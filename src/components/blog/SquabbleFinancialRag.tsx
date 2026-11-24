import { BpCode, BpFigure, BpFlow, BpQuote, BpSection, BpTable } from './bp'

const IMG = '/images/blog/squabble-financial-rag'
const APPLE_FILING = 'https://www.apple.com/newsroom/pdfs/fy2023-q4/FY23_Q4_Consolidated_Financial_Statements.pdf'
const META_FILING = 'https://investor.atmeta.com/investor-news/press-release-details/2026/Meta-Reports-Fourth-Quarter-and-Full-Year-2025-Results/default.aspx'
const BASELINE = 'https://github.com/Lueyu/squabble/blob/3343331227ad4f07975c291f2d58498bd70f828d'

export default function SquabbleFinancialRag() {
  return (
    <div className="bp-article">
      <p>我在 Squabble 做了一个投研资料库，给研究员和 Agent 保存财报、网页和研究材料。一次测试里，模型算对了 Meta 的分部亏损，却没找到分部表的那一行。我想知道，从上传一份财报到答出一个能回原表核对的数字，中间究竟哪一步丢了证据。</p>
      <div className="bp-summary">
        <strong>成果速览</strong>
        <ul>
          <li>真实上传一份 Apple 财报，<strong>149.862 秒</strong>后首次搜到正文，结果定位到 PDF 物理第 1 页。</li>
          <li>第一组留出题的 Recall@10 从 <strong>0% 升到 91.67%</strong>。18 道可答题都找到了至少一段证据，其中 3 道仍缺计算或回答所需的另一段。</li>
          <li>最后一组 18 道盲题共用同一个候选池。重排把前六条必要原文召回率从 <strong>87.50% 提到 95.83%</strong>，正确性从 <strong>83.90% 提到 90.55%</strong>。</li>
          <li>最终达到 <strong>13/15 项</strong>预设门槛。正确性和反问相关性仍未达标，高风险验收没有通过。</li>
        </ul>
      </div>

      <BpSection number="01" title="Meta 亏损答到了 19,193，我还是得翻原表">
        <BpQuote tone="bad">Meta 2025 年度业绩稿里，Reality Labs 全年亏了多少？请用正数和百万美元作答。</BpQuote>
        <p>第一版回答引用了两行利润数据。Meta 全年合并营业利润是 83,276，Family of Apps 全年营业利润是 102,469。模型算出差额 19,193 百万美元，又说无法确认这就是 Reality Labs 的亏损。数字与标准答案一致。读者要核对分部、期间和会计科目，仍需另开财报。</p>
        <p>调整排序后，模型收到的第一条就是 Reality Labs 的全年营业损益 <strong>−19,193 百万美元</strong>，按题意取绝对值即可。两次回答的数字相同，能回到分部表原行的只有第二次。<a href={META_FILING}>Meta FY2025 业绩稿</a></p>
        <BpFigure src={`${IMG}/trace.png`} alt="Meta 分部亏损题在两种检索排序中的原文摘录与实际回答" caption="开发题回放。左栏从两条利润推差额，右栏的首条证据直接给出 Reality Labs 的全年营业损益。" />
      </BpSection>

      <BpSection number="02" title="一条资料引用要指向版本和原文位置">
        <p>我把资料拆成两个对象。<code>data_library_sources</code> 保存来源类型、属主、启停状态和最新版指针。<code>data_library_versions</code> 保存当次抓取或解析的正文、段落和观测时间。网页更新或解析补完后，会生成新的版本。用户可以从页面、链接或文件入库。报价等金融数据的查询另走数据提供方接口。</p>
        <BpFlow label="PDF 入库和引用" steps={['保存原件', '后台解析', '发布可检索版本', '返回原文摘录和定位', '研究会话保存证据引用']} />
        <p>PDF 上传先落原件，再交给 Docling 等提取器。完成后写入带页码和元素位置的版本。一次 Apple FY2023 测试在 6.968 秒收到上传回执，当时能搜到标题，正文还搜不到。149.862 秒才首次返回正文。这个读数来自单文件和约一秒一次的探测。界面上的数字核对依然显示「未知」。<a href={APPLE_FILING}>Apple FY2023 原始财务表</a></p>
        <BpFigure src={`${IMG}/product-apple-2023.png`} alt="Squabble 资料库显示 Apple 财报原件指纹、解析状态和 PDF 物理页位置" caption="真实产品界面。Apple 财报已完成解析，命中的标题元素位于 PDF 物理第 1 页。" />
        <p>研究工具返回 <code>sourceId</code>、<code>versionId</code> 和 <code>locator</code>。团队能看的是本轮授予该成员的版本，还受资料可见状态和观测截止时间约束。保留旧版引用可以解释当时用过什么。再次读取时，工具仍要核对当前授权。<a href={`${BASELINE}/scripts/db/50_data_library.sql`}>资料库基线表结构</a> · <a href={`${BASELINE}/server/modules/teams/team-source-access.service.ts`}>团队资料授权代码</a></p>
      </BpSection>

      <BpSection number="03" title="先量入库、召回和作答，用三种条件找故障">
        <p>我从 28 份发行人披露中人工核对 398 段财务证据，再录入隔离资料库。批量问答从已入库文本开始。上传、解析和正文检索由前面的 Apple 单份 PDF 另行验证。</p>
        <p>54 道中文题中，微软和 Meta 的 27 道用于开发，Apple 和 Alphabet 的 27 道锁定留出。每组 18 道可答、9 道应拒或澄清。每项证据登记期间、币种、量纲、表名与位置。其他属主、停用、删除三类权限对照用公开材料构造。</p>
        <BpTable headers={['运行条件', '记录', '用来判断']} rows={[
          ['真实检索', '原问、排名、返回的摘录', '金标段落进了 Top 20 吗？必要原文进了模型看到的前 6 条吗？'],
          ['固定证据', '原问与全部金标原文，交给同一回答模型', '证据给齐后，模型能否算对、拒对、引对？'],
          ['真实检索后作答', '实际输入、答案、引文、盲评记录', '排序和生成组合起来，读者拿到了什么？'],
        ]} />
        <p>段落 Recall@20 按每题命中的必要段落计。上下文召回率按参考答案中有原文支持的事实计。忠实度评价模型实际说出的断言，引用另外核对位置是否真实、是否支撑对应断言。全部拒答会让忠实度的分母缩小，因此我同时报可答题作答率、正确性和应拒题表现。系统还会保留失败和证据不足的结果。</p>
        <p>作答和重排用隔离的 Codex <code>gpt-6.2-sol</code> 请求，盲评用 <code>gpt-6.2-astra</code>。每题的检索输入、模型回执和量表版本各自留档。FinQA 提供了另一批公开财报页摘和专家问法，用于核对裁判以及另做留出测试。<a href="https://aclanthology.org/2021.emnlp-main.300/">FinQA 论文</a></p>
      </BpSection>

      <BpSection number="04" title="把查询上限加到 20 条，开发集仍是零召回">
        <p>原版把完整问句交给 PostgreSQL 的 <code>simple</code> 全文查询，同时在正文、标题和说明中做子串匹配。按观测时间取版本，每个版本给一条摘录，上限 10 条。单独把上限提高到 20，开发集的 Recall@20 还是 0%。问句里的说法与资料里的指标或期间写法有出入，扩容没有改变查询条件。</p>
        <BpCode label="DataLibraryService.search 的基线匹配条件">{`const q = parsed.data, term = \`%\${escaped(q.query)}%\`;
const match = or(sql\`to_tsvector('simple', \${versions.extractedText}) @@ plainto_tsquery('simple', \${q.query})\`,
  ilike(versions.extractedText, term), ilike(sources.title, term), ilike(sources.description, term));`}</BpCode>
        <p>我让查询识别发行人、分部、期间和双语指标，用段落参与排序，并优先保留题目需要的不同证据。开发集 Recall@20 先到 88.89%，加入主体、期间与证据覆盖后到 97.22%。首次锁定留出降到 91.67%，3 道题都缺了一半证据。再补双语财务词、可比报表与拆股注记之后，已开封题能找齐，另外冻结的题才用于看能否复现。<a href={`${BASELINE}/server/modules/data-library/data-library.service.ts#L375`}>基线检索代码</a></p>
        <BpFigure src={`${IMG}/retrieval.png`} alt="首轮留出集在原检索与候选检索中的 Recall、MRR 与上下文精度对照" caption="首轮锁定留出。候选 Recall@20 为 91.67%，原版接口拒绝了 20 条请求。" />
      </BpSection>

      <BpSection number="05" title="先把引用绑到原文，再重排模型会看到的六条">
        <p>同一张 Apple 财务表里，季度与全年的截止日都是 2023 年 9 月 30 日，净销售额分别是 89,498 和 383,285 百万美元。只把日期和数字切成一句文本时，很容易漏掉「三个月」或「十二个月」的表头。</p>
        <BpFigure src={`${IMG}/apple-periods.png`} alt="Apple 财报中同一截止日的三个月与十二个月净销售额列" caption="Apple 官方财报实际截屏。同一个截止日下，季度和全年净销售额不同。" />
        <p>我先要求模型为每个关键断言提交原文短引，由程序核对短引是否出现在所指片段，再挂引用。拒答理由如果声称报表含有某个科目，也走这道核对。在亚马逊和英伟达的 21 道后备题上，引用准确率从 30/36 到 17/17，覆盖从 34/37 到 27/27。两组共用有缺口的检索结果。标准提示答了 11/14 道可答题，引文校验组答了 10/14，正确性从 87.43% 降到 73.75%。</p>
        <BpFigure src={`${IMG}/confirmation.png`} alt="亚马逊和英伟达留出集上的标准提示与逐条引文校验对照" caption="后备组使用相同检索上下文。逐条引文更准，可答题的漏答也更多。" />
        <p>另一组 FinQA 找齐了 Top 20，却只有 83.33% 的必要原文进入前 6 条。我让 Codex 只看原问和打乱顺序的候选短摘，重排后仍取 6 条。那批题的正确性从 83.72% 到 97.56%。它已经开封，所以我另外冻结新题。最终盲测中，18 次重排调用的单次 P95 是 30.17 秒，同组 SQL 检索 P95 是 56.14 毫秒。两项都是本次实验的阶段计时。</p>
      </BpSection>

      <BpSection number="06" title="最终盲测仍有一道题缺计算分母">
        <p>最后一组延续预先登记的 FinQA 选题顺序，使用此前未入选的新报告。12 道可答题、6 道应拒题，两组分别完成 18/18 题盲评。两组共用真实 SQL 检索的候选池和相同的作答规则，对照只改变排序。</p>
        <BpTable headers={['指标', '直接检索', '盲重排', '门槛']} rows={[
          ['段落 Recall@20', '95.83%', '95.83%', '≥95%'],
          ['nDCG@10', '74.54%', '96.78%', '≥85%'],
          ['MRR@10', '74.58%', '100%', '≥85%'],
          ['上下文精度（按证据排名加权）', '73.82%', '100%', '≥90%'],
          ['上下文召回（参考事实）', '29/33', '32/34', '≥90%'],
          ['答案忠实度', '29/29', '31/31', '≥95%'],
          ['断言级幻觉', '0/29', '0/31', '≤5%'],
          ['实体级幻觉', '0/83', '0/90', '≤1%'],
          ['引用准确率', '14/14', '15/15', '≥98%'],
          ['关键断言引用覆盖率', '29/29', '31/31', '≥98%'],
          ['引用可追溯率', '14/14', '15/15', '100%'],
          ['应拒且理由恰当', '6/6', '6/6', '100%'],
          ['越权内容进入上下文', '0/18', '0/18', '0'],
          ['反问相关性', '85.34%', '85.38%', '≥90%'],
          ['答案正确性（事实 F1 与语义相似度加权）', '83.90%', '90.55%', '≥95%'],
        ]} />
        <BpFigure src={`${IMG}/final-validation.png`} alt="最终 18 题留出的 15 项门槛及直接检索和盲重排成绩" caption="最终留出评分回执截图。重排组过了 13 项，反问相关性和答案正确性都低于门槛。" />
        <p>重排组回答了 11/12 道可答题。一道题要算长期债务占合同义务总额的比例，分母连 Top 20 都没进去。重排只能移动已有片段，模型最终拒答。独立裁判在看不到生成答案的条件下，把同一组参考事实的支持数从 32/36 评到 34/36。表中的联合盲评分母来自各组拆出的参考事实，因此分别为 33 和 34。</p>
        <p>反问分也需要对照。在上一组外部题上，把冻结的标准答案本身送入同一反问流程，余弦平均只有 83.39%。这个结果提示量表和事实正确性可能不同步。90% 门槛仍照原协议判定。</p>
      </BpSection>

      <BpSection number="07" title="用权限对照和回执核验守住结果">
        <p>最终检索改动在 PostgreSQL 16 和 18 上各通过 71 项回归检查，覆盖中文长文、指标与注记、旧版本和研究工具权限。11 月 24 日核对的本机产品代码仍沿用基线检索。批量实验调用实验分支的检索服务与独立 Codex 请求。产品验证跑了单份 PDF 上传、解析和正文检索。完整研究室交互、真实用户资料库和个人部署的表现仍待测。</p>
        <p>并发对照里，两组各有一条拒答复核的独立缓存副本被同键覆盖。我保留首次答复和判读，用稳定缓存分别重放，两组都通过独立核验，15 项门槛的判定均一致。复跑时要给每组自己的缓存目录，让请求、答复和裁定能逐条对上。</p>
        <BpFigure src={`${IMG}/generation.png`} alt="主留出集各项门槛与已评样本、证据不足项目的标记" caption="首轮主留出只完成 26/27 题盲评。证据不足项目保留了状态，没有计为达标。" />
        <p>最终留出 0/18 次越权、6/6 次应拒题正确，说明本次受限资料对照通过。即便假设各题独立，0/18 的单侧 95% 错误率上界仍是 15.33%。这个样本量只能支持对本次运行作判断。</p>
      </BpSection>

      <BpSection number="08" title="下次复测，从缺的那一行开始">
        <ul>
          <li><strong>先按原表标证据。</strong>金标写明版本、页码、表行、列头、单位和所有操作数。按发行人或报告事件划分开发与留出。</li>
          <li><strong>逐级核对同一道错题。</strong>拿原文短语查入库，再看前 20 条与实际前 6 条，最后用固定证据重答。每一步保存输入、输出和失败状态。</li>
          <li><strong>把正确性、拒答和引用一起看。</strong>引用能打开之后，还要核对它是否支撑这项断言。零幻觉与低答题覆盖可以同时出现。</li>
        </ul>
        <p className="bp-em">一道财报题需要两个操作数时，直到两个数都能从对应版本的原表读出来，答案才有可复核的计算依据。</p>
      </BpSection>
    </div>
  )
}
