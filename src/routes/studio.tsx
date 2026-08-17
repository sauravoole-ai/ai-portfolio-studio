import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import type { Session } from "@supabase/supabase-js";
import { type FormEvent, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  createStudioPost,
  createStudioProject,
  deleteStudioPost,
  deleteStudioProject,
  deleteStudioMessage,
  isStudioAdmin,
  listStudioPosts,
  listStudioProjects,
  listStudioMessages,
  type StudioMessage,
  type StudioPost,
  type StudioProject,
  updateStudioPost,
  updateStudioProject,
  updateStudioMessageStatus,
  getStudioSiteProfile,
  updateStudioSiteProfile,
} from "@/lib/studio";
import {
  buildPostPayload,
  buildProjectPayload,
  isDeleteConfirmed,
  nextCreateSlug,
  resolveStudioAuthState,
  studioQueryKeys,
  validatePostDraft,
  validateProjectDraft,
  PROJECT_STATUSES,
  isMessageStatus,
} from "@/lib/studio.logic";
import { fallbackSiteProfile } from "@/lib/site-profile";
import { buildSiteProfileUpdate, parseBioFragments, parseCapabilities, parseTechnologyGroups, validateSiteProfile } from "@/lib/site-profile.logic";

export const Route = createFileRoute("/studio")({
  head: () => ({
    meta: [
      { title: "Studio" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: StudioRoute,
});

function StudioFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="studio-page min-h-screen">
      <main className="studio-container">{children}</main>
    </div>
  );
}

function StudioRoute() {
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    let active = true;
    void supabase.auth.getSession().then(({ data }) => {
      if (active) {
        setSession(data.session);
        setAuthLoading(false);
      }
    });
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setAuthLoading(false);
    });
    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);

  const authState = resolveStudioAuthState(authLoading, Boolean(session), "idle");
  if (authState === "loading") {
    return (
      <StudioFrame>
        <p className="studio-status" aria-live="polite">Checking session…</p>
      </StudioFrame>
    );
  }
  if (authState === "signed-out" || !session) return <SignIn />;
  return <AdminGate session={session} />;
}

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const signIn = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) throw new Error("Sign in failed.");
    },
    onError: (error) => setMessage(error.message),
  });

  function submit(event: FormEvent) {
    event.preventDefault();
    setMessage("");
    if (!email.trim() || !password) {
      setMessage("Email and password are required.");
      return;
    }
    signIn.mutate();
  }

  return (
    <StudioFrame>
      <section className="studio-auth-panel" aria-labelledby="studio-sign-in">
        <p className="eyebrow text-accent">Studio</p>
        <h1 id="studio-sign-in" className="mt-4 font-display text-4xl">Sign in</h1>
        <form onSubmit={submit} className="studio-form mt-8">
          <StudioField label="Email">
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </StudioField>
          <StudioField label="Password">
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </StudioField>
          {message ? <p className="studio-feedback studio-feedback--error" role="alert">{message}</p> : null}
          <button className="studio-button studio-button--primary" disabled={signIn.isPending}>
            {signIn.isPending ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </section>
    </StudioFrame>
  );
}

function SignOutButton() {
  const [busy, setBusy] = useState(false);
  return (
    <button
      type="button"
      className="studio-button"
      disabled={busy}
      onClick={() => {
        setBusy(true);
        void supabase.auth.signOut().finally(() => setBusy(false));
      }}
    >
      {busy ? "Signing out…" : "Sign out"}
    </button>
  );
}

function AdminGate({ session }: { session: Session }) {
  const admin = useQuery({
    queryKey: ["studio", "admin", session.user.id],
    queryFn: () => isStudioAdmin(session.user.id),
    retry: false,
  });

  const authState = resolveStudioAuthState(
    false,
    true,
    admin.isPending ? "pending" : admin.isError ? "error" : admin.data ? "allowed" : "denied",
  );
  if (authState === "checking-admin") {
    return (
      <StudioFrame>
        <p className="studio-status" aria-live="polite">Checking access…</p>
      </StudioFrame>
    );
  }
  if (authState === "error") {
    return (
      <StudioFrame>
        <section className="studio-auth-panel text-center">
          <h1 className="font-display text-3xl">Access check failed</h1>
          <div className="mt-6"><SignOutButton /></div>
        </section>
      </StudioFrame>
    );
  }
  if (authState === "denied") {
    return (
      <StudioFrame>
        <section className="studio-auth-panel text-center">
          <h1 className="font-display text-3xl">Access denied</h1>
          <div className="mt-6"><SignOutButton /></div>
        </section>
      </StudioFrame>
    );
  }
  return <Studio />;
}

