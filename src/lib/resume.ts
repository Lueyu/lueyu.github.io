export const RESUME_META = {
  name: "王略宇",
  role: "AI Agent Engineer",
  roleNote: "ADAS 工程师 · 斯巴鲁研究院",
  location: "底特律 → 中国",
  email: "lueyuw@umich.edu",
  site: "https://lueyu.github.io",
  pdfPath: "/resume/lueyu-resume.pdf",
  updated: "2026-10",
}

export const RESUME_SUMMARY =
  "密歇根大学电子与计算机工程硕士（GPA 4.0），本科计算机科学（GPA 3.73）。现于斯巴鲁研究院担任 ADAS 工程师，负责计算机视觉与全栈工具链。此前在 Irdeto 开发端到端自动化测试，在博世开发 Q&A 机器人前后端，在密歇根大学安全云制造实验室做大数据异常检测与 PLC 安全模糊测试。"

export const RESUME_EDUCATION = [
  {
    school: "密歇根大学安娜堡分校",
    degree: "电子与计算机工程 · 硕士",
    gpa: "4.0",
    period: "2022.09 — 2023.12",
    fullTime: true,
  },
  {
    school: "密歇根大学安娜堡分校",
    degree: "计算机科学 · 本科",
    gpa: "3.73",
    period: "2019.09 — 2022.04",
    fullTime: true,
  },
]

export const RESUME_EXPERIENCE = [
  {
    company: "Subaru Research and Development, Inc.",
    title: "ADAS 工程师",
    location: "底特律，密歇根",
    period: "2023.05 — 至今",
    points: [
      "智能车门设计：运用计算机视觉开发自动开关车门功能，实现人脸识别、低光照增强、面部对齐和眼球追踪（OpenCV, Pygaze, Docker）",
      "红外摄像头研究：低光照路况数据收集与大数据预处理，成功训练低光照条件下的神经网络（OpenCV, Matlab, Python）",
      "测试车辆预约软件：React + Django 前后端，JWT 鉴权",
      "Android Automotive 研究：开发自定义 Android Automotive 车机模拟器",
    ],
    tags: ["OPENCV", "REACT", "DJANGO", "DOCKER"],
  },
  {
    company: "Irdeto USA, Inc.",
    title: "软件工程师",
    location: "底特律，密歇根",
    period: "2023.01 — 2023.04",
    points: [
      "为 UPS Keystone Fleet 项目开发端到端自动化测试（Appium + Selenium，覆盖嵌入式硬件、iOS/Android、Web）",
      "设计效用函数与压力测试工具（并发编程）",
    ],
    tags: ["APPIUM", "SELENIUM", "并发编程"],
  },
  {
    company: "博世中国",
    title: "软件工程师",
    location: "上海",
    period: "2021.05 — 2021.08",
    points: [
      "博世 500+ 人财务部门 Q&A 机器人前端管理系统与 NLP 语义训练前端（Vue, MDN Web API）",
      "Q&A 机器人后端：Flask + Python，添加表情发送、语言识别等功能",
      "部门新版网页开发与日常更新（Nginx）",
    ],
    tags: ["VUE", "FLASK", "PYTHON", "NGINX"],
  },
  {
    company: "密歇根大学安全云制造实验室",
    title: "研究助理",
    location: "安娜堡，密歇根",
    period: "2020.01 — 2021.01",
    points: [
      "大数据处理与异常检测：Java + Apache Spark 处理机床大数据并发现异常",
      "安全测试开发：自动生成 EN/IP 包模糊测试 PLC 程序，检测 DDoS 漏洞（Python, Boofuzz）",
    ],
    tags: ["JAVA", "SPARK", "BOOFUZZ"],
  },
]

export const RESUME_PROJECTS = [
  {
    name: "密歇根大学生命科学研究院 Cianfrocco 实验室",
    role: "软件开发",
    period: "2022.11 — 2023.01",
    points: [
      "构建全栈 SaaS GUI 处理低温电子显微镜数据（React, Material Design）",
      "实现用户登录、yaml 解析器与数据可视化（React, Node.js）",
      "编写部署与新功能文档，促进组内高效开发",
    ],
    tags: ["REACT", "NODE.JS", "CRYO-EM"],
  },
  {
    name: "网页与网络安全",
    role: "开发",
    period: "2022.03 — 2022.05",
    points: [
      "HTTP 中间人攻击模拟（Go），拦截和篡改模拟银行汇款地址",
      "Web 安全漏洞模拟：SQL 注入、XSS、CSRF（JavaScript, MySQL）",
    ],
    tags: ["GO", "SECURITY"],
  },
]

export const RESUME_SKILLS = [
  "编程语言：Python · C++ · Java · HTML/CSS/JavaScript · Go",
  "框架与工具：Vue · React · Flask · Django · Selenium/Appium · Linux · Docker · SQL · Node.js · OpenCV · Matlab · Simulink",
  "语言：普通话（母语）· 英语 · 日语",
  "证书与荣誉：院长名单（Dean's List）· JLPT N2 · Ingersoll Prize",
]
