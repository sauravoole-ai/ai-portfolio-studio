CREATE TABLE public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'New',
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT contact_messages_status_check CHECK (status IN ('New', 'Read', 'Archived')),
  CONSTRAINT contact_messages_name_length_check CHECK (char_length(name) BETWEEN 1 AND 100),
  CONSTRAINT contact_messages_email_length_check CHECK (char_length(email) BETWEEN 3 AND 254),
  CONSTRAINT contact_messages_message_length_check CHECK (char_length(message) BETWEEN 1 AND 5000)
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit contact messages"
  ON public.contact_messages FOR INSERT TO anon, authenticated
  WITH CHECK (status = 'New');

CREATE POLICY "Admins can read contact messages"
  ON public.contact_messages FOR SELECT TO authenticated
  USING (public.is_studio_admin());

CREATE POLICY "Admins can update contact messages"
  ON public.contact_messages FOR UPDATE TO authenticated
  USING (public.is_studio_admin())
  WITH CHECK (public.is_studio_admin());

CREATE POLICY "Admins can delete contact messages"
  ON public.contact_messages FOR DELETE TO authenticated
  USING (public.is_studio_admin());

REVOKE ALL ON public.contact_messages FROM anon, authenticated;
GRANT INSERT ON public.contact_messages TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.contact_messages TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.contact_messages TO service_role;