function Studio() {
  const [section, setSection] = useState<"posts" | "projects" | "messages" | "profile">("posts");
  return (
    <StudioFrame>
      <header className="studio-header">
        <h1 className="font-display text-4xl">Studio</h1>
        <SignOutButton />
      </header>
      <div className="studio-tabs" aria-label="Studio sections">
        <button type="button" aria-pressed={section === "posts"} onClick={() => setSection("posts")}>Posts</button>
        <button type="button" aria-pressed={section === "projects"} onClick={() => setSection("projects")}>Projects</button>
        <button type="button" aria-pressed={section === "messages"} onClick={() => setSection("messages")}>Messages</button>
        <button type="button" aria-pressed={section === "profile"} onClick={() => setSection("profile")}>Profile</button>
      </div>
      {section === "posts" ? <PostsManager /> : section === "projects" ? <ProjectsManager /> : section === "messages" ? <MessagesManager /> : <ProfileManager />}
    </StudioFrame>
  );
}

function StudioField({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="studio-field"><span>{label}</span>{children}</label>;
}

function toLocalDateTime(value: string | null) {
  if (!value) return "";
  const date = new Date(value);
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

function PostsManager() {
  const client = useQueryClient();
  const posts = useQuery({ queryKey: ["studio", "posts"], queryFn: listStudioPosts });
  const [editing, setEditing] = useState<StudioPost | null | "new">(null);
  const [confirming, setConfirming] = useState<string | null>(null);
  const [deleteFeedback, setDeleteFeedback] = useState("");
  const remove = useMutation({
    mutationFn: deleteStudioPost,
    onSuccess: async () => {
      setConfirming(null);
      setDeleteFeedback("Deleted.");
      await Promise.all([
        ...studioQueryKeys.posts.map((queryKey) => client.invalidateQueries({ queryKey })),
      ]);
    },
  });

  if (posts.isPending) return <p className="studio-status">Loading posts…</p>;
  if (posts.isError) return <p className="studio-feedback studio-feedback--error">Posts could not be loaded.</p>;

  return (
    <section className="studio-section">
      <div className="studio-section__heading">
        <h2 className="font-display text-3xl">Posts</h2>
        <button type="button" className="studio-button studio-button--primary" onClick={() => setEditing("new")}>New post</button>
      </div>
      {editing ? (
        <PostForm
          key={editing === "new" ? "new" : editing.id}
          post={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
        />
      ) : null}
      <ul className="studio-records">
        {posts.data.map((post) => (
          <li key={post.id} className="studio-record">
            <div><strong>{post.title}</strong><span>{post.published ? "Published" : "Draft"}</span></div>
            <div className="studio-record__actions">
              <button type="button" className="studio-button" onClick={() => setEditing(post)}>Edit</button>
              {isDeleteConfirmed(confirming, post.id) ? (
                <>
                  <button type="button" className="studio-button studio-button--danger" disabled={remove.isPending} onClick={() => remove.mutate(post.id)}>Confirm delete</button>
                  <button type="button" className="studio-button" onClick={() => setConfirming(null)}>Cancel</button>
                </>
              ) : (
                <button type="button" className="studio-button studio-button--danger" onClick={() => { setDeleteFeedback(""); setConfirming(post.id); }}>Delete</button>
              )}
            </div>
          </li>
        ))}
      </ul>
      {deleteFeedback ? <p className="studio-feedback" role="status">{deleteFeedback}</p> : null}
      {remove.isError ? <p className="studio-feedback studio-feedback--error">Post deletion failed.</p> : null}
    </section>
  );
}

function PostForm({ post, onClose }: { post: StudioPost | null; onClose: () => void }) {
  const client = useQueryClient();
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugEdited, setSlugEdited] = useState(Boolean(post));
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [content, setContent] = useState(post?.content ?? "");
  const [category, setCategory] = useState(post?.category ?? "");
  const [cover, setCover] = useState(post?.cover_image_url ?? "");
  const [published, setPublished] = useState(post?.published ?? false);
  const [publishedAt, setPublishedAt] = useState(toLocalDateTime(post?.published_at ?? null));
  const [feedback, setFeedback] = useState("");
  const save = useMutation({
    mutationFn: async () => {
      const values = buildPostPayload({ title, slug, excerpt, content, category, cover, published, publishedAt });
      return post ? updateStudioPost(post.id, values) : createStudioPost(values);
    },
    onSuccess: async () => {
      setFeedback("Saved.");
      await Promise.all([
        ...studioQueryKeys.posts.map((queryKey) => client.invalidateQueries({ queryKey })),
      ]);
    },
    onError: () => setFeedback("Save failed."),
  });

  function submit(event: FormEvent) {
    event.preventDefault();
    setFeedback("");
    if (!validatePostDraft({ title, slug, excerpt, content, category, cover, published, publishedAt })) {
      setFeedback("Title, slug, excerpt, and content are required.");
      return;
    }
    save.mutate();
  }

  return (
    <form className="studio-editor studio-form" onSubmit={submit}>
      <StudioField label="Title"><input value={title} onChange={(event) => { const value = event.target.value; setTitle(value); if (!post) setSlug(nextCreateSlug(value, slug, slugEdited)); }} /></StudioField>
      <StudioField label="Slug"><input value={slug} onChange={(event) => { setSlugEdited(true); setSlug(event.target.value); }} /></StudioField>
      <StudioField label="Excerpt"><textarea rows={3} value={excerpt} onChange={(event) => setExcerpt(event.target.value)} /></StudioField>
      <StudioField label="Content"><textarea rows={12} value={content} onChange={(event) => setContent(event.target.value)} /></StudioField>
      <div className="studio-form__columns">
        <StudioField label="Category"><input value={category} onChange={(event) => setCategory(event.target.value)} /></StudioField>
        <StudioField label="Cover image URL"><input type="url" value={cover} onChange={(event) => setCover(event.target.value)} /></StudioField>
      </div>
      <div className="studio-form__columns">
        <label className="studio-check"><input type="checkbox" checked={published} onChange={(event) => setPublished(event.target.checked)} /><span>Published</span></label>
        <StudioField label="Published at"><input type="datetime-local" value={publishedAt} onChange={(event) => setPublishedAt(event.target.value)} /></StudioField>
      </div>
      {feedback ? <p className={`studio-feedback${feedback === "Saved." ? "" : " studio-feedback--error"}`} role="status">{feedback}</p> : null}
      <div className="studio-form__actions">
        <button className="studio-button studio-button--primary" disabled={save.isPending}>{save.isPending ? "Saving…" : "Save post"}</button>
        <button type="button" className="studio-button" onClick={onClose}>Close</button>
      </div>
    </form>
  );
}

function ProjectsManager() {
  const client = useQueryClient();
  const projects = useQuery({ queryKey: ["studio", "projects"], queryFn: listStudioProjects });
  const [editing, setEditing] = useState<StudioProject | null | "new">(null);
  const [confirming, setConfirming] = useState<number | null>(null);
  const [deleteFeedback, setDeleteFeedback] = useState("");
  const remove = useMutation({
    mutationFn: deleteStudioProject,
    onSuccess: async () => {
      setConfirming(null);
      setDeleteFeedback("Deleted.");
      await Promise.all([
        ...studioQueryKeys.projects.map((queryKey) => client.invalidateQueries({ queryKey })),
      ]);
    },
  });
  if (projects.isPending) return <p className="studio-status">Loading projects…</p>;
  if (projects.isError) return <p className="studio-feedback studio-feedback--error">Projects could not be loaded.</p>;
  return (
    <section className="studio-section">
      <div className="studio-section__heading"><h2 className="font-display text-3xl">Projects</h2><button type="button" className="studio-button studio-button--primary" onClick={() => setEditing("new")}>New project</button></div>
      {editing ? <ProjectForm key={editing === "new" ? "new" : editing.id} project={editing === "new" ? null : editing} onClose={() => setEditing(null)} /> : null}
      <ul className="studio-records">
        {projects.data.map((project) => (
          <li key={project.id} className="studio-record">
            <div><strong>{project.title || "Untitled"}</strong><span>{project.published ? "Published" : "Draft"}</span></div>
            <div className="studio-record__actions">
              <button type="button" className="studio-button" onClick={() => setEditing(project)}>Edit</button>
              {isDeleteConfirmed(confirming, project.id) ? <><button type="button" className="studio-button studio-button--danger" disabled={remove.isPending} onClick={() => remove.mutate(project.id)}>Confirm delete</button><button type="button" className="studio-button" onClick={() => setConfirming(null)}>Cancel</button></> : <button type="button" className="studio-button studio-button--danger" onClick={() => { setDeleteFeedback(""); setConfirming(project.id); }}>Delete</button>}
            </div>
          </li>
        ))}
      </ul>
      {deleteFeedback ? <p className="studio-feedback" role="status">{deleteFeedback}</p> : null}
      {remove.isError ? <p className="studio-feedback studio-feedback--error">Project deletion failed.</p> : null}
    </section>
  );
}

function MessagesManager() {
  const client = useQueryClient();
  const messages = useQuery({ queryKey: ["studio", "messages"], queryFn: listStudioMessages });
  const [confirming, setConfirming] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");
  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => {
      if (!isMessageStatus(status)) throw new Error("Invalid message status.");
      return updateStudioMessageStatus(id, status);
    },
    onSuccess: async () => {
      setFeedback("Message updated.");
      await Promise.all(studioQueryKeys.messages.map((queryKey) => client.invalidateQueries({ queryKey })));
    },
    onError: () => setFeedback("Message update failed."),
  });
  const remove = useMutation({
    mutationFn: deleteStudioMessage,
    onSuccess: async () => {
      setConfirming(null);
      setFeedback("Message deleted.");
      await Promise.all(studioQueryKeys.messages.map((queryKey) => client.invalidateQueries({ queryKey })));
    },
    onError: () => setFeedback("Message deletion failed."),
  });

  if (messages.isPending) return <p className="studio-status">Loading messages…</p>;
  if (messages.isError) return <p className="studio-feedback studio-feedback--error">Messages could not be loaded.</p>;
  return (
    <section className="studio-section">
      <div className="studio-section__heading"><h2 className="font-display text-3xl">Messages</h2></div>
      {messages.data.length === 0 ? <p className="studio-status">No messages yet.</p> : (
        <ul className="studio-records">
          {messages.data.map((message: StudioMessage) => (
            <li key={message.id} className="studio-message">
              <div className="studio-message__header"><div><strong>{message.name}</strong><a href={`mailto:${message.email}`}>{message.email}</a></div><span>{new Date(message.created_at).toLocaleString()}</span></div>
              {message.project_type ? <p className="studio-message__project-type"><strong>Project type:</strong> {message.project_type}</p> : null}
              {message.build_idea ? <div className="studio-message__body"><strong>Build idea</strong><p>{message.build_idea}</p></div> : null}
              <div className="studio-message__body"><strong>Context</strong><p>{message.message}</p></div>
              <div className="studio-record__actions">
                <span className="studio-message__status">{message.status}</span>
                {message.status === "New" ? <button type="button" className="studio-button" disabled={updateStatus.isPending} onClick={() => updateStatus.mutate({ id: message.id, status: "Read" })}>Mark read</button> : null}
                {message.status !== "Archived" ? <button type="button" className="studio-button" disabled={updateStatus.isPending} onClick={() => updateStatus.mutate({ id: message.id, status: "Archived" })}>Archive</button> : null}
                {isDeleteConfirmed(confirming, message.id) ? <><button type="button" className="studio-button studio-button--danger" disabled={remove.isPending} onClick={() => remove.mutate(message.id)}>Confirm delete</button><button type="button" className="studio-button" onClick={() => setConfirming(null)}>Cancel</button></> : <button type="button" className="studio-button studio-button--danger" onClick={() => setConfirming(message.id)}>Delete</button>}
              </div>
            </li>
          ))}
        </ul>
      )}
      {feedback ? <p className={`studio-feedback${feedback.includes("failed") ? " studio-feedback--error" : ""}`} role="status">{feedback}</p> : null}
    </section>
  );
}

