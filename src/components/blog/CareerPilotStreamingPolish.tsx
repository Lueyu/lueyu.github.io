import { BpSection, BpQuote, BpCode, BpFigure, BpFlow, BpTable } from './bp'

const IMG = '/images/blog/careerpilot-streaming'

export default function CareerPilotStreamingPolish() {
  return (
    <div className="bp-article">
      <p>CareerPilot 是我在维护的一个 AI 面试教练：它读你的真实作答，按失分项讲知识点，用独立新题验证你有没有真的学会。对话是它的主战场——学习者问一句，助教回答一段。这一轮我盯的是这段回答本身：<strong>从提问到第一个字出现，用户要等多久；字出现之后，又是怎么“吐”出来的。</strong></p>
      <div className="bp-summary">
        <strong>成果速览</strong>
        <ul>
          <li><strong>首字延迟（TTFT）从 30–60 秒的“空白等待”降到 0.7 秒</strong>——此前用户点发送后屏幕上没有任何文字反馈，观感上就是“假流式/卡死了”</li>
          <li><strong>把模型的思考过程实时推给用户</strong>：一个“思考中…（N 字 · Xs）”面板，边想边显示，正文出现后自动折叠</li>
          <li><strong>吐字从“0.5 秒一大块”变成 30–60ms 的细粒度流式</strong>，配合前端 rAF 批处理、纯文本轻渲染与打字机光标，消除一卡一卡的感觉</li>
          <li>顺带修掉了三个真实故障：思考型模型把输出预算吃满导致“未返回完整内容”高频失败、笔记整理点击后零反馈、引文校验逐字匹配误判</li>
          <li>全量回归 <strong>839 passed / 1 failed（预存环境问题）</strong>，前端 typecheck + build 通过，浏览器端到端验证真实模型链路</li>
        </ul>
      </div>
      <p>这篇文章按“先量、再拆、后修”的顺序记录整个过程——尤其是<strong>推理模型（reasoning model）对流式体验的隐形影响</strong>，这是最容易踩也最少被写下来的坑。</p>

      <BpSection number="01" title="症状：等 30–60 秒才见字">
        <p>第一轮交付上线后，反馈很快来了，而且是三个叠加的抱怨：</p>
        <ul>
          <li>“流式回复要等差不多 30–60 秒才返回结果，这中间发生了什么，不会是假的流式回复吧？”</li>
          <li>“回复的效果很卡顿。”——字不是连续吐的，而是一块一块地跳。</li>
          <li>“思考过程不够清晰。”——要么什么都没有，要么一上来就是完整答案。</li>
        </ul>
        <p>三个症状指向同一条链路：<strong>SSE 端点 → 生成服务 → 模型网关 → 前端渲染</strong>。我没有直接猜哪里慢，而是先给这条链路的每一段装上了“尺子”。</p>
      </BpSection>

      <BpSection number="02" title="先量：网关流本身就不是你以为的样子">
        <p>第一条尺子是直接打网关。用 httpx 流式请求 <code>deepseek-v4-pro</code>，只问一个简单问题，记录每个 SSE 事件的到达时间：</p>
        <BpTable
          headers={['指标', '数值', '含义']}
          rows={[
            ['首个事件', '4.01s（role + reasoning_content）', '模型先进入思考，不吐正文'],
            ['first_content', 'None', '整条流里一个 content token 都没出现'],
            ['reasoning_chars', '765', '全部 token 预算都花在了推理上'],
            ['elapsed', '13.19s 后流结束', '预算耗尽，未产出任何可展示的正文'],
          ]}
        />
        <p>第二把尺子是浏览器端的 SSE 帧计时。新建会话提问，逐帧记录内容长度：</p>
        <BpCode label="SSE 帧时间线（修复前）">{`frame #1   t=0.14s   status=generating  stage=routing   len=0
frame #2   t=9.34s   status=generating  stage=generating len=0
frame #3   t=59.56s  status=generating  len=3      ← 第一个非空 content
frame #4   t=60.09s  len=84
frame #5   t=60.64s  len=155`}</BpCode>
        <p>第三把尺子是数据库侧。消息行的 <code>content</code> 与 <code>coach.trace.stage</code> 每一秒轮询一次：<code>t=0.05s stage=queued → t=0.22s stage=generating → t=31.86s content=2 → t=42.88s completed</code>。</p>
        <p>三把尺子给出同一个结论：<strong>延迟不是网络、不是排队、也不是数据库，而是模型在“思考”的 30–60 秒里，前端什么都看不到。</strong></p>
      </BpSection>

      <BpSection number="03" title="根因：三个叠加的真相">
        <h3>真相一：推理模型的 thinking 被当成噪音丢掉了</h3>
        <p>网关返回的 SSE 里，推理过程在 <code>delta.reasoning_content</code> 字段里，正文在 <code>delta.content</code>。流式解析器（<code>llm_stream.py</code>）的取舍是：</p>
        <BpCode label="llm_stream.py 修复前">{`# All other fields, including reasoning/reasoning_content,
# are discarded.
content = delta.get('content')`}</BpCode>
        <p>对普通模型这是对的——省内存、省带宽。但 <code>deepseek-v4-pro</code> 是推理模型：它先花 30–60 秒输出 reasoning_content，之后才输出 content。解析器把前 30–60 秒全部丢弃，数据库里的 content 一直是空字符串，SSE 帧全是 <code>len=0</code>。用户看到的就是“点了发送，60 秒没有任何动静”。</p>
        <h3>真相二：思考 token 计入输出预算，把 max_tokens 吃满</h3>
        <p>生成服务给每次调用设了输出上限：快速档 <code>allowance=min(budget, available, 2300)</code>。对推理模型，这 2300 个 token 会先被思考过程消耗——思考结束，预算已尽，模型被截断（<code>finish_reason=length</code>），正文一个字都出不来。</p>
        <BpCode label="一次失败调用的 trace">{`call 1: generation=1  elapsed=57.8s  tokens=2300  error=invalid_response
call 2: generation=2  elapsed=80.8s  tokens=5264  ok (escalation=1)`}</BpCode>
        <p>更糟的是失败会触发“升级重试”：快速档失败 → 换深度档重来一遍。用户看到的不是 60 秒，而是 57.8 + 80.8 ≈ 138 秒，最后可能还是 <code>failed</code>。</p>
        <h3>真相三：0.5 秒的数据库轮询 + 前端整段重渲染</h3>
        <p>就算 content 开始出现，SSE 端点也是每 0.5 秒去数据库读一次快照，内容以 0.5 秒的粒度“一大块一大块”地冒出来；前端每个 SSE 事件都对整段 markdown 重新解析（react-markdown + KaTeX + highlight）。内容变长后每帧都是 O(全文) 的解析——这就是“卡顿”的来源。</p>
      </BpSection>

      <BpSection number="04" title="修复：让思考先可见，让正文细粒度">
        <h3>把 reasoning 从噪音变成信号</h3>
        <p>第一步，流式解析器不再丢弃 <code>reasoning_content</code>，而是累积起来并新增 <code>on_reasoning</code> 回调（内存中保留、不进数据库、不进 trace 日志——它只活在连接的生命周期里）：</p>
        <BpCode label="llm_stream.py 修复后">{`reasoning = delta.get('reasoning_content')
if reasoning is not None and not isinstance(reasoning, str):
    self.fail('invalid_content')
if reasoning:
    size = len(reasoning.encode('utf-8'))
    if self.reasoning_bytes + size > self.limits.content_bytes:
        self.fail('content_limit')
    self.reasoning_bytes += size
    self.reasoning_chars += len(reasoning)
    self.reasoning_parts.append(reasoning)
    self.meta.setdefault('first_reasoning_ms', self.elapsed())`}</BpCode>
        <h3>进程内队列：把“轮询数据库”升级成“事件推送”</h3>
        <p>生成服务和 SSE 端点在同一个 API 进程里。于是我不再让 SSE 去轮询数据库，而是搭了一个轻量 pub/sub：生成侧每 30–60ms 把最新快照（含 reasoning 与 content）推给订阅这个 message_id 的队列，SSE 端点优先消费队列，数据库轮询降级为断线重连后的兜底：</p>
        <BpFlow
          label="数据流"
          steps={['模型网关 SSE', 'on_content / on_reasoning', 'asyncio.Queue（60ms 节流）', 'SSE 端点', '浏览器 rAF 渲染']}
        />
        <h3>预算与截断：给思考留出空间</h3>
        <p>把输出预算从写死的 <code>2300/4500</code> 改成配置项：<code>study_flash_output_tokens=6000</code>、<code>study_strong_output_tokens=12000</code>，让思考过程和正文都有足够的 token；同时把项目证据检索的钳位从 15 秒放宽到 120 秒，避免“检索没结束就被掐断”的假超时。</p>
        <p>这三个改动合起来的效果：</p>
        <BpCode label="SSE 帧时间线（修复后）">{`frame #1   t=0.70s  status=generating  content_len=159  reasoning_len=226
...         content 60ms 级递增
frame #20  t=3.72s  status=completed   content_len=768`}</BpCode>
        <BpQuote>首字延迟从 30–60 秒的空白等待，变成 0.7 秒内“思考面板先亮起来，正文随后细粒度流出”。</BpQuote>
      </BpSection>

      <BpSection number="05" title="渲染：把“卡顿”拆掉">
        <p>后端推得快了，前端也要接得住。四件事把渲染开销按数量级降下来：</p>
        <ul>
          <li><strong>rAF 批处理</strong>：SSE 事件不再直接 setState，而是攒进 ref，由 <code>requestAnimationFrame</code> 每帧合并渲染一次（原来固定 80ms 定时器，现在跟随显示器的帧率，不固定延迟、不丢帧）。</li>
          <li><strong>流式期间纯文本渲染</strong>：<code>StudyText</code> 在 <code>streaming</code> 状态输出 <code>&lt;pre&gt;</code> 纯文本（不再每帧跑 react-markdown + KaTeX），内容结束、状态变为 completed 后才切回完整 Markdown 渲染。渲染成本从 O(全文重解析) 变成 O(追加文本)。</li>
          <li><strong>memo 隔离</strong>：RunDetails、Sources 等与流式内容无关的组件用 <code>React.memo</code> 包裹，流式事件只重渲染真正变化的子树。</li>
          <li><strong>打字机光标</strong>：流式中的文本末尾加一个 CSS 动画的光标，用户一眼就知道“还在吐字”。</li>
        </ul>
        <BpFigure
          src={`${IMG}/generating.png`}
          caption="生成中：思考中…（1421 字 · 实时增长）面板 + 跳动圆点 + 内容流式 + 打字机光标，标题行显示「生成中」高亮。"
          alt="CareerPilot 学习聊天生成中界面：思考面板、流式正文与打字机光标"
        />
        <p>思考过程本身也做了“清晰化”处理：一个新的 <code>ThinkingPanel</code> 组件，自动滚底、显示字数与已用时长的实时计数、摘要可点击折叠；正文一旦开始出现，思考面板自动收起，避免抢占注意力：</p>
        <BpFigure
          src={`${IMG}/completed.png`}
          caption="完成态：思考面板自动折叠，正文以完整 Markdown（含代码块高亮）渲染，标题行「已保存」。"
          alt="CareerPilot 学习聊天完成态：完整 Markdown 渲染与思考面板收起"
        />
        <h3>断线重连：别让一次抖动毁掉整段流</h3>
        <p>原来 SSE 一旦断开就直接退化为 1 秒轮询。现在先指数退避重连两次（400ms → 800ms），两次都失败才降级轮询——本地开发时 Vite 热更新、代理抖动都不再打断流式体验。</p>
      </BpSection>

      <BpSection number="06" title="顺带挖出的三个坑">
        <h3>坑一：“整理这条回复”点了像卡死</h3>
        <p>学习聊天里每个回答下面有“整理这条回复”——把对话沉淀成笔记。用户点了之后 30–60 秒没有任何反馈，看起来像卡死。真相：笔记生成是后台任务（入队只要 0.16 秒，生成要 30–60 秒），但主界面只在“整理成卡片”那条路径上有状态提示，普通整理路径点击后什么都不显示。</p>
        <p>修复：点击后按钮立即变「整理中…」；输入区上方出现状态行——进行中显示跳动点 +「正在整理笔记…（已冻结 N 条消息）」；失败显示「整理失败」+ 具体原因 + 重试按钮；成功出现「笔记已收录这条回复 / 打开笔记」。</p>
        <BpFigure
          src={`${IMG}/note-succeeded.png`}
          caption="整理笔记完成态：按钮复原，「笔记已收录这条回复 · 打开笔记 · 对照原聊」出现。"
          alt="CareerPilot 整理笔记成功后的消息桥"
          narrow
        />
        <h3>坑二：笔记生成高频“未返回完整内容”</h3>
        <p>和聊天同一个根因：笔记生成调 <code>read_json</code> 时没传 <code>output_limit</code>，推理模型把默认预算吃满后不吐 JSON，任务直接失败。给笔记生成 8000、复习卡 4000 的显式输出上限后，重试一次即成功。</p>
        <h3>坑三：引文校验把换行当成“不一致”</h3>
        <p>笔记里的引用要逐字匹配原文（<code>quote in text</code>）。思考型模型生成的引文偶尔多一个换行或连续空格，逐字匹配就误判失败。改成两侧先折叠空白（<code>" ".join(text.split())</code>）再比较，语义不变、容忍排版差异。</p>
      </BpSection>

      <BpSection number="07" title="工程质量：把“打磨”锁进测试">
        <ul>
          <li>每个修复先写失败测试再改实现：<code>test_llm_stream_transport.py</code> 新增 reasoning 捕获与回调测试（断言 reasoning 不落 meta、有界、<code>first_reasoning_ms</code> 记录）；<code>test_study_chat_stream.py</code> 新增实时推理帧转发测试；<code>test_study_notes.py</code> 新增引文空白容忍测试。</li>
          <li>全量后端 <strong>839 passed, 1 failed</strong>（唯一失败是预存环境问题：<code>deploy/restore.ps1</code> 被 PowerShell 执行策略拦截，与本次改动无关，单独验证过）。</li>
          <li>前端 <code>tsc --noEmit</code> + <code>npm run build</code> 双绿。</li>
          <li>端到端用真实模型验证：浏览器里发送问题 → 观察思考面板实时增长 → 正文流式 → 完成后自动收起；SSE 请求确认为 <code>text/event-stream</code> 200。</li>
        </ul>
      </BpSection>

      <BpSection number="08" title="这条链路教我的事">
        <ul>
          <li><strong>先量再猜。</strong>三把尺子（网关直测、SSE 帧计时、数据库轮询）把“卡”定位到了模型思考阶段，而不是网络或前端——如果没有网关直测，我可能会去优化一个并不存在的瓶颈。</li>
          <li><strong>推理模型把“流式”的语义改了。</strong>对推理模型，流式的第一段内容不是正文而是思考；凡是丢弃 reasoning 的解析器，都会把“思考的 60 秒”变成“用户眼前的 60 秒空白”。要么展示它，要么至少把它算进延迟预算。</li>
          <li><strong>max_tokens 是对推理模型输出的总预算，不是正文预算。</strong>不放大预算，模型会“思考完就截断”，表现为莫名其妙的 invalid_response。</li>
          <li><strong>异步任务必须有反馈契约。</strong>入队 0.16 秒、完成 60 秒的操作，用户眼里就是“卡死”，除非你在中间把状态演给他看：进行中 / 失败可重试 / 成功可打开。</li>
        </ul>
        <p className="bp-em">流式体验的终点不是“字在动”，而是用户每一毫秒都知道系统在想什么、在做什么、接下来会发生什么。</p>
      </BpSection>
    </div>
  )
}
