import { useMemo, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Palette, ArrowLeft, Wand2, RotateCcw, Download, Eye, Layers,
  Image as ImageIcon, Sparkles, GitCompareArrows, Save,
} from "lucide-react";
import { Link } from "react-router-dom";
import event1 from "@/assets/event-1.jpg";
import event2 from "@/assets/event-2.jpg";
import event3 from "@/assets/event-3.jpg";
import event4 from "@/assets/event-4.jpg";

type Preset = {
  id: string; name: string; vibe: string;
  filter: string; tint: string;
};

const presets: Preset[] = [
  { id: "none", name: "Original", vibe: "Untouched", filter: "none", tint: "from-muted to-muted" },
  { id: "warm", name: "Golden Hour", vibe: "Warm, romantic", filter: "saturate(1.15) contrast(1.05) sepia(0.15) brightness(1.05)", tint: "from-warning to-orange-400" },
  { id: "moody", name: "Moody Film", vibe: "Cinematic, dark", filter: "saturate(0.85) contrast(1.2) brightness(0.92) hue-rotate(-8deg)", tint: "from-primary to-primary-glow" },
  { id: "airy", name: "Airy Pastel", vibe: "Soft, light", filter: "saturate(0.9) contrast(0.95) brightness(1.12)", tint: "from-info to-cyan-400" },
  { id: "vivid", name: "Vivid Pop", vibe: "Bold colors", filter: "saturate(1.5) contrast(1.15) brightness(1.05)", tint: "from-success to-emerald-400" },
  { id: "bw", name: "Mono Classic", vibe: "Timeless B&W", filter: "grayscale(1) contrast(1.15)", tint: "from-foreground to-muted-foreground" },
];

const photos = [event1, event2, event3, event4, event1, event2, event3, event4];

