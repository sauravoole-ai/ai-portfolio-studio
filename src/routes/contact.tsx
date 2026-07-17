import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteShell, PageHeader } from "@/components/site-shell";
import { SITE } from "@/lib/content";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — [Your Name]" },
      {
        name: "description",
        content: "Get in touch with [Your Name] about applied AI product work, collaborations or writing.",
      },
      { property: "og:title", content: "Contact — [Your Name]" },
      { property: "og:description", content: "Get in touch about applied AI product work." },
    ],
  }),
  component: Contact,
});

function Contact() {
  const [submitted, setSubmitted] = useState(false);
  return (
    <SiteShell>
      <PageHeader
        eyebrow="Contact"
        title="Say hello."
        lede="The best way to start a conversation is a short note about what you're working on and what you'd want help with. I read everything, and reply within a few days."
      />

      <section className="container-editorial pb-24">
        <div className="grid gap-12 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] md:gap-16">
          <form
            className="space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
          >
            <Field label="Your name" name="name" placeholder="[Your Name]" />
            <Field label="Email" name="email" type="email" placeholder="you@company.com" />
            <Field label="Company or project" name="company" placeholder="Optional" />
            <div>
              <label htmlFor="message" className="eyebrow">
                A short note
              </label>
              <textarea
                id="message"
                name="message"
                rows={6}
                required
                placeholder="What are you working on, and what would you want help with?"
                className="mt-3 w-full resize-none rounded-none border-b border-border bg-transparent px-0 py-3 text-base outline-none placeholder:text-muted-foreground/60 focus:border-foreground"
              />
            </div>
            <div className="flex items-center justify-between pt-2">
              <p className="text-xs text-muted-foreground">
                Form doesn't send yet — placeholder for the real thing.
              </p>
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-full border border-foreground px-5 py-3 text-sm transition-colors hover:bg-foreground hover:text-background"
              >
                Send note <span aria-hidden>→</span>
              </button>
            </div>
            {submitted ? (
              <p className="mt-4 text-sm text-[color:var(--terracotta)]">
                Thanks — I'll be in touch. (This is a placeholder confirmation.)
              </p>
            ) : null}
          </form>

          <aside className="space-y-10 border-t border-border pt-10 md:border-l md:border-t-0 md:pl-12 md:pt-0">
            <div>
              <p className="eyebrow">Direct</p>
              <ul className="mt-4 space-y-2 text-sm">
                <li><a href={`mailto:${SITE.email}`} className="link-underline">{SITE.email}</a></li>
                <li className="text-muted-foreground">Based in {SITE.location}</li>
              </ul>
            </div>
            <div>
              <p className="eyebrow">Elsewhere</p>
              <ul className="mt-4 space-y-2 text-sm">
                <li><a href="#" className="link-underline">{SITE.github}</a></li>
                <li><a href="#" className="link-underline">{SITE.twitter}</a></li>
                <li><a href="#" className="link-underline">{SITE.linkedin}</a></li>
              </ul>
            </div>
            <div>
              <p className="eyebrow">What I'm up for</p>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li>— Zero-to-one AI product collaborations</li>
                <li>— Design & engineering advisory</li>
                <li>— Writing, essays, occasional talks</li>
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </SiteShell>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="eyebrow">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        required={type !== "text" || name === "name"}
        className="mt-3 w-full border-b border-border bg-transparent px-0 py-3 text-base outline-none placeholder:text-muted-foreground/60 focus:border-foreground"
      />
    </div>
  );
}
