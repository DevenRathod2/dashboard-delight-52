import { Link, useParams } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft, Image as ImageIcon, CheckCircle2, HardDrive, CalendarDays,
  Palette, Share2, KeyRound, Eye, MoreHorizontal, Edit3, Plus, Copy,
} from "lucide-react";
import event1 from "@/assets/event-1.jpg";
import event2 from "@/assets/event-2.jpg";

const collections = [
  {
    id: "day-1",
    name: "Day 1",
    description: "this is day 1 photos",
    cover: event1,
    photos: 42,
    selected: 0,
    likes: 0,
    active: true,
  },
  {
    id: "day-2",
    name: "Day 2",
    description: "Beautiful moments from day 2",
    cover: event2,
    photos: 0,
    selected: 0,
    likes: 0,
    active: true,
  },
];

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

  return (
    <DashboardLayout>
      {/* Top header bar */}
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

      {/* Stats / settings strip */}
      <div className="rounded-2xl bg-card/60 border border-border/60 backdrop-blur-md shadow-card p-4 mb-8">
        <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
          <Stat icon={ImageIcon} value="42" label="Total Photos" tint="from-primary to-primary-glow" />
          <Stat icon={CheckCircle2} value="0" label="Selected" tint="from-success to-emerald-400" />
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

      {/* Active collections heading */}
      <div className="flex items-center gap-3 mb-5">
        <h2 className="font-display font-bold text-xl">Active Collections</h2>
        <span className="size-6 rounded-full bg-warning text-warning-foreground text-[11px] font-bold grid place-items-center shadow-card">
          {collections.length}
        </span>
      </div>

      {/* Collections grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {collections.map((c) => (
          <article
            key={c.id}
            className="group relative rounded-3xl overflow-hidden bg-gradient-card border border-border/60 shadow-card hover:shadow-elevated transition-all duration-500 hover:-translate-y-1"
          >
            <div className="absolute -inset-px rounded-3xl bg-gradient-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-md" />

            <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
              <img
                src={c.cover}
                alt={c.name}
                loading="lazy"
                className="size-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-x-0 top-0 p-3 flex items-start justify-between bg-gradient-to-b from-black/50 to-transparent">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border backdrop-blur-md bg-success/20 text-success border-success/30">
                  <span className="size-1.5 rounded-full bg-current" /> Active
                </span>
                <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="size-8 rounded-lg glass grid place-items-center hover:bg-primary hover:text-primary-foreground transition-colors">
                    <Eye className="size-3.5" />
                  </button>
                  <button className="size-8 rounded-lg glass grid place-items-center hover:bg-primary hover:text-primary-foreground transition-colors">
                    <Edit3 className="size-3.5" />
                  </button>
                  <button className="size-8 rounded-lg glass grid place-items-center hover:bg-secondary transition-colors">
                    <MoreHorizontal className="size-3.5" />
                  </button>
                </div>
              </div>
              <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-card to-transparent pointer-events-none" />
            </div>

            <div className="p-5 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-display font-bold text-lg leading-tight tracking-tight group-hover:gradient-text transition-all">
                    {c.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{c.description}</p>
                </div>
                <Switch defaultChecked={c.active} />
              </div>

              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <ImageIcon className="size-3.5 text-warning" /> {c.photos}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="size-3.5 text-success" /> {c.selected}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="text-destructive">♥</span> {c.likes}
                </span>
              </div>

              <Link to={`/events/${id ?? "1"}/collections/${c.id}`}>
                <Button className="w-full rounded-xl bg-gradient-primary hover:opacity-90 shadow-glow">
                  View Collection
                </Button>
              </Link>
            </div>
          </article>
        ))}

        {/* Create new collection */}
        <button className="group rounded-3xl border-2 border-dashed border-border hover:border-primary/60 bg-card/40 backdrop-blur-md p-6 flex flex-col items-center justify-center text-center min-h-[420px] transition-all hover:bg-card/60">
          <div className="size-14 rounded-2xl bg-gradient-primary/20 border border-primary/30 grid place-items-center mb-4 group-hover:scale-110 transition-transform">
            <Plus className="size-6 text-primary" />
          </div>
          <h3 className="font-display font-bold text-base">Create New Collection</h3>
          <p className="text-xs text-muted-foreground mt-1.5 mb-4 max-w-[220px]">
            Add a new collection to organize your photos
          </p>
          <Button variant="secondary" size="sm" className="rounded-xl border border-border/60">
            <Plus className="size-3.5 mr-1.5" /> Create Collection
          </Button>
        </button>
      </div>
    </DashboardLayout>
  );
};

export default EventDetail;
