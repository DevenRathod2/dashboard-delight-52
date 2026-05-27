import { useCallback, useEffect, useRef, useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  UploadCloud, FolderUp, Image as ImageIcon, Video, FileUp,
  CheckCircle2, X, Loader2, Trash2, Play, Pause,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export type UploadMode = "image" | "video";

type Item = {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  preview?: string;
  progress: number;
  status: "queued" | "uploading" | "paused" | "done" | "error";
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const timersRef = useRef<Record<string, number>>({});

  const accept = mode === "video" ? "video/*" : "image/*";
  const title = mode === "video" ? "Upload Videos" : "Upload Images or Folder";
  const desc =
    mode === "video"
      ? "Drag and drop video files, or browse to add cinematic reels to this collection."
      : "Drag and drop images or an entire folder. Files upload in parallel with live progress.";

  // Cleanup previews + timers when closed
  useEffect(() => {
    if (!open) {
      Object.values(timersRef.current).forEach((t) => window.clearInterval(t));
      timersRef.current = {};
      items.forEach((i) => i.preview && URL.revokeObjectURL(i.preview));
      setItems([]);
      setDragging(false);
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
        progress: 0,
        status: "queued",
      }));
      setItems((prev) => [...prev, ...next]);
      // Auto-start
      next.forEach((it) => startUpload(it.id));
    },
    [acceptable, mode, toast],
  );

  const startUpload = (id: string) => {
    if (timersRef.current[id]) return;
    setItems((p) => p.map((i) => (i.id === id ? { ...i, status: "uploading" } : i)));
    const tick = window.setInterval(() => {
      setItems((prev) =>
        prev.map((i) => {
          if (i.id !== id || i.status !== "uploading") return i;
          const inc = Math.random() * 12 + 4;
          const np = Math.min(100, i.progress + inc);
          if (np >= 100) {
            window.clearInterval(timersRef.current[id]);
            delete timersRef.current[id];
            return { ...i, progress: 100, status: "done" };
          }
          return { ...i, progress: np };
        }),
      );
    }, 250);
    timersRef.current[id] = tick;
  };

  const pauseUpload = (id: string) => {
    if (timersRef.current[id]) {
      window.clearInterval(timersRef.current[id]);
      delete timersRef.current[id];
    }
    setItems((p) => p.map((i) => (i.id === id ? { ...i, status: "paused" } : i)));
  };

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

  const totalSize = items.reduce((a, b) => a + b.size, 0);
  const doneCount = items.filter((i) => i.status === "done").length;
  const uploadingCount = items.filter((i) => i.status === "uploading").length;
  const overallProgress = items.length
    ? Math.round(items.reduce((a, b) => a + b.progress, 0) / items.length)
    : 0;
  const allDone = items.length > 0 && doneCount === items.length;

  const finish = () => {
    onComplete?.(items.map((i) => i.file));
    toast({
      title: "Upload complete",
      description: `${items.length} ${mode === "video" ? "video(s)" : "file(s)"} added to the collection.`,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden bg-gradient-card border-border/60">
        {/* Header */}
        <div className="relative p-6 border-b border-border/60 bg-gradient-aurora">
          <div className="absolute -top-16 -right-16 size-56 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
          <DialogHeader className="relative">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "size-11 rounded-2xl grid place-items-center text-white shadow-glow bg-gradient-to-br",
                  mode === "video" ? "from-info to-cyan-400" : "from-primary to-primary-glow",
                )}
              >
                {mode === "video" ? <Video className="size-5" /> : <ImageIcon className="size-5" />}
              </div>
              <div>
                <DialogTitle className="font-display text-2xl tracking-tight">{title}</DialogTitle>
                <DialogDescription className="mt-1">{desc}</DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Drop zone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
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
            <input
              ref={fileInputRef}
              type="file"
              accept={accept}
              multiple
              hidden
              onChange={(e) => e.target.files && addFiles(e.target.files)}
            />
            {mode === "image" && (
              <input
                ref={folderInputRef}
                type="file"
                hidden
                multiple
                onChange={(e) => e.target.files && addFiles(e.target.files)}
                // @ts-expect-error non-standard but widely supported
                webkitdirectory=""
                directory=""
              />
            )}

            <div
              className={cn(
                "mx-auto size-16 rounded-2xl grid place-items-center mb-4 bg-gradient-to-br text-white shadow-card transition-transform",
                mode === "video" ? "from-info to-cyan-400" : "from-primary to-primary-glow",
                dragging && "scale-110",
              )}
            >
              <UploadCloud className="size-7" />
            </div>
            <p className="font-display font-bold text-lg">
              {dragging ? "Drop to upload" : "Drag & drop here"}
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
                <Button
                  variant="secondary"
                  onClick={() => folderInputRef.current?.click()}
                  className="rounded-xl border border-border/60"
                >
                  <FolderUp className="size-4 mr-1.5" /> Select Folder
                </Button>
              )}
            </div>
          </div>

          {/* Summary */}
          {items.length > 0 && (
            <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-md p-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>
                    <span className="font-bold text-foreground">{items.length}</span> file(s)
                  </span>
                  <span>
                    <span className="font-bold text-foreground">{formatBytes(totalSize)}</span> total
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="size-1.5 rounded-full bg-success" />
                    {doneCount} done
                  </span>
                  {uploadingCount > 0 && (
                    <span className="inline-flex items-center gap-1">
                      <Loader2 className="size-3 animate-spin text-primary" />
                      {uploadingCount} uploading
                    </span>
                  )}
                </div>
                <span className="text-xs font-semibold gradient-text">{overallProgress}%</span>
              </div>
              <Progress value={overallProgress} className="h-2" />
            </div>
          )}

          {/* Items */}
          {items.length > 0 && (
            <div className="space-y-2">
              {items.map((i) => (
                <div
                  key={i.id}
                  className="flex items-center gap-3 p-3 rounded-2xl border border-border/60 bg-card/40 hover:bg-card/60 transition-colors"
                >
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
                      <span className="text-[11px] text-muted-foreground shrink-0">
                        {formatBytes(i.size)}
                      </span>
                    </div>
                    <div className="mt-1.5 flex items-center gap-2">
                      <Progress value={i.progress} className="h-1.5 flex-1" />
                      <span
                        className={cn(
                          "text-[11px] font-semibold w-10 text-right",
                          i.status === "done" ? "text-success" : "text-muted-foreground",
                        )}
                      >
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
                      <button
                        onClick={() => pauseUpload(i.id)}
                        className="size-8 rounded-lg hover:bg-secondary grid place-items-center"
                        aria-label="Pause"
                      >
                        <Pause className="size-3.5" />
                      </button>
                    ) : (
                      <button
                        onClick={() => startUpload(i.id)}
                        className="size-8 rounded-lg hover:bg-secondary grid place-items-center"
                        aria-label="Resume"
                      >
                        <Play className="size-3.5" />
                      </button>
                    )}
                    <button
                      onClick={() => removeItem(i.id)}
                      className="size-8 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive grid place-items-center"
                      aria-label="Remove"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border/60 bg-secondary/30 flex flex-wrap items-center justify-between gap-3">
          <p className="text-[11px] text-muted-foreground">
            Files stay on your device until upload completes. Don't close this window during upload.
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="rounded-xl"
            >
              <X className="size-4 mr-1.5" /> Cancel
            </Button>
            <Button
              disabled={!allDone}
              onClick={finish}
              className="rounded-xl bg-gradient-primary hover:opacity-90 shadow-glow disabled:opacity-50"
            >
              <CheckCircle2 className="size-4 mr-1.5" />
              {allDone ? "Done" : `Uploading… ${overallProgress}%`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UploadDialog;
