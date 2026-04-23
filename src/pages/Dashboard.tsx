import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, DollarSign, HardDrive, Plus, ChevronLeft, ChevronRight, ArrowUpRight, Users } from "lucide-react";

const days = Array.from({ length: 35 }, (_, i) => i - 1);
const eventDays: Record<number, string[]> = {
  2: ["warning"],
  7: ["warning"],
  23: ["primary"],
  24: ["info"],
  25: ["info", "warning"],
};

const pipeline = [
  { client: "Aanya Sharma", event: "Wedding Photography", date: "07/05/2026", status: "Pending", amount: "₹85,000" },
  { client: "Rohan Patel", event: "Corporate Gala", date: "22/04/2026", status: "Active", amount: "₹42,000" },
  { client: "Maya Iyer", event: "Birthday Shoot", date: "12/04/2026", status: "Confirmed", amount: "₹18,500" },
];

const topClients = [
  { name: "Deven Rathod", events: 8, spent: "₹1,24,000", initials: "DR" },
  { name: "Yash Nasale", events: 5, spent: "₹86,500", initials: "YN" },
  { name: "Priya Sharma", events: 4, spent: "₹52,000", initials: "PS" },
];

const Dashboard = () => {
  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="Dashboard"
        title={<>Welcome back, <span className="gradient-text">Deven</span></>}
        description="Here's what's happening with your photography business today."
        actions={
          <Button size="lg" className="rounded-xl bg-gradient-primary hover:opacity-90 shadow-glow">
            <Plus className="size-4 mr-1.5" /> Create Event
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Pending Selections" value="1" hint="Awaiting client review" icon={Clock} tint="from-info to-cyan-400" />
        <StatCard label="Total Events" value="5" hint="4 upcoming this month" icon={Calendar} tint="from-primary to-primary-glow" />
        <StatCard label="Revenue" value="₹0" hint="No revenue yet" icon={DollarSign} tint="from-success to-emerald-400" />
        <StatCard label="Storage Used" value="3.01 GB" hint="1% of 500 GB" icon={HardDrive} tint="from-warning to-orange-400" />
      </div>

      {/* Calendar + planned today */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5 mb-8">
        {/* Calendar */}
        <div className="xl:col-span-3 rounded-3xl bg-gradient-card border border-border/60 p-6 shadow-card">
          <div className="flex items-center justify-between mb-5">
            <button className="size-9 rounded-xl bg-secondary/60 border border-border/60 grid place-items-center hover:bg-secondary transition-colors">
              <ChevronLeft className="size-4" />
            </button>
            <p className="font-display font-bold text-lg tracking-tight">April 2026</p>
            <button className="size-9 rounded-xl bg-secondary/60 border border-border/60 grid place-items-center hover:bg-secondary transition-colors">
              <ChevronRight className="size-4" />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1.5 text-center text-[11px] text-muted-foreground mb-2">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1.5">
            {days.map((d, i) => {
              const day = d <= 0 ? 30 + d : d > 30 ? d - 30 : d;
              const isOtherMonth = d <= 0 || d > 30;
              const isActive = d === 23;
              const dots = eventDays[d] || [];
              return (
                <button
                  key={i}
                  className={`relative aspect-square rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-gradient-primary text-primary-foreground shadow-glow"
                      : isOtherMonth
                      ? "text-muted-foreground/30"
                      : "hover:bg-secondary text-foreground"
                  }`}
                >
                  {day}
                  {dots.length > 0 && !isActive && (
                    <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex gap-0.5">
                      {dots.map((c, j) => (
                        <span key={j} className={`size-1 rounded-full bg-${c}`} />
                      ))}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <div className="flex flex-wrap gap-3 mt-5 text-[11px] text-muted-foreground">
            {[
              { label: "Wedding", c: "bg-success" },
              { label: "Birthday", c: "bg-warning" },
              { label: "Corporate", c: "bg-primary" },
              { label: "Delivery", c: "bg-info" },
              { label: "Pre-Wedding", c: "bg-primary-glow" },
            ].map((x) => (
              <span key={x.label} className="inline-flex items-center gap-1.5">
                <span className={`size-2 rounded-full ${x.c}`} /> {x.label}
              </span>
            ))}
          </div>
        </div>

        {/* Planned today */}
        <div className="xl:col-span-2 rounded-3xl bg-gradient-card border border-border/60 p-6 shadow-card flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] font-bold text-warning uppercase tracking-widest">Planned for today</p>
            <span className="text-[11px] text-muted-foreground">0 events</span>
          </div>
          <p className="font-display font-bold text-xl tracking-tight">Thursday, 23 April</p>

          <div className="flex-1 grid place-items-center py-10">
            <div className="text-center">
              <div className="size-16 mx-auto rounded-2xl bg-gradient-aurora border border-border/60 grid place-items-center mb-4">
                <Calendar className="size-7 text-primary" />
              </div>
              <p className="font-medium">Nothing planned for this day</p>
              <p className="text-xs text-muted-foreground mt-1">Select a date with events or create a new one</p>
              <Button size="sm" className="mt-5 rounded-xl bg-gradient-primary hover:opacity-90 shadow-glow">
                <Plus className="size-3.5 mr-1.5" /> Create Event
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Pipeline + Top Clients */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="rounded-3xl bg-gradient-card border border-border/60 p-6 shadow-card">
          <div className="flex items-start justify-between mb-5">
            <div>
              <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Booking pipeline</p>
              <p className="font-display font-bold text-xl tracking-tight mt-1">Requests & Quotations</p>
              <p className="text-xs text-muted-foreground mt-1">Follow up on new enquiries and pending approvals</p>
            </div>
            <Button variant="secondary" size="sm" className="rounded-xl">Manage Leads</Button>
          </div>
          <div className="space-y-2">
            {pipeline.map((p) => (
              <div key={p.client} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-secondary/40 transition-colors border border-transparent hover:border-border/60">
                <div className="size-10 rounded-xl bg-gradient-primary grid place-items-center text-xs font-bold text-primary-foreground shadow-glow">
                  {p.client.split(" ").map(s => s[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{p.client}</p>
                  <p className="text-xs text-muted-foreground truncate">{p.event} • {p.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-sm">{p.amount}</p>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                    p.status === "Pending" ? "bg-warning/15 text-warning border-warning/30" :
                    p.status === "Active" ? "bg-info/15 text-info border-info/30" :
                    "bg-success/15 text-success border-success/30"
                  }`}>{p.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl bg-gradient-card border border-border/60 p-6 shadow-card relative overflow-hidden">
          <div className="absolute -right-10 -top-10 size-40 rounded-full bg-primary/15 blur-3xl" />
          <div className="relative flex items-start justify-between mb-5">
            <div>
              <p className="text-[10px] font-bold text-primary-glow uppercase tracking-widest">Top Clients</p>
              <p className="font-display font-bold text-xl tracking-tight mt-1">Most Active Clients</p>
              <p className="text-xs text-muted-foreground mt-1">Stay in touch with your most engaged clients</p>
            </div>
            <Button variant="secondary" size="sm" className="rounded-xl">
              <Users className="size-3.5 mr-1.5" /> View All
            </Button>
          </div>
          <div className="relative space-y-2">
            {topClients.map((c, i) => (
              <div key={c.name} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-secondary/40 transition-colors border border-transparent hover:border-border/60">
                <div className="relative">
                  <div className="size-10 rounded-xl bg-gradient-primary grid place-items-center text-xs font-bold text-primary-foreground shadow-glow">
                    {c.initials}
                  </div>
                  {i === 0 && <span className="absolute -top-1 -right-1 text-[10px]">👑</span>}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.events} events</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-sm">{c.spent}</p>
                  <p className="text-[10px] text-success inline-flex items-center gap-0.5"><ArrowUpRight className="size-3" /> Lifetime</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
