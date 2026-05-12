export interface Project {
  title: string;
  role: string;
  duration: string;
  summary?: string;
  description: string[];
  techStack: string[];
  links?: { github?: string; live?: string };
  category?: string;
}

export interface Experience {
  company: string;
  role: string;
  location: string;
  duration: string;
  bullets?: string[];
}

export const USER_DATA = {
  name: "Charles Isaac Velasco",
  initials: "CV",
  email: "zekvelasco15@gmail.com",
  phone: "+65 8947 7408",
  location: "Singapore",
  linkedin: "https://linkedin.com/in/charles-isaac-velasco",
  github: "https://github.com/zek01svg",
  education: [
    {
      school: "Singapore Management University",
      degree: "Bachelor of Science (Information Systems)",
      track: "Product Development | FinTech",
      duration: "Aug 2024 – Sep 2028 (Expected)",
    },
    {
      school: "Divine Word College of Bangued",
      degree: "Senior High School",
      track: "Science, Technology, Engineering, and Mathematics (STEM)",
      duration: "Jun 2022 – May 2024",
    },
    {
      school: "Divine Word College of Bangued",
      degree: "Junior High School",
      duration: "Jun 2018 – May 2022",
    },
  ],
};

export const PROJECTS: Project[] = [
  {
    title: "TownOps",
    role: "Full Stack Developer",
    duration: "Dec 2025 - Jan 2026",
    summary:
      "A municipal operations platform for managing contractor dispatch, SLA monitoring, and case escalation across city services.",
    techStack: [
      "Hono",
      "Bun",
      "React 19",
      "TanStack Router",
      "TanStack Query",
      "Drizzle ORM",
      "PostgreSQL",
      "RabbitMQ (AMQP)",
      "Better Auth",
      "Zod v4",
      "OpenTelemetry",
      "Supabase Storage",
      "OutSystems (External)",
      "Docker",
      "Turborepo",
      "pnpm workspaces",
    ],
    description: [
      "Designed a strict Atomic/Composite SOA across 17 services (8 atoms, 6 composites, 3 role-specific frontends) where each atom owns exactly one domain schema and composites are stateless AMQP-driven orchestrators with no persistent storage — integrating OutSystems Cloud as an external Contractor atom for vendor data.",
      "Implemented SLA breach detection using RabbitMQ topic exchange with TTL Dead Letter Queues",
      "Secured service-to-service communication with better-auth RS256 JWT and JWKS validation, using Hono typed RPC clients (`hc<T>`) for end-to-end type safety across all inter-service HTTP calls.",
    ],
    links: {
      github: "https://github.com/zek01svg/town-ops",
    },
    category: "IS213 - Enterprise Solution Development",
  },
  {
    title: "ESMOS",
    role: "Cloud Engineer | QA Engineer",
    duration: "Jan 2026 - Present",
    summary:
      "Multi-cloud infrastructure for a healthcare enterprise's core software suite, deployed across Azure and Google Cloud with automated observability and zero-trust security.",
    techStack: [
      "Terraform (IaC)",
      "Azure Container Apps",
      "Azure Container App Jobs",
      "Azure Functions",
      "Azure Flexible PostgreSQL",
      "Azure Key Vault",
      "Azure Files",
      "GCP Global Load Balancer",
      "Docker",
      "Playwright (E2E)",
      "Sentry & Pino",
      "Better Stack",
      "Supabase (Storage)",
      "GitHub Actions (OIDC)",
      "Odoo",
      "Moodle",
      "Peppermint",
    ],
    description: [
      "Longlisted for the SMU-Dell Cloud Native Award.",
      "Developed a multi-cloud hybrid topology using Terraform, anchoring enterprise compute (Moodle, Odoo, Peppermint) on Azure Container Apps with traffic routed through a GCP Global Edge layer (GLB + Internet NEGs) for the Singapore region.",
      "Engineered an automated E2E observability pipeline utilizing Playwright and Azure Container App Jobs to verify critical healthcare flows on a 10-minute cadence, with automated Sentry/Pino reporting and Supabase screenshot capture.",
      "Implemented a Zero-Trust security model using Azure Managed Identities and GitHub OIDC for keyless deployments, complemented by a zero-manual-secret policy where Terraform auto-populates all secrets into Azure Key Vault.",
      "Optimized operational expenditure by 40% through consumption-based scaling and intelligent Azure Function-driven resource lifecycle management.",
    ],
    links: {
      github: "https://github.com/esmos-health-g8t1",
    },
    category: "IS214 - Enterprise Solution Management",
  },
  {
    title: "LocaLoco",
    role: "Full Stack Developer",
    duration: "Oct 2025 - Present",
    summary:
      "A hyperlocal discovery platform connecting Singapore residents with small businesses through interactive maps, vendor storefronts, and community reviews.",
    techStack: [
      "Hono",
      "Bun",
      "React 19",
      "Vite",
      "TanStack Router",
      "TanStack Query",
      "Drizzle ORM",
      "PostgreSQL (Supabase)",
      "Better Auth",
      "Upstash Redis",
      "QStash",
      "Resend",
      "Google Maps API",
      "OneMap API",
      "Tailwind CSS v4",
      "Vitest",
      "Playwright",
      "Testcontainers",
      "Turboreporepo",
      "pnpm workspaces",
    ],
    description: [
      "Built a hyperlocal business discovery platform for Singapore's small businesses, featuring interactive maps (Google Maps + OneMap API), vendor storefronts, community reviews, and a referral rewards system.",
      "Architected a pnpm monorepo with a shared types layer across frontend and server, migrating the stack from PHP → Express.js/Node.js → Hono/Bun for end-to-end type safety and significantly improved cold-start performance.",
      "Integrated better-auth for Google OAuth and email/password flows, with Upstash Redis for session caching and QStash for transactional email queue processing.",
    ],
    links: {
      github: "https://github.com/zek01svg/localoco",
    },
    category: "IS216 - Web Application Development II",
  },
  {
    title: "VibeCards",
    role: "Full Stack Developer",
    duration: "Mar 2026 - Present",
    summary:
      "An AI-powered flashcard generator for studying any topic with automatic fallback across 8 AI models to guarantee availability and consistent output quality.",
    techStack: [
      "Next.js 16",
      "React 19",
      "Google Gemini",
      "Better Auth",
      "Drizzle ORM",
      "Supabase",
      "TanStack Form",
      "Tailwind CSS v4",
      "Resend",
      "Turboreporepo",
      "Oxlint",
      "Playwright (E2E)",
      "Vitest",
    ],
    description: [
      "Engineered an AI generation engine using Next.js Server Actions with an automatic 8-model fallback hierarchy (Gemini 3.1 → 3.0 → 2.x → 1.5) and native JSON structured outputs with Zod schema validation to ensure 100% schema compliance and system availability.",
      "Implemented a secure authentication and session management architecture using better-auth with Email OTP and Google OAuth, with decks stored as JSONB columns in Supabase for flexible schema evolution without migrations.",
      "Designed a unified type-safe data layer with Drizzle ORM and Supabase RLS, maintaining end-to-end type integrity across the monorepo from the schema to the form layer.",
    ],
    links: {
      github: "https://github.com/zek01svg/vibecards",
    },
  },
  {
    title: "AutoGrader",
    role: "Full Stack Developer",
    duration: "Sep 2025",
    summary:
      "An automated code grading system that runs student submissions in isolated sandboxes and uses AI to generate test cases directly from PDF assessment papers.",
    techStack: [
      "Java 17",
      "Docker (Sandboxing)",
      "Ollama (qwen2.5-coder:3b)",
      "Next.js 16",
      "PDF.js",
      "JSZip",
      "pnpm Workspaces",
      "Prettier",
    ],
    description: [
      "Engineered a high-performance Java grading engine utilizing a multi-threaded ExecutorService and disposable Docker containers with strict CPU/Memory limits and disabled networking for secure, isolated code execution.",
      "Developed an AI-assisted test generation pipeline using local Ollama with NDJSON log streaming to automatically derive unit testers from PDF question paper, reducing manual assessment overhead by 90%.",
      "Built a Next.js dashboard featuring real-time log streaming, automated gradebook generation (CSV), and an interactive score display with granular failure tooltips for compilation and runtime errors.",
      "Optimized large-scale grading performance through parallel student processing, achieving a 60% reduction in total assessment time.",
    ],
    links: {
      github: "https://github.com/zek01svg/autograder",
    },
    category: "IS442 - Object-Oriented Programming",
  },
];

