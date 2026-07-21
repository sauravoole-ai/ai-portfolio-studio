import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { SITE } from "@/lib/content";

const footerNav = [
  { to: "/projects", label: "Projects" },
  { to: "/writing", label: "Writing" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

const footerLinkClass =
  "focus-ring inline-flex min-h-12 items-center rounded-lg text-base text-muted-foreground transition-colors hover:text-foreground md:min-h-11 md:text-sm";

export function SiteFooter() {
  return (
    <footer className="relative mt-24 border-t border-border-subtle bg-surface-inset md:mt-36">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/35 to-transparent" aria-hidden />
      <div className="container-wide grid gap-14 py-16 md:grid-cols-[1.6fr_0.8fr_1fr] md:gap-16 md:py-20">
        <div>
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-mint shadow-[0_0_16px_oklch(0.76_0.085_160/0.35)]" aria-hidden />
            <p className="eyebrow">Open to thoughtful work</p>
          </div>
          <p className="mt-6 max-w-lg font-display text-4xl leading-[1.02] tracking-[-0.03em] text-foreground md:text-5xl">
            {SITE.name}
          </p>
          <p className="mt-4 max-w-md text-base leading-7 text-foreground-soft">
            {SITE.role}
          </p>
          <Link to="/contact" className="button-primary focus-ring group mt-8">
            Start a conversation
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div>
          <p className="eyebrow text-foreground-soft">Navigate</p>
          <ul className="mt-4 space-y-0 md:mt-5">
            {footerNav.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className={footerLinkClass}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="eyebrow text-foreground-soft">Elsewhere</p>
          <ul className="mt-4 space-y-0 md:mt-5">
            <li><a href="#" className={footerLinkClass}>{SITE.github}</a></li>
            <li><a href="#" className={footerLinkClass}>{SITE.linkedin}</a></li>
            <li><a href={`mailto:${SITE.email}`} className={footerLinkClass}>{SITE.email}</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border-subtle">
        <div className="container-wide flex flex-col items-start justify-between gap-3 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center">
          <span>© {new Date().getFullYear()} {SITE.name}</span>
          <span className="font-mono text-xs tracking-wide">Applied AI · Product · Writing</span>
        </div>
      </div>
    </footer>
  );
}
