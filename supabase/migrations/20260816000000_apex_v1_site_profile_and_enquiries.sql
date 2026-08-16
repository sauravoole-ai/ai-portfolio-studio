CREATE TABLE public.site_profile (
  id boolean PRIMARY KEY DEFAULT true,
  name text NOT NULL,
  role text NOT NULL,
  location text NOT NULL,
  degree text NOT NULL,
  university text NOT NULL,
  graduation_year text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT site_profile_singleton_check CHECK (id),
  CONSTRAINT site_profile_name_length_check CHECK (char_length(name) BETWEEN 1 AND 100),
  CONSTRAINT site_profile_role_length_check CHECK (char_length(role) BETWEEN 1 AND 100),
  CONSTRAINT site_profile_location_length_check CHECK (char_length(location) BETWEEN 1 AND 100),
  CONSTRAINT site_profile_degree_length_check CHECK (char_length(degree) BETWEEN 1 AND 160),
  CONSTRAINT site_profile_university_length_check CHECK (char_length(university) BETWEEN 1 AND 160),
  CONSTRAINT site_profile_graduation_year_check CHECK (graduation_year ~ '^[0-9]{4}$')
);

INSERT INTO public.site_profile (name, role, location, degree, university, graduation_year)
VALUES (
  'Saurav Kumar Jha',
  'AI Product Builder',
  'India',
  'B.Tech in Electronics & Communication Engineering',
  'Tezpur University',
  '2027'
);

ALTER TABLE public.site_profile ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read site profile"
  ON public.site_profile FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can update site profile"
  ON public.site_profile FOR UPDATE TO authenticated
  USING (public.is_studio_admin())
  WITH CHECK (public.is_studio_admin() AND id);

REVOKE ALL ON public.site_profile FROM anon, authenticated;
GRANT SELECT ON public.site_profile TO anon, authenticated;
GRANT UPDATE ON public.site_profile TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_profile TO service_role;

ALTER TABLE public.contact_messages
  ADD COLUMN project_type text,
  ADD COLUMN build_idea text,
  ADD CONSTRAINT contact_messages_project_type_length_check
    CHECK (project_type IS NULL OR char_length(project_type) BETWEEN 1 AND 100),
  ADD CONSTRAINT contact_messages_build_idea_length_check
    CHECK (build_idea IS NULL OR char_length(build_idea) BETWEEN 1 AND 2000);

ALTER POLICY "Anyone can submit contact messages"
  ON public.contact_messages
  WITH CHECK (
    status = 'New'
    AND build_idea IS NOT NULL
    AND char_length(build_idea) BETWEEN 1 AND 2000
  );