function ProfileManager() {
  const client = useQueryClient();
  const profile = useQuery({ queryKey: ["studio", "profile"], queryFn: getStudioSiteProfile });
  if (profile.isPending) return <p className="studio-status">Loading profile…</p>;
  if (profile.isError || !profile.data) return <p className="studio-feedback studio-feedback--error">Profile could not be loaded.</p>;
  return <ProfileForm key={profile.data.updated_at} profile={profile.data} onSaved={async () => { await Promise.all(studioQueryKeys.profile.map((queryKey) => client.invalidateQueries({ queryKey }))); }} />;
}

function ProfileForm({ profile, onSaved }: { profile: NonNullable<Awaited<ReturnType<typeof getStudioSiteProfile>>>; onSaved: () => Promise<void> }) {
  const [name, setName] = useState(profile.name);
  const [role, setRole] = useState(profile.role);
  const [location, setLocation] = useState(profile.location);
  const [degree, setDegree] = useState(profile.degree);
  const [university, setUniversity] = useState(profile.university);
  const [graduationYear, setGraduationYear] = useState(profile.graduation_year);
  const [heroTagline, setHeroTagline] = useState(profile.hero_tagline);
  const [heroSupporting, setHeroSupporting] = useState(profile.hero_supporting);
  const [connectCta, setConnectCta] = useState(profile.connect_cta);
  const [githubUrl, setGithubUrl] = useState(profile.github_url);
  const [linkedinUrl, setLinkedinUrl] = useState(profile.linkedin_url);
  const [instagramUrl, setInstagramUrl] = useState(profile.instagram_url);
  const [bio, setBio] = useState(() => parseBioFragments(profile.bio_fragments, fallbackSiteProfile.bio_fragments));
  const [profileCapabilities, setProfileCapabilities] = useState(() => parseCapabilities(profile.capabilities, fallbackSiteProfile.capabilities));
  const [technologyGroups, setTechnologyGroups] = useState(() => parseTechnologyGroups(profile.technology_groups, fallbackSiteProfile.technology_groups));
  const [feedback, setFeedback] = useState("");
  const draft = { name, role, location, degree, university, graduation_year: graduationYear, hero_tagline: heroTagline, hero_supporting: heroSupporting, connect_cta: connectCta, github_url: githubUrl, linkedin_url: linkedinUrl, instagram_url: instagramUrl, bio_fragments: bio, capabilities: profileCapabilities, technology_groups: technologyGroups };
  const save = useMutation({ mutationFn: () => updateStudioSiteProfile(buildSiteProfileUpdate(draft)), onSuccess: async () => { setFeedback("Saved."); await onSaved(); }, onError: () => setFeedback("Save failed.") });
  function submit(event: FormEvent) { event.preventDefault(); setFeedback(""); const error = validateSiteProfile(draft); if (error) { setFeedback(error); return; } save.mutate(); }
  return <section className="studio-section"><div className="studio-section__heading"><div><h2 className="font-display text-3xl">Profile / Site Details</h2><p className="mt-2 text-sm text-muted-foreground">Objective facts and mutable public branding used across the site.</p></div></div><form className="studio-editor studio-form" onSubmit={submit}>
    <h3 className="text-lg font-medium">Profile</h3><StudioField label="Name"><input value={name} onChange={(event) => setName(event.target.value)} /></StudioField><StudioField label="Role"><input value={role} onChange={(event) => setRole(event.target.value)} /></StudioField><div className="studio-form__columns"><StudioField label="Location"><input value={location} onChange={(event) => setLocation(event.target.value)} /></StudioField><StudioField label="Graduation year"><input inputMode="numeric" value={graduationYear} onChange={(event) => setGraduationYear(event.target.value)} /></StudioField></div><StudioField label="Degree"><input value={degree} onChange={(event) => setDegree(event.target.value)} /></StudioField><StudioField label="University"><input value={university} onChange={(event) => setUniversity(event.target.value)} /></StudioField>
    <h3 className="mt-5 text-lg font-medium">Branding</h3><StudioField label="Hero tagline"><input value={heroTagline} onChange={(event) => setHeroTagline(event.target.value)} /></StudioField><StudioField label="Hero supporting line"><textarea rows={3} value={heroSupporting} onChange={(event) => setHeroSupporting(event.target.value)} /></StudioField><StudioField label="Connect CTA"><input value={connectCta} onChange={(event) => setConnectCta(event.target.value)} /></StudioField>
    <h3 className="mt-5 text-lg font-medium">Social links</h3><StudioField label="GitHub"><input type="url" value={githubUrl} onChange={(event) => setGithubUrl(event.target.value)} /></StudioField><StudioField label="LinkedIn"><input type="url" value={linkedinUrl} onChange={(event) => setLinkedinUrl(event.target.value)} /></StudioField><StudioField label="Instagram"><input type="url" value={instagramUrl} onChange={(event) => setInstagramUrl(event.target.value)} /></StudioField>
    <h3 className="mt-5 text-lg font-medium">Biography</h3>{bio.map((fragment, index) => <StudioField key={index} label={`Fragment ${index + 1}`}><textarea rows={4} value={fragment} onChange={(event) => setBio((current) => current.map((item, itemIndex) => itemIndex === index ? event.target.value : item))} /></StudioField>)}
    <h3 className="mt-5 text-lg font-medium">Capabilities</h3>{profileCapabilities.map((capability, index) => <div className="studio-form__columns" key={index}><StudioField label={`Capability ${index + 1}`}><input value={capability.title} onChange={(event) => setProfileCapabilities((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, title: event.target.value } : item))} /></StudioField><StudioField label="Description"><textarea rows={3} value={capability.description} onChange={(event) => setProfileCapabilities((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, description: event.target.value } : item))} /></StudioField></div>)}
    <h3 className="mt-5 text-lg font-medium">Tools & Technologies</h3>{technologyGroups.map((group, groupIndex) => <div key={groupIndex}><StudioField label={`Group ${groupIndex + 1}`}><input value={group.title} onChange={(event) => setTechnologyGroups((current) => current.map((item, itemIndex) => itemIndex === groupIndex ? { ...item, title: event.target.value } : item))} /></StudioField>{group.items.map((item, itemIndex) => <div className="studio-form__columns" key={itemIndex}><StudioField label="Item label (optional)"><input value={item.label ?? ""} onChange={(event) => setTechnologyGroups((current) => current.map((currentGroup, currentGroupIndex) => currentGroupIndex === groupIndex ? { ...currentGroup, items: currentGroup.items.map((currentItem, currentItemIndex) => currentItemIndex === itemIndex ? { ...currentItem, label: event.target.value || null } : currentItem) } : currentGroup))} /></StudioField><StudioField label="Technologies"><textarea rows={2} value={item.content} onChange={(event) => setTechnologyGroups((current) => current.map((currentGroup, currentGroupIndex) => currentGroupIndex === groupIndex ? { ...currentGroup, items: currentGroup.items.map((currentItem, currentItemIndex) => currentItemIndex === itemIndex ? { ...currentItem, content: event.target.value } : currentItem) } : currentGroup))} /></StudioField></div>)}</div>)}
    {feedback ? <p className={`studio-feedback${feedback === "Saved." ? "" : " studio-feedback--error"}`} role="status">{feedback}</p> : null}<div className="studio-form__actions"><button className="studio-button studio-button--primary" disabled={save.isPending}>{save.isPending ? "Saving…" : "Save profile"}</button></div></form></section>;
}

