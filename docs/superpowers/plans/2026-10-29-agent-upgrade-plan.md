# Agent 升级开发规划：工具化 + GitHub 接入 + 页面放大镜

日期：2026-10-29 · 状态：**已实施**（设计定稿见
`docs/superpowers/specs/2026-10-29-agent-upgrade-design.md`；本地验证 24/24 通过）

## 0. 一句话目标

把主页右下角的聊天机器人，升级为一个**能在真实环境里干活、能引用真实代码自证、能导览整个页面**的 Agent——让"我懂 Agent"从简历上的主张，变成访客（尤其面试官）可以现场体验的证据。

三个能力，三个价值：

| 能力 | 价值 |
|---|---|
| A. 工具化（页面感知 + UI 操控 + 可见推理过程） | 演示 Agent 与 Chatbot 的本质区别：观察→决策→行动循环 |
| B. GitHub 接入（读真实仓库的代码与文档） | 面试官提问时，Agent 基于**真实材料**润色项目、巧妙应答短板——有据可查，不怕穿帮 |
| C. 页面放大镜（点哪讲哪） | AI 能力溢出到整个站点：任何区块都能召唤一段专业又俏皮的解释 |

## 1. 总体架构

核心判断：**浏览器是 Agent 的环境，服务端是策略层。**

```
┌─ 浏览器（环境 + 编排） ──────────────────────────────────────┐
│  AgentPanel（聊天 + trace UI）      PageLens（放大镜 + 浮层）  │
│        │                                  │                   │
│        ▼                                  ▼                   │
│  agentRuntime（多轮工具循环，最多 3 轮 + 强制收尾）             │
│        │                                  │                   │
│        ├─ 浏览器工具：read_page / open_section / highlight…   │
│        │   （直接操作 DOM / 路由 / 主题 / 表单）               │
│        ▼                                  ▼                   │
└─────── POST /api/agent（面板/放大镜共用） ── POST /api/tool ───┘
                 │                                  │
┌─ 服务端（策略层，Aliyun FC） ──────────────────────────────────┐
│  /api/agent：人设 system prompt（不下发）· 工具 schema 白名单   │
│              wire 消息校验 · 限流 · DeepSeek 网关               │
│  /api/tool：GitHub 只读工具（白名单仓库 + 缓存 + 限流）         │
│  /api/message：留言送达（唯一真实副作用，服务端校验）           │
└───────────────────────────────────────────────────────────────┘
```

为什么工具分两个栖息地：

- **页面观察/动作必须在浏览器**：read_page 读的是真实 DOM 和路由（不是服务端镜像），滚动/高亮/跳转只有浏览器能执行。
- **外部世界访问必须在服务端**：GitHub token 不下发、API 限额集中管理、仓库白名单集中配置；客户端传来的一切都按不可信输入处理。
- **策略（人设、白名单、限流）留在服务端**：防注入的核心防线不进前端 bundle。

## 2. 工具清单（9 个）

| 工具 | 执行位置 | 作用 | 演示话术 |
|---|---|---|---|
| `read_page()` | 浏览器 | 读当前路由、正在看的区块、主题、页面标题 | "它知道我在看哪" |
| `get_profile(field)` | 浏览器 | 查结构化资料：summary/projects/experience/skills/contact | "介绍有据，不背稿" |
| `list_github_files(repo)` | **服务端** | 列仓库文件树（缓存 10 分钟） | "它真的翻了我的仓库" |
| `read_github_file(repo, path)` | **服务端** | 读仓库文件内容（≤3500 字符，二进制拒绝） | "引用 README 原文来夸我" |
| `open_section(section)` | 浏览器 | 滚动到 home/about/work/contact | "页面被它接管" |
| `open_project(slug)` | 浏览器 | 跳转项目详情页 | "面试官截图时刻" |
| `highlight(target)` | 浏览器 | 像素风聚光灯框住区块/项目卡 2.4s | 同上 |
| `show_message_form(draft)` | 浏览器 | 打开留言表单，可代拟草稿 | "从好奇走到行动的闭环" |
| `set_theme(mode)` | 浏览器 | 切换白天/夜间主题 | "隐藏彩蛋" |

克制说明：每个工具对应一类能力（观察 / 检索 / 行动 / 沟通）。不做 web_search、不做代码沙箱——9 个已经足够讲完整故事。

## 3. Agent 循环协议

### wire 消息格式（客户端持有、服务端逐轮校验）

