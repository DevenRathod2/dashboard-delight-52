import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import {
  Sparkle,
  UserPlus,
  CalendarPlus,
  ImageUp,
  Link2,
  Receipt,
  Gauge,
  FolderPlus,
} from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";
import { Tool, ToolContent, ToolHeader, ToolInput } from "@/components/ai-elements/tool";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { ToolResultCard } from "@/components/agent/ToolResultCard";
import { ThreadRail, type AgentThread } from "@/components/agent/ThreadRail";
import { cn } from "@/lib/utils";
import lensLogo from "@/assets/agent-lens.png";

const SESSION_KEY = "lensly.agent.session";

const getSessionId = () => {
  try {
    let id = localStorage.getItem(SESSION_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return "anonymous";
  }
};

const TOOL_LABELS: Record<string, string> = {
  create_client: "Adding client",
  create_event: "Creating event",
  create_collection: "Creating collection",
  upload_media: "Uploading media",
  share_gallery: "Sharing gallery",
  create_invoice: "Drafting invoice",
  send_invoice: "Sending invoice",
  get_billing_usage: "Reading billing usage",
  list_events: "Listing events",
};

const QUICK_ACTIONS = [
  {
    icon: UserPlus,
    label: "Add client",
    hint: "New CRM contact",
    tint: "from-sky-500 to-cyan-400",
    prompt: "Add a new client: Aanya Mehra, +91 98200 11223, aanya@example.com",
  },
  {
    icon: CalendarPlus,
    label: "Create event",
    hint: "Shoot & date",
    tint: "from-primary to-primary-glow",
    prompt: "Create a wedding event for Aanya & Rohan on 24 Apr in Udaipur",
  },
  {
    icon: FolderPlus,
    label: "New collection",
    hint: "Album inside event",
    tint: "from-violet-500 to-fuchsia-400",
    prompt: "Add a 'Day 1 — Haldi' collection to the Aanya & Rohan wedding",
  },
  {
    icon: ImageUp,
    label: "Upload photos",
    hint: "Bulk media",
    tint: "from-emerald-500 to-teal-400",
    prompt: "Upload 250 photos to the Day 1 collection",
  },
  {
    icon: Link2,
    label: "Share gallery",
    hint: "Client link",
    tint: "from-amber-500 to-orange-400",
    prompt: "Share the client gallery for the Aanya & Rohan wedding with a PIN",
  },
  {
    icon: Receipt,
    label: "Create invoice",
    hint: "Bill a client",
    tint: "from-rose-500 to-pink-400",
    prompt: "Draft an invoice for Deven Rathod: wedding package ₹1,20,000 + album ₹18,000",
  },
  {
    icon: Gauge,
    label: "Usage report",
    hint: "Storage & credits",
    tint: "from-indigo-500 to-blue-400",
    prompt: "How much storage and AI credit have I used this month?",
  },
];

const Agent = () => {
  const sessionId = useMemo(getSessionId, []);
  const { threadId } = useParams();
  const navigate = useNavigate();
  const [threads, setThreads] = useState<AgentThread[]>([]);
  const [initial, setInitial] = useState<UIMessage[] | null>(null);

  const loadThreads = useCallback(async () => {
    const { data, error } = await supabase
      .from("agent_threads")
      .select("id, title, pinned, updated_at")
      .eq("session_id", sessionId)
      .order("updated_at", { ascending: false });
    if (error) {
      console.error("load threads failed", error);
      return;
    }
    setThreads((data ?? []) as AgentThread[]);
  }, [sessionId]);

  // Every chat lives at its own URL; a fresh id is minted for /agent.
  useEffect(() => {
    if (!threadId) navigate(`/agent/${crypto.randomUUID()}`, { replace: true });
  }, [threadId, navigate]);

  useEffect(() => {
    loadThreads();
  }, [loadThreads]);

  useEffect(() => {
    if (!threadId) return;
    let active = true;
    setInitial(null);
    (async () => {
      const { data, error } = await supabase
        .from("agent_messages")
        .select("id, message_id, role, parts")
        .eq("thread_id", threadId)
        .order("created_at", { ascending: true });
      if (!active) return;
      if (error) {
        console.error("load history failed", error);
        setInitial([]);
        return;
      }
      setInitial(
        (data ?? []).map((row) => ({
          id: row.message_id ?? row.id,
          role: row.role as UIMessage["role"],
          parts: (row.parts ?? []) as UIMessage["parts"],
        })),
      );
    })();
    return () => {
      active = false;
    };
  }, [threadId]);

  const pinThread = async (t: AgentThread) => {
    setThreads((prev) => prev.map((x) => (x.id === t.id ? { ...x, pinned: !t.pinned } : x)));
    const { error } = await supabase.from("agent_threads").update({ pinned: !t.pinned }).eq("id", t.id);
    if (error) {
      toast.error("Could not update pin");
      loadThreads();
    }
  };

  const deleteThread = async (id: string) => {
    const { error } = await supabase.from("agent_threads").delete().eq("id", id);
    if (error) {
      toast.error("Could not delete chat");
      return;
    }
    setThreads((prev) => prev.filter((t) => t.id !== id));
    toast.success("Chat deleted");
    if (id === threadId) navigate(`/agent/${crypto.randomUUID()}`, { replace: true });
  };

  return (
    <DashboardLayout>
      <div className="flex gap-4 h-[calc(100vh-8rem)]">
        <ThreadRail
          threads={threads}
          activeId={threadId}
          onNew={() => navigate(`/agent/${crypto.randomUUID()}`)}
          onOpen={(id) => navigate(`/agent/${id}`)}
          onPin={pinThread}
          onDelete={deleteThread}
        />

        {!threadId || !initial ? (
          <div className="flex-1 grid place-items-center text-sm text-muted-foreground">
            Waking up your studio assistant…
          </div>
        ) : (
          <AgentChat
            key={threadId}
            sessionId={sessionId}
            threadId={threadId}
            initialMessages={initial}
            knownThread={threads.some((t) => t.id === threadId)}
            onThreadsChanged={loadThreads}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

const AgentChat = ({
  sessionId,
  threadId,
  initialMessages,
  knownThread,
  onThreadsChanged,
}: {
  sessionId: string;
  threadId: string;
  initialMessages: UIMessage[];
  knownThread: boolean;
  onThreadsChanged: () => void;
}) => {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const createdRef = useRef(knownThread);

  const { messages, sendMessage, status, stop, error } = useChat({
    id: threadId,
    messages: initialMessages,
    transport: new DefaultChatTransport({
      api: `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/agent-chat`,
      headers: {
        "Content-Type": "application/json",
        apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: { sessionId, threadId },
    }),
  });

  const focus = () => textareaRef.current?.focus();

  useEffect(() => {
    focus();
  }, []);

  useEffect(() => {
    if (status === "ready") {
      focus();
      onThreadsChanged();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  useEffect(() => {
    if (error) toast.error(error.message || "The assistant could not respond. Please try again.");
  }, [error]);

  const send = async (text: string) => {
    const value = text.trim();
    if (!value || status === "streaming" || status === "submitted") return;

    if (!createdRef.current) {
      createdRef.current = true;
      const { error: insErr } = await supabase
        .from("agent_threads")
        .insert({ id: threadId, session_id: sessionId, title: "New chat" });
      if (insErr && insErr.code !== "23505") {
        createdRef.current = false;
        console.error("create thread failed", insErr);
        toast.error("Could not start this chat.");
        return;
      }
      onThreadsChanged();
    }

    sendMessage({ text: value });
    setInput("");
    requestAnimationFrame(focus);
  };

  const empty = messages.length === 0;

  const composer = (
    <PromptInput
      className={cn("rounded-2xl shadow-card", empty ? "w-full" : "mt-4 shrink-0")}
      onSubmit={(message) => send(message.text ?? input)}
    >
      <PromptInputTextarea
        ref={textareaRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask Lens to create an event, upload photos, share a gallery, bill a client…"
      />
      <PromptInputFooter className="justify-end">
        <PromptInputSubmit
          status={status}
          onStop={stop}
          disabled={!input.trim() && status !== "streaming" && status !== "submitted"}
        />
      </PromptInputFooter>
    </PromptInput>
  );

  if (empty) {
    return (
      <div className="flex-1 min-w-0 rounded-3xl border border-border/60 bg-card/40 backdrop-blur-xl overflow-y-auto">
        <div className="mx-auto flex min-h-full w-full max-w-2xl flex-col justify-center px-5 py-10">
          <div className="text-center">
            <img
              src={lensLogo}
              alt="Lens studio assistant"
              width={512}
              height={512}
              className="mx-auto size-14 rounded-2xl shadow-glow"
            />
            <h1 className="mt-4 font-display text-2xl font-bold">
              What should we get <span className="gradient-text">done today?</span>
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Lens runs your studio by chat — clients, events, uploads, galleries and invoices.
            </p>
          </div>

          <div className="mt-6">{composer}</div>

          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            {QUICK_ACTIONS.map((a) => (
              <button
                key={a.label}
                onClick={() => send(a.prompt)}
                className="group flex items-center gap-3 rounded-2xl border border-border/60 bg-background/40 px-3 py-2.5 text-left transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:bg-secondary/60"
              >
                <span
                  className={cn(
                    "grid size-8 shrink-0 place-items-center rounded-xl bg-gradient-to-br text-white shadow-card",
                    a.tint,
                  )}
                >
                  <a.icon className="size-4" />
                </span>
                <span className="min-w-0">
                  <span className="block text-xs font-medium">{a.label}</span>
                  <span className="block truncate text-[11px] text-muted-foreground">{a.hint}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 min-w-0 flex-col">
      <Conversation className="flex-1 min-h-0 rounded-3xl border border-border/60 bg-card/40 backdrop-blur-xl">
        <ConversationContent className="mx-auto w-full max-w-3xl px-4 py-6 md:px-8">
          {messages.map((m) => (
            <Message from={m.role} key={m.id}>
              <MessageContent className={m.role === "assistant" ? "w-full max-w-2xl" : undefined}>
                {m.parts.map((part, i) => {
                  if (part.type === "text") {
                    return m.role === "assistant" ? (
                      <MessageResponse key={i}>{part.text}</MessageResponse>
                    ) : (
                      <p key={i} className="whitespace-pre-wrap">
                        {part.text}
                      </p>
                    );
                  }

                  if (part.type.startsWith("tool-")) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const p = part as any;
                    const name = part.type.replace("tool-", "");
                    const label = TOOL_LABELS[name] ?? name;

                    if (p.state === "output-available") {
                      return (
                        <div key={i} className="space-y-2 w-full">
                          <ToolResultCard name={name} output={p.output} />
                          <Tool defaultOpen={false}>
                            <ToolHeader type={part.type as never} state={p.state} title={label} />
                            <ToolContent>
                              <ToolInput input={p.input} />
                            </ToolContent>
                          </Tool>
                        </div>
                      );
                    }

                    if (p.state === "output-error") {
                      return (
                        <div
                          key={i}
                          className="rounded-xl border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive"
                        >
                          {label} failed: {p.errorText}
                        </div>
                      );
                    }

                    return (
                      <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Sparkle className="size-3.5 animate-pulse text-primary" />
                        <Shimmer>{`${label}…`}</Shimmer>
                      </div>
                    );
                  }

                  return null;
                })}
              </MessageContent>
            </Message>
          ))}

          {status === "submitted" && (
            <Message from="assistant">
              <MessageContent>
                <Shimmer>Thinking…</Shimmer>
              </MessageContent>
            </Message>
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <div className="mx-auto w-full max-w-3xl">{composer}</div>
    </div>
  );
};

export default Agent;
