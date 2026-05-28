import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UploadDialog } from "@/components/UploadDialog";
import event1 from "@/assets/event-1.jpg";
import event2 from "@/assets/event-2.jpg";
import event3 from "@/assets/event-3.jpg";
import event4 from "@/assets/event-4.jpg";
import { UploadDialog, type UploadMode } from "@/components/UploadDialog";

const covers = [event1, event2, event3, event4];

const photos = Array.from({ length: 24 }).map((_, i) => ({
  id: i + 1,
  name: `DSC0${6848 + i}.JPG`,
  size: `${(7 + (i % 16) + Math.random()).toFixed(1)} MB`,
  date: "29/03/2026",
  src: covers[i % covers.length],
}));

const CollectionPhotos = () => {
  const { id, collectionId } = useParams();
  const [view, setView] = useState<"grid" | "list">("grid");
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [selectMode, setSelectMode] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadMode, setUploadMode] = useState<UploadMode>("image");

  const openUpload = (mode: UploadMode) => {
    setUploadMode(mode);
    setUploadOpen(true);
  };

  const toggle = (pid: number) => {
    if (!selectMode) return;
    setSelected((s) => {
      const n = new Set(s);
      n.has(pid) ? n.delete(pid) : n.add(pid);
      return n;
    });
  };

  const collectionName = collectionId === "day-2" ? "Day 2" : "Day 1";

  return (
    <DashboardLayout>
      {/* Toolbar */}
      <div className="rounded-3xl bg-card/60 border border-border/60 backdrop-blur-md shadow-card p-3 mb-6 flex flex-wrap items-center gap-2">
        <Link
          to={`/events/${id ?? "1"}`}
          className="size-10 rounded-xl bg-secondary/60 border border-border/60 grid place-items-center hover:bg-secondary transition-colors"
          aria-label="Back to event"
        >
          <ArrowLeft className="size-4" />
        </Link>

        <div className="flex items-center gap-2 px-2">
          <h1 className="font-display font-bold text-lg">{collectionName}</h1>
          <button className="size-7 rounded-lg hover:bg-secondary grid place-items-center">
            <Edit3 className="size-3.5 text-muted-foreground" />
          </button>
        </div>

        <div className="relative flex-1 min-w-[220px] max-w-md">
          <Search className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            placeholder="Search photos..."
            className="pl-9 h-10 rounded-xl bg-secondary/60 border-border/60"
          />
        </div>

        <Button variant="secondary" size="sm" className="rounded-xl border border-border/60">
          <Filter className="size-3.5 mr-1.5" /> All
        </Button>

        <div className="ml-auto flex flex-wrap items-center gap-2">
          <Button onClick={() => openUpload("image")} size="sm" className="rounded-xl bg-success text-success-foreground hover:bg-success/90 shadow-card">
            <Upload className="size-3.5 mr-1.5" /> Upload Images/Folder
          </Button>
          <Button onClick={() => openUpload("video")} size="sm" className="rounded-xl bg-info text-info-foreground hover:bg-info/90 shadow-card">
            <Video className="size-3.5 mr-1.5" /> Upload Video
          </Button>
          <Button size="sm" className="rounded-xl bg-gradient-primary hover:opacity-90 shadow-glow">
            <Download className="size-3.5 mr-1.5" /> Get Selected ({selected.size})
          </Button>

          <div className="flex items-center p-1 rounded-xl bg-secondary/60 border border-border/60">
            <button
              onClick={() => setView("grid")}
              aria-label="Grid view"
              className={`size-8 rounded-lg grid place-items-center transition-colors ${
                view === "grid" ? "bg-gradient-primary text-primary-foreground shadow-glow" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <LayoutGrid className="size-4" />
            </button>
            <button
              onClick={() => setView("list")}
              aria-label="List view"
              className={`size-8 rounded-lg grid place-items-center transition-colors ${
                view === "list" ? "bg-gradient-primary text-primary-foreground shadow-glow" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <List className="size-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Selection bar */}
      <div className="flex flex-wrap items-center gap-2 mb-5">
        <Button
          size="sm"
          variant={selectMode ? "default" : "secondary"}
          onClick={() => { setSelectMode((v) => !v); if (selectMode) setSelected(new Set()); }}
          className={`rounded-xl border border-border/60 ${selectMode ? "bg-gradient-primary text-primary-foreground" : ""}`}
        >
          <CheckSquare className="size-3.5 mr-1.5" />
          {selectMode ? "Selecting…" : "Select"}
        </Button>
        <Button
          size="sm"
          variant="secondary"
          disabled={!selectMode}
          onClick={() => setSelected(new Set(photos.map((p) => p.id)))}
          className="rounded-xl border border-border/60"
        >
          Select All
        </Button>
        <Button
          size="sm"
          variant="ghost"
          disabled={selected.size === 0}
          onClick={() => setSelected(new Set())}
          className="rounded-xl border border-border/60"
        >
          <X className="size-3.5 mr-1.5" /> Clear Selection
        </Button>
        {selected.size > 0 && (
          <span className="ml-auto text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">{selected.size}</span> selected
          </span>
        )}
      </div>

      {/* Photos */}
      {view === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {photos.map((p) => {
            const isSel = selected.has(p.id);
            return (
              <article
                key={p.id}
                onClick={() => toggle(p.id)}
                className={`group relative rounded-2xl overflow-hidden bg-gradient-card border shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-0.5 ${
                  isSel ? "border-primary ring-2 ring-primary shadow-glow" : "border-border/60"
                } ${selectMode ? "cursor-pointer" : ""}`}
              >
                <div className="relative aspect-square overflow-hidden bg-secondary">
                  <img
                    src={p.src}
                    alt={p.name}
                    loading="lazy"
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {isSel && (
                    <div className="absolute inset-0 bg-primary/20 backdrop-blur-[1px]" />
                  )}
                  <div className="absolute top-2 left-2">
                    <div
                      className={`size-6 rounded-md grid place-items-center border transition-all ${
                        isSel
                          ? "bg-gradient-primary border-primary text-primary-foreground shadow-glow"
                          : "bg-card/70 backdrop-blur-md border-border opacity-0 group-hover:opacity-100"
                      }`}
                    >
                      {isSel && <CheckSquare className="size-3.5" />}
                    </div>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />
                  <div className="absolute bottom-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="size-7 rounded-lg glass grid place-items-center hover:bg-primary hover:text-primary-foreground transition-colors">
                      <Download className="size-3.5" />
                    </button>
                    <button className="size-7 rounded-lg glass grid place-items-center hover:bg-secondary transition-colors">
                      <MoreVertical className="size-3.5" />
                    </button>
                  </div>
                </div>
                <div className="p-2.5">
                  <p className="text-[11px] font-semibold truncate">{p.name}</p>
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground mt-0.5">
                    <span>{p.date}</span>
                    <span className="font-medium text-foreground/70">{p.size}</span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl bg-card/60 border border-border/60 backdrop-blur-md overflow-hidden">
          <div className="grid grid-cols-12 px-4 py-3 text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border/60">
            <div className="col-span-1"></div>
            <div className="col-span-6">Name</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-2">Size</div>
            <div className="col-span-1 text-right">Actions</div>
          </div>
          {photos.map((p) => {
            const isSel = selected.has(p.id);
            return (
              <div
                key={p.id}
                onClick={() => toggle(p.id)}
                className={`grid grid-cols-12 items-center px-4 py-2.5 border-b border-border/40 last:border-0 transition-colors ${
                  isSel ? "bg-primary/10" : "hover:bg-secondary/50"
                } ${selectMode ? "cursor-pointer" : ""}`}
              >
                <div className="col-span-1">
                  <img src={p.src} alt={p.name} className="size-10 rounded-lg object-cover" />
                </div>
                <div className="col-span-6 text-sm font-medium truncate">{p.name}</div>
                <div className="col-span-2 text-xs text-muted-foreground">{p.date}</div>
                <div className="col-span-2 text-xs">{p.size}</div>
                <div className="col-span-1 flex justify-end gap-1">
                  <button className="size-8 rounded-lg hover:bg-secondary grid place-items-center">
                    <Download className="size-3.5" />
                  </button>
                  <button className="size-8 rounded-lg hover:bg-secondary grid place-items-center">
                    <MoreVertical className="size-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <UploadDialog
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        mode={uploadMode}
      />
    </DashboardLayout>
  );
};

export default CollectionPhotos;