export const EXPERIENCES: Experience[] = [
  {
    company: "DPWH - Abra District Engineering Office",
    role: "Engineering Intern",
    location: "Philippines",
    duration: "Jan 2024 - Feb 2024",
    bullets: [
      "Conducted on-site inspections to ensure infrastructure projects aligned with engineering planning specifications.",
      "Streamlined data retrieval for the engineering team by managing technical documentation and filing systems.",
    ],
  },
  {
    company: "EIU - Industry 4.0 Innovation Center",
    role: "Backend Developer Intern",
    location: "Vietnam",
    duration: "May 2026 - Jul 2026",
  },
];

export const TOOLKIT = {
  languages: ["TypeScript", "Python", "Java", "HCL", "SQL"],
  cloud: [
    "Microsoft Azure",
    "Google Cloud",
    "Terraform",
    "Docker",
    "GitHub Actions",
    "Vercel",
    "Railway",
    "Supabase",
    "Upstash",
    "Better Stack",
    "Grafana",
    "Sentry",
  ],
  frameworks: [
    "Next.js",
    "React 19",
    "Hono",
    "Flask",
    "FastAPI",
    "Bun",
    "Node.js",
    "Better Auth",
    "Drizzle ORM",
    "SQLAlchemy",
    "SQLModel",
    "TanStack",
    "Playwright",
    "Vitest",
    "Testcontainers",
    "Turboreporeporepo",
    "Sentry",
    "Pino",
    "Logtape",
    "RabbitMQ (AMQP)",
    "OpenTelemetry",
    "Ollama",
  ],
  concepts: [
    "Multi-Cloud Topology",
    "Distributed Systems",
    "Atomic & Composite SOA",
    "E2E Observability",
    "DevSecOps",
    "Log & Event Streaming",
    "Cloud Cost Optimization",
    "Infrastructure-as-code",
    "Prompt Engineering",
    "Code Sandboxing",
  ],
};
