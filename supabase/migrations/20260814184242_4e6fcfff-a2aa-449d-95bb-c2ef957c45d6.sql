CREATE TABLE public.agent_threads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  title text NOT NULL DEFAULT 'New chat',
  pinned boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.agent_threads TO anon, authenticated;
GRANT ALL ON public.agent_threads TO service_role;
ALTER TABLE public.agent_threads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Demo threads are public" ON public.agent_threads FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.agent_messages ADD COLUMN IF NOT EXISTS thread_id uuid REFERENCES public.agent_threads(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS agent_messages_thread_idx ON public.agent_messages(thread_id, created_at);
CREATE INDEX IF NOT EXISTS agent_threads_session_idx ON public.agent_threads(session_id, updated_at DESC);