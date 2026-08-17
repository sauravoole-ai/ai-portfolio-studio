export const SITE = {
  name: "Saurav Kumar Jha",
  role: "AI Product Builder",
  tagline: "Translating ideas into AI products.",
  location: "India",
  degree: "B.Tech in Electronics & Communication Engineering",
  university: "Tezpur University",
  graduationYear: "2027",
  education: "B.Tech ECE · Tezpur University · 2027",
  github: "GitHub",
  githubUrl: "https://github.com/sauravoole-ai",
  linkedin: "LinkedIn",
  linkedinUrl: "https://www.linkedin.com/in/saurav-kumarjha/",
  instagram: "Instagram",
  instagramUrl: "https://www.instagram.com/sauravjha_ai/",
};

export const capabilities = [
  {
    heading: "AI Product Development",
    description:
      "Turning ideas into usable AI-powered applications through AI-assisted development.",
  },
  {
    heading: "Applied AI Integration",
    description:
      "LLMs, retrieval, structured outputs, and conversational AI integrated into product workflows.",
  },
  {
    heading: "Connected & AIoT Projects",
    description:
      "AI-enabled applications involving sensor workflows, connected devices, and hardware prototyping.",
  },
];

export const bioFragments = [
  "I’m Saurav Kumar Jha, an AI Product Builder and B.Tech student in Electronics and Communication Engineering at Tezpur University.",
  "Most of my work centres on taking practical or creative ideas and shaping them into usable AI products through an AI-assisted development process.",
  "I continue to learn through the products I build. Previous experience includes a Web Development Internship with InAmigos Foundation, and this site is where the work, experiments, and writing come together.",
] as const;

export const technologyGroups = [
  { title: "AI, LLM & Retrieval", items: [
    { label: "LLM Integration", content: "Groq API · Gemini API · Prompt Engineering · Structured Outputs · Conversational Flows" },
    { label: "Retrieval & Grounding", content: "Embeddings · Vector Search · Evidence Retrieval · Retrieval-grounded Analysis" },
    { label: "Applied AI Patterns", content: "Document Analysis · Classification & Scoring · Conversational Assistants · Context-aware Generation" },
  ] },
  { title: "Languages & Web", items: [{ label: null, content: "Python · TypeScript · JavaScript · HTML · CSS" }] },
  { title: "Application Frameworks & UI", items: [{ label: null, content: "Flask · FastAPI · React · TanStack Start / Router / Query · Tailwind CSS" }] },
  { title: "Data, APIs & Documents", items: [{ label: null, content: "Supabase · Auth · Postgres · RLS · Migrations · REST APIs · pypdf · ReportLab" }] },
  { title: "AI-Assisted Product Development", items: [{ label: null, content: "ChatGPT · Claude · Codex · Lovable" }] },
  { title: "Development, Testing & Delivery", items: [{ label: null, content: "VS Code · Git · GitHub · Postman · Node.js / npm · Render" }] },
  { title: "Connected Systems & AIoT", items: [{ label: null, content: "MCU boards such as ESP32 · Sensors · Display modules · Arduino IDE · AIoT prototyping" }] },
] as const;
