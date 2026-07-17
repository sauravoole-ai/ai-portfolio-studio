import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowUpRight, RefreshCcw } from "lucide-react";
import { SiteShell, PageHeader } from "@/components/site-shell";

export const Route = createFileRoute("/discovery")({
  head: () => ({
    meta: [
      { title: "Project Discovery — [Your Name]" },
      {
        name: "description",
        content:
          "A short three-question flow to shape your AI product idea into a direction, a next step, and a way to work together.",
      },
      { property: "og:title", content: "Project Discovery — [Your Name]" },
      {
        property: "og:description",
        content: "Answer three questions and get a tailored project direction.",
      },
    ],
  }),
  component: Discovery,
});

type ProductType =
  | "internal-tool"
  | "consumer-app"
  | "vertical-saas"
  | "agent-workflow";
type Stage = "spark" | "sketch" | "prototype" | "in-market";
type Support = "strategy" | "design" | "build" | "review";

const productOptions: {
  value: ProductType;
  label: string;
  hint: string;
}[] = [
  { value: "internal-tool", label: "Internal tool", hint: "AI copilots or ops tools for a team" },
  { value: "consumer-app", label: "Consumer product", hint: "An app or site real users pay for" },
  { value: "vertical-saas", label: "Vertical SaaS", hint: "AI-native software for a specific industry" },
  { value: "agent-workflow", label: "Agent or workflow", hint: "Multi-step automations and integrations" },
];

const stageOptions: { value: Stage; label: string; hint: string }[] = [
  { value: "spark", label: "Spark", hint: "A hunch, not much on paper yet" },
  { value: "sketch", label: "Sketch", hint: "Notes, a doc, some early wireframes" },
  { value: "prototype", label: "Prototype", hint: "Something clickable or a working demo" },
  { value: "in-market", label: "In market", hint: "Real users, ready to level up" },
];

const supportOptions: { value: Support; label: string; hint: string }[] = [
  { value: "strategy", label: "Strategy", hint: "Shape the problem and the bet" },
  { value: "design", label: "Product design", hint: "Flows, interface, prompts, evals" },
  { value: "build", label: "Build with me", hint: "Ship a prototype or v1 end-to-end" },
  { value: "review", label: "Second opinion", hint: "Audit, critique, or advisory" },
];

type Answers = {
  product: ProductType | null;
  stage: Stage | null;
  support: Support | null;
};

function recommend(a: { product: ProductType; stage: Stage; support: Support }) {
  const directionByProduct: Record<ProductType, string> = {
    "internal-tool":
      "A focused internal copilot that removes one painful workflow — measured on time saved per week, not features shipped.",
    "consumer-app":
      "A consumer product with one wedge use case that shows off model capability while feeling calm and legible.",
    "vertical-saas":
      "An AI-native vertical SaaS anchored on a workflow that domain experts already do daily — automate the boring 80%.",
    "agent-workflow":
      "A multi-step agent that owns a single business outcome end-to-end, with clean handoffs and human review points.",
  };

  const nextStepByStage: Record<Stage, string> = {
    spark:
      "Write a one-page product brief: the user, the moment of pain, and the smallest thing that would count as a win.",
    sketch:
      "Build a clickable prototype in a week — one flow, real copy, a stubbed model — and put it in front of five users.",
    prototype:
      "Instrument it. Add lightweight evals, capture real conversations, and pick one metric to move over the next two weeks.",
    "in-market":
      "Run a focused iteration cycle: identify the top drop-off, ship a targeted fix, and re-measure within ten days.",
  };

  const collabBySupport: Record<Support, string> = {
    strategy: "A short discovery sprint — 1 to 2 weeks, fixed scope, ends in a written direction.",
    design: "A product design engagement — flows, interface, and prompt design, part-time over 3 to 6 weeks.",
    build: "An embedded build sprint — I ship alongside you as a hands-on product engineer for 4 to 8 weeks.",
    review: "An advisory retainer — a monthly review, async feedback, and a working channel for the tricky calls.",
  };

  return {
    direction: directionByProduct[a.product],
    nextStep: nextStepByStage[a.stage],
    collab: collabBySupport[a.support],
  };
}

