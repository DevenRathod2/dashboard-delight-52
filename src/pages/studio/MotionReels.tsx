import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Film, Play, Pause, Music2, Wand2, Download, Share2, ArrowLeft,
  Smartphone, Square, Monitor, Sparkles, Clock, Layers,
} from "lucide-react";
import { Link } from "react-router-dom";
import event1 from "@/assets/event-1.jpg";
import event2 from "@/assets/event-2.jpg";
import event3 from "@/assets/event-3.jpg";
import event4 from "@/assets/event-4.jpg";

const templates = [
  { id: "cine", name: "Cinematic", desc: "Slow zooms, warm grade", color: "from-warning to-orange-400" },
  { id: "trend", name: "Trending Reel", desc: "Fast cuts, bass drop", color: "from-info to-cyan-400" },
  { id: "story", name: "Story Mode", desc: "Vertical, soft music", color: "from-primary to-primary-glow" },
  { id: "teaser", name: "Wedding Teaser", desc: "Romantic, 30s", color: "from-success to-emerald-400" },
];

const tracks = [
  { id: "t1", name: "Aurora Sky", artist: "Lensly OST", bpm: 92, duration: "0:45" },
  { id: "t2", name: "Heartline", artist: "Mood Library", bpm: 110, duration: "1:12" },
  { id: "t3", name: "Golden Hour", artist: "Cinematic Vol.2", bpm: 78, duration: "0:58" },
];

