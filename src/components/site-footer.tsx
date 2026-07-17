import { Link } from "@tanstack/react-router";
import { SITE } from "@/lib/content";

export function SiteFooter() {
  return (
    <footer className="mt-32 border-t border-border">
      <div className="container-editorial grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-display text-2xl leading-tight">
            Have a project that deserves care?
          </p>
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">
            I take on one or two collaborations per quarter — usually zero-to-one
            AI products with teams who care about craft.
          </p>
          <Link
            to="/contact"
            className="mt-6 inline-flex items-center gap-2 text-sm link-underline"
          >
            Start a conversation
            <span aria-hidden>→</span>
          </Link>
        </div>
        <div>
          <p className="eyebrow">Elsewhere</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li><a href="#" className="link-underline">{SITE.github}</a></li>
            <li><a href="#" className="link-underline">{SITE.twitter}</a></li>
            <li><a href="#" className="link-underline">{SITE.linkedin}</a></li>
          </ul>
        </div>
        <div>
          <p className="eyebrow">Direct</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li><a href={`mailto:${SITE.email}`} className="link-underline">{SITE.email}</a></li>
            <li className="text-muted-foreground">{SITE.location}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container-editorial flex flex-col items-start justify-between gap-2 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <span>© {new Date().getFullYear()} {SITE.name}. All work shown is placeholder.</span>
          <span className="font-mono">v0.1 · handset in Instrument Serif & Inter</span>
        </div>
      </div>
    </footer>
  );
}
