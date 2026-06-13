import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { EventCard, EventStatus } from "@/components/EventCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CreateEventDialog } from "@/components/CreateEventDialog";
import { Plus, Search, SlidersHorizontal, ChevronDown, Calendar, TrendingUp, CheckCircle2, Clock } from "lucide-react";
import event1 from "@/assets/event-1.jpg";
import event2 from "@/assets/event-2.jpg";
import event3 from "@/assets/event-3.jpg";
import event4 from "@/assets/event-4.jpg";

const events: Array<{
  title: string; date: string; client: string; status: EventStatus; image?: string; photos: number; progress: number;
}> = [
  { title: "EventBit Corp Gala", date: "Apr 25, 2026", client: "Yash Nasale", status: "In Progress", image: event1, photos: 248, progress: 65 },
  { title: "Aanya & Rohan Wedding", date: "Apr 24, 2026", client: "Deven Rathod", status: "Selection Submitted", image: event2, photos: 1240, progress: 88 },
  { title: "Maya's 5th Birthday", date: "Apr 22, 2026", client: "Priya Sharma", status: "Not Started", photos: 0, progress: 0 },
  { title: "TechSummit Keynote", date: "Apr 20, 2026", client: "Acme Inc.", status: "Completed", image: event4, photos: 512, progress: 100 },
  { title: "Sangeet Ceremony", date: "Apr 18, 2026", client: "Deven Rathod", status: "In Progress", image: event1, photos: 320, progress: 42 },
  { title: "Anniversary Shoot", date: "Apr 15, 2026", client: "Karan Mehta", status: "Selection Submitted", image: event2, photos: 180, progress: 76 },
  { title: "Surprise Birthday Bash", date: "Apr 12, 2026", client: "Neha Kapoor", status: "Completed", image: event3, photos: 295, progress: 100 },
  { title: "Product Launch Night", date: "Apr 10, 2026", client: "Lumen Labs", status: "Not Started", image: event4, photos: 0, progress: 0 },
];

const stats = [
  { label: "Total Events", value: "128", change: "+12%", icon: Calendar, tint: "from-primary to-primary-glow" },
  { label: "In Progress", value: "24", change: "+4 this week", icon: Clock, tint: "from-warning to-orange-400" },
  { label: "Completed", value: "92", change: "+8 this month", icon: CheckCircle2, tint: "from-success to-emerald-400" },
  { label: "Revenue", value: "$48.2k", change: "+18.4%", icon: TrendingUp, tint: "from-info to-cyan-400" },
];

const Index = () => {
  const [createOpen, setCreateOpen] = useState(false);
  return (
    <DashboardLayout>
      {/* Hero header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-aurora border border-border/60 p-6 lg:p-8 mb-8">
        <div className="absolute -top-20 -right-20 size-72 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 size-72 rounded-full bg-info/15 blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-primary uppercase tracking-widest mb-2">Events</p>
            <h1 className="font-display font-extrabold text-3xl lg:text-4xl tracking-tight">
              Manage your <span className="gradient-text">creative</span> projects
            </h1>
            <p className="text-muted-foreground mt-2 max-w-xl">
              Track every shoot, ceremony and corporate event in one place. Share galleries, follow progress and delight your clients.
            </p>
          </div>
          <Button onClick={() => setCreateOpen(true)} size="lg" className="rounded-xl bg-gradient-primary hover:opacity-90 shadow-glow self-start md:self-auto">
            <Plus className="size-4 mr-1.5" /> Create Event
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="relative overflow-hidden rounded-2xl bg-gradient-card border border-border/60 p-5 shadow-card hover:shadow-elevated transition-all hover:-translate-y-0.5">
            <div className={`absolute -right-6 -top-6 size-24 rounded-full bg-gradient-to-br ${s.tint} opacity-20 blur-2xl`} />
            <div className="relative">
              <div className={`inline-flex size-9 rounded-xl bg-gradient-to-br ${s.tint} items-center justify-center text-white shadow-card mb-3`}>
                <s.icon className="size-4" />
              </div>
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="font-display font-bold text-2xl mt-1">{s.value}</p>
              <p className="text-[11px] text-success mt-1">{s.change}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="size-4 text-muted-foreground absolute left-4 top-1/2 -translate-y-1/2" />
          <Input
            placeholder="Search by event name, client, or date..."
            className="pl-11 h-12 rounded-2xl bg-card/60 border-border/60 backdrop-blur-md"
          />
        </div>
        <button className="h-12 px-5 rounded-2xl bg-card/60 border border-border/60 backdrop-blur-md text-sm font-medium flex items-center gap-2 hover:bg-secondary transition-colors">
          Newest First <ChevronDown className="size-4 text-muted-foreground" />
        </button>
        <button className="h-12 px-5 rounded-2xl bg-card/60 border border-border/60 backdrop-blur-md text-sm font-medium flex items-center gap-2 hover:bg-secondary transition-colors">
          <SlidersHorizontal className="size-4" /> Filter
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-6 p-1 rounded-2xl bg-card/60 border border-border/60 backdrop-blur-md w-fit">
        {["All Events", "Upcoming", "In Progress", "Completed"].map((tab, i) => (
          <button
            key={tab}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              i === 0
                ? "bg-gradient-primary text-primary-foreground shadow-glow"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {events.map((e, i) => (
          <div key={i} style={{ animationDelay: `${i * 60}ms` }}>
            <EventCard {...e} id={String(i + 1)} />
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default Index;
