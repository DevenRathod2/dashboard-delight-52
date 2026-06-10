import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft, Image as ImageIcon, CheckCircle2, HardDrive, CalendarDays,
  Palette, Share2, KeyRound, Eye, MoreHorizontal, Edit3, Plus, Copy,
  Search, Filter, Upload, Download, LayoutGrid, List, CheckSquare, X,
  Folder, Heart, Trash2, ChevronDown, Monitor, Smartphone, FileText,
  Star, Sparkles, Video as VideoIcon, Pencil,
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
  description: string;
  cover: string;
  photos: number;
  selected: number;
  likes: number;
  active: boolean;
};

const collectionsSeed: Collection[] = [
  { id: "day-1", name: "Day 1", description: "this is day 1 photos", cover: event1, photos: 42, selected: 0, likes: 0, active: true },
  { id: "day-2", name: "Day 2", description: "Beautiful moments from day 2", cover: event2, photos: 18, selected: 0, likes: 0, active: true },
  { id: "day-3", name: "Reception", description: "Evening reception highlights", cover: event3, photos: 64, selected: 4, likes: 12, active: true },
  { id: "day-4", name: "Portraits", description: "Couple portraits & details", cover: event4, photos: 28, selected: 2, likes: 6, active: false },
];

const buildPhotos = (cover: string, count: number) =>
  Array.from({ length: count }).map((_, i) => ({
    id: i + 1,
    name: `DSC0${6848 + i}.JPG`,
    size: `${(7 + (i % 16) + Math.random()).toFixed(1)} MB`,
    date: "29/03/2026",
    src: covers[i % covers.length],
    coverHint: cover,
  }));