const ColorGrading = () => {
  const [preset, setPreset] = useState("warm");
  const [exposure, setExposure] = useState([0]);
  const [contrast, setContrast] = useState([0]);
  const [saturation, setSaturation] = useState([0]);
  const [warmth, setWarmth] = useState([0]);
  const [vignette, setVignette] = useState([20]);
  const [grain, setGrain] = useState([10]);
  const [compare, setCompare] = useState(true);
  const [aiAuto, setAiAuto] = useState(true);
  const [applying, setApplying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activePhoto, setActivePhoto] = useState(0);

  const baseFilter = useMemo(() => {
    const p = presets.find((x) => x.id === preset)!.filter;
    const e = 1 + exposure[0] / 100;
    const c = 1 + contrast[0] / 100;
    const s = 1 + saturation[0] / 100;
    const h = warmth[0] * 0.3;
    return `${p === "none" ? "" : p} brightness(${e}) contrast(${c}) saturate(${s}) hue-rotate(${h}deg)`;
  }, [preset, exposure, contrast, saturation, warmth]);

  const reset = () => {
    setExposure([0]); setContrast([0]); setSaturation([0]); setWarmth([0]); setVignette([20]); setGrain([10]);
  };

  const applyAll = () => {
    setApplying(true); setProgress(0);
    const i = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) { clearInterval(i); setApplying(false); return 100; }
        return p + 5;
      });
    }, 100);
  };

  return (
    <DashboardLayout>
      <Link to="/studio" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="size-4" /> Back to Studio
      </Link>
      <PageHeader
        eyebrow="Studio"
        title={<>Color <span className="gradient-text">Grading</span></>}
        description="One-click presets and pro-grade controls. Apply your signature look across an entire shoot."
        actions={
          <>
            <Button variant="secondary" className="rounded-xl"><Save className="size-4 mr-1.5" /> Save Preset</Button>
            <Button onClick={applyAll} disabled={applying} className="rounded-xl bg-gradient-primary shadow-glow">
              <Wand2 className="size-4 mr-1.5" /> {applying ? "Applying..." : "Apply to All"}
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Photos in Shoot" value={String(photos.length)} icon={ImageIcon} tint="from-primary to-primary-glow" />
        <StatCard label="Active Preset" value={presets.find((p) => p.id === preset)!.name} icon={Palette} tint="from-warning to-orange-400" />
        <StatCard label="Saved Looks" value="7" icon={Layers} tint="from-info to-cyan-400" />
        <StatCard label="AI Suggestions" value="3" hint="Match this scene" icon={Sparkles} tint="from-success to-emerald-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Preview */}
        <div className="lg:col-span-2 space-y-5">
          <div className="rounded-3xl bg-gradient-card border border-border/60 p-6 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <p className="font-display font-bold text-xl">Preview</p>
              <button
                onClick={() => setCompare((c) => !c)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-xl border transition ${
                  compare ? "border-primary bg-primary/10 text-primary" : "border-border/60 bg-secondary/40"
                }`}
              >
                <GitCompareArrows className="size-3.5" /> Before / After
              </button>
            </div>

            <div className="relative rounded-2xl overflow-hidden border border-border/60 aspect-[16/10] bg-black">
              {compare ? (
                <div className="grid grid-cols-2 h-full">
                  <div className="relative">
                    <img src={photos[activePhoto]} className="w-full h-full object-cover" alt="" />
                    <Badge className="absolute top-3 left-3 bg-background/80 text-foreground">Before</Badge>
                  </div>
                  <div className="relative border-l-2 border-white/40">
                    <img src={photos[activePhoto]} className="w-full h-full object-cover" style={{ filter: baseFilter }} alt="" />
                    <Badge className="absolute top-3 left-3 bg-gradient-primary text-primary-foreground">After</Badge>
                    {vignette[0] > 0 && (
                      <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: `inset 0 0 ${vignette[0] * 2}px hsl(0 0% 0% / ${vignette[0] / 100})` }} />
                    )}
                  </div>
                </div>
              ) : (
                <div className="relative h-full">
                  <img src={photos[activePhoto]} className="w-full h-full object-cover" style={{ filter: baseFilter }} alt="" />
                  {vignette[0] > 0 && (
                    <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: `inset 0 0 ${vignette[0] * 2}px hsl(0 0% 0% / ${vignette[0] / 100})` }} />
                  )}
                </div>
              )}
              {grain[0] > 0 && (
                <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-50" style={{
                  backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.6'/%3E%3C/svg%3E\")",
                  opacity: grain[0] / 200,
                }} />
              )}
            </div>

            <div className="flex gap-2 mt-4 overflow-x-auto pb-1 scrollbar-hide">
              {photos.map((src, i) => (
                <button key={i} onClick={() => setActivePhoto(i)} className={`shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition ${activePhoto === i ? "border-primary shadow-glow" : "border-border/60"}`}>
                  <img src={src} alt="" className="w-full h-full object-cover" style={{ filter: baseFilter }} />
                </button>
              ))}
            </div>

            {applying && (
              <div className="mt-4 p-4 rounded-2xl bg-secondary/40 border border-border/60">
                <div className="flex justify-between text-sm mb-2"><span>Applying to {photos.length} photos…</span><span className="font-semibold">{progress}%</span></div>
                <Progress value={progress} className="h-2" />
              </div>
            )}
          </div>

          {/* Presets */}
          <div className="rounded-3xl bg-gradient-card border border-border/60 p-6 shadow-card">
            <p className="font-display font-bold text-xl mb-4">Presets</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {presets.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPreset(p.id)}
                  className={`group text-left rounded-2xl border overflow-hidden transition-all ${
                    preset === p.id ? "border-primary shadow-glow" : "border-border/60 hover:border-primary/40"
                  }`}
                >
                  <div className="relative aspect-square">
                    <img src={event1} alt="" className="w-full h-full object-cover" style={{ filter: p.filter === "none" ? undefined : p.filter }} />
                    {preset === p.id && (
                      <div className="absolute top-1.5 right-1.5 size-5 rounded-full bg-gradient-primary grid place-items-center">
                        <Eye className="size-3 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="p-2">
                    <p className="font-semibold text-xs truncate">{p.name}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{p.vibe}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-5">
          <div className="rounded-3xl bg-gradient-card border border-border/60 p-6 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <p className="font-display font-bold text-xl">Adjustments</p>
              <Button onClick={reset} variant="ghost" size="sm" className="text-xs"><RotateCcw className="size-3.5 mr-1" /> Reset</Button>
            </div>
            <div className="space-y-5">
              {[
                { label: "Exposure", v: exposure, set: setExposure, min: -50, max: 50 },
                { label: "Contrast", v: contrast, set: setContrast, min: -50, max: 50 },
                { label: "Saturation", v: saturation, set: setSaturation, min: -50, max: 50 },
                { label: "Warmth", v: warmth, set: setWarmth, min: -50, max: 50 },
                { label: "Vignette", v: vignette, set: setVignette, min: 0, max: 100 },
                { label: "Grain", v: grain, set: setGrain, min: 0, max: 100 },
              ].map((s) => (
                <div key={s.label}>
                  <div className="flex justify-between text-sm mb-2"><span>{s.label}</span><span className="font-semibold tabular-nums">{s.v[0] > 0 ? "+" : ""}{s.v[0]}</span></div>
                  <Slider value={s.v} onValueChange={s.set} min={s.min} max={s.max} step={1} />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-gradient-card border border-border/60 p-6 shadow-card">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-semibold text-sm">AI Auto-Match</p>
                <p className="text-[11px] text-muted-foreground">Adjust per-photo for skin & light</p>
              </div>
              <Switch checked={aiAuto} onCheckedChange={setAiAuto} />
            </div>
            <Button className="w-full rounded-xl bg-gradient-primary shadow-glow"><Sparkles className="size-4 mr-1.5" /> Suggest a Look</Button>
          </div>

          <div className="rounded-3xl bg-gradient-card border border-border/60 p-6 shadow-card">
            <p className="font-display font-bold text-base mb-3">Export</p>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="secondary" className="rounded-xl"><Download className="size-4 mr-1.5" /> JPG</Button>
              <Button variant="secondary" className="rounded-xl"><Download className="size-4 mr-1.5" /> .CUBE</Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ColorGrading;
