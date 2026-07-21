import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";

const pathways = [
  {
    title: "AI product prototyping",
    description:
      "Explore an idea, shape the essential product experience, and create something concrete enough to learn from.",
  },
  {
    title: "Intelligent workflows and assistants",
    description:
      "Consider where models, tools, and human judgment can meet in a useful and understandable workflow.",
  },
  {
    title: "Creative AI and digital experiences",
    description:
      "Develop expressive digital work where interaction, storytelling, and emerging capabilities belong together.",
  },
] as const;

export function ServicePathways() {
  return (
    <div className="divide-y divide-border-subtle border-y border-border-subtle">
      {pathways.map((pathway, index) => (
        <Link
          key={pathway.title}
          to="/contact"
          className="focus-ring group grid gap-5 rounded-xl px-3 py-8 transition-[background-color,padding] hover:bg-surface-1 sm:grid-cols-[3rem_minmax(12rem,0.8fr)_minmax(16rem,1.2fr)_3rem] sm:items-center sm:gap-8 sm:px-5 md:py-10 md:hover:px-7"
        >
          <span className="font-mono text-xs text-quiet-foreground">0{index + 1}</span>
          <h3 className="text-xl font-medium leading-tight tracking-[-0.03em] text-foreground md:text-2xl">
            {pathway.title}
          </h3>
          <p className="max-w-xl text-base leading-7 text-foreground-soft">
            {pathway.description}
          </p>
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-border bg-surface-inset text-muted-foreground transition-[border-color,color,transform] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:border-accent-muted group-hover:text-accent">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </Link>
      ))}
    </div>
  );
}
