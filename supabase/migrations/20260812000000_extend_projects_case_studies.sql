ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS problem text,
  ADD COLUMN IF NOT EXISTS approach text,
  ADD COLUMN IF NOT EXISTS key_features text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS stack text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS outcome text,
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'Live',
  ADD COLUMN IF NOT EXISTS live_url text,
  ADD COLUMN IF NOT EXISTS github_url text,
  ADD COLUMN IF NOT EXISTS cover_image_url text,
  ADD COLUMN IF NOT EXISTS sort_order integer NOT NULL DEFAULT 0;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conrelid = 'public.projects'::regclass
      AND conname = 'projects_status_check'
  ) THEN
    ALTER TABLE public.projects
      ADD CONSTRAINT projects_status_check
      CHECK (status IN ('Live', 'In Progress', 'Archived'));
  END IF;
END
$$;
