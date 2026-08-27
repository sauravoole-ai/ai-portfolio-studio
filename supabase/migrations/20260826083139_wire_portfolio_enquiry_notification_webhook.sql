CREATE EXTENSION IF NOT EXISTS pg_net;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM vault.secrets
    WHERE name = 'portfolio_enquiry_webhook_secret'
  ) THEN
    PERFORM vault.create_secret(
      gen_random_uuid()::text || gen_random_uuid()::text,
      'portfolio_enquiry_webhook_secret',
      'Authenticates contact_messages insert notifications to the portfolio enquiry Edge Function.'
    );
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.verify_portfolio_enquiry_webhook(candidate text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM vault.decrypted_secrets
    WHERE name = 'portfolio_enquiry_webhook_secret'
      AND decrypted_secret = candidate
  );
$$;

REVOKE ALL ON FUNCTION public.verify_portfolio_enquiry_webhook(text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.verify_portfolio_enquiry_webhook(text) TO service_role;

CREATE OR REPLACE FUNCTION public.notify_portfolio_enquiry_insert()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  webhook_secret text;
BEGIN
  SELECT decrypted_secret
  INTO webhook_secret
  FROM vault.decrypted_secrets
  WHERE name = 'portfolio_enquiry_webhook_secret';

  IF webhook_secret IS NULL THEN
    RAISE WARNING 'Portfolio enquiry notification secret is unavailable.';
    RETURN NEW;
  END IF;

  PERFORM net.http_post(
    url := 'https://xmrxwbungwpdlhdyxcdp.supabase.co/functions/v1/notify-portfolio-enquiry',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-portfolio-webhook-secret', webhook_secret
    ),
    body := jsonb_build_object(
      'type', 'INSERT',
      'table', TG_TABLE_NAME,
      'schema', TG_TABLE_SCHEMA,
      'record', jsonb_build_object('id', NEW.id),
      'old_record', NULL
    ),
    timeout_milliseconds := 5000
  );

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Portfolio enquiry notification queueing failed: %', SQLERRM;
    RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.notify_portfolio_enquiry_insert() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.notify_portfolio_enquiry_insert() TO service_role;

DROP TRIGGER IF EXISTS notify_portfolio_enquiry_after_insert ON public.contact_messages;

CREATE TRIGGER notify_portfolio_enquiry_after_insert
AFTER INSERT ON public.contact_messages
FOR EACH ROW
EXECUTE FUNCTION public.notify_portfolio_enquiry_insert();