const Stat = ({
  icon: Icon, value, label, tint,
}: { icon: any; value: string; label: string; tint: string }) => (
  <div className="flex items-center gap-2.5">
    <div className={`size-9 rounded-xl bg-gradient-to-br ${tint} grid place-items-center text-white shadow-card`}>
      <Icon className="size-4" />
    </div>
    <div className="leading-tight">
      <p className="text-sm font-bold">{value}</p>
      <p className="text-[11px] text-muted-foreground">{label}</p>
    </div>
  </div>
);

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
  const photos = buildPhotos(active.cover, Math.max(active.photos, 8));
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
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-aurora border border-border/60 p-5 lg:p-6 mb-6">
        <div className="absolute -top-20 -right-20 size-72 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 size-72 rounded-full bg-info/15 blur-3xl pointer-events-none" />

        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              to="/events"
              className="size-10 rounded-xl bg-card/70 border border-border/60 backdrop-blur-md grid place-items-center hover:bg-secondary transition-colors"
              aria-label="Back to events"
            >
              <ArrowLeft className="size-4" />
            </Link>
            <div>
              <p className="text-[11px] font-medium text-primary uppercase tracking-widest">Event</p>
              <div className="flex items-center gap-3">
                <h1 className="font-display font-extrabold text-2xl lg:text-3xl tracking-tight">{eventTitle}</h1>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-info/15 text-info border border-info/30">
                  <span className="size-1.5 rounded-full bg-current" /> Planned
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" className="rounded-xl bg-gradient-primary hover:opacity-90 shadow-glow">
              <Palette className="size-3.5 mr-1.5" /> Design Gallery
            </Button>
            <Button size="sm" variant="secondary" className="rounded-xl border border-border/60">
              <Share2 className="size-3.5 mr-1.5" /> Share URL
            </Button>
            <Button size="sm" variant="secondary" className="rounded-xl border border-border/60">
              <KeyRound className="size-3.5 mr-1.5" /> Access Code: 2233
              <Copy className="size-3 ml-1.5 text-muted-foreground" />
            </Button>
            <Button size="sm" variant="secondary" className="rounded-xl border border-border/60">
              <Eye className="size-3.5 mr-1.5" /> Preview
            </Button>
            <Button size="sm" variant="ghost" className="rounded-xl border border-border/60 size-9 p-0">
              <MoreHorizontal className="size-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Stats strip */}
      <div className="rounded-2xl bg-card/60 border border-border/60 backdrop-blur-md shadow-card p-4 mb-6">
        <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
          <Stat icon={ImageIcon} value={String(collections.reduce((a, c) => a + c.photos, 0))} label="Total Photos" tint="from-primary to-primary-glow" />
          <Stat icon={CheckCircle2} value={String(collections.reduce((a, c) => a + c.selected, 0))} label="Selected" tint="from-success to-emerald-400" />
          <Stat icon={HardDrive} value="2.99 GB" label="Storage" tint="from-warning to-orange-400" />
          <Stat icon={CalendarDays} value="31/03/2026" label="Completed" tint="from-info to-cyan-400" />

          <div className="flex items-center gap-2">
            <p className="text-xs text-muted-foreground">Selection Status</p>
            <Select defaultValue="under">
              <SelectTrigger className="h-9 w-[180px] rounded-xl bg-secondary/60 border-border/60 text-xs font-semibold uppercase tracking-wide">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="under">Under Selection</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs">Publish gallery</span>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs">AI Face Search</span>
            <Switch />
          </div>
        </div>
      </div>

      {/* Workspace: collections rail + photos */}
      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
        {/* Collections rail */}
        <aside className="rounded-3xl bg-card/60 border border-border/60 backdrop-blur-md shadow-card p-3 lg:sticky lg:top-4 self-start">
          <div className="flex items-center justify-between px-2 pt-1 pb-3">
            <div className="flex items-center gap-2">
              <h2 className="font-display font-bold text-sm">Collections</h2>
              <span className="size-5 rounded-full bg-warning text-warning-foreground text-[10px] font-bold grid place-items-center">
                {collections.length}
              </span>
            </div>
            <button className="size-7 rounded-lg hover:bg-secondary grid place-items-center" aria-label="New collection">
              <Plus className="size-3.5" />
            </button>
          </div>

          <div className="relative px-1 mb-2">
            <Search className="size-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              value={collectionsQuery}
              onChange={(e) => setCollectionsQuery(e.target.value)}
              placeholder="Search collections..."
              className="pl-8 h-9 rounded-xl bg-secondary/60 border-border/60 text-xs"
            />
          </div>

          <div className="space-y-1.5 max-h-[68vh] overflow-y-auto pr-1">
            {filteredCollections.map((c) => {
              const isActive = c.id === activeId;
              return (
                <button
                  key={c.id}
                  onClick={() => switchCollection(c.id)}
                  className={`group w-full text-left rounded-2xl border transition-all p-2 flex items-center gap-3 ${
                    isActive
                      ? "bg-gradient-primary/15 border-primary/40 shadow-glow"
                      : "bg-card/40 border-border/60 hover:bg-secondary/60"
                  }`}
                >
                  <div className="relative size-12 rounded-xl overflow-hidden shrink-0">
                    <img src={c.cover} alt={c.name} className="size-full object-cover" />
                    {isActive && <div className="absolute inset-0 ring-2 ring-primary rounded-xl" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className={`text-sm font-semibold truncate ${isActive ? "gradient-text" : ""}`}>
                        {c.name}
                      </p>
                      {c.active ? (
                        <span className="size-1.5 rounded-full bg-success shrink-0" />
                      ) : (
                        <span className="size-1.5 rounded-full bg-muted-foreground/50 shrink-0" />
                      )}
                    </div>
                    <div className="flex items-center gap-2.5 text-[10px] text-muted-foreground mt-0.5">
                      <span className="inline-flex items-center gap-0.5">
                        <ImageIcon className="size-3" /> {c.photos}
                      </span>
                      <span className="inline-flex items-center gap-0.5">
                        <CheckCircle2 className="size-3 text-success" /> {c.selected}
                      </span>
                      <span className="inline-flex items-center gap-0.5">
                        <Heart className="size-3 text-destructive" /> {c.likes}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}

            <button
              className="w-full rounded-2xl border-2 border-dashed border-border/70 hover:border-primary/60 p-3 flex items-center gap-2 justify-center text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <Plus className="size-3.5" /> New collection
            </button>
          </div>
        </aside>

        {/* Main: photos for active collection */}
        <section className="min-w-0">
          {/* Collection header */}
          <div className="rounded-3xl bg-card/60 border border-border/60 backdrop-blur-md shadow-card p-4 mb-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="size-11 rounded-2xl overflow-hidden shrink-0">
                <img src={active.cover} alt={active.name} className="size-full object-cover" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="font-display font-bold text-lg leading-tight truncate">{active.name}</h2>
                  <button className="size-6 rounded-md hover:bg-secondary grid place-items-center" aria-label="Rename">
                    <Edit3 className="size-3 text-muted-foreground" />
                  </button>
                  <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                    active.active ? "bg-success/15 text-success border-success/30" : "bg-muted/40 text-muted-foreground border-border"
                  }`}>
                    <span className="size-1.5 rounded-full bg-current" /> {active.active ? "Active" : "Hidden"}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground truncate">{active.description}</p>
              </div>

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
                <Button variant="secondary" size="sm" className="rounded-xl border border-border/60">
                  <Filter className="size-3.5 mr-1.5" /> All
                </Button>
                <Button onClick={() => setUploadOpen(true)} size="sm" className="rounded-xl bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-glow">
                  <Upload className="size-3.5 mr-1.5" /> Upload
                </Button>
                <Button size="sm" variant="secondary" className="rounded-xl border border-border/60">
                  <Download className="size-3.5 mr-1.5" /> Get ({selected.size})
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
            <div className="flex flex-wrap items-center gap-2 mt-4">
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
                  <Button size="sm" variant="ghost" className="rounded-xl border border-destructive/40 text-destructive hover:text-destructive">
                    <Trash2 className="size-3.5 mr-1.5" /> Delete
                  </Button>
                  <span className="ml-auto text-xs text-muted-foreground">
                    <span className="font-semibold text-foreground">{selected.size}</span> selected
                  </span>
                </>
              )}
            </div>
          </div>

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
