ALTER TABLE public.site_profile
  ADD COLUMN home_bridge_text text NOT NULL DEFAULT 'Some ideas become products. Others become writing, experiments, or questions worth following.',
  ADD COLUMN home_work_blurb text NOT NULL DEFAULT 'Products, prototypes, and applied AI in practice.',
  ADD COLUMN home_journal_blurb text NOT NULL DEFAULT 'Writing, observations, experiments, and ideas in progress.',
  ADD COLUMN footer_connect_context text NOT NULL DEFAULT 'AI product builds, prototypes, and product-focused collaboration.',
  ADD CONSTRAINT site_profile_home_bridge_text_length_check CHECK (char_length(home_bridge_text) BETWEEN 1 AND 300),
  ADD CONSTRAINT site_profile_home_work_blurb_length_check CHECK (char_length(home_work_blurb) BETWEEN 1 AND 200),
  ADD CONSTRAINT site_profile_home_journal_blurb_length_check CHECK (char_length(home_journal_blurb) BETWEEN 1 AND 200),
  ADD CONSTRAINT site_profile_footer_connect_context_length_check CHECK (char_length(footer_connect_context) BETWEEN 1 AND 200);
