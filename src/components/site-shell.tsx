import type { ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";
import { PoeticAtmosphere } from "./poetic-atmosphere";

export function SiteShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const hasInnerAtmosphere = ["/projects", "/writing", "/about", "/contact"].includes(pathname);

  return (
    <div
      className={`site-ambient flex min-h-screen flex-col overflow-x-clip${hasInnerAtmosphere ? " site-ambient--inner" : ""}`}
    >
      <PoeticAtmosphere className="poetic-atmosphere--shell" variant="mist" />
      <a
        href="#main-content"
        className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground shadow-md transition-transform focus:translate-y-0"
      >
        Skip to content
      </a>
      <SiteHeader />
      <main id="main-content" tabIndex={-1} className="relative z-0 flex-1 outline-none">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  lede,
}: {
  eyebrow: string;
  title: string;
  lede?: string;
}) {
  return (
    <section className="container-editorial animate-rise pb-14 pt-20 md:pb-20 md:pt-32">
      <p className="eyebrow text-accent">{eyebrow}</p>
      <h1 className="mt-6 max-w-5xl text-5xl leading-[0.98] tracking-[-0.05em] sm:text-6xl md:text-7xl">
        {title}
      </h1>
      {lede ? (
        <p className="mt-7 max-w-2xl text-lg leading-8 text-foreground-soft md:text-xl md:leading-9">
          {lede}
        </p>
      ) : null}
    </section>
  );
}
