export const SITE = {
  name: "[Your Name]",
  role: "Applied AI Product Builder",
  tagline:
    "Designing and shipping AI products that feel considered — from research prototype to production surface.",
  location: "Brooklyn, NY",
  email: "[Contact Email]",
  github: "[GitHub Link]",
  twitter: "[Twitter Handle]",
  linkedin: "[LinkedIn URL]",
};

export type Project = {
  slug: string;
  name: string;
  tagline: string;
  year: string;
  role: string;
  stack: string[];
  status: "Shipped" | "In progress" | "Case study";
  summary: string;
  problem: string;
  approach: string[];
  outcome: string[];
  metrics: { label: string; value: string }[];
  gallery?: string[];
};

export const projects: Project[] = [
  {
    slug: "lumen-notes",
    name: "[Project Name] Lumen Notes",
    tagline: "A calm, cursor-native notebook for research and synthesis.",
    year: "2025",
    role: "Product, design, engineering",
    stack: ["TypeScript", "TanStack Start", "PGVector", "OpenAI"],
    status: "Shipped",
    summary:
      "A local-first notebook that quietly threads citations, drafts and reading into a single working surface. Designed for researchers who dislike chatbots.",
    problem:
      "Analysts spend hours moving between PDFs, notes, and chat interfaces. The interface, not the model, is the bottleneck.",
    approach: [
      "Ran nine research sessions with policy analysts and grad students to map the real workflow.",
      "Prototyped a keyboard-first canvas with inline citations rather than a chat panel.",
      "Shipped an embeddings pipeline that runs on-device for private corpora.",
    ],
    outcome: [
      "Reduced average synthesis time from 42 to 18 minutes in usability testing.",
      "Featured in two independent researcher newsletters.",
      "Grew to 1,800 weekly active writers in the first quarter.",
    ],
    metrics: [
      { label: "Weekly writers", value: "1.8k" },
      { label: "Time to synthesis", value: "−57%" },
      { label: "Retention (D30)", value: "48%" },
    ],
  },
  {
    slug: "atlas-review",
    name: "[Project Name] Atlas Review",
    tagline: "Structured feedback for engineering teams, written by no one.",
    year: "2024",
    role: "Founding engineer",
    stack: ["Python", "LangGraph", "Postgres", "React"],
    status: "Shipped",
    summary:
      "A reviewer that reads pull requests the way a staff engineer would — with taste, restraint, and a memory of the codebase.",
    problem:
      "Automated review tools flood PRs with low-signal comments. Teams learn to ignore them, which defeats the point.",
    approach: [
      "Built a retrieval layer keyed to architectural decisions, not just files.",
      "Trained a small taste model on accepted vs. rejected reviewer comments.",
      "Designed a review UI that presents at most three prioritized notes.",
    ],
    outcome: [
      "Adopted by four engineering teams inside a Series C fintech.",
      "Comment acceptance rate rose from 11% to 61%.",
    ],
    metrics: [
      { label: "Acceptance rate", value: "61%" },
      { label: "Median PR review", value: "4m 12s" },
      { label: "Teams onboarded", value: "12" },
    ],
  },
  {
    slug: "field-transcripts",
    name: "[Project Name] Field Transcripts",
    tagline: "Interviews turned into structured evidence, respectfully.",
    year: "2024",
    role: "Design + ML",
    stack: ["Whisper", "Rust", "SQLite", "Svelte"],
    status: "Case study",
    summary:
      "A qualitative research tool for journalists and UX researchers. Transcripts stay local; themes surface as the conversation unfolds.",
    problem:
      "Existing transcription tools optimize for accuracy but ignore the interpretive work that makes an interview useful.",
    approach: [
      "Ran a two-week diary study with four investigative reporters.",
      "Designed a two-pane surface: verbatim on the left, evolving themes on the right.",
      "Kept every model call optional — the tool is useful without a network.",
    ],
    outcome: [
      "Used to produce three long-form investigative pieces.",
      "Zero data ever leaves the researcher's machine by default.",
    ],
    metrics: [
      { label: "Interviews processed", value: "2,400+" },
      { label: "Local by default", value: "100%" },
      { label: "Publications", value: "3 features" },
    ],
  },
  {
    slug: "grove-agents",
    name: "[Project Name] Grove Agents",
    tagline: "A small library for building agents you can actually debug.",
    year: "2025",
    role: "Open source maintainer",
    stack: ["TypeScript", "OpenTelemetry"],
    status: "In progress",
    summary:
      "Opinionated primitives for agent workflows with first-class tracing, replayable state and typed tool calls.",
    problem:
      "Most agent frameworks optimize for demos. Debugging a failed run at 2am is a different job.",
    approach: [
      "Every step emits an OTel span with typed inputs and outputs.",
      "Runs are replayable from any checkpoint.",
      "No hidden prompts — you own the string.",
    ],
    outcome: [
      "700+ GitHub stars in three months.",
      "Used in production at two small AI companies.",
    ],
    metrics: [
      { label: "GitHub stars", value: "720" },
      { label: "Weekly npm installs", value: "3.4k" },
      { label: "Contributors", value: "18" },
    ],
  },
];

export type Post = {
  slug: string;
  title: string;
  kind: "Essay" | "Build log" | "Note";
  date: string;
  readingTime: string;
  excerpt: string;
};

export const posts: Post[] = [
  {
    slug: "against-chat-as-default",
    title: "Against chat as the default surface",
    kind: "Essay",
    date: "Jun 12, 2026",
    readingTime: "9 min",
    excerpt:
      "A chat window is a confession that you did not design the product. Some notes on when text-in, text-out is right — and when it is a shrug.",
  },
  {
    slug: "build-log-lumen-week-14",
    title: "Build log: Lumen, week 14 — the quiet retrieval refactor",
    kind: "Build log",
    date: "May 30, 2026",
    readingTime: "6 min",
    excerpt:
      "How we replaced a 900-line orchestrator with a 40-line query planner, and what it cost in expressiveness.",
  },
  {
    slug: "evaluating-taste",
    title: "Evaluating taste in language models",
    kind: "Essay",
    date: "May 4, 2026",
    readingTime: "12 min",
    excerpt:
      "Benchmarks measure competence. Products live or die on taste. A practical framework for evaluating a model's editorial judgment.",
  },
  {
    slug: "note-on-latency-budgets",
    title: "A note on latency budgets for interactive AI",
    kind: "Note",
    date: "Apr 21, 2026",
    readingTime: "3 min",
    excerpt:
      "If your interaction has to feel like a conversation, you have 400ms. If it has to feel like thinking, you have four seconds. Design accordingly.",
  },
  {
    slug: "build-log-atlas-review-launch",
    title: "Build log: shipping Atlas Review to production",
    kind: "Build log",
    date: "Mar 18, 2026",
    readingTime: "8 min",
    excerpt:
      "What we learned turning a research prototype into a tool four teams depend on every day.",
  },
];

export const skills = [
  {
    heading: "Product",
    items: [
      "Zero-to-one product definition",
      "Interaction design for AI surfaces",
      "Research and evaluation frameworks",
      "Roadmapping under uncertainty",
    ],
  },
  {
    heading: "Engineering",
    items: [
      "TypeScript, Python, Rust",
      "Retrieval, embeddings, evals",
      "Agent orchestration & tracing",
      "Postgres, PGVector, SQLite",
    ],
  },
  {
    heading: "Craft",
    items: [
      "Editorial visual systems",
      "Motion with restraint",
      "Design engineering",
      "Writing and long-form thinking",
    ],
  },
];
