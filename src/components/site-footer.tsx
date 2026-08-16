import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { SITE } from "@/lib/content";
import { useSiteProfile } from "@/lib/site-profile";

const footerNav = [
  { to: "/projects", label: "Work" },
  { to: "/writing", label: "Journal" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

const footerLinkClass =
  "site-footer__link focus-ring inline-flex min-h-12 items-center gap-1.5 rounded-md text-base text-muted-foreground md:min-h-11 md:text-sm";

const socialLinks = [
  { label: SITE.github, href: SITE.githubUrl },
  { label: SITE.linkedin, href: SITE.linkedinUrl },
  { label: SITE.instagram, href: SITE.instagramUrl },
] as const;

export function SiteFooter() {
  const profile = useSiteProfile();
  return (
    <footer className="relative mt-24 border-t border-border-subtle bg-surface-inset md:mt-36">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/35 to-transparent" aria-hidden />
      <div className="container-wide grid gap-10 py-14 md:grid-cols-[1.35fr_0.8fr_1fr] md:gap-12 md:py-16">
        <div>
          <Link to="/contact" className="site-footer__cta focus-ring group inline-flex min-h-12 items-center gap-3 rounded-md font-display text-3xl text-foreground md:text-4xl">
            Connect for work
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </Link>
        </div>

        <div>
          <p className="eyebrow text-foreground-soft">Explore</p>
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
        <div className="container-wide py-6 text-sm text-muted-foreground">
          <span>© {new Date().getFullYear()} {profile.name}</span>
        </div>
      </div>
    </footer>
  );
}
