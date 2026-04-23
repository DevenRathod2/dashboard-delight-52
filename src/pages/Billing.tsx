import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, CreditCard, Edit3, Check } from "lucide-react";

const usage = [
  { label: "Storage", value: 1, sub: "3.01 GB of 500 GB", color: "primary" },
  { label: "Clients", value: 1, sub: "5 of 400", color: "success" },
  { label: "Events", value: 3, sub: "5 of 200", color: "warning" },
  { label: "Photos", value: 0, sub: "68 of 100000", color: "info" },
  { label: "WhatsApp Credits", value: 0, sub: "0 of 5000", color: "primary-glow" },
  { label: "AI Faces", value: 0, sub: "0 of 20000", color: "info" },
];

const tabs = ["Overview", "Invoices & Transactions", "Plans", "Add-ons"];

const Ring = ({ value, color, label, sub }: { value: number; color: string; label: string; sub: string }) => {
  const stroke = 8;
  const r = 42;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative size-28">
        <svg viewBox="0 0 100 100" className="size-full -rotate-90">
          <circle cx="50" cy="50" r={r} stroke="hsl(var(--border))" strokeWidth={stroke} fill="none" />
          <circle
            cx="50" cy="50" r={r}
            stroke={`hsl(var(--${color}))`}
            strokeWidth={stroke}
            strokeLinecap="round"
            fill="none"
            strokeDasharray={c}
            strokeDashoffset={offset}
            style={{ filter: `drop-shadow(0 0 6px hsl(var(--${color}) / 0.6))` }}
          />
        </svg>
        <div className="absolute inset-0 grid place-items-center">
          <span className="font-display font-bold text-xl">{value}%</span>
        </div>
      </div>
      <p className="font-semibold mt-2">{label}</p>
      <p className="text-xs text-muted-foreground">{sub}</p>
    </div>
  );
};

const Billing = () => {
  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="Billing & Subscription"
        title={<>Manage your <span className="gradient-text">plan</span> & usage</>}
        description="Subscription details, payment information and usage statistics in one place."
      />

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-6 p-1 rounded-2xl bg-card/60 border border-border/60 backdrop-blur-md w-fit">
        {tabs.map((t, i) => (
          <button
            key={t}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              i === 0 ? "bg-gradient-primary text-primary-foreground shadow-glow" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
        {/* Current Plan */}
        <div className="xl:col-span-3 rounded-3xl bg-gradient-card border border-primary/40 p-6 lg:p-8 shadow-elevated relative overflow-hidden">
          <div className="absolute -top-20 -right-20 size-60 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
          <div className="relative">
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="font-display font-bold text-2xl tracking-tight">Current Plan</p>
                <p className="text-sm text-muted-foreground mt-1">Your subscription details and usage statistics</p>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-primary text-primary-foreground text-[11px] font-bold shadow-glow uppercase tracking-widest">
                  Business
                </span>
                <p className="font-display font-bold text-xl mt-2">₹1,600<span className="text-sm font-normal text-muted-foreground">/monthly</span></p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-secondary/40 border border-border/60">
                <div className="size-10 rounded-xl bg-gradient-primary grid place-items-center text-primary-foreground shadow-glow">
                  <Calendar className="size-4" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Next Billing</p>
                  <p className="font-semibold">26/4/2026</p>
                  <p className="text-[11px] text-muted-foreground">4 days remaining</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-secondary/40 border border-border/60">
                <div className="size-10 rounded-xl bg-gradient-to-br from-info to-cyan-400 grid place-items-center text-white shadow-card">
                  <CreditCard className="size-4" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Billing Cycle</p>
                  <p className="font-semibold">Monthly</p>
                  <p className="text-[11px] text-muted-foreground">Auto-renew enabled</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
              {usage.map((u) => <Ring key={u.label} {...u} />)}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button size="lg" className="rounded-xl bg-gradient-to-r from-warning to-orange-400 text-warning-foreground hover:opacity-90 shadow-glow font-semibold">
                ⭐ Upgrade Plan ⭐
              </Button>
              <Button size="lg" variant="outline" className="rounded-xl border-destructive/40 text-destructive hover:bg-destructive/10">
                Cancel Plan
              </Button>
            </div>
          </div>
        </div>

        {/* Payment Information */}
        <div className="xl:col-span-2 rounded-3xl bg-gradient-card border border-success/40 p-6 lg:p-8 shadow-elevated relative overflow-hidden">
          <div className="absolute -top-20 -left-20 size-60 rounded-full bg-success/15 blur-3xl pointer-events-none" />
          <div className="relative">
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="font-display font-bold text-2xl text-success tracking-tight">Payment Information</p>
                <p className="text-sm text-muted-foreground mt-1">Your billing details</p>
              </div>
              <Button variant="secondary" size="sm" className="rounded-xl">
                <Edit3 className="size-3.5 mr-1.5" /> Edit
              </Button>
            </div>

            <p className="text-sm font-semibold mb-4 inline-flex items-center gap-2">
              <Check className="size-4 text-success" /> Billing Information
            </p>

            <div className="grid grid-cols-2 gap-3">
              {[
                { l: "Contact Name", v: "EventBit" },
                { l: "Company / Studio", v: "EventBit" },
                { l: "Address Line 1", v: "Site No. 26, Laskar Hosur Road, Adugodi", full: true },
                { l: "Address Line 2", v: "Laskar Hosur Road, Adugodi", full: true },
                { l: "City", v: "Bengaluru" },
                { l: "State", v: "Maharashtra" },
                { l: "Pincode", v: "560029" },
                { l: "Phone", v: "8788887373" },
                { l: "Email", v: "admin@eventbit.io", full: true },
                { l: "GST Number", v: "27ABCDE1234F1Z5", full: true },
              ].map((f) => (
                <div key={f.l} className={f.full ? "col-span-2" : ""}>
                  <label className="text-[10px] uppercase tracking-widest text-muted-foreground">{f.l}</label>
                  <Input value={f.v} readOnly className="mt-1 rounded-xl bg-secondary/40 border-border/60 h-10" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Billing;
