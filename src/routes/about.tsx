import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { SiteShell } from "@/components/site-shell";
import { SITE } from "@/lib/content";
import { useSiteProfile } from "@/lib/site-profile";

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
        <div className="work-route-intro__copy"><p className="eyebrow text-accent">Profile</p><h1 className="mt-6 font-sans text-[clamp(3rem,6vw,5.5rem)] font-medium leading-[0.98] tracking-[-0.05em]">About</h1></div>
        <figure className="work-route-intro__visual"><img src="/about-route-visual.webp" alt="A young boy follows a winding rural road beneath diffused moonlight." width={1536} height={1024} /></figure>
      </div>
    </section>

    <section className="about-biography container-editorial pb-20 md:pb-28">
      <p className="eyebrow">Biography</p>
      <div className="about-biography__fragments mt-8">
        {profile.bio_fragments.map((fragment) => <p key={fragment}>{fragment}</p>)}
      </div>
    </section>

    <section className="about-editorial-section about-capabilities border-t border-border-subtle">
      <div className="about-editorial-section__grid container-editorial grid gap-8 py-16 md:grid-cols-[16ch_minmax(0,1fr)] md:gap-16 md:py-24"><h2 className="eyebrow text-violet md:pt-2">Capabilities</h2><div className="about-capabilities__grid grid max-w-3xl gap-10 sm:grid-cols-3">{profile.capabilities.map((group) => <div key={group.title}><h3 className="text-lg font-medium tracking-[-0.025em]">{group.title}</h3><p className="mt-5 text-sm leading-6 text-muted-foreground">{group.description}</p></div>)}</div></div>
    </section>

    <section className="about-tools border-t border-border-subtle bg-surface-inset/45">
      <div className="container-editorial py-20 md:py-28"><div className="max-w-3xl"><h2 className="font-sans text-3xl font-medium tracking-[-0.04em] md:text-5xl">Tools & Technologies</h2><p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">Technologies used across product builds, experiments, and AI-assisted development workflows.</p></div>
        <div className="about-tools__matrix mt-12">{profile.technology_groups.map((group) => <section key={group.title} className="about-tools__group"><h3>{group.title}</h3>{group.items.some((item) => item.label) ? <div>{group.items.map((item) => <div key={`${item.label}-${item.content}`}><h4>{item.label}</h4><p>{item.content}</p></div>)}</div> : <p>{group.items.map((item) => item.content).join(" · ")}</p>}</section>)}</div>
      </div>
    </section>

    <section className="about-site-gateway border-t border-border-subtle"><div className="container-editorial py-20 md:py-24"><p className="eyebrow">On this site</p><div className="about-site-gateway__links mt-8"><Link to="/projects" className="focus-ring group"><span><strong>Work</strong><small>Products & case studies</small></span><ArrowRight aria-hidden /></Link><Link to="/writing" className="focus-ring group"><span><strong>Journal</strong><small>Writing, experiments & observations</small></span><ArrowRight aria-hidden /></Link></div></div></section>

    <section className="about-contact-cta border-t border-border"><div className="container-editorial py-20 text-center md:py-28"><Link to="/contact" className="button-primary focus-ring group">{profile.connect_cta} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden /></Link></div></section>
  </SiteShell>;
}