function Discovery() {
  const [answers, setAnswers] = useState<Answers>({
    product: null,
    stage: null,
    support: null,
  });
  const [submitted, setSubmitted] = useState(false);

  const complete = answers.product && answers.stage && answers.support;

  const reset = () => {
    setAnswers({ product: null, stage: null, support: null });
    setSubmitted(false);
  };

  return (
    <SiteShell>
      <PageHeader
        eyebrow="Project Discovery"
        title="Three questions to shape the work."
        lede="Tell me a little about the idea. I'll return a suggested direction, a concrete next step, and the kind of collaboration that fits."
      />

      <section className="container-editorial pb-24">
        {!submitted ? (
          <form
            className="space-y-14"
            onSubmit={(e) => {
              e.preventDefault();
              if (complete) setSubmitted(true);
            }}
          >
            <Question
              number="01"
              title="What type of AI product do you want to build?"
              options={productOptions}
              value={answers.product}
              onChange={(v) => setAnswers((s) => ({ ...s, product: v }))}
            />
            <Question
              number="02"
              title="What stage is the idea at today?"
              options={stageOptions}
              value={answers.stage}
              onChange={(v) => setAnswers((s) => ({ ...s, stage: v }))}
            />
            <Question
              number="03"
              title="What support do you need?"
              options={supportOptions}
              value={answers.support}
              onChange={(v) => setAnswers((s) => ({ ...s, support: v }))}
            />

            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-8">
              <p className="text-xs text-muted-foreground">
                Nothing is saved — this is a lightweight prototype to sketch a direction.
              </p>
              <button
                type="submit"
                disabled={!complete}
                className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm text-background transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
              >
                See recommendation <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>
          </form>
        ) : (
          <Recommendation
            answers={answers as { product: ProductType; stage: Stage; support: Support }}
            onReset={reset}
          />
        )}
      </section>
    </SiteShell>
  );
}

function Question<T extends string>({
  number,
  title,
  options,
  value,
  onChange,
}: {
  number: string;
  title: string;
  options: { value: T; label: string; hint: string }[];
  value: T | null;
  onChange: (v: T) => void;
}) {
  return (
    <fieldset className="animate-rise">
      <div className="flex items-baseline gap-4">
        <span className="eyebrow">{number}</span>
        <legend className="font-display text-2xl leading-tight tracking-tight sm:text-3xl">
          {title}
        </legend>
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {options.map((o) => {
          const active = value === o.value;
          return (
            <button
              key={o.value}
              type="button"
              onClick={() => onChange(o.value)}
              className={
                "group text-left rounded-2xl border px-5 py-4 transition-colors " +
                (active
                  ? "border-foreground bg-foreground text-background"
                  : "border-border hover:border-foreground/60")
              }
              aria-pressed={active}
            >
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-medium">{o.label}</span>
                <span
                  className={
                    "inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border " +
                    (active
                      ? "border-background bg-background"
                      : "border-border")
                  }
                  aria-hidden
                >
                  {active ? (
                    <span className="h-1.5 w-1.5 rounded-full bg-foreground" />
                  ) : null}
                </span>
              </div>
              <p
                className={
                  "mt-1 text-xs " +
                  (active ? "text-background/70" : "text-muted-foreground")
                }
              >
                {o.hint}
              </p>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function Recommendation({
  answers,
  onReset,
}: {
  answers: { product: ProductType; stage: Stage; support: Support };
  onReset: () => void;
}) {
  const rec = recommend(answers);
  const productLabel = productOptions.find((o) => o.value === answers.product)!.label;
  const stageLabel = stageOptions.find((o) => o.value === answers.stage)!.label;
  const supportLabel = supportOptions.find((o) => o.value === answers.support)!.label;

  return (
    <div className="animate-rise">
      <div className="mb-6 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <span className="eyebrow">Your answers</span>
        <Chip>{productLabel}</Chip>
        <Chip>{stageLabel}</Chip>
        <Chip>{supportLabel}</Chip>
      </div>

      <article className="rounded-3xl border border-border bg-card p-8 md:p-12">
        <p className="eyebrow">Recommendation</p>
        <h2 className="mt-3 font-display text-3xl leading-tight tracking-tight sm:text-4xl">
          Here's a shape for the work.
        </h2>

        <div className="mt-10 grid gap-10 md:grid-cols-3 md:gap-8">
          <RecBlock
            label="Suggested direction"
            body={rec.direction}
            accent
          />
          <RecBlock label="Recommended next step" body={rec.nextStep} />
          <RecBlock label="Suitable collaboration" body={rec.collab} />
        </div>

        <div className="mt-12 flex flex-wrap items-center gap-3 border-t border-border pt-8">
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm text-background"
          >
            Start a conversation <ArrowUpRight className="h-4 w-4" />
          </Link>
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 text-sm hover:border-foreground/60"
          >
            <RefreshCcw className="h-3.5 w-3.5" /> Start over
          </button>
        </div>
      </article>

      <p className="mt-6 text-xs text-muted-foreground">
        This is a lightweight sketch, not a proposal. The real thing happens in a conversation.
      </p>
    </div>
  );
}

function RecBlock({
  label,
  body,
  accent,
}: {
  label: string;
  body: string;
  accent?: boolean;
}) {
  return (
    <div>
      <div className="flex items-center gap-2">
        <span
          className="inline-block h-1.5 w-1.5 rounded-full"
          style={{
            backgroundColor: accent
              ? "var(--terracotta)"
              : "var(--muted-foreground)",
          }}
          aria-hidden
        />
        <p className="eyebrow">{label}</p>
      </div>
      <p className="mt-3 text-base leading-relaxed">{body}</p>
    </div>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-border px-3 py-1 text-xs text-foreground">
      {children}
    </span>
  );
}
