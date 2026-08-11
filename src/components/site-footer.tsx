import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { SITE } from "@/lib/content";

const footerNav = [
  { to: "/projects", label: "Projects" },
  { to: "/writing", label: "Writing" },
  { to: "/about", label: "About" },
] as const;

const footerLinkClass =
  "site-footer__link focus-ring inline-flex min-h-12 items-center gap-1.5 rounded-md text-base text-muted-foreground md:min-h-11 md:text-sm";

const socialLinks = [
  { label: SITE.github, href: SITE.githubUrl },
  { label: SITE.linkedin, href: SITE.linkedinUrl },
  { label: SITE.instagram, href: SITE.instagramUrl },
] as const;

export function SiteFooter() {
  return (
    <footer className="relative mt-24 border-t border-border-subtle bg-surface-inset md:mt-36">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/35 to-transparent" aria-hidden />
      <div className="container-wide grid gap-10 py-14 md:grid-cols-[1.6fr_0.8fr_1fr] md:gap-12 md:py-16">
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
          <p className="mt-2 max-w-md text-base leading-7 text-muted-foreground">
            {SITE.tagline}
          </p>
          <Link to="/contact" className="site-footer__cta button-primary focus-ring group mt-8">
            Start a conversation
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
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
          <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-0 md:mt-5">
            {socialLinks.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={footerLinkClass}
                >
                  {item.label}
                  <span aria-hidden>↗</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-border-subtle">
        <div className="container-wide flex flex-col items-start justify-between gap-3 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center">
          <span>© {new Date().getFullYear()} {SITE.name}</span>
          <span className="font-mono text-xs tracking-wide">{SITE.role}</span>
        </div>
      </div>
    </footer>
  );
}