```jsonc
{ "role": "user",      "content": "..." }
{ "role": "assistant", "content": "…（旁白，可为空）",
  "tool_calls": [ { "id": "call_x", "name": "open_section", "arguments": "{\"section\":\"work\"}" } ] }
{ "role": "tool",      "tool_call_id": "call_x", "content": "{ ok, summary, data }" }
```

### 一轮对话的时序

```
用户："带我看看你最拿得出手的项目"
  │
  ▼ POST /api/agent { messages }          ── 服务端：注入人设 + 工具 schema → DeepSeek
  ◀ { narration: "跟我来。", tool_calls: [read_page, get_profile] }
  │  [面板打出旁白气泡 + trace 行出现]
  │  浏览器执行工具 → trace 行变 ✓
  ▼ POST /api/agent { messages + assistant(tool_calls) + tool 结果 }   ── 循环第 2 轮
  ◀ { narration: "……这个项目有代码为证。", tool_calls: [read_github_file] }
  │  [POST /api/tool → 服务端读 GitHub → 结果回填]
  ▼ POST /api/agent（第 3 轮）
  ◀ { reply: "（最终介绍，打字机流出）" }
```

### 终止保证（经典 Agent bug 的防御）

- 工具轮最多 3 轮；到第 3 轮仍要调工具时，**摘掉 tools 再调一次**（`allowTools:false`），模型被迫输出文字。
- 服务端逐轮校验：工具名白名单、tool_call_id 配对（每个调用必须有结果、结果必须能对上调用）、消息数 ≤30、工具消息 ≤12、内容长度上限。非法直接 400。

### 降级

`/api/agent` 404（如切到 worker/edge-functions 旧后端）→ 前端自动退回 v1 `/api/chat` 纯聊天模式，站点不坏。

## 4. GitHub 接入设计

- **白名单**：环境变量 `GITHUB_REPOS`（逗号分隔 `owner/name`），服务端硬校验，工具 schema 里做成 enum 让模型不乱猜。**默认 `lueyu/lueyu.github.io`，待确认补齐**（见 §12）。
- **认证**：公开仓库匿名可读（60 次/时/源 IP）；可选 `GITHUB_TOKEN` 提到 5000/时。token 只存在 FC 环境变量。
- **缓存与限额**：文件树缓存 10 分钟（进程内 Map）；`/api/tool` 独立限流 60 次/IP/天；文件内容截断 ~3500 字符并标注 `(truncated)`，二进制/超大文件拒绝。
- **只读**：没有任何写操作。攻击面 = 被限流地读你公开的仓库，无。

## 5. 面试话术策略（prompt 层，配合 GitHub 材料）

persona prompt v2 新增「面试官模式」规则：

1. **润色有据**：介绍项目以 `get_profile` / `read_github_file` 的真实材料为依据；可以强调动机、取舍与验证方式（这些是真实优点），**不编造**数据、star 数、成果。
2. **短板应答公式**：被问到不足 → ①承认真实存在的限制（材料里看得见的）→ ②讲当时的取舍逻辑（这个限制换来了什么）→ ③给出下一步改进方向。不狡辩、不撒谎、不摆烂。
3. **访客分层**：介绍 Lueyu 前先判断对方身份（招聘方/技术同行/路人），不确定就问一句，再决定讲成果还是讲细节。
4. **工具使用礼仪**：调工具前先说一句符合人设的短旁白（"等等，我翻翻他的仓库。"），不裸调；一轮内工具 ≤3 个。

## 6. 页面放大镜设计

### 交互流

```
平时：Agent 触发器上方挂一个小放大镜按钮（像素风）
点击 → 进入 lens 模式：光标变十字线，可点区块 hover 出虚线框，Esc/再点按钮退出
点击某区块 → 该区块解析为 { 标题, 文本摘录 ≤1500 字符 }
        → POST /api/agent { surface:"lens", lens:{title,text} }
        → 浮层卡片出现在该区块旁（视口内自适应），打字机流出解释
```

### 关键决策

- **与聊天共用一个大脑、一个端点**：`surface` 参数区分。lens 模式**不带工具、单轮调用**——解释要快（3~6s），不需要观察循环。
- **lens 专属人设**：详细专业 + 俏皮（保留一点点傲娇基因但以讲解为主）。system prompt 服务端切换，不下发。
- **区块解析**：`closest('section, article, header, footer')` + 内部标题猜测（h1/h2/label），项目卡用 `data-project-slug`。首页和项目详情页都可用（详情页讲 SYSTEM MAP、指标卡，效果最好）。
- **lens 消耗同一份聊天限额**（150 次/IP/天，面板+lens 合计）。

## 7. 前端改造清单

