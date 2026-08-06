import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import { SITE } from "@/lib/content";

const nav = [
  { to: "/", label: "Home" },
  { to: "/projects", label: "Work" },
  { to: "/writing", label: "Journal" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Connect" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [brandHidden, setBrandHidden] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRootRef = useRef<HTMLDivElement>(null);
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const routeTone = pathname === "/"
    ? "home"
    : pathname.startsWith("/projects")
      ? "work"
      : pathname.startsWith("/writing")
        ? "journal"
        : pathname.startsWith("/about")
          ? "about"
          : pathname.startsWith("/contact")
            ? "connect"
            : "inner";
  const nextRoute = routeTone === "home"
    ? { to: "/projects", label: "Work" }
    : routeTone === "work"
      ? { to: "/writing", label: "Journal" }
      : routeTone === "journal"
        ? { to: "/about", label: "About" }
        : routeTone === "about"
          ? { to: "/contact", label: "Connect" }
          : { to: "/", label: "Home" };
  const nextRouteLabel = `Next: ${nextRoute.label}`;

  useEffect(() => {
    if (open) {
      setBrandHidden(false);
      return;
    }

    const nearTopThreshold = 120;
    const directionThreshold = 6;
    let lastScrollY = window.scrollY;
    let ticking = false;
    let frameId = 0;

    const updateBrandVisibility = () => {
      const currentScrollY = window.scrollY;
      const scrollDelta = currentScrollY - lastScrollY;

      if (currentScrollY <= nearTopThreshold) {
        setBrandHidden(false);
      } else if (Math.abs(scrollDelta) >= directionThreshold) {
        setBrandHidden(scrollDelta > 0);
      }

      if (Math.abs(scrollDelta) >= directionThreshold || currentScrollY <= nearTopThreshold) {
        lastScrollY = currentScrollY;
      }
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        frameId = requestAnimationFrame(updateBrandVisibility);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(frameId);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const closeAndRestoreFocus = () => {
      setOpen(false);
      requestAnimationFrame(() => triggerRef.current?.focus());
    };

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeAndRestoreFocus();
    };
    const closeOnOutsidePointer = (event: PointerEvent) => {
      if (!menuRootRef.current?.contains(event.target as Node)) closeAndRestoreFocus();
    };

    window.addEventListener("keydown", closeOnEscape);
    document.addEventListener("pointerdown", closeOnOutsidePointer);
    return () => {
      window.removeEventListener("keydown", closeOnEscape);
      document.removeEventListener("pointerdown", closeOnOutsidePointer);
    };
  }, [open]);

  return (
    <header
      className={`site-header site-header--${routeTone} fixed inset-x-0 top-0 z-40 px-3 pt-3 sm:px-4 sm:pt-4`}
    >
      <div className="container-wide site-header__layout">
        <div className={`site-brand-capsule${brandHidden ? " site-brand-capsule--hidden" : ""}`}>
          <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-accent-muted/60 bg-accent/10" aria-hidden>
            <span className="h-2 w-2 rounded-full bg-accent shadow-[0_0_14px_oklch(0.79_0.125_194/0.5)]" />
          </span>
          <span className="ml-3 whitespace-nowrap text-[0.9375rem] font-semibold tracking-[-0.015em] text-foreground">
            {SITE.name}
          </span>
          <span className="site-brand-capsule__role ml-3 border-l border-border pl-3 text-[0.6875rem] font-medium uppercase tracking-[0.12em] text-muted-foreground">
            {SITE.role}
          </span>
        </div>

        <div ref={menuRootRef} className="site-nav-control">
          <button
            ref={triggerRef}
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="site-nav-trigger focus-ring"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="site-navigation"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span>Menu</span>
          </button>

          {open ? (
            <nav
              id="site-navigation"
              className="site-nav-dropdown animate-menu-reveal"
              aria-label="Primary"
            >
              {nav.map((item, index) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => {
                  setOpen(false);
                  requestAnimationFrame(() => triggerRef.current?.focus());
                }}
                className="site-nav-dropdown__item focus-ring group"
                activeProps={{ className: "text-foreground" }}
                activeOptions={{ exact: item.to === "/" }}
              >
                <span className="flex items-center gap-3">
                  <span className="site-nav-dropdown__indicator" aria-hidden />
                  {item.label}
                </span>
                <span className="site-nav-dropdown__number font-mono text-xs text-quiet-foreground" aria-hidden>
                  0{index + 1}
                </span>
              </Link>
              ))}
            </nav>
          ) : null}
        </div>
      </div>

      <div
        className={`site-next-route${open ? " site-next-route--hidden" : ""}`}
        aria-hidden={open || undefined}
      >
        <span className="site-next-route__label" aria-hidden>
          {nextRouteLabel}
        </span>
        <Link
          to={nextRoute.to}
          className="site-next-route__link focus-ring"
          aria-label={nextRouteLabel}
          tabIndex={open ? -1 : undefined}
        >
          <ArrowRight className="site-next-route__icon" aria-hidden />
        </Link>
      </div>
    </header>
  );
}
