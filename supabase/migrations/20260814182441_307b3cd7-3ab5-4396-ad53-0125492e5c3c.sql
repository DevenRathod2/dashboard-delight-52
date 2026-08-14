CREATE TABLE public.agent_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  message_id TEXT,
  role TEXT NOT NULL,
  parts JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX agent_messages_session_created_idx ON public.agent_messages (session_id, created_at);

GRANT SELECT, INSERT, DELETE ON public.agent_messages TO anon;
GRANT SELECT, INSERT, DELETE ON public.agent_messages TO authenticated;
GRANT ALL ON public.agent_messages TO service_role;

ALTER TABLE public.agent_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read agent messages" ON public.agent_messages FOR SELECT USING (true);
CREATE POLICY "Anyone can add agent messages" ON public.agent_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can delete agent messages" ON public.agent_messages FOR DELETE USING (true);