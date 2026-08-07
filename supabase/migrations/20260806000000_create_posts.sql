CREATE TABLE public.posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  excerpt text NOT NULL DEFAULT '',
  content text NOT NULL DEFAULT '',
  category text,
  cover_image_url text,
  published boolean NOT NULL DEFAULT false,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX posts_published_publication_date_idx
  ON public.posts (published_at DESC NULLS LAST, created_at DESC)
  WHERE published = true;

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published posts are publicly readable"
  ON public.posts
  FOR SELECT
  TO anon, authenticated
  USING (published = true);

GRANT SELECT ON public.posts TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.posts TO service_role;
