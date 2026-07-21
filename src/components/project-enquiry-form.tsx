const inputClass =
  "mt-2 min-h-12 w-full rounded-xl border border-border bg-surface-inset px-4 py-3 text-base text-foreground outline-none transition-[border-color,background-color] placeholder:text-quiet-foreground hover:border-border-strong focus:border-accent-muted";

function RequiredMark() {
  return <span className="text-accent" aria-hidden> *</span>;
}

export function ProjectEnquiryForm() {
  return (
    <form
      className="surface-feature p-6 sm:p-8 md:p-10"
      aria-describedby="enquiry-status enquiry-privacy"
      onSubmit={(event) => event.preventDefault()}
    >
      <div id="enquiry-errors" role="alert" aria-live="polite" tabIndex={-1} className="sr-only" />

      <div className="border-b border-border-subtle pb-7">
        <p className="eyebrow text-accent">Project enquiry</p>
        <h2 className="mt-4 text-2xl tracking-[-0.035em] sm:text-3xl">Share the shape of the work.</h2>
        <p id="enquiry-status" className="mt-4 max-w-2xl text-sm leading-6 text-foreground-soft">
          Direct form submission is being prepared. You can fill this out to structure your note, but nothing will be sent or saved yet.
        </p>
      </div>

      <fieldset className="mt-8 grid gap-6 sm:grid-cols-2">
        <legend className="sr-only">Your contact details</legend>
        <Field label="Name" name="name" autoComplete="name" required />
        <Field label="Email" name="email" type="email" autoComplete="email" required />
        <Field label="Organisation" name="organisation" autoComplete="organization" />
        <SelectField
          label="Project type"
          name="projectType"
          required
          options={["AI product", "Intelligent workflow or assistant", "Creative digital experience", "Other or still exploring"]}
        />
        <SelectField
          label="Budget range"
          name="budget"
          description="Choose only if a range is already known."
          options={["Not defined yet", "Prefer to discuss"]}
        />
        <SelectField
          label="Timeline"
          name="timeline"
          options={["Still exploring", "A future project", "Prefer to discuss"]}
        />
      </fieldset>

      <div className="mt-6">
        <label htmlFor="project-description" className="text-sm font-medium text-foreground">
          Project description<RequiredMark />
        </label>
        <p id="project-description-help" className="mt-1 text-sm leading-6 text-muted-foreground">
          Describe the idea, its context, and the kind of help you are considering.
        </p>
        <textarea
          id="project-description"
          name="projectDescription"
          rows={7}
          required
          aria-describedby="project-description-help"
          className={`${inputClass} min-h-44 resize-y`}
        />
      </div>

      <div className="mt-8 border-t border-border-subtle pt-6">
        <p id="enquiry-privacy" className="text-sm leading-6 text-muted-foreground">
          This draft remains only in your browser and is not stored. Use the direct email pathway on this page when you are ready to send an enquiry.
        </p>
        <button type="button" disabled className="button-primary mt-5 cursor-not-allowed opacity-45">
          Submission coming soon
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  autoComplete,
  required = false,
}: {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="text-sm font-medium text-foreground">
        {label}{required ? <RequiredMark /> : null}
      </label>
      <input id={name} name={name} type={type} autoComplete={autoComplete} required={required} className={inputClass} />
    </div>
  );
}

function SelectField({
  label,
  name,
  options,
  description,
  required = false,
}: {
  label: string;
  name: string;
  options: string[];
  description?: string;
  required?: boolean;
}) {
  const descriptionId = description ? `${name}-help` : undefined;
  return (
    <div>
      <label htmlFor={name} className="text-sm font-medium text-foreground">
        {label}{required ? <RequiredMark /> : null}
      </label>
      {description ? <p id={descriptionId} className="mt-1 text-xs leading-5 text-muted-foreground">{description}</p> : null}
      <select id={name} name={name} required={required} aria-describedby={descriptionId} defaultValue="" className={inputClass}>
        <option value="" disabled>Select an option</option>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </div>
  );
}
