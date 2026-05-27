import { useCallback, useEffect, useRef, useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  UploadCloud, FolderUp, Image as ImageIcon, Video, FileUp,
  CheckCircle2, X, Loader2, Trash2, Play, Pause, Sparkles, Gem,
  Wand2, ArrowLeft, Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export type UploadMode = "image" | "video";
export type Quality = "compressed" | "original";
type Stage = "select" | "quality" | "processing" | "uploading" | "done";

type Item = {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  preview?: string;
  processed: number; // 0-100
  progress: number;  // 0-100 upload
  status: "queued" | "processing" | "ready" | "uploading" | "paused" | "done" | "error";
};

const formatBytes = (b: number) => {
  if (!b) return "0 B";
  const k = 1024, u = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(b) / Math.log(k));
  return `${(b / Math.pow(k, i)).toFixed(i ? 1 : 0)} ${u[i]}`;
};

const uid = () => Math.random().toString(36).slice(2, 10);

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  mode: UploadMode;
  onComplete?: (files: File[]) => void;
}

export const UploadDialog = ({ open, onOpenChange, mode, onComplete }: Props) => {
  const { toast } = useToast();
  const [items, setItems] = useState<Item[]>([]);
  const [dragging, setDragging] = useState(false);
  const [stage, setStage] = useState<Stage>("select");
  const [quality, setQuality] = useState<Quality>("compressed");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const timersRef = useRef<Record<string, number>>({});

  const accept = mode === "video" ? "video/*" : "image/*";
  const title =
    stage === "quality"
      ? "Choose upload quality"
      : stage === "processing"
        ? mode === "video" ? "Processing videos…" : "Processing images…"
        : stage === "uploading" || stage === "done"
          ? mode === "video" ? "Uploading videos" : "Uploading files"
          : mode === "video" ? "Upload Videos" : "Upload Images or Folder";
  const desc =
    stage === "quality"
      ? "Pick how you want your files prepared before they're uploaded to the cloud."
      : stage === "processing"
        ? quality === "compressed"
          ? "We're optimising your files for fast delivery without losing visible detail."
          : "Preparing originals — preserving full resolution and metadata."
        : stage === "uploading" || stage === "done"
          ? "Your files are streaming to secure cloud storage in parallel."
          : mode === "video"
            ? "Drag and drop video files, or browse to add cinematic reels to this collection."
            : "Drag and drop images or an entire folder. Files upload in parallel with live progress.";

  // Cleanup on close
  useEffect(() => {
    if (!open) {
      Object.values(timersRef.current).forEach((t) => window.clearInterval(t));
      timersRef.current = {};
      items.forEach((i) => i.preview && URL.revokeObjectURL(i.preview));
      setItems([]);
      setDragging(false);
      setStage("select");
      setQuality("compressed");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const acceptable = useCallback(
    (f: File) =>
      mode === "video" ? f.type.startsWith("video/") : f.type.startsWith("image/"),
    [mode],
  );

  const addFiles = useCallback(
    (files: FileList | File[]) => {
      const arr = Array.from(files).filter(acceptable);
      if (!arr.length) {
        toast({
          title: "Unsupported files",
          description: `Only ${mode === "video" ? "videos" : "images"} are accepted here.`,
          variant: "destructive",
        });
        return;
      }
      const next: Item[] = arr.map((f) => ({
        id: uid(),
        file: f,
        name: f.name,
        size: f.size,
        type: f.type,
        preview: mode === "image" ? URL.createObjectURL(f) : undefined,
        processed: 0,
        progress: 0,
        status: "queued",
      }));
      setItems((prev) => [...prev, ...next]);
    },
    [acceptable, mode, toast],
  );

  const removeItem = (id: string) => {
    if (timersRef.current[id]) {
      window.clearInterval(timersRef.current[id]);
      delete timersRef.current[id];
    }
    setItems((p) => {
      const x = p.find((i) => i.id === id);
      if (x?.preview) URL.revokeObjectURL(x.preview);
      return p.filter((i) => i.id !== id);
    });
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
  };

  // ---- Processing stage ----
  const startProcessing = (q: Quality) => {
    setQuality(q);
    setStage("processing");
    // mark all queued -> processing
    setItems((p) => p.map((i) => ({ ...i, status: "processing" as const, processed: 0 })));
    // simulate processing for each
    items.forEach((it) => {
      const speed = q === "compressed" ? 14 : 6; // compressed is faster
      const tick = window.setInterval(() => {
        setItems((prev) => {
          const updated = prev.map((i) => {
            if (i.id !== it.id || i.status !== "processing") return i;
            const np = Math.min(100, i.processed + Math.random() * speed + 3);
            if (np >= 100) {
              window.clearInterval(timersRef.current[it.id + ":p"]);
              delete timersRef.current[it.id + ":p"];
              return { ...i, processed: 100, status: "ready" as const };
            }
            return { ...i, processed: np };
          });
          // if all ready -> move to uploading
          if (updated.every((i) => i.status === "ready")) {
            queueMicrotask(() => beginUploads(updated));
          }
          return updated;
        });
      }, 200);
      timersRef.current[it.id + ":p"] = tick;
    });
  };

  // ---- Uploading stage ----
  const beginUploads = (list: Item[]) => {
    setStage("uploading");
    list.forEach((it) => startUpload(it.id));
  };

  const startUpload = (id: string) => {
    const key = id + ":u";
    if (timersRef.current[key]) return;
    setItems((p) => p.map((i) => (i.id === id ? { ...i, status: "uploading" } : i)));
    const tick = window.setInterval(() => {
      setItems((prev) => {
        const updated = prev.map((i) => {
          if (i.id !== id || i.status !== "uploading") return i;
          const inc = Math.random() * 10 + 3;
          const np = Math.min(100, i.progress + inc);
          if (np >= 100) {
            window.clearInterval(timersRef.current[key]);
            delete timersRef.current[key];
            return { ...i, progress: 100, status: "done" as const };
          }
          return { ...i, progress: np };
        });
        if (updated.length > 0 && updated.every((i) => i.status === "done")) {
          setStage("done");
        }
        return updated;
      });
    }, 230);
    timersRef.current[key] = tick;
  };

  const pauseUpload = (id: string) => {
    const key = id + ":u";
    if (timersRef.current[key]) {
      window.clearInterval(timersRef.current[key]);
      delete timersRef.current[key];
    }
    setItems((p) => p.map((i) => (i.id === id ? { ...i, status: "paused" } : i)));
  };

  // ---- Derived ----
  const totalSize = items.reduce((a, b) => a + b.size, 0);
  const doneCount = items.filter((i) => i.status === "done").length;
  const uploadingCount = items.filter((i) => i.status === "uploading").length;
  const overallProgress = items.length
    ? Math.round(items.reduce((a, b) => a + b.progress, 0) / items.length)
    : 0;
  const overallProcessed = items.length
    ? Math.round(items.reduce((a, b) => a + b.processed, 0) / items.length)
    : 0;
  const allDone = stage === "done";

  const finish = () => {
    onComplete?.(items.map((i) => i.file));
    toast({
      title: "Upload complete",
      description: `${items.length} ${mode === "video" ? "video(s)" : "file(s)"} added • ${quality === "compressed" ? "Optimised" : "Original quality"}.`,
    });
    onOpenChange(false);
  };

  const accent =
    mode === "video"
      ? "from-info to-cyan-400"
      : "from-primary to-primary-glow";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden bg-gradient-card border-border/60">
        {/* Header */}
        <div className="relative p-6 border-b border-border/60 bg-gradient-aurora">
          <div className="absolute -top-16 -right-16 size-56 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
          <DialogHeader className="relative">
            <div className="flex items-center gap-3">
              {(stage === "quality" || stage === "select") && (
                <div
                  className={cn(
                    "size-11 rounded-2xl grid place-items-center text-white shadow-glow bg-gradient-to-br",
                    accent,
                  )}
                >
                  {mode === "video" ? <Video className="size-5" /> : <ImageIcon className="size-5" />}
                </div>
              )}
              {stage === "processing" && (
                <div className="size-11 rounded-2xl grid place-items-center text-white shadow-glow bg-gradient-to-br from-fuchsia-500 to-primary">
                  <Wand2 className="size-5 animate-pulse" />
                </div>
              )}
              {(stage === "uploading" || stage === "done") && (
                <div className={cn("size-11 rounded-2xl grid place-items-center text-white shadow-glow bg-gradient-to-br", accent)}>
                  <UploadCloud className="size-5" />
                </div>
              )}
              <div className="flex-1">
                <DialogTitle className="font-display text-2xl tracking-tight">{title}</DialogTitle>
                <DialogDescription className="mt-1">{desc}</DialogDescription>
              </div>
            </div>

            {/* Stepper */}
            <div className="relative mt-5 flex items-center gap-2 text-[11px] font-semibold">
              {(["select", "quality", "processing", "uploading"] as Stage[]).map((s, idx) => {
                const order = ["select", "quality", "processing", "uploading", "done"];
                const cur = order.indexOf(stage);
                const me = order.indexOf(s);
                const active = me <= cur;
                return (
                  <div key={s} className="flex items-center gap-2 flex-1">
                    <div
                      className={cn(
                        "flex items-center gap-1.5 px-2.5 py-1 rounded-full border transition-colors",
                        active
                          ? "border-primary/40 bg-primary/10 text-primary"
                          : "border-border bg-secondary/40 text-muted-foreground",
                      )}
                    >
                      <span className={cn("size-1.5 rounded-full", active ? "bg-primary" : "bg-muted-foreground/40")} />
                      {["Select", "Quality", "Process", "Upload"][idx]}
                    </div>
                    {idx < 3 && <div className="flex-1 h-px bg-border" />}
                  </div>
                );
              })}
            </div>
          </DialogHeader>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 max-h-[65vh] overflow-y-auto">
          {/* STAGE: SELECT */}
          {stage === "select" && (
            <>
              <div
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
                className={cn(
                  "relative rounded-3xl border-2 border-dashed p-8 sm:p-10 text-center transition-all",
                  "bg-secondary/40 backdrop-blur-md",
                  dragging
                    ? "border-primary bg-primary/10 scale-[1.01] shadow-glow"
                    : "border-border hover:border-primary/50",
                )}
              >
                <input ref={fileInputRef} type="file" accept={accept} multiple hidden
                  onChange={(e) => e.target.files && addFiles(e.target.files)} />
                {mode === "image" && (
                  <input ref={folderInputRef} type="file" hidden multiple
                    onChange={(e) => e.target.files && addFiles(e.target.files)}
                    // @ts-expect-error non-standard but widely supported
                    webkitdirectory="" directory="" />
                )}
                <div className={cn(
                  "mx-auto size-16 rounded-2xl grid place-items-center mb-4 bg-gradient-to-br text-white shadow-card transition-transform",
                  accent, dragging && "scale-110",
                )}>
                  <UploadCloud className="size-7" />
                </div>
                <p className="font-display font-bold text-lg">
                  {dragging ? "Drop to add" : "Drag & drop here"}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  or choose from your device · {mode === "video" ? "MP4, MOV, WEBM" : "JPG, PNG, HEIC, RAW"}
                </p>
                <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    className="rounded-xl bg-gradient-primary hover:opacity-90 shadow-glow"
                  >
                    <FileUp className="size-4 mr-1.5" />
                    {mode === "video" ? "Select Videos" : "Select Files"}
                  </Button>
                  {mode === "image" && (
                    <Button variant="secondary"
                      onClick={() => folderInputRef.current?.click()}
                      className="rounded-xl border border-border/60">
                      <FolderUp className="size-4 mr-1.5" /> Select Folder
                    </Button>
                  )}
                </div>
              </div>

              {items.length > 0 && (
                <div className="rounded-2xl border border-border/60 bg-card/60 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-semibold">
                      {items.length} file(s) · {formatBytes(totalSize)}
                    </p>
                    <button
                      onClick={() => setItems([])}
                      className="text-xs text-muted-foreground hover:text-destructive"
                    >
                      Clear all
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {items.slice(0, 8).map((i) => (
                      <div key={i.id} className="relative group aspect-square rounded-xl overflow-hidden border border-border/60 bg-secondary">
                        {i.preview ? (
                          <img src={i.preview} alt={i.name} className="size-full object-cover" />
                        ) : (
                          <div className="size-full grid place-items-center text-info">
                            <Video className="size-6" />
                          </div>
                        )}
                        <button onClick={() => removeItem(i.id)}
                          className="absolute top-1 right-1 size-6 rounded-full bg-background/80 backdrop-blur grid place-items-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <X className="size-3" />
                        </button>
                      </div>
                    ))}
                    {items.length > 8 && (
                      <div className="aspect-square rounded-xl border border-border/60 bg-secondary/60 grid place-items-center text-sm font-bold text-muted-foreground">
                        +{items.length - 8}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          {/* STAGE: QUALITY */}
          {stage === "quality" && (
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                {
                  key: "compressed" as Quality,
                  icon: Zap,
                  title: "Compressed",
                  tag: "Recommended",
                  desc: mode === "video"
                    ? "Smart H.264 transcode. Up to 60% smaller, web-optimised, plays anywhere."
                    : "Smart compression at ~85% quality. Visually identical, much smaller files.",
                  perks: ["Faster upload", "Lower storage cost", "Optimised previews"],
                  grad: "from-emerald-500/20 to-primary/10",
                  ring: "ring-primary",
                },
                {
                  key: "original" as Quality,
                  icon: Gem,
                  title: "Original",
                  tag: "Lossless",
                  desc: mode === "video"
                    ? "Keep the original codec, bitrate, and resolution. Ideal for archival masters."
                    : "Full resolution, untouched. Preserves EXIF, ICC profile, and RAW data.",
                  perks: ["100% quality", "Metadata preserved", "Best for delivery"],
                  grad: "from-amber-500/15 to-fuchsia-500/10",
                  ring: "ring-amber-500",
                },
              ].map(({ key, icon: Icon, title, tag, desc, perks, grad, ring }) => (
                <button
                  key={key}
                  onClick={() => setQuality(key)}
                  className={cn(
                    "relative text-left p-5 rounded-3xl border bg-gradient-to-br transition-all",
                    grad,
                    quality === key
                      ? `border-transparent ring-2 ${ring} shadow-glow`
                      : "border-border/60 hover:border-primary/40",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="size-11 rounded-2xl grid place-items-center bg-background/70 backdrop-blur border border-border/60">
                      <Icon className="size-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-background/70 border border-border/60">
                      {tag}
                    </span>
                  </div>
                  <p className="mt-4 font-display font-bold text-xl">{title}</p>
                  <p className="text-sm text-muted-foreground mt-1">{desc}</p>
                  <ul className="mt-4 space-y-1.5">
                    {perks.map((p) => (
                      <li key={p} className="flex items-center gap-2 text-xs">
                        <CheckCircle2 className="size-3.5 text-success" /> {p}
                      </li>
                    ))}
                  </ul>
                </button>
              ))}
            </div>
          )}

          {/* STAGE: PROCESSING */}
          {stage === "processing" && (
            <>
              <div className="rounded-3xl p-6 bg-gradient-aurora border border-border/60 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,hsl(var(--primary)/0.25),transparent_60%)] pointer-events-none" />
                <div className="relative mx-auto size-20 rounded-3xl bg-background/70 backdrop-blur border border-border/60 grid place-items-center shadow-glow">
                  <Sparkles className="size-8 text-primary animate-pulse" />
                </div>
                <p className="mt-4 font-display text-2xl font-bold gradient-text">
                  {overallProcessed}%
                </p>
                <p className="text-sm text-muted-foreground">
                  {quality === "compressed" ? "Optimising" : "Preparing originals"} · {items.filter(i=>i.status==="ready").length}/{items.length} ready
                </p>
                <div className="mt-4 max-w-md mx-auto">
                  <Progress value={overallProcessed} className="h-2" />
                </div>
              </div>

              <div className="space-y-2">
                {items.map((i) => (
                  <div key={i.id} className="flex items-center gap-3 p-3 rounded-2xl border border-border/60 bg-card/40">
                    <div className="size-12 rounded-xl overflow-hidden bg-secondary border border-border/60 grid place-items-center shrink-0 relative">
                      {i.preview ? (
                        <img src={i.preview} alt={i.name} className="size-full object-cover" />
                      ) : (
                        <Video className="size-5 text-info" />
                      )}
                      {i.status === "processing" && (
                        <div className="absolute inset-0 bg-primary/20 backdrop-blur-[1px] grid place-items-center">
                          <Loader2 className="size-4 animate-spin text-primary-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold truncate">{i.name}</p>
                        <span className="text-[11px] text-muted-foreground">{formatBytes(i.size)}</span>
                      </div>
                      <div className="mt-1.5 flex items-center gap-2">
                        <Progress value={i.processed} className="h-1.5 flex-1" />
                        <span className={cn("text-[11px] font-semibold w-12 text-right",
                          i.status === "ready" ? "text-success" : "text-muted-foreground")}>
                          {i.status === "ready" ? "Ready" : `${Math.round(i.processed)}%`}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* STAGE: UPLOADING / DONE */}
          {(stage === "uploading" || stage === "done") && (
            <>
              <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-md p-4 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span><span className="font-bold text-foreground">{items.length}</span> file(s)</span>
                    <span><span className="font-bold text-foreground">{formatBytes(totalSize)}</span> total</span>
                    <span className="inline-flex items-center gap-1">
                      <span className="size-1.5 rounded-full bg-success" />{doneCount} done
                    </span>
                    {uploadingCount > 0 && (
                      <span className="inline-flex items-center gap-1">
                        <Loader2 className="size-3 animate-spin text-primary" />{uploadingCount} uploading
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">
                      {quality === "compressed" ? <Zap className="size-3" /> : <Gem className="size-3" />}
                      {quality === "compressed" ? "Optimised" : "Original"}
                    </span>
                  </div>
                  <span className="text-xs font-semibold gradient-text">{overallProgress}%</span>
                </div>
                <Progress value={overallProgress} className="h-2" />
              </div>

              <div className="space-y-2">
                {items.map((i) => (
                  <div key={i.id} className="flex items-center gap-3 p-3 rounded-2xl border border-border/60 bg-card/40 hover:bg-card/60 transition-colors">
                    <div className="size-12 rounded-xl overflow-hidden bg-secondary border border-border/60 grid place-items-center shrink-0">
                      {i.preview ? (
                        <img src={i.preview} alt={i.name} className="size-full object-cover" />
                      ) : (
                        <Video className="size-5 text-info" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold truncate">{i.name}</p>
                        <span className="text-[11px] text-muted-foreground shrink-0">{formatBytes(i.size)}</span>
                      </div>
                      <div className="mt-1.5 flex items-center gap-2">
                        <Progress value={i.progress} className="h-1.5 flex-1" />
                        <span className={cn("text-[11px] font-semibold w-10 text-right",
                          i.status === "done" ? "text-success" : "text-muted-foreground")}>
                          {Math.round(i.progress)}%
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {i.status === "done" ? (
                        <span className="size-8 rounded-lg bg-success/15 text-success grid place-items-center">
                          <CheckCircle2 className="size-4" />
                        </span>
                      ) : i.status === "uploading" ? (
                        <button onClick={() => pauseUpload(i.id)}
                          className="size-8 rounded-lg hover:bg-secondary grid place-items-center" aria-label="Pause">
                          <Pause className="size-3.5" />
                        </button>
                      ) : i.status === "paused" ? (
                        <button onClick={() => startUpload(i.id)}
                          className="size-8 rounded-lg hover:bg-secondary grid place-items-center" aria-label="Resume">
                          <Play className="size-3.5" />
                        </button>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border/60 bg-secondary/30 flex flex-wrap items-center justify-between gap-3">
          <p className="text-[11px] text-muted-foreground">
            {stage === "uploading" || stage === "processing"
              ? "Keep this window open until the operation completes."
              : stage === "done"
                ? "All set! Your files are safe in cloud storage."
                : "Your files are private and encrypted in transit."}
          </p>
          <div className="flex items-center gap-2">
            {stage === "quality" && (
              <Button variant="ghost" onClick={() => setStage("select")} className="rounded-xl">
                <ArrowLeft className="size-4 mr-1.5" /> Back
              </Button>
            )}
            <Button variant="ghost" onClick={() => onOpenChange(false)} className="rounded-xl">
              <X className="size-4 mr-1.5" /> {stage === "done" ? "Close" : "Cancel"}
            </Button>

            {stage === "select" && (
              <Button
                disabled={!items.length}
                onClick={() => setStage("quality")}
                className="rounded-xl bg-gradient-primary hover:opacity-90 shadow-glow disabled:opacity-50"
              >
                Continue · {items.length} file{items.length === 1 ? "" : "s"}
              </Button>
            )}

            {stage === "quality" && (
              <>
                <Button
                  variant="secondary"
                  onClick={() => startProcessing("original")}
                  className="rounded-xl border border-border/60"
                >
                  <Gem className="size-4 mr-1.5" /> Upload Original
                </Button>
                <Button
                  onClick={() => startProcessing("compressed")}
                  className="rounded-xl bg-gradient-primary hover:opacity-90 shadow-glow"
                >
                  <Zap className="size-4 mr-1.5" /> Upload Compressed
                </Button>
              </>
            )}

            {stage === "done" && (
              <Button
                onClick={finish}
                className="rounded-xl bg-gradient-primary hover:opacity-90 shadow-glow"
              >
                <CheckCircle2 className="size-4 mr-1.5" /> Done
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UploadDialog;
