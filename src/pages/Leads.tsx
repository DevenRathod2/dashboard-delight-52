import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Filter, Users, Clock, TrendingUp, CheckCircle2, Eye, Trash2, Phone, Mail, MapPin, Calendar } from "lucide-react";

const leads = [
  { client: "Deven Rathod", email: "devenrathod2001@gmail.com", event: "Wedding Event", date: "25/04/2026", status: "Pending", initials: "DR" },
  { client: "Deven Rathod", email: "devenrathod2001@gmail.com", event: "Birthday", date: "07/05/2026", status: "Pending", initials: "DR" },
  { client: "Deven Rathod", email: "devenrathod2001@gmail.com", event: "Corporate", date: "22/04/2026", status: "Pending", initials: "DR" },
  { client: "EventBit Rathod", email: "admin@eventbit.io", event: "Pre-Wedding", date: "07/03/2026", status: "Active", initials: "ER" },
];

const tabs = ["All", "New", "Pending", "Confirmed", "Declined", "Cancelled"];

const Leads = () => {
  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="Lead Pipeline"
        title={<>Convert <span className="gradient-text">enquiries</span> into bookings</>}
        description="Monitor quotation requests from your public portfolio and add manual enquiries."
        actions={
          <Button size="lg" className="rounded-xl bg-gradient-primary hover:opacity-90 shadow-glow">
            <Plus className="size-4 mr-1.5" /> Add Lead
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Leads" value="4" hint="All enquiry sources" icon={Users} tint="from-info to-cyan-400" />
        <StatCard label="Pending" value="3" hint="Awaiting response" icon={Clock} tint="from-warning to-orange-400" />
        <StatCard label="Active" value="1" hint="Pipeline in motion" icon={TrendingUp} tint="from-primary to-primary-glow" />
        <StatCard label="Confirmed" value="0" hint="Converted bookings" icon={CheckCircle2} tint="from-success to-emerald-400" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Lead activity */}
        <div className="xl:col-span-2 rounded-3xl bg-gradient-card border border-border/60 p-6 shadow-card">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-5">
            <div>
              <p className="font-display font-bold text-xl tracking-tight">Lead activity</p>
              <p className="text-xs text-muted-foreground mt-1">Filter, follow up, and convert your warm enquiries.</p>
            </div>
            <div className="relative w-full md:w-72">
              <Search className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <Input placeholder="Search client, package..." className="pl-9 h-10 rounded-xl bg-secondary/60 border-border/60" />
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
            <div className="flex items-center gap-1 p-1 rounded-2xl bg-secondary/60 border border-border/60">
              {tabs.map((t, i) => (
                <button
                  key={t}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    i === 0 ? "bg-gradient-primary text-primary-foreground shadow-glow" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <button className="h-9 px-3 rounded-xl bg-secondary/60 border border-border/60 text-xs font-medium inline-flex items-center gap-1.5 hover:bg-secondary">
              <Filter className="size-3.5" /> All stages
            </button>
          </div>

          <div className="space-y-2">
            {leads.map((l, i) => (
              <div key={i} className="grid grid-cols-[auto_1fr_auto] md:grid-cols-[auto_1.4fr_1fr_auto_auto] items-center gap-4 p-4 rounded-2xl hover:bg-secondary/40 border border-transparent hover:border-border/60 transition-all group">
                <div className="size-10 rounded-xl bg-gradient-primary grid place-items-center text-xs font-bold text-primary-foreground shadow-glow">
                  {l.initials}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-sm truncate">{l.client}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{l.email}</p>
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium">{l.event}</p>
                  <p className="text-[11px] text-muted-foreground inline-flex items-center gap-1"><Calendar className="size-3" /> {l.date}</p>
                </div>
                <span className={`hidden md:inline-flex text-[11px] px-2.5 py-1 rounded-full border font-semibold ${
                  l.status === "Pending" ? "bg-warning/15 text-warning border-warning/30" : "bg-info/15 text-info border-info/30"
                }`}>{l.status}</span>
                <div className="flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                  <button className="size-8 rounded-lg bg-secondary/60 border border-border/60 grid place-items-center hover:text-primary"><Eye className="size-3.5" /></button>
                  <button className="size-8 rounded-lg bg-secondary/60 border border-border/60 grid place-items-center hover:text-destructive hover:bg-destructive/10"><Trash2 className="size-3.5" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lead details */}
        <div className="rounded-3xl bg-gradient-card border border-border/60 p-6 shadow-card relative overflow-hidden">
          <div className="absolute -right-10 -top-10 size-40 rounded-full bg-primary/15 blur-3xl" />
          <div className="relative">
            <p className="font-display font-bold text-xl tracking-tight">Lead details</p>
            <p className="text-xs text-muted-foreground mt-1">Notes, budget, and quick pipeline actions.</p>

            <div className="flex items-center gap-3 mt-6 p-4 rounded-2xl bg-secondary/40 border border-border/60">
              <div className="size-12 rounded-xl bg-gradient-primary grid place-items-center text-sm font-bold text-primary-foreground shadow-glow">DR</div>
              <div>
                <p className="font-semibold">Deven Rathod</p>
                <p className="text-xs text-muted-foreground">devenrathod2001@gmail.com</p>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Pipeline status</p>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-warning/15 text-warning border border-warning/30 font-semibold">Pending</span>
              </div>
              <div className="h-11 rounded-xl bg-secondary/60 border border-border/60 px-4 flex items-center justify-between text-sm">
                PENDING <span className="text-muted-foreground">▾</span>
              </div>
            </div>

            <div className="mt-6">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">Event details</p>
              <div className="space-y-2.5">
                {[
                  { icon: Phone, label: "Phone", val: "+91 87888 87373" },
                  { icon: Mail, label: "Email", val: "devenrathod2001@gmail.com" },
                  { icon: MapPin, label: "Location", val: "Pune, India" },
                  { icon: Calendar, label: "Event Date", val: "25 Apr 2026" },
                ].map((row) => (
                  <div key={row.label} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/40 border border-border/60">
                    <div className="size-9 rounded-lg bg-gradient-primary grid place-items-center text-primary-foreground">
                      <row.icon className="size-4" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{row.label}</p>
                      <p className="text-sm font-medium">{row.val}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Button className="w-full mt-6 rounded-xl bg-gradient-primary hover:opacity-90 shadow-glow">Convert to Booking</Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Leads;