const MotionReels = () => {
  const [template, setTemplate] = useState("cine");
  const [track, setTrack] = useState("t1");
  const [aspect, setAspect] = useState<"9:16" | "1:1" | "16:9">("9:16");
  const [duration, setDuration] = useState([30]);
  const [intensity, setIntensity] = useState([60]);
  const [autoBeat, setAutoBeat] = useState(true);
  const [captions, setCaptions] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [rendering, setRendering] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);

  const startRender = () => {
    setRendering(true);
    setRenderProgress(0);
    const i = setInterval(() => {
      setRenderProgress((p) => {
        if (p >= 100) { clearInterval(i); setRendering(false); return 100; }
        return p + 4;
      });
    }, 150);
  };

  const aspectClass = aspect === "9:16" ? "aspect-[9/16] max-w-[280px]" : aspect === "1:1" ? "aspect-square max-w-[380px]" : "aspect-video";

  return (
    <DashboardLayout>
      <Link to="/studio" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="size-4" /> Back to Studio
      </Link>
      <PageHeader
        eyebrow="Studio"
        title={<>Motion <span className="gradient-text">Reels</span></>}
        description="Auto-generate cinematic reels from your shoots — beat-synced, color-graded, ready for socials."
        actions={
          <Button onClick={startRender} disabled={rendering} className="rounded-xl bg-gradient-primary shadow-glow">
            <Wand2 className="size-4 mr-1.5" /> {rendering ? "Rendering..." : "Generate Reel"}
          </Button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Reels Created" value="14" icon={Film} tint="from-primary to-primary-glow" />
        <StatCard label="Total Duration" value="6m 42s" icon={Clock} tint="from-info to-cyan-400" />
        <StatCard label="AI Renders" value="38" hint="This month" icon={Sparkles} tint="from-warning to-orange-400" />
        <StatCard label="Published" value="9" hint="To socials" icon={Share2} tint="from-success to-emerald-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Preview */}
        <div className="lg:col-span-2 rounded-3xl bg-gradient-card border border-border/60 p-6 shadow-card">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <p className="font-display font-bold text-xl">Preview</p>
            <div className="flex items-center gap-1 p-1 rounded-xl bg-secondary/60 border border-border/60">
              {[
                { k: "9:16", icon: Smartphone, label: "Reel" },
                { k: "1:1", icon: Square, label: "Square" },
                { k: "16:9", icon: Monitor, label: "Wide" },
              ].map((a) => (
                <button
                  key={a.k}
                  onClick={() => setAspect(a.k as any)}
                  className={`px-3 py-1.5 text-xs rounded-lg flex items-center gap-1.5 transition-all ${
                    aspect === a.k ? "bg-gradient-primary text-primary-foreground shadow-glow" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <a.icon className="size-3.5" /> {a.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-center mb-5">
            <div className={`relative ${aspectClass} w-full rounded-2xl overflow-hidden border border-border/60 bg-black`}>
              <img src={event1} alt="" className={`w-full h-full object-cover transition-transform duration-[3000ms] ${playing ? "scale-110" : "scale-100"}`} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
              <button
                onClick={() => setPlaying((p) => !p)}
                className="absolute inset-0 grid place-items-center group"
              >
                <div className="size-16 rounded-full bg-white/20 backdrop-blur-xl border border-white/40 grid place-items-center group-hover:scale-110 transition">
                  {playing ? <Pause className="size-6 text-white" /> : <Play className="size-6 text-white ml-1" />}
                </div>
              </button>
              {captions && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg bg-black/70 text-white text-sm font-semibold">
                  Forever begins today ✨
                </div>
              )}
              <div className="absolute top-3 left-3 right-3 flex gap-1">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex-1 h-0.5 rounded-full bg-white/30 overflow-hidden">
                    <div className={`h-full bg-white transition-all ${playing && i === 0 ? "w-full duration-[5000ms]" : i < 0 ? "w-full" : "w-0"}`} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Timeline / clips */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold flex items-center gap-1.5"><Layers className="size-4" /> Clips</p>
              <Button size="sm" variant="ghost" className="text-xs">Reorder</Button>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {[event1, event2, event3, event4, event1, event2].map((src, i) => (
                <div key={i} className="relative shrink-0 w-20 h-14 rounded-lg overflow-hidden border border-border/60">
                  <img src={src} alt="" className="w-full h-full object-cover" />
                  <span className="absolute bottom-0.5 right-1 text-[9px] text-white font-bold drop-shadow">0:0{i + 2}</span>
                </div>
              ))}
            </div>
          </div>

          {rendering && (
            <div className="mt-5 p-4 rounded-2xl bg-secondary/40 border border-border/60">
              <div className="flex justify-between text-sm mb-2"><span>Rendering reel…</span><span className="font-semibold">{renderProgress}%</span></div>
              <Progress value={renderProgress} className="h-2" />
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="space-y-5">
          <div className="rounded-3xl bg-gradient-card border border-border/60 p-6 shadow-card">
            <p className="font-display font-bold text-xl mb-4">Style</p>
            <div className="grid grid-cols-2 gap-2">
              {templates.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTemplate(t.id)}
                  className={`text-left p-3 rounded-xl border transition-all ${
                    template === t.id ? "border-primary bg-secondary/60 shadow-glow" : "border-border/60 hover:border-primary/40 bg-secondary/30"
                  }`}
                >
                  <div className={`size-8 rounded-lg bg-gradient-to-br ${t.color} mb-2`} />
                  <p className="font-semibold text-sm">{t.name}</p>
                  <p className="text-[11px] text-muted-foreground">{t.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-gradient-card border border-border/60 p-6 shadow-card">
            <p className="font-display font-bold text-xl mb-4 flex items-center gap-2"><Music2 className="size-5" /> Music</p>
            <div className="space-y-2 mb-4">
              {tracks.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTrack(t.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                    track === t.id ? "border-primary bg-secondary/60" : "border-border/60 hover:border-primary/40 bg-secondary/30"
                  }`}
                >
                  <div className="size-9 rounded-lg gradient-primary grid place-items-center">
                    <Music2 className="size-4 text-primary-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{t.name}</p>
                    <p className="text-[11px] text-muted-foreground">{t.artist} · {t.bpm} BPM</p>
                  </div>
                  <Badge variant="secondary" className="text-[10px]">{t.duration}</Badge>
                </button>
              ))}
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Auto beat-sync</p>
                <p className="text-[11px] text-muted-foreground">Cut on the drop</p>
              </div>
              <Switch checked={autoBeat} onCheckedChange={setAutoBeat} />
            </div>
          </div>

          <div className="rounded-3xl bg-gradient-card border border-border/60 p-6 shadow-card">
            <p className="font-display font-bold text-xl mb-4">Settings</p>
            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-sm mb-2"><span>Duration</span><span className="font-semibold">{duration[0]}s</span></div>
                <Slider value={duration} onValueChange={setDuration} min={10} max={90} step={5} />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2"><span>Cut intensity</span><span className="font-semibold">{intensity[0]}%</span></div>
                <Slider value={intensity} onValueChange={setIntensity} min={0} max={100} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Captions</p>
                  <p className="text-[11px] text-muted-foreground">AI-generated subtitles</p>
                </div>
                <Switch checked={captions} onCheckedChange={setCaptions} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-5">
              <Button variant="secondary" className="rounded-xl"><Download className="size-4 mr-1.5" /> Export</Button>
              <Button className="rounded-xl bg-gradient-primary"><Share2 className="size-4 mr-1.5" /> Share</Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MotionReels;
