import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { PoeticAtmosphere } from "./poetic-atmosphere";

type BookingCTAProps = {
  variant?: "project" | "collaboration";
};

const content = {
  project: {
    eyebrow: "Project enquiries",
    title: "Have an idea that needs a thoughtful shape?",
    description:
      "Share the context, the ambition, and where the work currently stands.",
    action: "Start a project enquiry",
  },
  collaboration: {
    eyebrow: "Collaborations and conversations",
    title: "Something interesting may begin with a clear first note.",
    description:
      "Reach out about a project, a creative collaboration, or a thoughtful conversation.",
    action: "Get in touch",
  },
} as const;

export function BookingCTA({ variant = "project" }: BookingCTAProps) {
  const selected = content[variant];

  return (
    <div className="surface-feature relative overflow-hidden px-6 py-12 sm:px-10 md:px-14 md:py-16">
      <PoeticAtmosphere variant="quiet" />
      <div className="relative z-10 grid gap-10 md:grid-cols-[minmax(0,1.5fr)_auto] md:items-end">
        <div>
          <p className="eyebrow text-accent">{selected.eyebrow}</p>
          <h2 className="mt-5 max-w-3xl text-[clamp(2.5rem,5vw,4.75rem)] leading-[1.02] tracking-[-0.055em]">
            {selected.title}
          </h2>
          <p className="mt-5 max-w-xl text-base leading-7 text-foreground-soft md:text-lg md:leading-8">
            {selected.description}
          </p>
        </div>
        <Link to="/contact" className="button-primary focus-ring group w-full sm:w-auto">
          {selected.action}
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}
