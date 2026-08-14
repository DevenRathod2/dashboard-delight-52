import { useEffect, useMemo, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { Trash2, Sparkle } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
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

const SUGGESTIONS = [
  "Create a wedding event for a new client, Aanya & Rohan, on 24 Apr",
  "Upload 250 photos to the Day 1 collection and share the gallery",
  "Draft an invoice for Deven Rathod: wedding package ₹1,20,000 + album ₹18,000",
  "How much storage and AI credit have I used this month?",
];

const Agent = () => {
  const sessionId = useMemo(getSessionId, []);
  const [initial, setInitial] = useState<UIMessage[] | null>(null);
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data, error } = await supabase
        .from("agent_messages")
        .select("id, message_id, role, parts")
        .eq("session_id", sessionId)
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
  }, [sessionId]);

  if (!initial) {
    return (
      <DashboardLayout>
        <div className="h-[60vh] grid place-items-center text-sm text-muted-foreground">
          Waking up your studio assistant…
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <AgentChat
        key={sessionId}
        sessionId={sessionId}
        initialMessages={initial}
        input={input}
        setInput={setInput}
        textareaRef={textareaRef}
      />
    </DashboardLayout>
  );
};

const AgentChat = ({
  sessionId,
  initialMessages,
  input,
  setInput,
  textareaRef,
}: {
  sessionId: string;
  initialMessages: UIMessage[];
  input: string;
  setInput: (v: string) => void;
  textareaRef: React.MutableRefObject<HTMLTextAreaElement | null>;
}) => {
  const { messages, sendMessage, status, stop, setMessages, error } = useChat({
    id: sessionId,
    messages: initialMessages,
    transport: new DefaultChatTransport({
      api: `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/agent-chat`,
      headers: {
        "Content-Type": "application/json",
        apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: { sessionId },
    }),
  });

  const focus = () => textareaRef.current?.focus();

  useEffect(() => {
    focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (status === "ready") focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  useEffect(() => {
    if (error) toast.error(error.message || "The assistant could not respond. Please try again.");
  }, [error]);

  const send = (text: string) => {
    const value = text.trim();
    if (!value || status === "streaming" || status === "submitted") return;
    sendMessage({ text: value });
    setInput("");
    requestAnimationFrame(focus);
  };

  const clearChat = async () => {
    const { error: delError } = await supabase.from("agent_messages").delete().eq("session_id", sessionId);
    if (delError) {
      toast.error("Could not clear the conversation.");
      return;
    }
    setMessages([]);
    toast.success("Conversation cleared");
    focus();
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-aurora border border-border/60 px-5 py-4 mb-4 shrink-0">
        <div className="absolute -top-16 -right-10 size-56 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
        <div className="relative flex items-center gap-3">
          <img src={lensLogo} alt="Lens assistant" width={512} height={512} className="size-11 rounded-2xl shadow-glow" />
          <div className="min-w-0">
            <h1 className="font-display font-bold text-lg leading-none">
              Lens <span className="gradient-text">Studio Agent</span>
            </h1>
            <p className="text-xs text-muted-foreground mt-1.5">
              Runs your studio by chat — clients, events, uploads, galleries and invoices.
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearChat}
            disabled={messages.length === 0}
            className="ml-auto rounded-xl text-muted-foreground shrink-0"
          >
            <Trash2 className="size-4 mr-1.5" /> Clear
          </Button>
        </div>
      </div>

      {/* Transcript */}
      <Conversation className="flex-1 min-h-0 rounded-3xl border border-border/60 bg-card/40 backdrop-blur-xl">
        <ConversationContent className="px-4 py-6 md:px-8">
          {messages.length === 0 ? (
            <ConversationEmptyState
              className="min-h-[40vh]"
              icon={<img src={lensLogo} alt="" width={512} height={512} loading="lazy" className="size-14" />}
              title="What should we get done today?"
              description="Ask Lens to set up a shoot, upload media, share a gallery or bill a client."
            />
          ) : (
            messages.map((m) => (
              <Message from={m.role} key={m.id}>
                <MessageContent>
                  {m.parts.map((part, i) => {
                    if (part.type === "text") {
                      return m.role === "assistant" ? (
                        <MessageResponse key={i}>{part.text}</MessageResponse>
                      ) : (
                        <p key={i} className="whitespace-pre-wrap">{part.text}</p>
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
                          <div key={i} className="rounded-xl border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">
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
            ))
          )}

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

      {/* Suggestions */}
      {messages.length === 0 && (
        <div className="flex flex-wrap gap-2 mt-4 shrink-0">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              className="text-xs text-left rounded-xl border border-border/60 bg-card/60 backdrop-blur-md px-3 py-2 hover:bg-secondary transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Composer */}
      <PromptInput
        className="mt-4 shrink-0 rounded-2xl"
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
    </div>
  );
};

export default Agent;
