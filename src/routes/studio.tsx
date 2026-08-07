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
  isStudioAdmin,
  listStudioPosts,
  listStudioProjects,
  type StudioPost,
  type StudioProject,
  updateStudioPost,
  updateStudioProject,
} from "@/lib/studio";
import {
  buildPostPayload,
  buildProjectPayload,
  isDeleteConfirmed,
  nextCreateSlug,
  resolveStudioAuthState,
  studioQueryKeys,
  validatePostDraft,
} from "@/lib/studio.logic";

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
  const [section, setSection] = useState<"posts" | "projects">("posts");
  return (
    <StudioFrame>
      <header className="studio-header">
        <h1 className="font-display text-4xl">Studio</h1>
        <SignOutButton />
      </header>
      <div className="studio-tabs" aria-label="Studio sections">
        <button type="button" aria-pressed={section === "posts"} onClick={() => setSection("posts")}>Posts</button>
        <button type="button" aria-pressed={section === "projects"} onClick={() => setSection("projects")}>Projects</button>
      </div>
      {section === "posts" ? <PostsManager /> : <ProjectsManager />}
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

function ProjectForm({ project, onClose }: { project: StudioProject | null; onClose: () => void }) {
  const client = useQueryClient();
  const [title, setTitle] = useState(project?.title ?? "");
  const [slug, setSlug] = useState(project?.slug ?? "");
  const [summary, setSummary] = useState(project?.summary ?? "");
  const [published, setPublished] = useState(project?.published ?? false);
  const [feedback, setFeedback] = useState("");
  const save = useMutation({
    mutationFn: () => {
      const values = buildProjectPayload({ title, slug, summary, published });
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
  return (
    <form className="studio-editor studio-form" onSubmit={(event) => { event.preventDefault(); setFeedback(""); save.mutate(); }}>
      <StudioField label="Title"><input value={title} onChange={(event) => setTitle(event.target.value)} /></StudioField>
      <StudioField label="Slug"><input value={slug} onChange={(event) => setSlug(event.target.value)} /></StudioField>
      <StudioField label="Summary"><textarea rows={4} value={summary} onChange={(event) => setSummary(event.target.value)} /></StudioField>
      <label className="studio-check"><input type="checkbox" checked={published} onChange={(event) => setPublished(event.target.checked)} /><span>Published</span></label>
      {feedback ? <p className={`studio-feedback${feedback === "Saved." ? "" : " studio-feedback--error"}`} role="status">{feedback}</p> : null}
      <div className="studio-form__actions"><button className="studio-button studio-button--primary" disabled={save.isPending}>{save.isPending ? "Saving…" : "Save project"}</button><button type="button" className="studio-button" onClick={onClose}>Close</button></div>
    </form>
  );
}