function ProjectForm({ project, onClose }: { project: StudioProject | null; onClose: () => void }) {
  const client = useQueryClient();
  const [title, setTitle] = useState(project?.title ?? "");
  const [slug, setSlug] = useState(project?.slug ?? "");
  const [slugEdited, setSlugEdited] = useState(Boolean(project));
  const [summary, setSummary] = useState(project?.summary ?? "");
  const [problem, setProblem] = useState(project?.problem ?? "");
  const [approach, setApproach] = useState(project?.approach ?? "");
  const [keyFeatures, setKeyFeatures] = useState((project?.key_features ?? []).join("\n"));
  const [stack, setStack] = useState((project?.stack ?? []).join("\n"));
  const [outcome, setOutcome] = useState(project?.outcome ?? "");
  const [status, setStatus] = useState(project?.status ?? "Live");
  const [liveUrl, setLiveUrl] = useState(project?.live_url ?? "");
  const [githubUrl, setGithubUrl] = useState(project?.github_url ?? "");
  const [coverImageUrl, setCoverImageUrl] = useState(project?.cover_image_url ?? "");
  const [published, setPublished] = useState(project?.published ?? false);
  const [sortOrder, setSortOrder] = useState(String(project?.sort_order ?? 0));
  const [feedback, setFeedback] = useState("");
  const draft = { title, slug, summary, problem, approach, keyFeatures, stack, outcome, status, liveUrl, githubUrl, coverImageUrl, published, sortOrder };
  const save = useMutation({
    mutationFn: () => {
      const values = buildProjectPayload(draft);
      return project ? updateStudioProject(project.id, values) : createStudioProject(values);
    },
    onSuccess: async () => {
      setFeedback("Saved.");
      await Promise.all([
        ...studioQueryKeys.projects.map((queryKey) => client.invalidateQueries({ queryKey })),
      ]);
    },
    onError: () => setFeedback("Save failed."),
  });
  function submit(event: FormEvent) {
    event.preventDefault();
    setFeedback("");
    const validationError = validateProjectDraft(draft);
    if (validationError) {
      setFeedback(validationError);
      return;
    }
    save.mutate();
  }
  return (
    <form className="studio-editor studio-form" onSubmit={submit}>
      <StudioField label="Title"><input required value={title} onChange={(event) => { const value = event.target.value; setTitle(value); if (!project) setSlug(nextCreateSlug(value, slug, slugEdited)); }} /></StudioField>
      <StudioField label="Slug"><input required value={slug} onChange={(event) => { setSlugEdited(true); setSlug(event.target.value); }} /></StudioField>
      <StudioField label="Summary"><textarea required rows={4} value={summary} onChange={(event) => setSummary(event.target.value)} /></StudioField>
      <StudioField label="Problem"><textarea rows={5} value={problem} onChange={(event) => setProblem(event.target.value)} /></StudioField>
      <StudioField label="Approach"><textarea rows={5} value={approach} onChange={(event) => setApproach(event.target.value)} /></StudioField>
      <div className="studio-form__columns">
        <StudioField label="Key features (one per line)"><textarea rows={6} value={keyFeatures} onChange={(event) => setKeyFeatures(event.target.value)} /></StudioField>
        <StudioField label="Stack (one item per line)"><textarea rows={6} value={stack} onChange={(event) => setStack(event.target.value)} /></StudioField>
      </div>
      <StudioField label="Outcome / Learning"><textarea rows={5} value={outcome} onChange={(event) => setOutcome(event.target.value)} /></StudioField>
      <div className="studio-form__columns">
        <StudioField label="Status"><select value={status} onChange={(event) => setStatus(event.target.value)}>{PROJECT_STATUSES.map((item) => <option key={item}>{item}</option>)}</select></StudioField>
        <StudioField label="Sort order"><input type="number" value={sortOrder} onChange={(event) => setSortOrder(event.target.value)} /></StudioField>
      </div>
      <div className="studio-form__columns">
        <StudioField label="Live URL"><input type="url" value={liveUrl} onChange={(event) => setLiveUrl(event.target.value)} /></StudioField>
        <StudioField label="GitHub URL"><input type="url" value={githubUrl} onChange={(event) => setGithubUrl(event.target.value)} /></StudioField>
      </div>
      <StudioField label="Cover Image URL"><input type="url" value={coverImageUrl} onChange={(event) => setCoverImageUrl(event.target.value)} /></StudioField>
      <label className="studio-check"><input type="checkbox" checked={published} onChange={(event) => setPublished(event.target.checked)} /><span>Published</span></label>
      {feedback ? <p className={`studio-feedback${feedback === "Saved." ? "" : " studio-feedback--error"}`} role="status">{feedback}</p> : null}
      <div className="studio-form__actions"><button className="studio-button studio-button--primary" disabled={save.isPending}>{save.isPending ? "Saving…" : "Save project"}</button><button type="button" className="studio-button" onClick={onClose}>Close</button></div>
    </form>
  );
}
