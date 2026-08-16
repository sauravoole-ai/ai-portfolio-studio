import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { SiteShell } from "@/components/site-shell";
import { SITE, capabilities } from "@/lib/content";
import { useSiteProfile } from "@/lib/site-profile";

const toolGroups = [
  { heading: "AI, LLM & Retrieval", groups: [
    ["LLM Integration", "Groq API · Gemini API · Prompt Engineering · Structured Outputs · Conversational Flows"],
    ["Retrieval & Grounding", "Embeddings · Vector Search · Evidence Retrieval · Retrieval-grounded Analysis"],
    ["Applied AI Patterns", "Document Analysis · Classification & Scoring · Conversational Assistants · Context-aware Generation"],
  ] },
  { heading: "Languages & Web", copy: "Python · TypeScript · JavaScript · HTML · CSS" },
  { heading: "Application Frameworks & UI", copy: "Flask · FastAPI · React · TanStack Start / Router / Query · Tailwind CSS" },
  { heading: "Data, APIs & Documents", copy: "Supabase · Auth · Postgres · RLS · Migrations · REST APIs · pypdf · ReportLab" },
  { heading: "AI-Assisted Product Development", copy: "ChatGPT · Claude · Codex · Lovable" },
  { heading: "Development, Testing & Delivery", copy: "VS Code · Git · GitHub · Postman · Node.js / npm · Render" },
  { heading: "Connected Systems & AIoT", copy: "MCU boards such as ESP32 · Sensors · Display modules · Arduino IDE · AIoT prototyping" },
] as const;

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [
    { title: `About — ${SITE.name}` },
    { name: "description", content: `About ${SITE.name} — AI product work, tools, and areas of exploration.` },
    { property: "og:title", content: `About — ${SITE.name}` },
    { property: "og:description", content: "AI product work, tools, and areas of exploration." },
  ] }),
  component: About,
});

function About() {
  const profile = useSiteProfile();
  return <SiteShell>
    <section className="work-route-intro about-route-intro animate-rise">
      <div className="container-editorial work-route-intro__inner">
        <div className="work-route-intro__copy"><p className="eyebrow text-accent">About</p><h1 className="mt-6 text-5xl leading-[0.98] tracking-[-0.05em] sm:text-6xl md:text-7xl">{profile.role}</h1><p className="mt-7 text-lg leading-8 text-foreground-soft md:text-xl md:leading-9">{SITE.tagline}</p></div>
        <figure className="work-route-intro__visual"><img src="/about-route-visual.webp" alt="A young boy follows a winding rural road beneath diffused moonlight." width={1536} height={1024} /></figure>
      </div>
    </section>

    <section className="about-biography container-editorial pb-20 md:pb-28">
      <p className="eyebrow">Biography</p>
      <div className="about-biography__fragments mt-8">
        <p>I’m {profile.name}, an {profile.role} and {profile.degree} student at {profile.university}.</p>
        <p>Most of my current work revolves around taking practical or creative ideas and developing them into usable AI products through an AI-assisted build process.</p>
        <p>Alongside ongoing product work and learning, my previous experience includes a Web Development Internship with InAmigos Foundation. This site brings together products, experiments, notes, and ideas growing from that work.</p>
      </div>
    </section>

    <section className="about-editorial-section about-capabilities border-t border-border-subtle">
      <div className="about-editorial-section__grid container-editorial grid gap-8 py-16 md:grid-cols-[16ch_minmax(0,1fr)] md:gap-16 md:py-24"><h2 className="eyebrow text-violet md:pt-2">Capabilities</h2><div className="about-capabilities__grid grid max-w-3xl gap-10 sm:grid-cols-3">{capabilities.map((group) => <div key={group.heading}><h3 className="text-lg font-medium tracking-[-0.025em]">{group.heading}</h3><p className="mt-5 text-sm leading-6 text-muted-foreground">{group.description}</p></div>)}</div></div>
    </section>

    <section className="about-tools border-t border-border-subtle bg-surface-inset/45">
      <div className="container-editorial py-20 md:py-28"><div className="max-w-3xl"><p className="eyebrow text-mint">Tools & Technologies</p><h2 className="mt-5 text-3xl tracking-[-0.04em] md:text-5xl">A working toolkit.</h2><p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">Technologies used across product builds, experiments, and AI-assisted development workflows.</p></div>
        <div className="about-tools__matrix mt-12">{toolGroups.map((group) => <section key={group.heading} className="about-tools__group"><h3>{group.heading}</h3>{"groups" in group ? <div>{group.groups.map(([title, copy]) => <div key={title}><h4>{title}</h4><p>{copy}</p></div>)}</div> : <p>{group.copy}</p>}</section>)}</div>
      </div>
    </section>

    <section className="about-site-gateway border-t border-border-subtle"><div className="container-editorial py-20 md:py-24"><p className="eyebrow">On this site</p><div className="about-site-gateway__links mt-8"><Link to="/projects" className="focus-ring group"><span><strong>Work</strong><small>Products & case studies</small></span><ArrowRight aria-hidden /></Link><Link to="/writing" className="focus-ring group"><span><strong>Journal</strong><small>Notes, experiments, observations & creative pieces</small></span><ArrowRight aria-hidden /></Link></div></div></section>

    <section className="about-contact-cta border-t border-border"><div className="container-editorial py-20 text-center md:py-28"><Link to="/contact" className="button-primary focus-ring group">Connect for work <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden /></Link></div></section>
  </SiteShell>;
}
