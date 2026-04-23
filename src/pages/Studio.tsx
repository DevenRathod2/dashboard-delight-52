import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Camera, Users, Image as ImageIcon, Sparkles, Upload, Wand2, Film, Palette, ArrowUpRight } from "lucide-react";

const tools = [
  { icon: Wand2, name: "AI Face Recognition", desc: "Auto-tag clients across galleries", color: "from-primary to-primary-glow" },
  { icon: Sparkles, name: "Smart Selections", desc: "Let clients pick their favourites with one tap", color: "from-warning to-orange-400" },
  { icon: Film, name: "Motion Reels", desc: "Auto-generate cinematic reels for socials", color: "from-info to-cyan-400" },
  { icon: Palette, name: "Color Grading", desc: "One-click presets across the entire shoot", color: "from-success to-emerald-400" },
];

const team = [
  { name: "Deven Rathod", role: "Lead Photographer", initials: "DR", status: "online" },
  { name: "Yash Nasale", role: "Editor", initials: "YN", status: "online" },
  { name: "Priya Sharma", role: "Second Shooter", initials: "PS", status: "away" },
  { name: "Amit C.", role: "Retoucher", initials: "AC", status: "offline" },
];

const recentUploads = [
  { name: "Aanya & Rohan Wedding", count: 248, time: "2h ago" },
  { name: "EventBit Corp Gala", count: 120, time: "Yesterday" },
  { name: "Maya's Birthday", count: 85, time: "3d ago" },
];

const Studio = () => {
  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="Studio"
        title={<>Your <span className="gradient-text">creative</span> workspace</>}
        description="AI-powered tools to deliver stunning galleries faster than ever."
        actions={
          <Button size="lg" className="rounded-xl bg-gradient-primary hover:opacity-90 shadow-glow">
            <Upload className="size-4 mr-1.5" /> Upload Media
          </Button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Photos" value="68" hint="Across all events" icon={ImageIcon} tint="from-primary to-primary-glow" />
        <StatCard label="AI Faces" value="0" hint="Auto-tagged" icon={Sparkles} tint="from-warning to-orange-400" />
        <StatCard label="Team Members" value="4" hint="Active collaborators" icon={Users} tint="from-info to-cyan-400" />
        <StatCard label="Sessions" value="12" hint="This month" icon={Camera} tint="from-success to-emerald-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        {/* Tools */}
        <div className="lg:col-span-2 rounded-3xl bg-gradient-card border border-border/60 p-6 shadow-card">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="font-display font-bold text-xl tracking-tight">Studio Tools</p>
              <p className="text-xs text-muted-foreground mt-1">Power-up your post-production workflow</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {tools.map((t) => (
              <button key={t.name} className="group text-left p-5 rounded-2xl bg-secondary/40 border border-border/60 hover:border-primary/40 hover:bg-secondary/60 transition-all hover:-translate-y-0.5">
                <div className={`inline-flex size-11 rounded-xl bg-gradient-to-br ${t.color} items-center justify-center text-white shadow-card mb-3`}>
                  <t.icon className="size-5" />
                </div>
                <p className="font-semibold flex items-center justify-between">
                  {t.name} <ArrowUpRight className="size-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </p>
                <p className="text-xs text-muted-foreground mt-1">{t.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="rounded-3xl bg-gradient-card border border-border/60 p-6 shadow-card">
          <div className="flex items-center justify-between mb-5">
            <p className="font-display font-bold text-xl tracking-tight">Team</p>
            <Button variant="secondary" size="sm" className="rounded-xl">Invite</Button>
          </div>
          <div className="space-y-2">
            {team.map((m) => (
              <div key={m.name} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-secondary/40 border border-transparent hover:border-border/60 transition-colors">
                <div className="relative">
                  <div className="size-10 rounded-xl bg-gradient-primary grid place-items-center text-xs font-bold text-primary-foreground shadow-glow">{m.initials}</div>
                  <span className={`absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-card ${
                    m.status === "online" ? "bg-success" : m.status === "away" ? "bg-warning" : "bg-muted-foreground"
                  }`} />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{m.name}</p>
                  <p className="text-[11px] text-muted-foreground">{m.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent uploads */}
      <div className="rounded-3xl bg-gradient-card border border-border/60 p-6 shadow-card">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="font-display font-bold text-xl tracking-tight">Recent Uploads</p>
            <p className="text-xs text-muted-foreground mt-1">Latest media added to your studio</p>
          </div>
          <Button variant="secondary" size="sm" className="rounded-xl">View All</Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {recentUploads.map((u) => (
            <div key={u.name} className="p-5 rounded-2xl bg-secondary/40 border border-border/60 hover:border-primary/40 transition-all group cursor-pointer">
              <div className="aspect-video rounded-xl bg-gradient-aurora mb-3 grid place-items-center">
                <ImageIcon className="size-8 text-primary/60" />
              </div>
              <p className="font-semibold text-sm group-hover:gradient-text transition-all">{u.name}</p>
              <p className="text-[11px] text-muted-foreground mt-1">{u.count} photos • {u.time}</p>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Studio;
