import { useMemo, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Wand2, Users, ScanFace, Image as ImageIcon, Search, Play, Pause,
  RefreshCw, CheckCircle2, Mail, Download, Sparkles, ArrowLeft,
} from "lucide-react";
import { Link } from "react-router-dom";
import event1 from "@/assets/event-1.jpg";
import event2 from "@/assets/event-2.jpg";
import event3 from "@/assets/event-3.jpg";
import event4 from "@/assets/event-4.jpg";

const seedFaces = [
  { id: "f1", name: "Aanya Mehta", photos: 47, matched: true, img: event1, email: "aanya@mail.com" },
  { id: "f2", name: "Rohan Kapoor", photos: 52, matched: true, img: event2, email: "rohan@mail.com" },
  { id: "f3", name: "Priya Sharma", photos: 28, matched: true, img: event3, email: "priya@mail.com" },
  { id: "f4", name: "Unknown #1", photos: 12, matched: false, img: event4 },
  { id: "f5", name: "Unknown #2", photos: 9, matched: false, img: event1 },
  { id: "f6", name: "Maya Iyer", photos: 33, matched: true, img: event2, email: "maya@mail.com" },
  { id: "f7", name: "Karan V.", photos: 18, matched: true, img: event3, email: "karan@mail.com" },
  { id: "f8", name: "Unknown #3", photos: 6, matched: false, img: event4 },
];

