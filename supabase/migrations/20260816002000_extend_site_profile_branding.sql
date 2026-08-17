ALTER TABLE public.site_profile
  ADD COLUMN hero_tagline text NOT NULL DEFAULT 'Translating ideas into AI products.',
  ADD COLUMN hero_supporting text NOT NULL DEFAULT 'A personal space for products, writing, experiments, and ideas in progress.',
  ADD COLUMN connect_cta text NOT NULL DEFAULT 'Connect for work',
  ADD COLUMN github_url text NOT NULL DEFAULT 'https://github.com/sauravoole-ai',
  ADD COLUMN linkedin_url text NOT NULL DEFAULT 'https://www.linkedin.com/in/saurav-kumarjha/',
  ADD COLUMN instagram_url text NOT NULL DEFAULT 'https://www.instagram.com/sauravjha_ai/',
  ADD COLUMN bio_fragments jsonb NOT NULL DEFAULT '["I’m Saurav Kumar Jha, an AI Product Builder and B.Tech student in Electronics and Communication Engineering at Tezpur University.", "Most of my work centres on taking practical or creative ideas and shaping them into usable AI products through an AI-assisted development process.", "I continue to learn through the products I build. Previous experience includes a Web Development Internship with InAmigos Foundation, and this site is where the work, experiments, and writing come together."]'::jsonb,
  ADD COLUMN capabilities jsonb NOT NULL DEFAULT '[{"title":"AI Product Development","description":"Turning ideas into usable AI-powered applications through AI-assisted development."},{"title":"Applied AI Integration","description":"LLMs, retrieval, structured outputs, and conversational AI integrated into product workflows."},{"title":"Connected & AIoT Projects","description":"AI-enabled applications involving sensor workflows, connected devices, and hardware prototyping."}]'::jsonb,
  ADD COLUMN technology_groups jsonb NOT NULL DEFAULT '[{"title":"AI, LLM & Retrieval","items":[{"label":"LLM Integration","content":"Groq API · Gemini API · Prompt Engineering · Structured Outputs · Conversational Flows"},{"label":"Retrieval & Grounding","content":"Embeddings · Vector Search · Evidence Retrieval · Retrieval-grounded Analysis"},{"label":"Applied AI Patterns","content":"Document Analysis · Classification & Scoring · Conversational Assistants · Context-aware Generation"}]},{"title":"Languages & Web","items":[{"label":null,"content":"Python · TypeScript · JavaScript · HTML · CSS"}]},{"title":"Application Frameworks & UI","items":[{"label":null,"content":"Flask · FastAPI · React · TanStack Start / Router / Query · Tailwind CSS"}]},{"title":"Data, APIs & Documents","items":[{"label":null,"content":"Supabase · Auth · Postgres · RLS · Migrations · REST APIs · pypdf · ReportLab"}]},{"title":"AI-Assisted Product Development","items":[{"label":null,"content":"ChatGPT · Claude · Codex · Lovable"}]},{"title":"Development, Testing & Delivery","items":[{"label":null,"content":"VS Code · Git · GitHub · Postman · Node.js / npm · Render"}]},{"title":"Connected Systems & AIoT","items":[{"label":null,"content":"MCU boards such as ESP32 · Sensors · Display modules · Arduino IDE · AIoT prototyping"}]}]'::jsonb,
  ADD CONSTRAINT site_profile_hero_tagline_length_check CHECK (char_length(hero_tagline) BETWEEN 1 AND 160),
  ADD CONSTRAINT site_profile_hero_supporting_length_check CHECK (char_length(hero_supporting) BETWEEN 1 AND 300),
  ADD CONSTRAINT site_profile_connect_cta_length_check CHECK (char_length(connect_cta) BETWEEN 1 AND 80),
  ADD CONSTRAINT site_profile_social_url_length_check CHECK (
    char_length(github_url) BETWEEN 1 AND 500
    AND char_length(linkedin_url) BETWEEN 1 AND 500
    AND char_length(instagram_url) BETWEEN 1 AND 500
  ),
  ADD CONSTRAINT site_profile_bio_fragments_array_check CHECK (jsonb_typeof(bio_fragments) = 'array'),
  ADD CONSTRAINT site_profile_capabilities_array_check CHECK (jsonb_typeof(capabilities) = 'array'),
  ADD CONSTRAINT site_profile_technology_groups_array_check CHECK (jsonb_typeof(technology_groups) = 'array');
