ALTER TABLE public.projects
  ADD COLUMN show_in_product_launcher boolean NOT NULL DEFAULT false,
  ADD COLUMN product_sort_order integer NOT NULL DEFAULT 0;

UPDATE public.projects
SET
  show_in_product_launcher = true,
  product_sort_order = sort_order
WHERE published IS TRUE
  AND NULLIF(BTRIM(live_url), '') IS NOT NULL;