const FaceRecognition = () => {
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(72);
  const [confidence, setConfidence] = useState([85]);
  const [autoEmail, setAutoEmail] = useState(true);
  const [groupSimilar, setGroupSimilar] = useState(true);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string | null>("f1");

  const filtered = useMemo(
    () => seedFaces.filter((f) => f.name.toLowerCase().includes(query.toLowerCase())),
    [query],
  );

  const toggleScan = () => {
    setScanning((s) => !s);
    if (!scanning) {
      const interval = setInterval(() => {
        setProgress((p) => {
          if (p >= 100) { clearInterval(interval); setScanning(false); return 100; }
          return p + 2;
        });
      }, 120);
    }
  };

  return (
    <DashboardLayout>
      <Link to="/studio" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="size-4" /> Back to Studio
      </Link>
      <PageHeader
        eyebrow="AI Studio"
        title={<>AI <span className="gradient-text">Face Recognition</span></>}
        description="Auto-tag clients across your galleries. Group faces, send personalized albums, and let guests find themselves instantly."
        actions={
          <>
            <Button variant="secondary" className="rounded-xl"><RefreshCw className="size-4 mr-1.5" /> Re-index</Button>
            <Button onClick={toggleScan} className="rounded-xl bg-gradient-primary shadow-glow">
              {scanning ? <><Pause className="size-4 mr-1.5" /> Pause Scan</> : <><Play className="size-4 mr-1.5" /> Start Scan</>}
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Faces Detected" value="248" hint="Across 12 events" icon={ScanFace} tint="from-primary to-primary-glow" />
        <StatCard label="Unique People" value="42" hint="Auto-grouped" icon={Users} tint="from-info to-cyan-400" />
        <StatCard label="Tagged Photos" value="1,284" hint="92% accuracy" icon={CheckCircle2} tint="from-success to-emerald-400" />
        <StatCard label="Pending Review" value="18" hint="Low confidence" icon={Sparkles} tint="from-warning to-orange-400" />
      </div>

      {/* Scanner */}
      <div className="rounded-3xl bg-gradient-card border border-border/60 p-6 shadow-card mb-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="font-display font-bold text-xl">Active Scan</p>
            <p className="text-xs text-muted-foreground mt-1">Aanya & Rohan Wedding · 248 photos</p>
          </div>
          <Badge className={scanning ? "bg-success text-success-foreground" : "bg-secondary text-secondary-foreground"}>
            {scanning ? "Scanning…" : progress >= 100 ? "Complete" : "Idle"}
          </Badge>
        </div>
        <Progress value={progress} className="h-2" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 text-sm">
          <div><p className="text-muted-foreground text-xs">Processed</p><p className="font-semibold mt-1">{Math.round(progress * 2.48)} / 248</p></div>
          <div><p className="text-muted-foreground text-xs">ETA</p><p className="font-semibold mt-1">~{Math.max(0, Math.round((100 - progress) / 5))}m</p></div>
          <div><p className="text-muted-foreground text-xs">Faces Found</p><p className="font-semibold mt-1">189</p></div>
          <div><p className="text-muted-foreground text-xs">Engine</p><p className="font-semibold mt-1">Lensly Vision v3</p></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Detected People */}
        <div className="lg:col-span-2 rounded-3xl bg-gradient-card border border-border/60 p-6 shadow-card">
          <div className="flex items-center justify-between mb-4 gap-3">
            <p className="font-display font-bold text-xl">Detected People</p>
            <div className="relative w-full max-w-xs">
              <Search className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search faces..." className="pl-9 h-9 rounded-xl bg-secondary/60" />
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {filtered.map((f) => (
              <button
                key={f.id}
                onClick={() => setSelected(f.id)}
                className={`group text-left rounded-2xl border overflow-hidden transition-all ${
                  selected === f.id ? "border-primary shadow-glow" : "border-border/60 hover:border-primary/40"
                }`}
              >
                <div className="relative aspect-square">
                  <img src={f.img} alt={f.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 ring-2 ring-primary/0 group-hover:ring-primary/40 transition" />
                  {!f.matched && <Badge className="absolute top-2 left-2 bg-warning text-warning-foreground text-[10px]">Unmatched</Badge>}
                  <div className="absolute bottom-2 right-2 size-6 rounded-full bg-background/80 backdrop-blur grid place-items-center text-[10px] font-bold">
                    {f.photos}
                  </div>
                </div>
                <div className="p-2.5">
                  <p className="font-semibold text-xs truncate">{f.name}</p>
                  <p className="text-[10px] text-muted-foreground">{f.photos} photos</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Settings + selected */}
        <div className="space-y-5">
          <div className="rounded-3xl bg-gradient-card border border-border/60 p-6 shadow-card">
            <p className="font-display font-bold text-xl mb-4">Recognition Settings</p>
            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Match confidence</span><span className="font-semibold">{confidence[0]}%</span>
                </div>
                <Slider value={confidence} onValueChange={setConfidence} min={50} max={99} step={1} />
                <p className="text-[11px] text-muted-foreground mt-1.5">Higher = stricter matches.</p>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Group similar faces</p>
                  <p className="text-[11px] text-muted-foreground">Merge near-duplicates automatically</p>
                </div>
                <Switch checked={groupSimilar} onCheckedChange={setGroupSimilar} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Auto-email albums</p>
                  <p className="text-[11px] text-muted-foreground">Send personalized links when matched</p>
                </div>
                <Switch checked={autoEmail} onCheckedChange={setAutoEmail} />
              </div>
            </div>
          </div>

          {selected && (() => {
            const f = seedFaces.find((x) => x.id === selected)!;
            return (
              <div className="rounded-3xl bg-gradient-card border border-border/60 p-6 shadow-card">
                <p className="font-display font-bold text-xl mb-4">Selected</p>
                <div className="flex items-center gap-3 mb-4">
                  <img src={f.img} className="size-14 rounded-2xl object-cover" alt={f.name} />
                  <div>
                    <p className="font-semibold">{f.name}</p>
                    <p className="text-xs text-muted-foreground">{f.photos} photos · {f.matched ? "Tagged" : "Pending"}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button size="sm" variant="secondary" className="rounded-xl"><Mail className="size-4 mr-1.5" /> Email</Button>
                  <Button size="sm" variant="secondary" className="rounded-xl"><Download className="size-4 mr-1.5" /> Album</Button>
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FaceRecognition;
