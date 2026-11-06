export function BpTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="bp-table-wrap">
      <table className="bp-table">
        <thead>
          <tr>{headers.map((header) => <th key={header} scope="col">{header}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[0]}>
              {row.map((cell, index) => index === 0 ? <th key={cell} scope="row">{cell}</th> : <td key={cell}>{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function BpSection({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return (
    <section className="bp-section">
      <h2><span className="bp-no">{number}</span>{title}</h2>
      {children}
    </section>
  )
}

function BpQuote({ tone = 'ok', children }: { tone?: 'ok' | 'bad'; children: React.ReactNode }) {
  return <blockquote className={`bp-quote${tone === 'bad' ? ' bp-quote-bad' : ''}`}>{children}</blockquote>
}

function BpCode({ label, children }: { label?: string; children: string }) {
  return (
    <figure className="bp-code">
      {label && <figcaption>{label}</figcaption>}
      <pre><code>{children}</code></pre>
    </figure>
  )
}

function BpFlow({ label, steps }: { label: string; steps: string[] }) {
  return (
    <div className="bp-flow">
      <span className="bp-flow-label">{label}</span>
      <div className="bp-flow-steps">
        {steps.map((step, index) => (
          <span className="bp-flow-step" key={step}>{index > 0 && <b aria-hidden="true">→</b>}{step}</span>
        ))}
      </div>
    </div>
  )
}

export default function SquabbleDebateToSilence() {
  return (
    <div className="bp-article">
      <p className="bp-tldr">
        <strong>TL;DR</strong>
        我们一开始只有一个很朴素的抱怨：几个通过 A2A 调用的本地 Agent 做股票研究，每个都跑完一大段，然后依次倒进聊天框，互动感很弱。我们试过把它做成群聊，试过给它装上决策链和证据体系，两次都把问题推向了另一个极端。最后落定的是两条互不污染的链路：每日一轮严肃研究沉进报告，频道只消费报告批准过的事实，用审核过的模板编译出短句。这篇记录我们推翻了什么、为什么推翻，以及“人味”最终被我们定义成了哪几件可以写进类型系统的东西。结论有点反直觉：这个项目的竞争力不来自多 Agent，恰恰来自我们禁止多 Agent 做它最擅长的事。
      </p>

      <BpSection number="01" title="一个不太舒服的起点">
        <p>Squabble 的初始形态很好描述：用户提一个问题，Orchestrator 把本地的几个研究 Agent 依次跑一遍，每个 Agent 交回一份完整的分析，前端按顺序渲染。</p>
        <p>问题不是“文字太长”。把长文切成十条短消息，用户还是得按时间线读完，负担一点没少。真正被绑死的是四件事：</p>
        <ul>
          <li>Agent 之间没有共享上下文，它们是串行汇报，不是讨论；</li>
          <li>没有发言粒度控制，一个 Agent 一旦开口就会把整份推理写完；</li>
          <li>工具调用是隐藏过程，结果被揉进正文，证据和话混在一起；</li>
          <li>用户的消息被当成“新回合的起点”，而不是一个可以随时注入的中断信号。</li>
        </ul>
        <p>所以第一轮改造的目标很自然：让它像一个股票讨论群。</p>
      </BpSection>

      <BpSection number="02" title="第一次修正：把它做成群聊，以及为什么失败">
        <p>我们设计了一个共享的 append-only 事件流，所有 Agent 只订阅这条流，不持有私有长上下文；加了一个 turn-taking 调度器，用 maxTokensPerTurn、reactionWindowMs、userPreempt 控制发言节奏；把工具调用拆成文字流之外的折叠卡片；用户回车时用 AbortController 挂起当前 generator，让 Agent 让路。</p>
        <p>技术上都成立，效果也确实“活”了。然后我们撞上了 multi-agent 产品最常见的那个坟场：智能体会议。</p>
        <p>诊断下来是四个机制性原因，没有一条靠调 prompt 能修：</p>
        <BpTable
          headers={['现象', '机制']}
          rows={[
            ['互相点头、措辞不同的同义反复', 'LLM 的先验就是续写“像对话的东西”，没有信息增量约束时必然收敛到这'],
            ['立场是演的', '“你是空头”只会把同一个事实换成负面措辞，不是真的在找反证'],
            ['永远不落地', '群聊里没有裁决机制，全员安全发言'],
            ['越聊越像一个声音', '大家读同一份 history，分歧是表演出来的'],
          ]}
        />
        <p>一句话：我们养的是辩论社，不是研究团队。</p>
      </BpSection>

      <BpSection number="03" title="第二次修正：给它装决策链，以及为什么又失败">
        <p>于是我们把“讨论”从目标降级为手段，给它装了三把锁。</p>
        <p>先有 DecisionTicket 再开聊——每次研究必须从一个可裁决的问题开始，调度器能算 relevance(ticket, utterance)，低于阈值直接掐掉。分歧必须落在可验证的原子命题上，Claim 强制挂 verifiableBy 工具和 falsification 条件，由反证官去回测、交叉验证、做逻辑攻击，产出 SUPPORTED / WEAKENED / FALSIFIED 裁决卡。角色按信息特权切，不按多空性格切：财报法医只看三表勾稽，盘口猎手只看 L2 与期权，反证官不持票、只负责杀人。再往外接证据链、分歧热力图、决策账本和 invalid_if 到期自动复盘。</p>
        <p>信息密度是上去了。但用户打开页面，读到的是一份会说话的合规底稿。</p>
        <p>这次我们意识到媒介选错了：聊天框是一条串行时间线，气泡 × 40 仍然是一篇长文，只是被切碎了还得按顺序读。结构化卡片贴在气泡里，比长文更硬，也更没有人味。</p>
      </BpSection>

      <BpSection number="04" title="第三次修正：把信息从气泡里搬走">
        <p>关键的一次转向是承认：问题不在气泡的长短，在于所有信息都挤在同一个容器里。</p>
        <p>改成两个通道：</p>
        <div className="bp-layers">
          <div className="bp-layer">
            <span className="bp-layer-name">盘面层<small>常驻 · 一眼扫完 · 不说话</small></span>
            <p>现在怎样 / 什么变了 / 需要我做什么</p>
            <p>当前判断 · 关键变化 · 待我决定 · 一行聚合进度</p>
          </div>
          <div className="bp-layer bp-layer-channel">
            <span className="bp-layer-name">频道层<small>低频 · 只发“非说不可”的那一句</small></span>
            <p className="bp-layer-line">老周：那条线我挪到 274 了，理由在下面，你空了点一下</p>
            <p className="bp-layer-line bp-layer-meta">ⓘ 依据可展开 · [确认] [改回] [问问原因]</p>
          </div>
        </div>
        <p>99% 的信息沉到盘面层，聊天框反而安静了。安静才有重量——Agent 一开口，用户真会抬头看。</p>
        <p>深度也不摊在眼前，改成“可随时调取的可信感”：气泡旁边一个小标记，默认折叠、零阅读成本，点开才是源、时间、缺口和回测。我们同时删掉了几个看起来很聪明的东西：情绪温度计（不可复算，用户会开始赌灯的颜色）、裸奔的 0.72 置信度（未校准的概率制造虚假精确）、伪造的停顿和自动点赞（没有真实响应就不制造响应）。</p>
        <p className="bp-em">人味被重新定义为三件不靠语气的东西：他记得你、他有可预测的脾气、他敢沉默。</p>
      </BpSection>

      <BpSection number="05" title="转折：两条独立链路">
        <p>真正让架构定下来的，是把“重研究”和“日常相处”彻底解耦：</p>
        <BpFlow label="研究链路" steps={['独立调查', '封存首次判断', '反向核查', '当日报告与策略草稿', '编译监控 Brief']} />
        <BpFlow label="频道链路" steps={['接收事实事件', '更新服务端状态', '匹配 Brief', '校验锚点、角色、姿态和重量', '发布短句或保持静默']} />
        <p className="bp-callout"><strong>频道不能直接转发 Agent 原始输出。</strong> 所有内容先经过事实与发布契约校验。当日交易策略仍是候选方案，沿用“应用到模拟盘”后生效的授权机制。</p>
        <p>这条分层顺手解决了之前所有矛盾：严肃研究本来就不该在频道里发生，它要的是深度、交叉验证、慢；频道要的是“此时此刻有个熟人在边上嘟囔一句”。塞进同一个容器，才会既啰嗦又没温度。</p>
        <p>但解耦之后立刻冒出三个新坑，我们都上了硬约束：</p>
        <ol>
          <li><strong>情绪会滑成隐性喊单。</strong> “这跌法看着不太妙啊”没说“卖”，但语气越像人，暗示越强，而且没法审计。解法是给情绪装方向锁：只能骂信息和过程，不能指向涨跌和用户的钱。</li>
          <li><strong>补充研究要短，但不能轻。</strong> “影响不大，放心”是最短的，也是最烂的。约束改成“一句话结论 + 一张硬证据卡”，查不到就老实认，绝不为了短而给结论。</li>
          <li><strong>日报和频道不能各说各话。</strong> 频道里的一切——包括吐槽——都必须锚到当日报告或一条可核验事实，不许自由发挥新观点。</li>
        </ol>
      </BpSection>

      <BpSection number="06" title="人味不是语气，是四件可验证的事">
        <p>频道不是一个时间线，是四个噪声层级，从静到闹：</p>
        <BpTable
          headers={['层', '内容', '打扰规则']}
          rows={[
            ['① 静默', '工具调用、进度、核查过程，只留痕', '不通知、不红点'],
            ['② 随口一句', '碎念、情绪、自己的小动作', '不通知、不自动滚动'],
            ['③ 关键升级', '判断被推翻、监控触发、关键缺口', '只有 poke 可通知'],
            ['④ 待你接话', '真实待处理事项', '唯一置顶，同时最多一条'],
          ]}
        />
        <p>越往上越吵，也越稀有。一条研究从 ① 爬到 ④ 得过好几道关，大部分永远停在 ①——这就是“安静才有重量”的机械实现。</p>
        <p>气泡不是 {'{agent, text}'}，是一小个有情境的台词：</p>
        <BpCode label="shared/channel-types.ts">{`export type Weight  = "tap" | "nudge" | "poke";   // 是否打扰
export type Stance  =
  | "plain_fact"      // 中性事实：补充研究、监控播报、执行状态的底色
  | "I_told_you"      // 早说过，必须有事件前的本人旧发言
  | "admit_wrong"     // 认错，必须挂本人旧判断 + 新证据 + 明确修正
  | "unsure_honest"   // 没一手源就明说“你自己核实”
  | "quiet_win"       // 办完不邀功，默认停在静默层
  | "watchful"        // 还没发生、我看着（专供擦边与持续擦边）
  | "mood";           // 纯情绪衬托，无按钮、无方向

interface Bubble {
  anchors: BubbleAnchors;   // 接哪条 thesis、由什么触发、是否接自己上一条
  text: string;             // ≤90 字素，禁口号、禁感叹号连击
  stance: Stance;
  weight: Weight;
  action?: OneToThree<BubbleAction>;
  evidence: EvidenceCard;   // 默认折叠
  episodeId: Id;            // 报警→陪着→收场归为一组
  posture: "alarm" | "accompany" | "close" | "standalone";
  semanticDeltaId: Id;      // 本句消耗的“新增事实/状态变化”
}`}</BpCode>
        <p>人味不在 text，在 anchors + stance 的组合里。同一个事实，五种说法的差别不是文采，是立场与记忆：</p>
        <BpQuote>看，就说是回款的问题吧，你当时还嫌我烦。</BpQuote>
        <BpQuote>我错了，上次咬定是交付崩了，公告只说延期，我收嘴。</BpQuote>
        <BpQuote>这块我只拿到二手的，不敢下，你自己过一眼原文？</BpQuote>
        <p>这背后是三样很克制的东西：</p>
        <ul>
          <li><strong>关系记忆只存三类</strong>：我们之间的旧账、用户真说过的偏好、这个角色自己的脾气。追加不可改；没有记录就显示“未记录”，系统不许事后替用户编“因为仓位偏见”这种心理解释。</li>
          <li><strong>脾气焊死在触发条件里，不靠 prompt 随机。</strong> 老周只在事前喊、事后认错、止损擦边时开腔，绝不夸你赚钱；阿杰只在算到赔率且已有模拟成交回执时说一句“我上了”；小柒只甩“说法和原文不一样”的点，不给评价；反证官只在正式研究收口前核查，从不进频道。用户两周就能摸出谁什么时候会冒泡——可预测性才是信任。</li>
          <li><strong>沉默是最高级的人味。</strong> quiet_win 只放行三种已完成动作：整笔模拟订单成交、监控事件正式收场、当日复盘结束。而且过了白名单也不意味着必须冒泡。老周半夜替你把保护线挪了，早上你看到的是盘面那条线变了加一条静默日志，他本人不蹦出来说“我救了你一命”。</li>
        </ul>
      </BpSection>

      <BpSection number="07" title="话痨的正确形态：话痨在反应，不话痨在分析">
        <p>“一天四条”我们试过，太冷，像合租室友。但直接把配额调高又会退回刷屏。解法不是调数量，是分重量：</p>
        <BpTable
          headers={['Weight', '含义', '通知']}
          rows={[
            ['tap', '桌面轻敲，碎念、情绪、等数据时的小动作', '无'],
            ['nudge', '进频道流的普通气泡', '无'],
            ['poke', '止损击穿、假设被推翻、真要你拍板', '有'],
          ]}
        />
        <p>话痨全部长在 tap 层。同一件事允许多句，但必须换姿态：</p>
        <BpFlow label="接近阈值 → 持续接近 → 恢复" steps={['“线碰了，没破。”', '“还在边上蹭。”', '“哦自己回去了，虚惊。”']} />
        <p>不允许的是换皮复读：“风险很大 → 值得警惕 → 还是要小心”。防复读分四层，其中最有意思的是语义指纹——对象、指标、期间、数值、假设状态、执行状态、关键缺口一起算，把“仍然偏高”改成“还是不低”得不到新指纹。</p>
        <p>再加一个用户可以自己拧的旋钮 quiet / deskmate / chatty，只调 tap 的间隔与连发上限，不碰功能，也不许靠漏掉重要事项来换取“安静”。</p>
      </BpSection>

      <BpSection number="08" title="情绪的方向锁">
        <p>这是最容易翻车的一处。我们最终没有用关键词黑名单，而是审核模板白名单 + 受限填槽 + 上下文校验，自由生成的情绪句根本进不了发布路径。</p>
        <BpCode label="publisher/direction-lock.ts">{`// 关键一步：不信任传入的槽值，从服务端锚点事实重新解析
const authoritativeSlots = ctx.resolveAuthoritativeSlots(template.slotSchema, candidate.anchors);
if (!ctx.exactSlotValuesMatch(candidate.slots, authoritativeSlots)) return deny("SLOT_VALUE_OR_KEY_MISMATCH");
const expected = ctx.renderTemplate(template, authoritativeSlots);
if (text !== expected) return deny("FREE_TEXT_MUTATION");`}</BpCode>
        <p>模板本身在 registry 里被不变式约束：family === "mood" 时，subject 只能是 information_quality 或 research_process，changesConclusion 与 impliesInvestmentAdvice 必须为 false，allowedStances 只能是 ["mood"]，allowedWeights 只能是 ["tap"]，槽定义不许塞价格、盈亏这类数值。</p>
        <p>于是下面这些是合法的：</p>
        <BpQuote>这公告把关键口径藏得够深。</BpQuote>
        <BpQuote>等了俩小时，这份数据总算到了。</BpQuote>
        <BpQuote>刚才那波是期权到期砸的，白紧张一场。</BpQuote>
        <p>下面这些一律拒绝，即使没出现“买卖”二字：</p>
        <BpQuote tone="bad">要崩啊这。 / 疼不疼。 / 我也觉得该跑了。</BpQuote>
        <p className="bp-em">判据一句话：情绪只能指向“信息有多离谱、等得有多烦”，不能指向“你这把赚没赚”。</p>
      </BpSection>

      <BpSection number="09" title="发布契约：把性格编译出来，而不是让模型即兴发挥">
        <p>每份日报发布时，同时编译出可执行的频道 Brief，保留五个核心字段：</p>
        <BpCode label="shared/channel-brief.ts">{`interface ChannelBrief {
  when: MonitorPredicate;   // cross / persist / event，含滞回与新鲜观测要求
  agent: Speaker;
  text:  { templateId; templateRevision; slots: TemplateSlot[] };
  card:  { templateId; templateRevision; sourceEvidenceCardIds };
  anchor:{ reportSectionId; assertionId?; thesisId?; priorOwnBubbleId? };
  stance: Stance; weight: Weight; posture: Bubble["posture"];
  requiredChecks: Array<"fresh_data" | "active_rule_matches" | ...>;
  validFrom: ISOTime; expiresAt: ISOTime;
  status: "ready" | "invalidated" | "expired";
}`}</BpCode>
        <p>抽取分两步：研究侧从明确的假设、触发条件、资料缺口里提出候选，编译器批准——条件是否可计算、阈值是否有来源、模板是否允许、角色是否匹配、证据是否完整。编译不了的继续留在报告里，不生成监控发言。</p>
        <p>触发路径固定为：</p>
        <BpFlow label="触发路径" steps={['收到行情/公告/账本事件', '校验来源、时间与版本', '更新服务端事实和 episode', '匹配仍有效的 Brief', '用已验证字段填入审核模板', '生成证据卡', '角色/方向锁/字数/去重校验', '同事务写气泡与 outbox', '客户端接收']} />
        <p className="bp-callout"><strong>触发时不调用 LLM。</strong> 这里的“零幻觉”有精确含义：触发路径没有自由发挥空间；外部数据本身是否正确仍取决于来源核验，不能把错误行情包装成可信事实。</p>
        <p>唯一例外是后台主动研究发现。我们特意补了 research.finding 这条路径，否则会出现“大家下午查到了关键反证，却因为价格没动而不能说”。它可以用 LLM 产生发现，但发布仍走审核模板与受限填槽，并且必须由发布契约编译器 sealFinding 自动授予发布资格——不是挂一条等人点头的审批队列，个人投研产品没人 24 小时审。只有“权限可补授予”的越权候选才转人工，补齐后还要重新编译，不能直接改状态。</p>
        <p>no_counterevidence_found 和普通的 unable_to_verify 在入口和 canPublish 里各有一道对称硬拦，不许冒一句。后台发现只能是 nudge / poke，不许 tap——豁免 tap 限流桶，不等于可以发 tap。</p>
        <p>三层幂等由服务端唯一约束兜底：</p>
        <BpCode>{`编译幂等：findingId + publicationPayloadHash + compilerVersion
发布幂等：ownerId + episodeId + semanticDeltaId
投递幂等：bubbleId + destination`}</BpCode>
        <p>semanticDeltaId 由共同的规范化逻辑生成，不含 findingId、模板 ID、deliveryCause、编译器版本。于是同一变化同时命中 Brief 和后台发现只发一次；编译器升级后重新 seal 不会重发；100 次重复投递只产生一次状态迁移。</p>
      </BpSection>

      <BpSection number="10" title="状态：频道语言永远不等于状态">
        <p>早期我们写过一句很痛快但错的话：“动作只有两态”。策略应用成功和交易成交根本是两件事，模拟盘也会排队、失败、取消、部分成交；隐藏这些状态，用户会误以为事情已经办完。</p>
        <p>最终拆成三块，摘要高度不随内容增长：</p>
        <BpTable
          headers={['块', '主行', '辅助行']}
          rows={[
            ['当前运行', '当前策略与关键规则值', '模拟盘标识、状态确认时间'],
            ['建议修改', '待应用的修改摘要', '“尚未应用到模拟盘”'],
            ['执行进展', '当前实际执行结果', '已成交、剩余数量或失败原因'],
          ]}
        />
        <p>状态词典也拆开：partially_filled 属于执行结果，不能成为策略规则自身的生命周期状态。</p>
        <BpCode label="状态机">{`建议：proposed → applying → active
                        ↘ failed
      proposed → superseded
执行：queued → working → partially_filled → filled
                      ↘ failed / cancelled`}</BpCode>
        <p>一条铁律：盘面只投影服务端 RuntimeSnapshot。客户端不能乐观地把“应用中”改成“已调整”；只有拿到服务端确认的新版本，当前保护线才从 271 跳到 274。而这表示规则已更新，不表示已经发生卖出。</p>
        <p>文案也有边界：Squabble 的自动执行对象是模拟盘，写“尚未应用到模拟盘”，不写“未触碰实盘”——后者会暗示系统拥有真实账户交易权限。阿杰那句“我上了”必须同时满足：授权策略允许、确实存在非零模拟成交、绑定对应策略与成交记录、明确是模拟盘、部分成交只说部分成交。</p>
        <p>另一个容易伤人的细节：如果用户在报警期动过手（改了保护线），收场时禁止“虚惊一场”和 quiet_win，也禁止评价他的决策，只能陈述事实：“已回到观察区外。你提交的规则修改仍在处理中。”</p>
      </BpSection>

      <BpSection number="11" title="一致不是绿灯">
        <p>多 Agent 最容易骗人的时刻不是吵得不可开交，是全体一致——三个人都觉得没问题，因为大家共享同一个盲点。</p>
        <p>所以我们把可见性做成两阶段：</p>
        <BpTable
          headers={['阶段', '可以看到', '不可以看到']}
          rows={[
            ['独立调查', '公共原始资料、自己的工具结果、用户约束', '其他成员本轮的结论、推荐和评价'],
            ['交叉核验', '各人的公开判断、证据、计算依据', '模型未公开的内部推理'],
          ]}
        />
        <p>首次提交的判断封存不可覆盖，改口通过 JudgmentAmendment 追加并记原因。核验阶段允许找新证据，并记录取得时间，避免事后看起来像“一开始就知道”——永久信息独占会妨碍查错，但完全不隔离又会退回“大家读同一份 history 长出同一个声音”。</p>
        <p>反向核查是一个独立关卡，默认不进频道，只输出“查了什么／查到什么／还缺什么／影响哪个前提”，结局允许四种：</p>
        <BpCode>{`critical_counterevidence / partially_weakened
/ no_counterevidence_found / unable_to_verify`}</BpCode>
        <p>no_counterevidence_found 的固定展示是“本次检查范围内未发现关键反证”，不能映射成“判断正确”“安全”或绿色通过状态。盘面上更诚实的写法是：</p>
        <BpQuote>已核查订单与回款；客户集中度资料缺失。</BpQuote>
        <p>比“反证通过”具体，也比它可信。</p>
      </BpSection>

      <BpSection number="12" title="Where the answers stop">
        <p>参考我们喜欢的那类工程博客，这一节得写清楚答案在哪里停下：</p>
        <ul>
          <li><strong>本文记录的是设计推演，不是实测结果。</strong> 固定案例验收矩阵、三组对照（单 Agent／多 Agent 独立／独立+反向核查）和 U1/U2 理解时间夹具都已定义，但数字还没跑出来。中位数 ≤15 秒、P90 ≤30 秒是验收目标，不是已测性能。</li>
          <li><strong>触发路径零幻觉 ≠ 外部数据正确。</strong> 错误行情仍会进来，只是不会被包装成可信事实。数据源质量得单独观测。</li>
          <li><strong>“没找到反证”不等于判断正确。</strong> 它只说明在本次检查范围内、用现有资料没推翻。</li>
          <li><strong>论文不能直接背书。</strong> Debate or Vote 在它测的 NLP 基准上说明“独立答案集合解释了许多收益、额外辩论不天然有效”，最多支持到“别迷信讨论”这一层，不能推广成投资场景里“独立研究+投票一定更好”。</li>
          <li><strong>Telemetry 还没接。</strong> 这套架构里最值钱的行为全是不产生输出的负向决策：canPublish 返回 false、sealFinding rejected、方向锁 deny、vibe 把过时碎念归档、quiet_win 默认静默。没有 telemetry，我们分不清系统是“克制”还是“死了”——用户看到的频道完全一样。</li>
          <li><strong>情绪方向锁不是语义证明。</strong> 关键词检测只是防御层，主防线是审核模板、受限来源和精确渲染。我们没声称能识别任意自然语言里的隐性喊单。</li>
        </ul>
      </BpSection>

      <BpSection number="13" title="竞争力落在哪里">
        <p>到 2026 年，“我用多 Agent 做了个 XX”已经是 baseline，不是亮点。招人方真正稀缺的是生产可靠性经验、评测设计、多 Agent 协调，没有一条是“会调 Prompt”。而面试官最爱问的那道题恰好是：什么时候不该上 Multi-Agent？</p>
        <p>我们这个项目最值钱的素材，是整整几轮做过减法的推演：</p>
        <ol>
          <li>否决智能体圆桌会议——讨论从目标降级为手段；</li>
          <li>把严肃研究从聊天框里搬出去——承认聊天框是串行时间线；</li>
          <li>砍掉情绪温度计——不可复算的指标不该出现在投研产品里；</li>
          <li>砍掉伪造的停顿、自动点赞、裸奔的 0.72——没有真实响应就不制造响应；</li>
          <li>把“动作只有两态”改成三块信息 + 完整状态机——承认策略生效 ≠ 成交；</li>
          <li>把“必须写三条反证路径的失败报告”改成四种结局的记录——模板化反证会退化成表演式质疑；</li>
          <li>砍掉“没找到反证 = 绿灯”。</li>
        </ol>
        <p>一句话概括：用确定性的工程约束驯服概率性的模型生成。这套东西落到类型系统里，就是五条一致性约束：</p>
        <p className="bp-constraints">每句有锚 · 每次改口有记录 · 每条提醒有新事实 · 每次执行有回执 · 每个盘面数字都能追到服务端状态</p>
        <p>这也是为什么“发布契约”本身比任何一个角色都重要：它本质上是 eval 思维——把不可枚举的模型输出，收敛成可回放、可回归、可拒绝的编译产物。评测指标因此也不该用 NLP 准确率，而是关键遗漏发现率、无依据断言数及严重度、用户理解判断与待办所需时间、安静度（且必须与关键事件漏报率成对看）。</p>
        <p className="bp-em">人味和竞争力在这里其实是同一件事：Agent 不是因为说话像人才可信，是因为它记得你当初认可的前提、敢指出哪一条已经变了、把可选择的调整准备好，而且在没事的时候闭嘴。</p>
      </BpSection>

      <BpSection number="14" title="What comes next">
        <p>两件事，按在意的顺序：</p>
        <ol>
          <li><strong>补 step-level telemetry 与固定案例实测。</strong> 先埋 denyReason，比先装看板重要十倍。要能拿出“今天静默 14 次，其中 3 次是方向锁挡下的隐性喊单，0 次关键漏报”这种证据，才能证明这套设计真的在工作。顺带把这一步产出的数字变成可讲的东西：每轮研究的 token 成本、P95 延迟、失败恢复率，以及一个真实的 bad case 复盘。</li>
          <li><strong>把假设回访接到结构化假设上。</strong> 每次回访留下四件事：当时依据什么、后来出现什么新证据、哪部分保留哪部分改变、当前策略是否需要修订；再加第五件——“当初为什么采纳”，且与复盘分时间戳存，禁止合成顺滑叙事。复盘还要分开看“经营判断是否兑现”和“模拟交易表现怎样”，短期赚钱不能自动证明研究正确。</li>
        </ol>
      </BpSection>

      <BpSection number="附" title="我们最终砍掉的东西">
        <ul className="bp-cut-list">
          <li>智能体圆桌会议 / 多头空头轮流发言 / 全员质疑轮</li>
          <li>把长报告切成 N 条气泡冒充“讨论”</li>
          <li>情绪温度计、涨跌表情、方向性唏嘘</li>
          <li>伪造停顿、自动点赞、“另一位成员点了 👀”</li>
          <li>裸奔的 0.xx 置信度；未校准的概率</li>
          <li>强制凑三条的“反证失败报告”；“没找到反证 = 安全灯”</li>
          <li>动作只有两态；“已经改了，等你确认”这种混淆态</li>
          <li>事后替用户编心理解释、合成顺滑叙事</li>
          <li>拿 NLP 论文当投资效果背书、用准确率替代覆盖率</li>
          <li>用漏报重要事项换来的“安静”</li>
        </ul>
        <p className="bp-em">Squabble 不养辩论社。严肃研究沉在报告里，频道里住着的是：记得你、有自己活法、只在真需要时出现、错了敢认、办完不邀功的那个人。它话痨在反应，不话痨在分析。</p>
        <p className="bp-boundary">本文基于一次持续的设计推演整理。所有接口、状态与校验规则为设计定稿，尚未接入生产实测；评测口径与验收夹具见第 12 节。</p>
      </BpSection>
    </div>
  )
}
