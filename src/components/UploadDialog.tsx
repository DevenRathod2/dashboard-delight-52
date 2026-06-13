import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  UploadCloud, FolderUp, Image as ImageIcon, Video, FileUp,
  CheckCircle2, X, Loader2, Play, Pause, Sparkles, Gem,
  Wand2, ArrowLeft, Zap, Play as YoutubeIcon, Cloud, HardDrive, Link2,
  FolderOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";


export type UploadMode = "image" | "video";
export type Quality = "compressed" | "original";
type Source = "images" | "videos" | "folder" | "youtube" | "cloud" | "gdrive";
type Stage = "select" | "quality" | "processing" | "uploading" | "done";

type Item = {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  preview?: string;
  processed: number;
  progress: number;
  status: "queued" | "processing" | "ready" | "uploading" | "paused" | "done" | "error";
};

const formatBytes = (b: number) => {
  if (!b) return "0 B";
  const k = 1024, u = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(b) / Math.log(k));
  return `${(b / Math.pow(k, i)).toFixed(i ? 1 : 0)} ${u[i]}`;
};

const uid = () => Math.random().toString(36).slice(2, 10);

export type UploadCollectionOption = { id: string; name: string; cover?: string; photos?: number };

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  /** Optional initial source — kept for backwards compatibility */
  mode?: UploadMode;
  collectionName?: string;
  collections?: UploadCollectionOption[];
  defaultCollectionId?: string;
  onCollectionChange?: (id: string) => void;
  onComplete?: (files: File[]) => void;
}


const SOURCES: {
  key: Source; group: "Upload" | "Embed" | "Import";
  label: string; icon: React.ComponentType<{ className?: string }>;
  tint: string;
}[] = [
  { key: "images",  group: "Upload", label: "Images",       icon: ImageIcon, tint: "from-sky-400 to-primary" },
  { key: "videos",  group: "Upload", label: "Videos",       icon: Video,     tint: "from-fuchsia-500 to-info" },
  { key: "folder",  group: "Upload", label: "Folder",       icon: FolderUp,  tint: "from-amber-400 to-orange-500" },
  { key: "youtube", group: "Embed",  label: "YouTube",      icon: YoutubeIcon,   tint: "from-rose-500 to-red-600" },
  { key: "cloud",   group: "Import", label: "Cloud",        icon: Cloud,     tint: "from-cyan-400 to-emerald-400" },
  { key: "gdrive",  group: "Import", label: "Google Drive", icon: HardDrive, tint: "from-emerald-400 to-yellow-400" },
];

