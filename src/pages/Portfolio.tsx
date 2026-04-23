import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, Upload, Image as ImageIcon, Instagram, Facebook, Twitter, Linkedin, X, Camera } from "lucide-react";

const styles = ["Video", "Photo", "Wedding", "Pre Wedding", "Birthday", "Corporate"];

const Field = ({ label, value, prefix, required }: { label: string; value?: string; prefix?: string; required?: boolean }) => (
  <div>
    <label className="text-xs font-medium mb-1.5 block">
      {label} {required && <span className="text-destructive">*</span>}
    </label>
    <div className="flex items-center rounded-xl bg-secondary/40 border border-border/60 focus-within:border-primary/60 transition-colors overflow-hidden">
      {prefix && <span className="pl-3 text-xs text-muted-foreground">{prefix}</span>}
      <Input defaultValue={value} className="border-0 bg-transparent h-11 focus-visible:ring-0" />
    </div>
  </div>
);

const Portfolio = () => {
  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="Portfolio Studio"
        title={<>Craft your <span className="gradient-text">public</span> presence</>}
        description={
          <>Manage every element your clients see on <span className="text-primary">domain.com/photographers/dev-s-studio</span></>
        }
        actions={
          <>
            <Button variant="secondary" size="lg" className="rounded-xl">
              <Eye className="size-4 mr-1.5" /> Preview Page
            </Button>
            <Button size="lg" className="rounded-xl bg-gradient-primary hover:opacity-90 shadow-glow">
              Publish Updates
            </Button>
          </>
        }
      />

      {/* Cover & Brand */}
      <div className="rounded-3xl bg-gradient-card border border-border/60 p-6 lg:p-8 shadow-card mb-5">
        <div className="flex items-start justify-between mb-5">
          <div>
            <p className="font-display font-bold text-xl tracking-tight">Cover & Studio Brand</p>
            <p className="text-xs text-muted-foreground mt-1">Upload the hero cover and your studio portrait.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-5">
          <div className="rounded-2xl border-2 border-dashed border-primary/40 bg-gradient-aurora aspect-[21/9] grid place-items-center relative overflow-hidden group hover:border-primary transition-colors cursor-pointer">
            <div className="text-center">
              <div className="size-14 mx-auto rounded-2xl bg-card/60 backdrop-blur grid place-items-center mb-3">
                <ImageIcon className="size-6 text-primary" />
              </div>
              <p className="font-semibold">Update cover image</p>
              <p className="text-xs text-muted-foreground mt-1">Recommended 2400×1000 · JPG/PNG</p>
              <Button size="sm" className="mt-4 rounded-xl bg-gradient-primary hover:opacity-90 shadow-glow">
                <Upload className="size-3.5 mr-1.5" /> Replace Image
              </Button>
            </div>
            <span className="absolute top-3 left-3 text-[11px] px-2 py-1 rounded-full glass">Cover preview</span>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-xs font-semibold mb-2">Studio Portrait</p>
            <p className="text-[11px] text-muted-foreground mb-3">1:1 square · JPG/PNG</p>
            <div className="size-44 rounded-2xl border-2 border-dashed border-border/60 bg-secondary/40 grid place-items-center hover:border-primary/60 transition-colors cursor-pointer relative overflow-hidden group">
              <div className="text-center">
                <Camera className="size-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-xs font-medium">Profile preview</p>
                <p className="text-[10px] text-muted-foreground mt-1">Click to update</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero & Contact + Social */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mb-5">
        <div className="xl:col-span-2 rounded-3xl bg-gradient-card border border-border/60 p-6 lg:p-8 shadow-card">
          <p className="font-display font-bold text-xl tracking-tight">Hero & Contact</p>
          <p className="text-xs text-muted-foreground mt-1 mb-6">Craft the hero narrative clients see first.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Public Username" value="dev-s-studio" prefix="photographers/" required />
            <Field label="Full Name" value="Deven Rathod" required />
            <Field label="Studio Name" value="Dev's Studio" required />
            <Field label="Tagline" value="" />
            <Field label="Location" value="Pune" required />
            <Field label="Phone" value="+91 87888 87373" required />
            <Field label="Email" value="admin@eventbit.io" required />
            <Field label="Website" value="" />
          </div>
        </div>

        <div className="rounded-3xl bg-gradient-card border border-border/60 p-6 lg:p-8 shadow-card">
          <p className="font-display font-bold text-xl tracking-tight">Social Links</p>
          <p className="text-xs text-muted-foreground mt-1 mb-6">Enter your usernames (we'll add the URL automatically).</p>

          <div className="space-y-4">
            {[
              { icon: Instagram, label: "Instagram", val: "devenrathod", color: "from-pink-500 to-orange-400" },
              { icon: Facebook, label: "Facebook", val: "devenrathod", color: "from-info to-cyan-400" },
              { icon: Twitter, label: "Twitter", val: "devenrathod_me", color: "from-cyan-400 to-info" },
              { icon: Linkedin, label: "LinkedIn", val: "devenrathod", color: "from-info to-primary" },
            ].map((s) => (
              <div key={s.label}>
                <label className="text-xs font-medium mb-1.5 flex items-center gap-1.5">
                  <s.icon className="size-3.5" /> {s.label}
                </label>
                <Input defaultValue={s.val} className="rounded-xl bg-secondary/40 border-border/60 h-11" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Signature Styles */}
      <div className="rounded-3xl bg-gradient-card border border-border/60 p-6 lg:p-8 shadow-card">
        <p className="font-display font-bold text-xl tracking-tight">Signature Styles</p>
        <p className="text-xs text-muted-foreground mt-1 mb-6">Design the chip row beneath your hero section.</p>

        <div className="flex flex-wrap gap-2">
          {styles.map((s) => (
            <span key={s} className="inline-flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-full bg-gradient-primary text-primary-foreground text-sm font-medium shadow-glow">
              {s}
              <button className="size-5 rounded-full bg-white/20 grid place-items-center hover:bg-white/30 transition-colors">
                <X className="size-3" />
              </button>
            </span>
          ))}
          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary/60 border border-dashed border-border text-sm font-medium hover:bg-secondary hover:border-primary/40 transition-all">
            + Add Style
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Portfolio;
