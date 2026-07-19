import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { SITE } from "@/lib/content";

const nav = [
  { to: "/", label: "Home" },
  { to: "/projects", label: "Projects" },
  { to: "/writing", label: "Writing" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="container-editorial flex h-16 items-center justify-between gap-6">
        <Link
          to="/"
          className="focus-ring rounded-sm font-display text-xl leading-none tracking-tight"
          aria-label={`${SITE.name} — home`}
        >
          {SITE.name}
          <span className="ml-2 hidden align-middle text-xs font-sans uppercase tracking-[0.18em] text-muted-foreground sm:inline">
            — {SITE.role}
          </span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="focus-ring rounded-sm text-sm text-muted-foreground transition-colors hover:text-foreground data-[status=active]:text-foreground"
              activeProps={{ className: "text-foreground" }}
              activeOptions={{ exact: n.to === "/" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="focus-ring inline-flex h-9 w-9 items-center justify-center rounded-md border border-border md:hidden"
          aria-label="Toggle navigation"
          aria-expanded={open}
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>
      {open ? (
        <div className="border-t border-border md:hidden">
          <nav className="container-editorial flex flex-col py-2" aria-label="Mobile">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="focus-ring rounded-sm py-3 text-sm text-muted-foreground"
                activeProps={{ className: "text-foreground" }}
                activeOptions={{ exact: n.to === "/" }}
              >
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