export const UploadDialog = ({ open, onOpenChange, mode, collectionName, collections, defaultCollectionId, onCollectionChange, onComplete }: Props) => {
  const { toast } = useToast();
  const [items, setItems] = useState<Item[]>([]);
  const [dragging, setDragging] = useState(false);
  const [stage, setStage] = useState<Stage>("select");
  const [quality, setQuality] = useState<Quality>("compressed");
  const [source, setSource] = useState<Source>(mode === "video" ? "videos" : "images");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [collectionId, setCollectionId] = useState<string | undefined>(
    defaultCollectionId ?? collections?.[0]?.id,
  );

  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const timersRef = useRef<Record<string, number>>({});

  const isVideoSource = source === "videos";
  const accept = isVideoSource ? "video/*" : "image/*";

  // Sync source when `mode` prop changes (parent still uses it)
  useEffect(() => {
    if (!open) return;
    setSource(mode === "video" ? "videos" : "images");
    setCollectionId(defaultCollectionId ?? collections?.[0]?.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, open, defaultCollectionId]);


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
      setYoutubeUrl("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const acceptable = useCallback(
    (f: File) => (isVideoSource ? f.type.startsWith("video/") : f.type.startsWith("image/")),
    [isVideoSource],
  );

  const addFiles = useCallback(
    (files: FileList | File[]) => {
      const arr = Array.from(files).filter(acceptable);
      if (!arr.length) {
        toast({
          title: "Unsupported files",
          description: `Only ${isVideoSource ? "videos" : "images"} are accepted here.`,
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
        preview: !isVideoSource ? URL.createObjectURL(f) : undefined,
        processed: 0,
        progress: 0,
        status: "queued",
      }));
      setItems((prev) => [...prev, ...next]);
    },
    [acceptable, isVideoSource, toast],
  );

  const removeItem = (id: string) => {
    Object.keys(timersRef.current).filter((k) => k.startsWith(id)).forEach((k) => {
      window.clearInterval(timersRef.current[k]);
      delete timersRef.current[k];
    });
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

  const switchSource = (s: Source) => {
    // Switching media type clears mismatched items
    const nextIsVideo = s === "videos";
    if (nextIsVideo !== isVideoSource && items.length) {
      items.forEach((i) => i.preview && URL.revokeObjectURL(i.preview));
      setItems([]);
    }
    setSource(s);
  };

  // ---- Processing stage ----
  const startProcessing = (q: Quality) => {
    setQuality(q);
    setStage("processing");
    setItems((p) => p.map((i) => ({ ...i, status: "processing" as const, processed: 0 })));
    items.forEach((it) => {
      const speed = q === "compressed" ? 14 : 6;
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
          if (updated.every((i) => i.status === "ready")) {
            queueMicrotask(() => beginUploads(updated));
          }
          return updated;
        });
      }, 200);
      timersRef.current[it.id + ":p"] = tick;
    });
  };

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

  const totalSize = items.reduce((a, b) => a + b.size, 0);
  const doneCount = items.filter((i) => i.status === "done").length;
  const uploadingCount = items.filter((i) => i.status === "uploading").length;
  const overallProgress = items.length
    ? Math.round(items.reduce((a, b) => a + b.progress, 0) / items.length)
    : 0;
  const overallProcessed = items.length
    ? Math.round(items.reduce((a, b) => a + b.processed, 0) / items.length)
    : 0;

  const finish = () => {
    onComplete?.(items.map((i) => i.file));
    toast({
      title: "Upload complete",
      description: `${items.length} ${isVideoSource ? "video(s)" : "file(s)"} added · ${quality === "compressed" ? "Optimised" : "Original quality"}.`,
    });
    onOpenChange(false);
  };

  const submitYoutube = () => {
    if (!youtubeUrl.trim()) return;
    toast({ title: "YouTube linked", description: youtubeUrl });
    setYoutubeUrl("");
    onOpenChange(false);
  };

  const grouped = useMemo(() => {
    const g: Record<string, typeof SOURCES> = {};
    SOURCES.forEach((s) => { (g[s.group] ||= []).push(s); });
    return g;
  }, []);

  const activeSource = SOURCES.find((s) => s.key === source)!;

  const headerTitle =
    stage === "quality" ? "Choose upload quality"
    : stage === "processing" ? (isVideoSource ? "Processing videos…" : "Processing images…")
    : stage === "uploading" || stage === "done" ? (isVideoSource ? "Uploading videos" : "Uploading files")
    : `Upload to ${collectionName ? `'${collectionName}'` : "Collection"}`;

  const headerDesc =
    stage === "quality" ? "Pick how your files are prepared before going to the cloud."
    : stage === "processing"
      ? quality === "compressed"
        ? "Optimising for fast delivery without losing visible detail."
        : "Preparing originals — preserving full resolution and metadata."
      : stage === "uploading" || stage === "done"
        ? "Streaming to secure cloud storage in parallel."
        : "Choose a source on the left, then add your files.";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl p-0 overflow-hidden bg-gradient-card border-border/60">
        {/* Header */}
        <div className="relative px-6 py-5 border-b border-border/60 bg-gradient-aurora">
          <div className="absolute -top-16 -right-16 size-56 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
          <DialogHeader className="relative">
            <div className="flex items-center gap-3">
              <div className={cn(
                "size-11 rounded-2xl grid place-items-center text-white shadow-glow bg-gradient-to-br",
                stage === "processing" ? "from-fuchsia-500 to-primary"
                : stage === "uploading" || stage === "done" ? "from-primary to-primary-glow"
                : activeSource.tint,
              )}>
                {stage === "processing" ? <Wand2 className="size-5 animate-pulse" />
                : stage === "uploading" || stage === "done" ? <UploadCloud className="size-5" />
                : <activeSource.icon className="size-5" />}
              </div>
              <div className="flex-1 min-w-0">
                <DialogTitle className="font-display text-xl sm:text-2xl tracking-tight truncate">
                  {headerTitle}
                </DialogTitle>
                <DialogDescription className="mt-1">{headerDesc}</DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Body */}
        <div className="grid grid-cols-12 max-h-[68vh]">
          {/* Sidebar — only on select stage */}
          {stage === "select" && (
            <aside className="col-span-12 sm:col-span-4 lg:col-span-3 border-b sm:border-b-0 sm:border-r border-border/60 bg-secondary/30 p-4 overflow-y-auto">
              {Object.entries(grouped).map(([group, list]) => (
                <div key={group} className="mb-4 last:mb-0">
                  <p className="px-2 mb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{group}</p>
                  <div className="space-y-1">
                    {list.map((s) => {
                      const active = source === s.key;
                      return (
                        <button
                          key={s.key}
                          onClick={() => switchSource(s.key)}
                          className={cn(
                            "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition-all",
                            active
                              ? "border-primary/40 bg-card shadow-card"
                              : "border-transparent hover:bg-card/60 hover:border-border/60",
                          )}
                        >
                          <span className={cn(
                            "size-9 rounded-xl grid place-items-center text-white shadow-card bg-gradient-to-br shrink-0",
                            s.tint,
                          )}>
                            <s.icon className="size-4" />
                          </span>
                          <span className={cn("text-sm font-semibold", active ? "" : "text-foreground/80")}>
                            {s.label}
                          </span>
                          {active && <span className="ml-auto size-1.5 rounded-full bg-primary" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </aside>
          )}

          {/* Main pane */}
          <section className={cn(
            "p-6 space-y-5 overflow-y-auto",
            stage === "select" ? "col-span-12 sm:col-span-8 lg:col-span-9" : "col-span-12",
          )}>
            {/* SELECT */}
            {stage === "select" && (
              <>
                {(source === "images" || source === "videos" || source === "folder") && (
                  <>
                    <div
                      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                      onDragLeave={() => setDragging(false)}
                      onDrop={onDrop}
                      className={cn(
                        "relative rounded-3xl border-2 border-dashed p-8 sm:p-12 text-center transition-all",
                        "bg-secondary/40 backdrop-blur-md",
                        dragging
                          ? "border-primary bg-primary/10 scale-[1.005] shadow-glow"
                          : "border-border hover:border-primary/50",
                      )}
                    >
                      <input ref={fileInputRef} type="file" accept={accept} multiple hidden
                        onChange={(e) => e.target.files && addFiles(e.target.files)} />
                      <input ref={folderInputRef} type="file" hidden multiple
                        accept={accept}
                        onChange={(e) => e.target.files && addFiles(e.target.files)}
                        // @ts-expect-error non-standard but widely supported
                        webkitdirectory="" directory="" />
                      <div className={cn(
                        "mx-auto size-16 rounded-2xl grid place-items-center mb-4 bg-gradient-to-br text-white shadow-card transition-transform",
                        activeSource.tint, dragging && "scale-110",
                      )}>
                        <UploadCloud className="size-7" />
                      </div>
                      <p className="font-display font-bold text-lg">
                        {dragging ? "Drop to add" : "Drop files here"}
                      </p>
                      <p className="text-xs uppercase tracking-wider text-muted-foreground mt-2">OR</p>
                      <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                        {source === "folder" ? (
                          <Button onClick={() => folderInputRef.current?.click()}
                            className="rounded-xl bg-gradient-primary hover:opacity-90 shadow-glow">
                            <FolderUp className="size-4 mr-1.5" /> Browse Folder
                          </Button>
                        ) : (
                          <Button onClick={() => fileInputRef.current?.click()}
                            className="rounded-xl bg-gradient-primary hover:opacity-90 shadow-glow">
                            <FileUp className="size-4 mr-1.5" />
                            Browse {source === "videos" ? "Videos" : "Images"}
                          </Button>
                        )}
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-4">
                        {source === "videos" ? "MP4, MOV, WEBM · up to 5 GB each" : "JPG, PNG, HEIC, RAW · up to 100 MB each"}
                      </p>
                    </div>

                    {items.length > 0 && (
                      <div className="rounded-2xl border border-border/60 bg-card/60 p-4">
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-sm font-semibold">
                            {items.length} file(s) · {formatBytes(totalSize)}
                          </p>
                          <button
                            onClick={() => { items.forEach(i=>i.preview && URL.revokeObjectURL(i.preview)); setItems([]); }}
                            className="text-xs text-muted-foreground hover:text-destructive"
                          >
                            Clear all
                          </button>
                        </div>
                        <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-6 gap-2">
                          {items.slice(0, 11).map((i) => (
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
                          {items.length > 11 && (
                            <div className="aspect-square rounded-xl border border-border/60 bg-secondary/60 grid place-items-center text-sm font-bold text-muted-foreground">
                              +{items.length - 11}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                )}

                {source === "youtube" && (
                  <div className="rounded-3xl border border-border/60 bg-secondary/40 p-8 text-center">
                    <div className="mx-auto size-16 rounded-2xl grid place-items-center mb-4 bg-gradient-to-br from-rose-500 to-red-600 text-white shadow-card">
                      <YoutubeIcon className="size-7" />
                    </div>
                    <p className="font-display font-bold text-lg">Embed a YouTube video</p>
                    <p className="text-sm text-muted-foreground mt-1">Paste a public YouTube link to attach it to this collection.</p>
                    <div className="mt-5 max-w-md mx-auto flex items-center gap-2">
                      <div className="relative flex-1">
                        <Link2 className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                        <Input value={youtubeUrl} onChange={(e)=>setYoutubeUrl(e.target.value)}
                          placeholder="https://youtube.com/watch?v=…"
                          className="pl-9 rounded-xl bg-background/60 border-border/60" />
                      </div>
                      <Button onClick={submitYoutube} disabled={!youtubeUrl.trim()}
                        className="rounded-xl bg-gradient-primary hover:opacity-90 shadow-glow disabled:opacity-50">
                        Embed
                      </Button>
                    </div>
                  </div>
                )}

                {(source === "cloud" || source === "gdrive") && (
                  <div className="rounded-3xl border border-border/60 bg-secondary/40 p-10 text-center">
                    <div className={cn(
                      "mx-auto size-16 rounded-2xl grid place-items-center mb-4 bg-gradient-to-br text-white shadow-card",
                      activeSource.tint,
                    )}>
                      <activeSource.icon className="size-7" />
                    </div>
                    <p className="font-display font-bold text-lg">{activeSource.label} import</p>
                    <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
                      Connect your {activeSource.label} account to bring media directly into Lensly. This integration is coming soon.
                    </p>
                    <Button variant="secondary" className="mt-5 rounded-xl border border-border/60">
                      Connect {activeSource.label}
                    </Button>
                  </div>
                )}
              </>
            )}

            {/* QUALITY */}
            {stage === "quality" && (
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { key: "compressed" as Quality, icon: Zap, title: "Compressed", tag: "Recommended",
                    desc: isVideoSource
                      ? "Smart H.264 transcode. Up to 60% smaller, web-optimised, plays anywhere."
                      : "Smart compression at ~85% quality. Visually identical, much smaller files.",
                    perks: ["Faster upload", "Lower storage cost", "Optimised previews"],
                    grad: "from-emerald-500/20 to-primary/10", ring: "ring-primary" },
                  { key: "original" as Quality, icon: Gem, title: "Original", tag: "Lossless",
                    desc: isVideoSource
                      ? "Keep the original codec, bitrate, and resolution. Ideal for archival masters."
                      : "Full resolution, untouched. Preserves EXIF, ICC profile, and RAW data.",
                    perks: ["100% quality", "Metadata preserved", "Best for delivery"],
                    grad: "from-amber-500/15 to-fuchsia-500/10", ring: "ring-amber-500" },
                ].map(({ key, icon: Icon, title, tag, desc, perks, grad, ring }) => (
                  <button key={key} onClick={() => setQuality(key)}
                    className={cn(
                      "relative text-left p-5 rounded-3xl border bg-gradient-to-br transition-all",
                      grad,
                      quality === key ? `border-transparent ring-2 ${ring} shadow-glow` : "border-border/60 hover:border-primary/40",
                    )}>
                    <div className="flex items-center justify-between">
                      <div className="size-11 rounded-2xl grid place-items-center bg-background/70 backdrop-blur border border-border/60">
                        <Icon className="size-5" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-background/70 border border-border/60">{tag}</span>
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

            {/* PROCESSING */}
            {stage === "processing" && (
              <>
                <div className="rounded-3xl p-6 bg-gradient-aurora border border-border/60 text-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,hsl(var(--primary)/0.25),transparent_60%)] pointer-events-none" />
                  <div className="relative mx-auto size-20 rounded-3xl bg-background/70 backdrop-blur border border-border/60 grid place-items-center shadow-glow">
                    <Sparkles className="size-8 text-primary animate-pulse" />
                  </div>
                  <p className="mt-4 font-display text-2xl font-bold gradient-text">{overallProcessed}%</p>
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
                        {i.preview ? <img src={i.preview} alt={i.name} className="size-full object-cover" /> : <Video className="size-5 text-info" />}
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

            {/* UPLOADING / DONE */}
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
                        {i.preview ? <img src={i.preview} alt={i.name} className="size-full object-cover" /> : <Video className="size-5 text-info" />}
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
                          <button onClick={() => pauseUpload(i.id)} className="size-8 rounded-lg hover:bg-secondary grid place-items-center" aria-label="Pause">
                            <Pause className="size-3.5" />
                          </button>
                        ) : i.status === "paused" ? (
                          <button onClick={() => startUpload(i.id)} className="size-8 rounded-lg hover:bg-secondary grid place-items-center" aria-label="Resume">
                            <Play className="size-3.5" />
                          </button>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </section>
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

            {stage === "select" && (source === "images" || source === "videos" || source === "folder") && (
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
                <Button variant="secondary" onClick={() => startProcessing("original")} className="rounded-xl border border-border/60">
                  <Gem className="size-4 mr-1.5" /> Upload Original
                </Button>
                <Button onClick={() => startProcessing("compressed")} className="rounded-xl bg-gradient-primary hover:opacity-90 shadow-glow">
                  <Zap className="size-4 mr-1.5" /> Upload Compressed
                </Button>
              </>
            )}

            {stage === "done" && (
              <Button onClick={finish} className="rounded-xl bg-gradient-primary hover:opacity-90 shadow-glow">
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
