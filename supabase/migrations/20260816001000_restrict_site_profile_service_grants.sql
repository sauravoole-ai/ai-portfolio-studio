REVOKE ALL ON public.site_profile FROM service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_profile TO service_role;
