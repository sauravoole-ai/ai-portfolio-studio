import type { ReactNode } from "react";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
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
    <section className="container-editorial pt-16 pb-10 md:pt-24 md:pb-14 animate-rise">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="mt-4 font-display text-4xl leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
        {title}
      </h1>
      {lede ? (
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          {lede}
        </p>
      ) : null}
    </section>
  );
}
