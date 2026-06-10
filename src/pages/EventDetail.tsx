import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft, Image as ImageIcon, Palette, Share2, Settings as SettingsIcon,
  Plus, Search, Upload, LayoutGrid, List, CheckSquare, X, Download,
  MoreHorizontal, Folder, Trash2, Pencil, Video as VideoIcon,
} from "lucide-react";
import event1 from "@/assets/event-1.jpg";
import event2 from "@/assets/event-2.jpg";
import event3 from "@/assets/event-3.jpg";
import event4 from "@/assets/event-4.jpg";
import { UploadDialog } from "@/components/UploadDialog";

const covers = [event1, event2, event3, event4];

type Collection = {
  id: string;
  name: string;
  cover: string;
  photos: number;
  selected: number;
};

const collectionsSeed: Collection[] = [
  { id: "day-1", name: "Day 1", cover: event1, photos: 42, selected: 0 },
  { id: "day-2", name: "Day 2", cover: event2, photos: 18, selected: 0 },
  { id: "day-3", name: "Reception", cover: event3, photos: 64, selected: 4 },
  { id: "day-4", name: "Portraits", cover: event4, photos: 28, selected: 2 },
];

const buildPhotos = (count: number) =>
  Array.from({ length: count }).map((_, i) => ({
    id: i + 1,
    name: `DSC0${6848 + i}.JPG`,
    size: `${(7 + (i % 16) + Math.random()).toFixed(1)} MB`,
    date: "29/03/2026",
    src: covers[i % covers.length],
  }));

