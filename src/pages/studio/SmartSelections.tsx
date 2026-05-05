import { useMemo, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Sparkles, Heart, Star, Filter, Share2, Copy, Check, Image as ImageIcon,
  ArrowLeft, Users, Eye, Send,
} from "lucide-react";
import { Link } from "react-router-dom";
import event1 from "@/assets/event-1.jpg";
import event2 from "@/assets/event-2.jpg";
import event3 from "@/assets/event-3.jpg";
import event4 from "@/assets/event-4.jpg";

const photos = Array.from({ length: 12 }).map((_, i) => ({
  id: `p${i}`,
  src: [event1, event2, event3, event4][i % 4],
  picks: Math.floor(Math.random() * 8),
  aiScore: Math.floor(60 + Math.random() * 40),
}));

const SmartSelections = () => {
  const [favorites, setFavorites] = useState<Set<string>>(new Set(["p0", "p3", "p7"]));
  const [filter, setFilter] = useState<"all" | "ai" | "client">("all");
  const [aiAssist, setAiAssist] = useState(true);
  const [allowComments, setAllowComments] = useState(true);
  const [copied, setCopied] = useState(false);

  const toggleFav = (id: string) => {
    setFavorites((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  const visible = useMemo(() => {
    if (filter === "ai") return [...photos].sort((a, b) => b.aiScore - a.aiScore);
    if (filter === "client") return [...photos].sort((a, b) => b.picks - a.picks);
    return photos;
  }, [filter]);

  const shareLink = "https://lensly.app/g/aanya-rohan/select";

  return (
    <DashboardLayout>
      <Link to="/studio" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="size-4" /> Back to Studio
      </Link>
      <PageHeader
        eyebrow="Studio"
        title={<>Smart <span className="gradient-text">Selections</span></>}
        description="Let your clients heart their favorites — and let AI suggest the very best frames in seconds."
        actions={
          <Button className="rounded-xl bg-gradient-primary shadow-glow">
            <Send className="size-4 mr-1.5" /> Send to Client
          </Button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Photos" value={String(photos.length)} icon={ImageIcon} tint="from-primary to-primary-glow" />
        <StatCard label="Client Picks" value={String(photos.reduce((s, p) => s + p.picks, 0))} icon={Heart} tint="from-warning to-orange-400" />
        <StatCard label="AI Top Picks" value="6" icon={Sparkles} tint="from-info to-cyan-400" />
        <StatCard label="Reviewers" value="3" hint="2 active now" icon={Users} tint="from-success to-emerald-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 rounded-3xl bg-gradient-card border border-border/60 p-6 shadow-card">
          <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
            <div className="flex items-center gap-1 p-1 rounded-xl bg-secondary/60 border border-border/60">
              {[
                { k: "all", label: "All" },
                { k: "ai", label: "AI Picks" },
                { k: "client", label: "Client Favs" },
              ].map((t) => (
                <button
                  key={t.k}
                  onClick={() => setFilter(t.k as any)}
                  className={`px-3 py-1.5 text-xs rounded-lg transition-all ${
                    filter === t.k ? "bg-gradient-primary text-primary-foreground shadow-glow" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <Button variant="secondary" size="sm" className="rounded-xl"><Filter className="size-4 mr-1.5" /> Filter</Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {visible.map((p) => {
              const fav = favorites.has(p.id);
              const isTop = p.aiScore >= 90;
              return (
                <div key={p.id} className="group relative rounded-2xl overflow-hidden border border-border/60">
                  <img src={p.src} alt="" className="w-full aspect-square object-cover transition-transform group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  {isTop && (
                    <Badge className="absolute top-2 left-2 bg-gradient-primary text-primary-foreground gap-1">
                      <Sparkles className="size-3" /> AI Top
                    </Badge>
                  )}
                  <button
                    onClick={() => toggleFav(p.id)}
                    className={`absolute top-2 right-2 size-9 rounded-full grid place-items-center backdrop-blur transition-all ${
                      fav ? "bg-destructive text-white scale-110" : "bg-background/70 hover:bg-background"
                    }`}
                  >
                    <Heart className={`size-4 ${fav ? "fill-current" : ""}`} />
                  </button>
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-xs text-white">
                    <span className="flex items-center gap-1"><Heart className="size-3" /> {p.picks + (fav ? 1 : 0)}</span>
                    <span className="flex items-center gap-1"><Star className="size-3" /> {p.aiScore}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-3xl bg-gradient-card border border-border/60 p-6 shadow-card">
            <p className="font-display font-bold text-xl mb-4">Selection Goal</p>
            <div className="flex justify-between text-sm mb-2"><span>{favorites.size} of 30 selected</span><span className="text-muted-foreground">{Math.round((favorites.size / 30) * 100)}%</span></div>
            <Progress value={(favorites.size / 30) * 100} className="h-2" />
            <p className="text-[11px] text-muted-foreground mt-3">Final delivery includes 30 retouched photos.</p>
          </div>

          <div className="rounded-3xl bg-gradient-card border border-border/60 p-6 shadow-card">
            <p className="font-display font-bold text-xl mb-4">Share Selection</p>
            <div className="flex gap-2 mb-4">
              <Input value={shareLink} readOnly className="rounded-xl bg-secondary/60 text-xs" />
              <Button
                onClick={() => { navigator.clipboard.writeText(shareLink); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
                variant="secondary"
                className="rounded-xl"
              >
                {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
              </Button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">AI Assistant</p>
                  <p className="text-[11px] text-muted-foreground">Suggest top frames per group</p>
                </div>
                <Switch checked={aiAssist} onCheckedChange={setAiAssist} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Allow comments</p>
                  <p className="text-[11px] text-muted-foreground">Clients can leave notes</p>
                </div>
                <Switch checked={allowComments} onCheckedChange={setAllowComments} />
              </div>
            </div>
            <Button className="w-full mt-4 rounded-xl bg-gradient-primary shadow-glow"><Share2 className="size-4 mr-1.5" /> Share with Client</Button>
          </div>

          <div className="rounded-3xl bg-gradient-card border border-border/60 p-6 shadow-card">
            <div className="flex items-center justify-between mb-3">
              <p className="font-display font-bold text-base">Live Activity</p>
              <Eye className="size-4 text-muted-foreground" />
            </div>
            <div className="space-y-2 text-xs">
              {[
                { who: "Aanya", what: "favorited 3 photos", when: "just now" },
                { who: "Rohan", what: "viewed gallery", when: "2m ago" },
                { who: "AI", what: "ranked 12 top picks", when: "5m ago" },
              ].map((a, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-secondary/40">
                  <span><b>{a.who}</b> {a.what}</span>
                  <span className="text-muted-foreground">{a.when}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SmartSelections;
