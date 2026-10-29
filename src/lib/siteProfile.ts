export interface FeaturedProject {
  number: string;
  slug: string;
  eyebrow: string;
  title: string;
  role: string;
  description: string;
  highlights: string[];
  details: string;
  tags: string[];
  color: "red" | "green" | "blue";
}

export interface ExperienceEntry {
  period: string;
  company: string;
  title: string;
  description: string;
  tags: string[];
}

export const FEATURED_PROJECTS: FeaturedProject[] = [
  {
    number: "01",
    slug: "aidr",
    eyebrow: "AI DATA RESILIENCE",
    title: "AIDR",
    role: "DEEP CONTRIBUTOR",
    description:
      "面向 AI 智能体时代的数据保护平台：按工具调用图计算爆炸半径，把 Agent 与实际读写的数据组成保护组并原子恢复。",
    highlights: ["打通 Agent 观测、归属与备份闭环", "修复 4 个生产级静默失败问题"],
    details:
      "完成 15 容器生产栈部署、OpenCode × Langfuse 观测链路、restic 备份设备适配器与 K8s 迁移方案；通过独立分支、防回归单测、分层 E2E 和合规报告交付 PR #47–#50。",
    tags: ["OTEL", "LANGFUSE", "RESTIC", "K8S"],
    color: "red",
  },
  {
    number: "02",
    slug: "daily-portfolio",
    eyebrow: "FULL-STACK AGENT APP",
    title: "Daily Portfolio",
    role: "INDEPENDENT PROJECT",
    description:
      "集投资组合管理、AI 投研与 Coding Agent 于一体的全栈工作台，覆盖持仓、交易、研究记录与组合分析。",
    highlights: ["隔离执行、代码检查点与失败恢复", "测试证据与源码版本强绑定"],
    details:
      "多角色模型生成投研分析，再由确定性规则与人工审核进入业务流程。Coding Agent 在容器内修改代码，候选变更经过冲突检查、审阅与独立复验后应用。",
    tags: ["REACT", "NESTJS", "PYTHON", "POSTGRES"],
    color: "green",
  },
  {
    number: "03",
    slug: "next-quest",
    eyebrow: "NEXT QUEST",
    title: "To Be Built",
    role: "RESERVED SLOT",
    description: "第三个主要项目正在整理中。这里会留给一个值得完整讲述的问题、过程和结果。",
    highlights: ["问题要真实", "过程可复现"],
    details: "",
    tags: ["SOON", "EXPERIMENT"],
    color: "blue",
  },
];

export const OTHER_EXPERIENCE: ExperienceEntry[] = [
  {
    period: "2024 — NOW",
    company: "Huawei",
    title: "Infrastructure & Automation",
    description:
      "参与智能数据存储基础设施与关键特性研发，负责测试自动化基础设施、CI/CD 构建链路与团队交付协作。",
    tags: ["KUBERNETES", "C++", "AUTOMATION"],
  },
  {
    period: "2023 — 2024",
    company: "Subaru R&D",
    title: "Driver Research Platform",
    description:
      "构建数据与访问密集型云应用，结合视觉、文本与驾驶模拟进行用户意图分析，支持研究决策。",
    tags: ["PYTHON", "OPENCV", "REACT", "DJANGO"],
  },
  {
    period: "2022 — 2023",
    company: "Earlier Work",
    title: "Internships & Research",
    description:
      "在 Irdelta、CryoHub 与研究实验室完成自动化测试、全栈数据工具及机器学习相关项目。",
    tags: ["APPIUM", "FULL-STACK", "ML"],
  },
];

export const HOME_SECTIONS = [
  { id: "home", title: "HERO" },
  { id: "about", title: "ABOUT" },
  { id: "work", title: "WORK" },
  { id: "contact", title: "CONTACT" },
] as const;

export type HomeSectionId = (typeof HOME_SECTIONS)[number]["id"];

export const PROJECT_SLUGS = FEATURED_PROJECTS.map((project) => project.slug);

const PROFILE_SUMMARY = {
  name: "Lueyu",
  role: "程序员，专注 AI Agent 方向",
  current: "Huawei · Infrastructure & Automation（2024 至今）",
  previous: "Subaru R&D · Driver Research Platform（2023–2024）",
  focus: [
    "Agent 规划、工具调用与多智能体协作",
    "真实业务场景的软件工程实践与系统思考",
    "围绕模型能力、人机协作与开发体验的技术实验",
  ],
  based: "China",
};

const PROFILE_SKILLS = [
  "AI Agent：规划 / 工具调用 / 多智能体协作",
  "LLM 集成与评测",
  "TypeScript · React · Node · NestJS",
  "Python · OpenCV · Django",
  "Kubernetes · CI/CD · 测试自动化",
  "可观测性：OpenTelemetry · Langfuse",
];

const PROFILE_CONTACT = {
  email: "lueyuwang@gmail.com",
  messageForm: "聊天窗顶部「留言」按钮（由本 Agent 转交）",
};

const PROFILE_FIELDS = ["summary", "projects", "experience", "skills", "contact", "all"] as const;
export type ProfileField = (typeof PROFILE_FIELDS)[number];

function projectBrief(project: FeaturedProject) {
  return {
    slug: project.slug,
    page: `/projects/${project.slug}`,
    title: project.title,
    role: project.role,
    description: project.description,
    highlights: project.highlights,
    tags: project.tags,
  };
}

export function getProfile(field: string): { ok: boolean; summary: string; data?: unknown } {
  if (!PROFILE_FIELDS.includes(field as ProfileField)) {
    return { ok: false, summary: `unknown field: ${field}`, data: { error: "unknown field", fields: PROFILE_FIELDS } };
  }
  let data: unknown;
  switch (field) {
    case "summary":
      data = PROFILE_SUMMARY;
      break;
    case "projects":
      data = FEATURED_PROJECTS.map(projectBrief);
      break;
    case "experience":
      data = OTHER_EXPERIENCE;
      break;
    case "skills":
      data = PROFILE_SKILLS;
      break;
    case "contact":
      data = PROFILE_CONTACT;
      break;
    default:
      data = {
        summary: PROFILE_SUMMARY,
        projects: FEATURED_PROJECTS.map(projectBrief),
        experience: OTHER_EXPERIENCE,
        skills: PROFILE_SKILLS,
        contact: PROFILE_CONTACT,
      };
  }
  return { ok: true, summary: `profile: ${field}`, data };
}
