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

export function SiteFooter() {
  const profile = useSiteProfile();
  const socialLinks = [
    { label: SITE.github, href: profile.github_url },
    { label: SITE.linkedin, href: profile.linkedin_url },
    { label: SITE.instagram, href: profile.instagram_url },
  ] as const;
  return (
    <footer className="site-footer relative mt-16 border-t border-border-subtle md:mt-24">
      <div className="container-wide grid gap-9 py-10 md:grid-cols-[1.3fr_0.8fr_1fr] md:items-start md:gap-10 md:py-12">
        <div>
          <Link to="/contact" className="site-footer__cta focus-ring group inline-flex min-h-11 items-center gap-2.5 rounded-md font-sans text-xl font-medium tracking-[-0.03em] text-foreground md:text-2xl">
            {profile.connect_cta}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </Link>
          <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">{profile.footer_connect_context}</p>
        </div>

        <div>
          <p className="eyebrow text-foreground-soft">Explore</p>
          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-0">
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
          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-0">
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
        <div className="container-wide py-5 text-sm text-muted-foreground">
          <span>© {new Date().getFullYear()} {profile.name}</span>
        </div>
      </div>
    </footer>
  );
}
