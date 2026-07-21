import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
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
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      requestAnimationFrame(() => triggerRef.current?.focus());
    };
    const desktopQuery = window.matchMedia("(min-width: 1024px)");
    const closeAtDesktop = () => {
      if (desktopQuery.matches) setOpen(false);
    };

    window.addEventListener("keydown", closeOnEscape);
    desktopQuery.addEventListener("change", closeAtDesktop);
    return () => {
      window.removeEventListener("keydown", closeOnEscape);
      desktopQuery.removeEventListener("change", closeAtDesktop);
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 px-3 pt-3 sm:px-4 sm:pt-4">
      <div className="container-wide rounded-[var(--radius-floating)] border border-border/80 bg-surface-1/95 shadow-[var(--shadow-sm)] backdrop-blur-md supports-[backdrop-filter]:bg-surface-1/88">
        <div className="flex h-[4.25rem] items-center justify-between gap-5">
          <Link
            to="/"
            className="focus-ring group inline-flex min-h-12 items-center rounded-xl"
            aria-label={`${SITE.name} — home`}
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-accent-muted/60 bg-accent/10" aria-hidden>
              <span className="h-2 w-2 rounded-full bg-accent shadow-[0_0_14px_oklch(0.79_0.125_194/0.5)]" />
            </span>
            <span className="ml-3 text-[0.9375rem] font-semibold tracking-[-0.015em] text-foreground">
              {SITE.name}
            </span>
            <span className="ml-3 hidden border-l border-border pl-3 text-[0.6875rem] font-medium uppercase tracking-[0.12em] text-muted-foreground transition-colors group-hover:text-foreground-soft xl:inline">
              {SITE.role}
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="focus-ring group relative rounded-full px-4 py-2.5 text-sm font-medium text-muted-foreground transition-[color,background-color] duration-200 hover:bg-surface-2 hover:text-foreground data-[status=active]:bg-surface-3 data-[status=active]:text-foreground"
                activeProps={{ className: "bg-surface-3 text-foreground" }}
                activeOptions={{ exact: item.to === "/" }}
              >
                {item.label}
                <span className="absolute inset-x-4 -bottom-px h-px scale-x-0 bg-accent transition-transform group-data-[status=active]:scale-x-100" aria-hidden />
              </Link>
            ))}
          </nav>

          <button
            ref={triggerRef}
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="focus-ring inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-border bg-surface-2 text-foreground transition-[border-color,background-color,transform] hover:border-border-strong hover:bg-surface-3 active:scale-95 lg:hidden"
            aria-label={open ? "Close navigation" : "Open navigation"}
            aria-expanded={open}
            aria-controls="mobile-navigation"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {open ? (
          <div className="animate-menu-reveal border-t border-border/80 pb-3 pt-2 lg:hidden">
            <nav id="mobile-navigation" className="flex flex-col" aria-label="Mobile">
              {nav.map((item, index) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="focus-ring group flex min-h-14 items-center justify-between rounded-xl px-4 text-base font-medium text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground data-[status=active]:bg-surface-3 data-[status=active]:text-foreground"
                  activeProps={{ className: "bg-surface-3 text-foreground" }}
                  activeOptions={{ exact: item.to === "/" }}
                >
                  <span className="flex items-center gap-3">
                    <span className="h-1.5 w-1.5 rounded-full bg-quiet-foreground group-data-[status=active]:bg-accent" aria-hidden />
                    {item.label}
                  </span>
                  <span className="font-mono text-xs text-quiet-foreground" aria-hidden>
                    0{index + 1}
                  </span>
                </Link>
              ))}
            </nav>
          </div>
        ) : null}
      </div>
    </header>
  );
}
