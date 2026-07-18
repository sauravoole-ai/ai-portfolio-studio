ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS slug text;
CREATE UNIQUE INDEX IF NOT EXISTS projects_slug_key ON public.projects(slug) WHERE slug IS NOT NULL;
GRANT SELECT ON public.projects TO anon;
GRANT SELECT ON public.projects TO authenticated;
GRANT ALL ON public.projects TO service_role;