| 文件 | 改动 |
|---|---|
| `src/lib/siteProfile.ts` **新建** | 站点数据单一来源（项目/经历/联系方式/区块表）；App.tsx 改为引用 |
| `src/lib/agentTools.ts` **新建** | 浏览器工具执行器 + 路由/表单注册表；服务端工具转发到 `/api/tool` |
| `src/lib/agent.ts` **重构** | wire 类型、localStorage 迁移（旧气泡格式 → wire）、`/api/agent` 调用、legacy 回退、lens 请求 |
| `src/lib/agentRuntime.ts` **新建** | 多轮循环编排、终止保证、trace 事件回调 |
| `src/components/AgentPanel.tsx` **重写** | trace 行（终端风）、旁白气泡、打字机流式感、表单卡片化、状态文案（THINKING/ACTING/TYPING） |
| `src/components/PageLens.tsx` **新建** | 放大镜按钮、十字线模式、hover 框、解释浮层 |
| `src/App.tsx` | 数据改引用 siteProfile、项目卡加 `data-project-slug`、主题事件监听、移除内嵌面板 |
| `src/SiteRoutes.tsx` | 面板 + 放大镜提升到 RouteFrame（全路由常驻，`open_project` 跳页后对话不断） |
| `src/index.css` | trace/旁白/聚光灯/lens 样式（日夜双主题、移动端、reduced-motion） |
| `public/sw.js` | 缓存版本号 +1 |

## 8. 后端改造清单（fc/index.js）

- `POST /api/agent`：如上协议；`DEEPSEEK_BASE_URL` 可覆盖（本地 mock 测试用）。
- `POST /api/tool`：GitHub 两工具的受控执行（白名单/缓存/限流）。
- prompts v2：simulation 层改写（"你有工具"而非"你没有工具"）+ persona 层「面试官模式」+ lens 人设。
- 限额调整：chat 150 次/IP/天（多轮折算）、max_tokens 500、`/api/tool` 60 次/IP/天。
- 旧 `/api/chat`、`/api/message` 原样保留（降级 + 留言通道不动）。

## 9. 实施顺序

1. `siteProfile.ts`（数据层）
2. `agentTools.ts`（工具执行 + 注册表 + 服务端转发）
3. `agent.ts` + `agentRuntime.ts`（协议 + 循环）
4. `AgentPanel.tsx`（面板 UI）
5. `App.tsx` / `SiteRoutes.tsx`（挂载点 + 事件）
6. CSS + sw
7. fc 后端（/api/agent、/api/tool、prompts v2）
8. `PageLens.tsx`（放大镜）
9. 验证（见 §10）
10. README + 设计文档（specs/2026-10-29-agent-upgrade-design.md）

## 10. 验证计划

- **本地自动化**：mock DeepSeek + mock GitHub，起 standalone `node fc/index.js`，跑通：普通对话 / 旁白+工具往返 / 工具结果回填后的最终回复 / lens 请求 / 校验拒绝（伪造工具名、孤儿 tool_call_id、超限）/ 429 限流 / CORS 预检。
- **构建**：`npm run build`（tsc + vite）零错误。
- **手动 QA**：真机上验证——带工具完整循环（滚动/高亮/跳页后对话延续）、放大镜点各区块、留言表单草稿预填、日夜主题、移动端、reduced-motion、localStorage 旧数据迁移、legacy 降级。

## 11. 明确不做与取舍（写进设计文档的部分）

- **不做 SSE 流式**：FC 响应 API 不支持分块输出。选择：每轮一个请求 + 客户端打字机动画。协议按"事件流消费者"设计（runtime 的回调即流接口），未来换后端可平滑接 SSE。
- **不做** web_search、代码沙箱、MCP、服务端会话状态（无状态设计，三个备选后端零改动可用——worker/edge 暂保持 v1 契约，前端自动降级）。
- GitHub 只读白名单仓库；不缓存敏感信息（全是公开数据）。

## 12. 待确认问题

1. **GitHub 仓库白名单**：默认 `lueyu/lueyu.github.io`。AIDR 仓库在 `rainbow0432-dev` 名下要加吗？daily-portfolio 是公开还是私有（私有则工具只能跳过它）？还有别的想让它读的仓库吗？
2. **GITHUB_TOKEN**：有没有可用的 token（可选，只为了提升 API 限额到 5000/时；没有也能跑，匿名 60/时）。
3. **放大镜交互**：悬浮按钮 + 十字线点选 + 浮层解释，这个形态 OK 吗？还是想要别的触发方式（比如按住 Alt 点页面）？
