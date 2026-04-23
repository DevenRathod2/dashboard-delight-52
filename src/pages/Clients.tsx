import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, SlidersHorizontal, ChevronDown, Eye, Edit3, Trash2, Phone, Mail, Calendar } from "lucide-react";

const clients = [
  { name: "Deven Rathod", phone: "8788887676", email: "deven@studio.in", events: 1, initials: "DR" },
  { name: "Deven Rathod", phone: "23908479877888", email: "deven2@studio.in", events: 1, initials: "DR" },
  { name: "Yash Nasale", phone: "+918788887373", email: "yash@studio.in", events: 1, initials: "YN" },
  { name: "Deven Rathod", phone: "9822582423", email: "deven3@studio.in", events: 1, initials: "DR" },
  { name: "Amit Chaluripagaar", phone: "8788887373", email: "amit@studio.in", events: 1, initials: "AC" },
  { name: "Priya Sharma", phone: "9988776655", email: "priya@studio.in", events: 3, initials: "PS" },
];

const Clients = () => {
  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="Clients"
        title={<>Your <span className="gradient-text">creative</span> clientele</>}
        description="Manage your photography clients and their events in one elegant place."
        actions={
          <Button size="lg" className="rounded-xl bg-gradient-primary hover:opacity-90 shadow-glow">
            <Plus className="size-4 mr-1.5" /> Add Client
          </Button>
        }
      />

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="size-4 text-muted-foreground absolute left-4 top-1/2 -translate-y-1/2" />
          <Input
            placeholder="Search by name, email, or phone..."
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

      {/* Table */}
      <div className="rounded-3xl bg-gradient-card border border-border/60 shadow-card overflow-hidden">
        <div className="hidden md:grid grid-cols-[1.5fr_1.5fr_0.7fr_0.8fr] gap-4 px-6 py-4 border-b border-border/60 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground bg-secondary/30">
          <div>Name</div>
          <div>Contact</div>
          <div>Events</div>
          <div className="text-right">Actions</div>
        </div>
        <div className="divide-y divide-border/40">
          {clients.map((c, i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-[1.5fr_1.5fr_0.7fr_0.8fr] gap-4 px-6 py-4 items-center hover:bg-secondary/30 transition-colors group">
              <div className="flex items-center gap-3">
                <div className="size-11 rounded-xl bg-gradient-primary grid place-items-center text-sm font-bold text-primary-foreground shadow-glow">
                  {c.initials}
                </div>
                <div>
                  <p className="font-semibold text-sm">{c.name}</p>
                  <p className="text-[11px] text-muted-foreground inline-flex items-center gap-1"><Mail className="size-3" /> {c.email}</p>
                </div>
              </div>
              <div className="text-sm text-muted-foreground inline-flex items-center gap-2">
                <span className="size-7 rounded-lg bg-secondary/60 grid place-items-center"><Phone className="size-3.5" /></span>
                {c.phone}
              </div>
              <div className="text-sm">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/15 text-primary border border-primary/30 text-xs font-semibold">
                  <Calendar className="size-3" /> {c.events}
                </span>
              </div>
              <div className="flex items-center justify-end gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                <button className="size-9 rounded-xl bg-secondary/60 border border-border/60 grid place-items-center hover:bg-secondary hover:text-primary transition-all">
                  <Eye className="size-4" />
                </button>
                <button className="size-9 rounded-xl bg-secondary/60 border border-border/60 grid place-items-center hover:bg-secondary hover:text-info transition-all">
                  <Edit3 className="size-4" />
                </button>
                <button className="size-9 rounded-xl bg-secondary/60 border border-border/60 grid place-items-center hover:bg-destructive/15 hover:text-destructive hover:border-destructive/40 transition-all">
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between px-6 py-4 border-t border-border/60">
          <p className="text-xs text-muted-foreground">Showing 1 to {clients.length} of {clients.length} clients</p>
          <div className="flex items-center gap-2">
            <button className="size-9 rounded-xl bg-secondary/60 border border-border/60 grid place-items-center hover:bg-secondary"><ChevronDown className="size-4 rotate-90" /></button>
            <span className="text-xs">Page 1 of 1</span>
            <button className="size-9 rounded-xl bg-secondary/60 border border-border/60 grid place-items-center hover:bg-secondary"><ChevronDown className="size-4 -rotate-90" /></button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Clients;
