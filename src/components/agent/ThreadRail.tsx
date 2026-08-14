import { Pin, PinOff, Plus, Search, Trash2, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export type AgentThread = {
  id: string;
  title: string;
  pinned: boolean;
  updated_at: string;
};

const timeAgo = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.round(diff / 60000);
  if (m < 1) return "now";
  if (m < 60) return `${m}m`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h`;
  return `${Math.round(h / 24)}d`;
};

const Row = ({
  thread,
  active,
  onOpen,
  onPin,
  onDelete,
}: {
  thread: AgentThread;
  active: boolean;
  onOpen: () => void;
  onPin: () => void;
  onDelete: () => void;
}) => (
  <div
    className={cn(
      "group/row relative flex items-center gap-2 rounded-xl pl-2.5 pr-1 py-2 transition-colors",
      active ? "bg-primary/10 text-foreground" : "hover:bg-secondary/70 text-muted-foreground",
    )}
  >
    {active && <span className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full bg-primary" />}
    <button onClick={onOpen} className="min-w-0 flex-1 text-left">
      <span className={cn("block truncate text-xs", active && "font-medium")}>{thread.title}</span>
    </button>
    <span className="text-[10px] tabular-nums text-muted-foreground/70 group-hover/row:hidden">
      {timeAgo(thread.updated_at)}
    </span>
    <span className="hidden items-center gap-0.5 group-hover/row:flex">
      <button
        onClick={onPin}
        aria-label={thread.pinned ? "Unpin chat" : "Pin chat"}
        className="grid size-6 place-items-center rounded-lg hover:bg-background/80 hover:text-foreground"
      >
        {thread.pinned ? <PinOff className="size-3.5" /> : <Pin className="size-3.5" />}
      </button>
      <button
        onClick={onDelete}
        aria-label="Delete chat"
        className="grid size-6 place-items-center rounded-lg hover:bg-destructive/10 hover:text-destructive"
      >
        <Trash2 className="size-3.5" />
      </button>
    </span>
  </div>
);

export const ThreadRail = ({
  threads,
  activeId,
  onNew,
  onOpen,
  onPin,
  onDelete,
}: {
  threads: AgentThread[];
  activeId?: string;
  onNew: () => void;
  onOpen: (id: string) => void;
  onPin: (t: AgentThread) => void;
  onDelete: (id: string) => void;
}) => {
  const [q, setQ] = useState("");
  const filtered = threads.filter((t) => t.title.toLowerCase().includes(q.toLowerCase()));
  const pinned = filtered.filter((t) => t.pinned);
  const rest = filtered.filter((t) => !t.pinned);

  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col gap-3 rounded-3xl border border-border/60 bg-card/40 backdrop-blur-xl p-3">
      <Button onClick={onNew} className="w-full rounded-xl justify-start gap-2 h-9 text-xs">
        <Plus className="size-4" /> New chat
      </Button>

      <div className="relative">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search chats"
          className="w-full rounded-xl border border-border/60 bg-background/50 pl-8 pr-2 py-1.5 text-xs outline-none focus:border-primary/50"
        />
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto space-y-4 pr-0.5">
        {pinned.length > 0 && (
          <div className="space-y-1">
            <p className="px-2 text-[10px] uppercase tracking-widest text-muted-foreground/80">Pinned</p>
            {pinned.map((t) => (
              <Row
                key={t.id}
                thread={t}
                active={t.id === activeId}
                onOpen={() => onOpen(t.id)}
                onPin={() => onPin(t)}
                onDelete={() => onDelete(t.id)}
              />
            ))}
          </div>
        )}

        <div className="space-y-1">
          <p className="px-2 text-[10px] uppercase tracking-widest text-muted-foreground/80">Recent</p>
          {rest.length === 0 ? (
            <p className="px-2 py-6 text-center text-xs text-muted-foreground/70">
              <MessageSquare className="mx-auto mb-2 size-4 opacity-60" />
              No chats yet
            </p>
          ) : (
            rest.map((t) => (
              <Row
                key={t.id}
                thread={t}
                active={t.id === activeId}
                onOpen={() => onOpen(t.id)}
                onPin={() => onPin(t)}
                onDelete={() => onDelete(t.id)}
              />
            ))
          )}
        </div>
      </div>
    </aside>
  );
};
