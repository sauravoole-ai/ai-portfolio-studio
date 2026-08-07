CREATE TABLE public.admin_users (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Authenticated users may only verify whether their own account
-- is present in the Studio admin allowlist.
CREATE POLICY "Users can check their own admin membership"
  ON public.admin_users
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Do not allow browser users to modify the admin allowlist.
REVOKE ALL ON public.admin_users FROM anon, authenticated;
GRANT SELECT ON public.admin_users TO authenticated;

-- Server-side service role retains explicit CRUD access.
GRANT SELECT, INSERT, UPDATE, DELETE
  ON public.admin_users
  TO service_role;


-- Central Studio authorization helper.
-- SECURITY DEFINER allows the function to check the private allowlist
-- without exposing all admin_users rows to authenticated clients.
CREATE OR REPLACE FUNCTION public.is_studio_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_users
    WHERE user_id = auth.uid()
  );
$$;

REVOKE ALL
  ON FUNCTION public.is_studio_admin()
  FROM PUBLIC;

GRANT EXECUTE
  ON FUNCTION public.is_studio_admin()
  TO authenticated;


-- ============================================================
-- POSTS — Studio admin CRUD
-- Existing public policy allowing published posts to be read
-- remains untouched.
-- ============================================================

CREATE POLICY "Admins can read all posts"
  ON public.posts
  FOR SELECT
  TO authenticated
  USING (public.is_studio_admin());

CREATE POLICY "Admins can create posts"
  ON public.posts
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_studio_admin());

CREATE POLICY "Admins can update posts"
  ON public.posts
  FOR UPDATE
  TO authenticated
  USING (public.is_studio_admin())
  WITH CHECK (public.is_studio_admin());

CREATE POLICY "Admins can delete posts"
  ON public.posts
  FOR DELETE
  TO authenticated
  USING (public.is_studio_admin());

GRANT SELECT, INSERT, UPDATE, DELETE
  ON public.posts
  TO authenticated;


-- ============================================================
-- PROJECTS — Studio admin CRUD
-- Existing public published-project read policy remains untouched.
-- ============================================================

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read all projects"
  ON public.projects
  FOR SELECT
  TO authenticated
  USING (public.is_studio_admin());

CREATE POLICY "Admins can create projects"
  ON public.projects
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_studio_admin());

CREATE POLICY "Admins can update projects"
  ON public.projects
  FOR UPDATE
  TO authenticated
  USING (public.is_studio_admin())
  WITH CHECK (public.is_studio_admin());

CREATE POLICY "Admins can delete projects"
  ON public.projects
  FOR DELETE
  TO authenticated
  USING (public.is_studio_admin());

GRANT SELECT, INSERT, UPDATE, DELETE
  ON public.projects
  TO authenticated;