const EventDetail = () => {
  const { id } = useParams();
  const eventTitle = "Wedding";

  const [collections] = useState<Collection[]>(collectionsSeed);
  const [activeId, setActiveId] = useState<string>(collectionsSeed[0].id);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [selectMode, setSelectMode] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [collectionsQuery, setCollectionsQuery] = useState("");

  const active = collections.find((c) => c.id === activeId) ?? collections[0];
  const photos = buildPhotos(Math.max(active.photos, 8));
  const filtered = photos.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
  const filteredCollections = collections.filter((c) =>
    c.name.toLowerCase().includes(collectionsQuery.toLowerCase()),
  );

  const toggle = (pid: number) => {
    if (!selectMode) return;
    setSelected((s) => {
      const n = new Set(s);
      n.has(pid) ? n.delete(pid) : n.add(pid);
      return n;
    });
  };

  const switchCollection = (cid: string) => {
    setActiveId(cid);
    setSelected(new Set());
  };

  return (
    <DashboardLayout>
      {/* Slim top bar */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <Link
          to="/events"
          className="size-10 rounded-xl bg-card/70 border border-border/60 backdrop-blur-md grid place-items-center hover:bg-secondary transition-colors"
          aria-label="Back to events"
        >
          <ArrowLeft className="size-4" />
        </Link>
        <div className="min-w-0">
          <p className="text-[11px] font-medium text-primary uppercase tracking-widest">Event</p>
          <h1 className="font-display font-extrabold text-xl lg:text-2xl tracking-tight truncate">{eventTitle}</h1>
        </div>

        <div className="ml-auto flex flex-wrap items-center gap-2">
          <Button size="sm" className="rounded-xl bg-gradient-primary hover:opacity-90 shadow-glow">
            <Palette className="size-3.5 mr-1.5" /> Design Gallery
          </Button>
          <Button size="sm" variant="secondary" className="rounded-xl border border-border/60">
            <Share2 className="size-3.5 mr-1.5" /> Share URL
          </Button>
          <Link to={`/events/${id}/settings`}>
            <Button size="sm" variant="secondary" className="rounded-xl border border-border/60">
              <SettingsIcon className="size-3.5 mr-1.5" /> Event Settings
            </Button>
          </Link>
        </div>
      </div>

      {/* Workspace: collections rail + photos */}
      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
        {/* Collections rail */}
        <aside className="rounded-[2.5rem] bg-card/50 border border-border/60 backdrop-blur-2xl shadow-elevated flex flex-col lg:sticky lg:top-4 self-start overflow-hidden">
          <div className="p-5">
            <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden group shadow-elevated ring-1 ring-border/60">
              <img
                src={active.cover}
                alt={active.name}
                className="size-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-background/10" />
              <button
                className="absolute top-4 right-4 p-2.5 bg-foreground/10 hover:bg-foreground/20 backdrop-blur-xl rounded-full border border-foreground/20 transition-all active:scale-90"
                aria-label="Change cover image"
              >
                <Pencil className="size-4 text-foreground" />
              </button>
              <div className="absolute bottom-5 left-5 right-5 flex gap-2">
                <div className="flex-1 bg-foreground/10 backdrop-blur-md border border-foreground/10 rounded-2xl p-3 flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/70">Photos</span>
                  <span className="text-xl font-medium text-foreground inline-flex items-center gap-1.5">
                    <ImageIcon className="size-3.5 opacity-60" />
                    {collections.reduce((a, c) => a + c.photos, 0)}
                  </span>
                </div>
                <div className="flex-1 bg-card/40 backdrop-blur-md border border-border/40 rounded-2xl p-3 flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Videos</span>
                  <span className="text-xl font-medium text-muted-foreground inline-flex items-center gap-1.5">
                    <VideoIcon className="size-3.5 opacity-60" />
                    00
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="px-5 space-y-3">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                value={collectionsQuery}
                onChange={(e) => setCollectionsQuery(e.target.value)}
                placeholder="Find collection..."
                className="pl-11 h-11 rounded-2xl bg-secondary/40 border-border/60 text-sm focus-visible:ring-primary/40"
              />
            </div>

            <button className="w-full flex items-center justify-between p-1 pl-4 bg-gradient-primary text-primary-foreground rounded-2xl font-medium transition-all group hover:opacity-95 shadow-glow">
              <span className="text-sm">New Collection</span>
              <div className="w-10 h-10 flex items-center justify-center bg-foreground/15 rounded-xl group-hover:scale-95 transition-transform">
                <Plus className="size-5" />
              </div>
            </button>
          </div>

          <nav className="flex-1 mt-6 px-3 pb-2 space-y-1.5">
            <div className="px-4 mb-3 flex items-center justify-between">
              <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground">Collections</h3>
              <div className="h-px flex-1 ml-4 bg-border/60" />
            </div>

            {filteredCollections.map((c, i) => {
              const isActive = c.id === activeId;
              if (isActive) {
                return (
                  <button
                    key={c.id}
                    onClick={() => switchCollection(c.id)}
                    className="group relative w-full text-left flex items-center gap-4 p-4 bg-primary/10 rounded-[1.5rem] border border-primary/20 shadow-[0_0_20px_hsl(var(--primary)/0.08)]"
                  >
                    <div className="w-1 bg-primary absolute left-0 top-6 bottom-6 rounded-r-full" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-bold text-foreground truncate">{c.name}</p>
                        <span className="text-[10px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                          Active
                        </span>
                      </div>
                      <p className="text-[11px] text-primary/70 mt-0.5 truncate">
                        {c.photos} items{i === 0 ? " • Primary" : ""}
                      </p>
                    </div>
                  </button>
                );
              }
              return (
                <button
                  key={c.id}
                  onClick={() => switchCollection(c.id)}
                  className="group w-full text-left flex items-center gap-4 p-4 hover:bg-secondary/40 rounded-[1.5rem] transition-all border border-transparent hover:border-border/60"
                >
                  <div className="w-10 text-[10px] font-black text-muted-foreground/60 group-hover:text-muted-foreground transition-colors tracking-tighter uppercase">
                    Vol {String(i).padStart(2, "0")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors truncate">
                        {c.name}
                      </p>
                      {c.selected > 0 && (
                        <span className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary)/0.6)] shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground/70 mt-0.5">{c.photos} items</p>
                  </div>
                </button>
              );
            })}
          </nav>

          <div className="p-5 mt-auto">
            <div className="bg-secondary/40 rounded-2xl p-4 border border-border/60">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Vault Usage</span>
                <span className="text-[10px] font-bold text-foreground">45%</span>
              </div>
              <div className="h-1.5 w-full bg-background rounded-full overflow-hidden">
                <div className="h-full w-[45%] bg-gradient-primary rounded-full shadow-[0_0_10px_hsl(var(--primary)/0.4)]" />
              </div>
            </div>
          </div>
        </aside>

        {/* Main: photos for active collection */}
        <section className="min-w-0">
          {/* Slim toolbar */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <h2 className="font-display font-bold text-lg leading-tight truncate mr-2">{active.name}</h2>
            <span className="text-xs text-muted-foreground">{filtered.length} photos</span>

            <div className="ml-auto flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="size-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search photos..."
                  className="pl-8 h-9 w-56 rounded-xl bg-secondary/60 border-border/60 text-xs"
                />
              </div>
              <Button
                size="sm"
                variant={selectMode ? "default" : "secondary"}
                onClick={() => { setSelectMode((v) => !v); if (selectMode) setSelected(new Set()); }}
                className={`rounded-xl border border-border/60 ${selectMode ? "bg-gradient-primary text-primary-foreground" : ""}`}
              >
                <CheckSquare className="size-3.5 mr-1.5" />
                {selectMode ? "Selecting…" : "Select"}
              </Button>
              <Button onClick={() => setUploadOpen(true)} size="sm" className="rounded-xl bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-glow">
                <Upload className="size-3.5 mr-1.5" /> Upload
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

          {/* Selection bar (only when in select mode) */}
          {selectMode && (
            <div className="flex flex-wrap items-center gap-2 mb-4 p-3 rounded-2xl bg-card/60 border border-border/60">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setSelected(new Set(filtered.map((p) => p.id)))}
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
                <X className="size-3.5 mr-1.5" /> Clear
              </Button>
              {selected.size > 0 && (
                <>
                  <Button size="sm" variant="secondary" className="rounded-xl border border-border/60">
                    <Folder className="size-3.5 mr-1.5" /> Move
                  </Button>
                  <Button size="sm" variant="secondary" className="rounded-xl border border-border/60">
                    <Download className="size-3.5 mr-1.5" /> Download
                  </Button>
                  <Button size="sm" variant="ghost" className="rounded-xl border border-destructive/40 text-destructive hover:text-destructive">
                    <Trash2 className="size-3.5 mr-1.5" /> Delete
                  </Button>
                  <span className="ml-auto text-xs text-muted-foreground">
                    <span className="font-semibold text-foreground">{selected.size}</span> selected
                  </span>
                </>
              )}
            </div>
          )}

          {/* Photos */}
          {filtered.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border/70 bg-card/40 p-12 text-center">
              <div className="size-14 rounded-2xl bg-gradient-primary/20 border border-primary/30 grid place-items-center mx-auto mb-3">
                <ImageIcon className="size-6 text-primary" />
              </div>
              <h3 className="font-display font-bold">No photos yet</h3>
              <p className="text-xs text-muted-foreground mt-1 mb-4">Upload media to populate this collection.</p>
              <Button onClick={() => setUploadOpen(true)} size="sm" className="rounded-xl bg-gradient-primary hover:opacity-90 shadow-glow">
                <Upload className="size-3.5 mr-1.5" /> Upload Media
              </Button>
            </div>
          ) : view === "grid" ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
              {filtered.map((p) => {
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
                      <img src={p.src} alt={p.name} loading="lazy"
                        className="size-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      {isSel && <div className="absolute inset-0 bg-primary/20 backdrop-blur-[1px]" />}
                      <div className="absolute top-2 left-2">
                        <div className={`size-6 rounded-md grid place-items-center border transition-all ${
                          isSel
                            ? "bg-gradient-primary border-primary text-primary-foreground shadow-glow"
                            : "bg-card/70 backdrop-blur-md border-border opacity-0 group-hover:opacity-100"
                        }`}>
                          {isSel && <CheckSquare className="size-3.5" />}
                        </div>
                      </div>
                      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />
                      <div className="absolute bottom-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="size-7 rounded-lg glass grid place-items-center hover:bg-primary hover:text-primary-foreground transition-colors">
                          <Download className="size-3.5" />
                        </button>
                        <button className="size-7 rounded-lg glass grid place-items-center hover:bg-secondary transition-colors">
                          <MoreHorizontal className="size-3.5" />
                        </button>
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
              {filtered.map((p) => {
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
                        <MoreHorizontal className="size-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      <UploadDialog open={uploadOpen} onOpenChange={setUploadOpen} mode="image" />
    </DashboardLayout>
  );
};

export default EventDetail;
