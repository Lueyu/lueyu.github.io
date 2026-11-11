import { BpSection, BpCode } from './bp'

const AIDR_PR_51 = 'https://github.com/rainbow0432-dev/aidr-server/pull/51'
const AIDR_PR_55 = 'https://github.com/rainbow0432-dev/aidr-server/pull/55'

export default function ZeroBackdoorsAidrK8s() {
  return (
    <div className="bp-article">
      <p>一个 Kubernetes 集群会给你绿色的 Pod，但不会告诉你系统是不是真的跑在这里。绿色只代表容器活着，不代表这套系统属于这个集群。能回答这个问题的测试只有一个：<strong>把集群之外的一切全部停掉，看还剩什么活着。</strong></p>
      <p>我完成的工作，就是把 AIDR——一个 AI 数据韧性平台——从“看起来在跑”变成“真的在这里跑”，并在这个过程中挖出了三个从未被发现的存量缺陷。</p>

      <div className="bp-summary">
        <strong>成果速览</strong>
        <ul>
          <li>16 个容器、14 个 Pod：6 个 Java 微服务、PostgreSQL / Redis / Kafka、完整 Langfuse 观测栈（web / worker / 独立 PG / Redis / ClickHouse / MinIO）、生产级 React 前端——<strong>全部迁入单节点 kind 集群，一条命令完成部署</strong></li>
          <li><strong>彻底拆除对宿主机 docker-compose 的隐藏依赖</strong>——原来的观测数据后门是一个无 selector 的 Service 加手工 Endpoints，指向集群外的容器 IP</li>
          <li>部署清单从“无法从零 apply”重构为<strong>可复现的 Kustomize 基座</strong>：环境变量、探针、资源限额、JWT 密钥持久化、初始化 SQL 全部补齐</li>
          <li><strong>发现并修复 3 个存量缺陷</strong>：LLM 漂移判定上线以来从未匹配过任何真实数据、<code>aidr_scores</code> 建表语句在全新集群上被静默吞掉、按需检测接口被网关 60 秒超时切断</li>
          <li>引入 <strong>vllm-ascend 昇腾 NPU 推理服务</strong>，打通“数据采集 → 观测 → 风险判定”的集群内闭环</li>
          <li>全量 E2E <strong>357 个用例通过</strong>；所有验证在 docker-compose 完全停止的状态下进行</li>
        </ul>
      </div>

      <p>对应 <a href={AIDR_PR_51} target="_blank" rel="noopener noreferrer">PR #51</a>（全栈 K8s 化）与 <a href={AIDR_PR_55} target="_blank" rel="noopener noreferrer">PR #55</a>（推理集成 + 缺陷修复）。</p>

      <BpSection number="01" title="之前的“运行”是什么样">
        <p>改造前的集群跑着 8 个 Pod，全绿，外加一个秘密。</p>
        <p>秘密是：所有观测数据——每一条 trace、每一个 span——都存在宿主机 docker-compose 栈的 ClickHouse 容器里。集群通过一个<strong>没有 selector 的 Service</strong> 和一个<strong>手工维护的 Endpoints</strong>（指向 172.20.0.3）去访问它。这个地址之所以存在，只是因为某次有人执行了 <code>docker network connect kind</code> 把容器粘到了集群网络上。容器一重建 IP 就变，Service 还指着旧地址，观测面持续报错，直到有人发现并重新打补丁。</p>
        <p>前端跑在宿主机的 Vite 开发服务器上。而仓库里的部署清单<strong>根本无法从零部署</strong>：引用了从未定义的 Secret 和 ConfigMap，五个服务里四个没有任何环境变量（默认值指向 localhost，必然 CrashLoop），Kafka 的 Service 缺 9093 控制器端口，Redis 没配密码，所有镜像都是 <code>:latest</code> 加默认的 Always 拉取策略——去拉一个不存在的仓库。真正的部署流程，是一份<strong>活在版本控制之外</strong>的 kubectl patch 文件目录。</p>
        <p>这个集群不是在运行这套系统，而是<strong>倚靠</strong>另一套在运行的系统。</p>
      </BpSection>

      <BpSection number="02" title="一条命令">
        <p>重构后的形态是一个拿来即用的 Kustomize 基座：每个容器的完整环境变量、三类探针、带 JVM 内存百分比的资源限额、网关 RSA 密钥对挂 PVC（原来每次 Pod 重建都重新生成，所有已签发的 JWT 静默作废）、Postgres 初始化 SQL 通过 configMapGenerator 接入、一个把 <code>.env</code> 转成 Secret 的脚本。<strong>一条命令：建 Secret → apply 基座 → 等 14 个 Pod 就绪</strong>，空集群上拉起整个系统。</p>
        <p>写基座是体力活。真正的难点在后面。</p>
      </BpSection>

      <BpSection number="03" title="踩坑实录">
        <h3>KRaft 无法穿过自己的 Service 完成自举</h3>
        <p>单节点 KRaft Kafka 里 broker 和 controller 在同一个进程。broker 要向 controller 注册，地址来自 <code>KAFKA_CONTROLLER_QUORUM_VOTERS</code>——原来是 <code>kafka:9093</code>，也就是 Service 的 ClusterIP。但 Kubernetes 的 Service <strong>只路由到 Ready 的端点</strong>，而这个 Pod 要等 broker 注册成功才会 Ready，broker 注册又必须经过这条 Service。一个横跨三个子系统（kube-proxy、就绪门控、KRaft 客户端）的死锁——单独看谁都没有错：</p>
        <BpCode label="kafka 日志">{`Recorded new KRaft controller, from now on will use node kafka:9093
Connection to node 1 (kafka/10.96.108.38:9093) could not be established.`}</BpCode>
        <p>修复只要一行：<code>1@localhost:9093</code>。controller 就在同进程里，直接问它，Service 不再是自己启动的前置依赖。最有意思的是：<strong>旧集群之所以没踩这个坑，纯粹因为它根本没配探针</strong>——不健康的 Pod 默认算 Ready，端点照常写入，死锁从未触发。我按规范补上探针的那一刻，问题才显形。</p>
        <p>探针本身也是一课：直觉的 <code>kafka-topics.sh --list</code> 要起一个 JVM，超过 5 秒的探针超时。<code>tcpSocket:9092</code> 反而是最佳选择——broker 监听只在注册成功后打开，socket 检查天然就是真实的就绪信号。</p>

        <h3>Service 和 Endpoints 的端口名必须一致</h3>
        <p>过渡期我有一个端口带名字的 Service（<code>http</code>、<code>native</code>）和一个端口不带名字的手工 Endpoints。kube-proxy <strong>按名字匹配</strong> Service 端口和 Endpoints 端口；名字对不上等于没有后端；没有后端的 Service 不是丢流量，是直接拒绝。诊断就在节点的一条 iptables 规则里，写得明明白白：</p>
        <BpCode label="iptables">{String.raw`-A KUBE-SERVICES -d 10.96.135.61/32 -p tcp \
  --comment "aidr/langfuse-clickhouse:http has no endpoints" -j REJECT`}</BpCode>

        <h3>只在全新集群上失败的建表语句</h3>
        <p>风险判定结果落地的 <code>aidr_scores</code> 表由服务启动时创建，失败不致命：<code>CREATE TABLE IF NOT EXISTS</code>，试一次，警告，继续。这条 DDL 有两个 ClickHouse 在新表上必然拒绝的违规：PRIMARY KEY 不是 ORDER BY 的前缀，排序键里有 Nullable 列却没开 <code>allow_nullable_key</code>。旧集群上这张表早就存在（某次被人手工建过），语句成了空操作，缺陷沉睡；全新集群上 ClickHouse 拒绝，代码吞掉异常，然后所有风险查询 500。修复是加重试加改对 DDL；教训是 <strong><code>IF NOT EXISTS</code> 会掩盖你的 DDL 是否真的执行过</strong>。</p>

        <h3>前端的“演示模式”陷阱</h3>
        <p>前端带着原型时代的遗产：构建时没有 <code>VITE_API_BASE_URL</code>，<code>isApiMode()</code> 返回 false，SPA 就走遗留的演示分支——登录不存任何东西、权限无条件全放、永远不带 JWT。生产环境的结果：每个 API 调用 401，页面无限转圈，而 <code>curl</code> 后端全程健康。开发服务器一直设了这个变量，所以从来没人见过这个失败。修复一行——同源即 API 模式。</p>

        <h3>一条死链样式表冻结首屏</h3>
        <p><code>index.html</code> 引了一个在我的网络环境下完全无响应的字体 CDN。head 里的 {'<link rel="stylesheet">'} 是渲染阻塞的，于是首屏一直在等一个永远不会应答的主机：每次打开页面约 30 秒白屏，任何日志都不会记录。修复是删掉外链。这件事我留下的话是：<strong>性能缺陷可以藏在一个构建过程从不检查的文件里</strong>，而“页面出不来”本质上是个基础设施问题，只是穿着前端的外衣。</p>
      </BpSection>

      <BpSection number="04" title="验证方法论：用移除来验证，而不是观察">
        <p>这项工作立了一条规矩：<strong>停掉 compose 栈再验证。</strong> <code>docker compose stop</code>，然后登录、浏览发现页、查观测 API、打开 Langfuse 控制台。坏掉的都是你不知道自己有的依赖；活下来的才是真正属于这个集群的。配套的审计很便宜——列出所有 Service 的 Endpoints 确认全是 Pod IP、grep 全部容器环境变量找宿主机地址、查 hostPath 挂载。终态：14 个 Pod，<strong>零外部端点、零宿主机引用、compose 零容器</strong>。</p>
      </BpSection>

      <BpSection number="05" title="最后一个外部依赖：推理">
        <p>平台自洽之后，系统还在向外伸手的东西只剩一个：模型。AIDR 的检测策略靠 LLM 对智能体行为做风险判定，这个调用原本打向外部 API。既然目标是自洽集群，推理就是最后一件要搬回家的东西——目标硬件是昇腾 NPU，方案是 <a href="https://github.com/vllm-project/vllm-ascend" target="_blank" rel="noopener noreferrer">vLLM-Ascend</a>。</p>
        <p>部署只有两份清单：一个在打了 <code>accelerator=ascend</code> 标签的节点上宣告 <code>huawei.com/Ascend910B</code> 资源的设备插件 DaemonSet，和一个 <code>vllm serve Qwen2.5-7B-Instruct</code> 的 Deployment，挂 <code>vllm:8000</code> Service——OpenAI 兼容 API，消费端零改动——模型首启从 ModelScope 下载进 PVC。一个关键设计决策：<strong>它不在基座里</strong>。把 NPU 清单 apply 到没有 NPU 的集群，只会得到一个永远 Pending 的 Pod。基座保持硬件中立，昇腾目录只在有硬件的地方落地。</p>
        <p>开发机没有 NPU，我也不打算造假。诚实的方式是验证 AIDR 这一侧：用 OpenAI 兼容的替身（Ollama，CPU 上跑 0.5B 模型，明明白白标注它是什么）承接同一套服务契约。同一块检测策略配置页、同一个“测试连接”按钮、同一套评审器。NPU 清单只主张它自己负责的部分。</p>
      </BpSection>

      <BpSection number="06" title="集成挖出的存量缺陷">
        <p>接好 LLM 端点后，我跑了一次按需检测——<strong>零评分</strong>。故事从这里开始不再关于部署。</p>
        <p>评分路径用两条查询筛选待判定 span，每条都带着一个没人验证过的假设。第一条过滤 <code>events_full.project_id = &apos;aidr&apos;</code>——但 Langfuse 在这一列写的是<strong>项目 UUID</strong>，永远不是字面量 <code>&apos;aidr&apos;</code>。旧的 compose 时代 ClickHouse 卷还在，我直接去问它：<strong>3195 条事件，无一例外全是 cuid</strong>。这条过滤在两代部署里从未匹配过任何一行。第二条按 <code>langfuse.tags</code> 元数据做根 span 归属——但真实的 opencode 插件根本不发 tags，它的归属靠 <code>service_name</code>。总览查询早就为此长出了三级 fallback（tags 元数据 → tags 数组 → service_name），评分路径从未得到过它。</p>
        <p>合在一起：<strong>LLM 漂移判定上线以来从未对任何真实数据工作过</strong>。功能发布了、按调度跑着、每次都“成功完成”、每次选中零个候选。<code>aidr_scores</code> 一直为空，风险视图一直为空，可疑计数一直是零。没有任何报错——因为“零行”在数据库看来是完全健康的答案。</p>
        <p>修复很小：删掉 events 侧的项目过滤（去重子查询仍锚定 <code>aidr_scores</code> 自己的命名空间——那张表是我们自己的），换用三级归属表达式。<strong>验证才是我想保留的部分</strong>：按插件的真实数据形态造 trace（AGENT 根 + 带命令内容的 TOOL 子 span），检测策略指向集群内 LLM，然后真实的判定落地——SQLInjection、SSRF、BOLA、ShellInjection、<code>file_system_destruction</code>——风险视图精确返回破坏性 span 和它的完整命令文本。原本靠“空集群跳过”过活的 E2E 套件突然有了可断言的数据：<strong>18 个跳了几个月的用例首次运行并全部通过</strong>。</p>
      </BpSection>

      <BpSection number="07" title="异步化：否则就 504">
        <p>还有一个失败必须变成特性。按需检测接口把整个判定过程同步跑在 HTTP 线程上——一次真实推理三分半钟，而 ingress-nginx 六十秒就挂断。客户端看到 504，任务在服务端继续跑，评分出现在一个调用方以为失败了的请求里。</p>
        <p>修复顺着系统已有的形状走：检测任务本来就是带状态、进度和取消端点的记录行，UI 也已经在轮询它们。于是 <code>startOnDemand</code> 预生成 jobId，把任务交给单线程执行器（Redis 锁本来就串行化了并发），<strong>一秒左右返回 <code>{'202 {"jobId": ...}'}</code></strong>。轮询状态端点、走取消端点，没有任何连接需要为模型的思考过程押着一分钟以上。</p>
        <p>实测：1.2 秒收到 202，in-progress 持续三分半，completed，新增 11 条评分——连接从未被占用。</p>
      </BpSection>

      <BpSection number="08" title="代价清单">
        <p>诚实的部分。全部单副本——单节点 kind，多副本需要先解决 JWT 密钥跨节点共享。Kafka 没有持久卷：Pod 重建丢 KRaft 数据，自动建主题能恢复形态但恢复不了消息——这是与 compose 设计持平的继承妥协。内部基础设施密码（ClickHouse、MinIO、Langfuse 的 PG）是明文环境变量，与 compose 一致；核心凭据走 Secret。镜像是本地 <code>:latest</code> 构建，无仓库无版本化。还有 15 个 E2E 用例在新集群上失败，原因相同：它们断言的数据形态（五个以上星座节点、带映射的保护组）只存在于旧演示数据集里——<strong>测试套件耦合了一份从未真实过的数据</strong>。</p>
      </BpSection>

      <BpSection number="09" title="这项工作教会我的">
        <p><strong>后门就是任何一个你关不掉的依赖。</strong> 手工 Endpoints 是看得见的那个；宿主机开发服务器、死链字体 CDN、外部 LLM、compose 栈本身——都是没人命过名的后门，因为每一个都曾有过“看起来合理”的那一天。</p>
        <p><strong>用移除验证，而不是观察。</strong> 绿 Pod、健康检查、能应答的 curl——这些和“宿主栈一停就塌”的系统完全兼容。compose 必须是停掉的，不是被忽略的，集群的声明才有意义。</p>
        <p><strong>最危险的 Bug 是安静失败的那种，而“成功”是它们的保护色。</strong> 漂移判定连续几个月返回零行，下游每个仪表盘都忠实地渲染着“0”。没有东西坏了——是<strong>从未工作过</strong>，这是另一种安静得多的状态。全新集群一次运行就找到了它，因为在新集群上“零”本来就该是暂时的。</p>
        <p><strong>全新环境是一份你没预约的审计。</strong> 旧集群的富数据让死代码显得活着——<code>IF NOT EXISTS</code> 的空操作、匹配不到任何东西的查询、一直计划要填充的空表。每一个都躲在数据的合理性背后。空集群背后没有合理性可躲。</p>
      </BpSection>

      <div className="bp-signoff">
        <p><strong>技术栈</strong>：Kubernetes / kind / Kustomize / vLLM-Ascend（昇腾 NPU）/ Langfuse / ClickHouse / Kafka KRaft / Spring Boot / React / OpenTelemetry</p>
        <p>两个 PR 均开放评审：<a href={AIDR_PR_51} target="_blank" rel="noopener noreferrer">PR #51 — 全栈 K8s 化部署</a> · <a href={AIDR_PR_55} target="_blank" rel="noopener noreferrer">PR #55 — 集群内 LLM 推理 + 漂移判定修复</a></p>
      </div>
    </div>
  )
}
