import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { PoeticAtmosphere } from "./poetic-atmosphere";

type PremiumEmptyStateProps = {
  eyebrow: string;
  heading: string;
  explanation: string;
  action?: {
    label: string;
    to: "/projects" | "/writing" | "/contact";
  };
  atmosphere?: "mist" | "quiet";
};

export function PremiumEmptyState({
  eyebrow,
  heading,
  explanation,
  action,
  atmosphere = "quiet",
}: PremiumEmptyStateProps) {
  return (
    <div className="surface-feature relative overflow-hidden px-6 py-10 sm:px-10 sm:py-12 md:px-14 md:py-14">
      <PoeticAtmosphere variant={atmosphere} />
      <div className="relative z-10 grid gap-8 md:grid-cols-[minmax(0,1.35fr)_auto] md:items-end">
        <div>
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-accent-muted/40 bg-accent/5" aria-hidden>
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            </span>
            <p className="eyebrow">{eyebrow}</p>
          </div>
          <h3 className="mt-6 max-w-2xl text-2xl leading-tight tracking-[-0.035em] sm:text-3xl">
            {heading}
          </h3>
          <p className="mt-4 max-w-xl text-base leading-7 text-foreground-soft">
            {explanation}
          </p>
        </div>
        {action ? (
          <Link to={action.to} className="button-secondary focus-ring group w-full sm:w-auto">
            {action.label}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        ) : null}
      </div>
    </div>
  );
}
