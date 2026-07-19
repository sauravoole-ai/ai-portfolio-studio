import { Link } from "@tanstack/react-router";
import { SITE } from "@/lib/content";

const footerNav = [
  { to: "/projects", label: "Projects" },
  { to: "/writing", label: "Writing" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border">
      <div className="container-editorial grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-display text-2xl leading-tight">
            {SITE.name}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {SITE.role}
          </p>
          <Link
            to="/contact"
            className="focus-ring mt-6 inline-flex items-center gap-2 rounded-sm text-sm link-underline"
          >
            Start a conversation
            <span aria-hidden>→</span>
          </Link>
        </div>
        <div>
          <p className="eyebrow">Site</p>
          <ul className="mt-4 space-y-2 text-sm">
            {footerNav.map((n) => (
              <li key={n.to}>
                <Link to={n.to} className="focus-ring rounded-sm link-underline">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="eyebrow">Elsewhere</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li><a href="#" className="focus-ring rounded-sm link-underline">{SITE.github}</a></li>
            <li><a href="#" className="focus-ring rounded-sm link-underline">{SITE.linkedin}</a></li>
            <li><a href={`mailto:${SITE.email}`} className="focus-ring rounded-sm link-underline">{SITE.email}</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container-editorial flex flex-col items-start justify-between gap-2 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <span>© {new Date().getFullYear()} {SITE.name}</span>
          <span className="font-mono">Applied AI · Product · Writing</span>
        </div>
      </div>
    </footer>
  );
}
