import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  CreditCard,
  Edit3,
  Check,
  Download,
  Search,
  Filter,
  Receipt,
  TrendingUp,
  Sparkles,
  Zap,
  Crown,
  Rocket,
  Plus,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  XCircle,
  MessageSquare,
  ScanFace,
  HardDrive,
  Image as ImageIcon,
} from "lucide-react";

const usage = [
  { label: "Storage", value: 1, sub: "3.01 GB of 500 GB", color: "primary" },
  { label: "Clients", value: 1, sub: "5 of 400", color: "success" },
  { label: "Events", value: 3, sub: "5 of 200", color: "warning" },
  { label: "Photos", value: 0, sub: "68 of 100000", color: "info" },
  { label: "WhatsApp", value: 0, sub: "0 of 5000", color: "primary-glow" },
  { label: "AI Faces", value: 0, sub: "0 of 20000", color: "info" },
];

const tabs = ["Overview", "Invoices & Transactions", "Plans", "Add-ons"] as const;
type Tab = typeof tabs[number];

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

/* -------------------- Overview -------------------- */
const Overview = () => (
  <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
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
            <p className="font-display font-bold text-xl mt-2">
              ₹1,600<span className="text-sm font-normal text-muted-foreground">/monthly</span>
            </p>
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
            <div className="size-10 rounded-xl bg-gradient-to-br from-info to-primary-glow grid place-items-center text-primary-foreground shadow-card">
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
          <Button size="lg" className="rounded-xl bg-gradient-to-r from-warning to-primary-glow text-warning-foreground hover:opacity-90 shadow-glow font-semibold">
            <Sparkles className="size-4" /> Upgrade Plan
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
            <Edit3 className="size-3.5" /> Edit
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
);

/* -------------------- Invoices -------------------- */
const invoices = [
  { id: "INV-2026-0042", date: "Mar 26, 2026", amount: "₹1,600", status: "paid", method: "Visa •• 4242", plan: "Business Monthly" },
  { id: "INV-2026-0041", date: "Feb 26, 2026", amount: "₹1,600", status: "paid", method: "Visa •• 4242", plan: "Business Monthly" },
  { id: "INV-2026-0040", date: "Jan 26, 2026", amount: "₹1,600", status: "paid", method: "UPI", plan: "Business Monthly" },
  { id: "INV-2025-0039", date: "Dec 26, 2025", amount: "₹4,800", status: "paid", method: "Visa •• 4242", plan: "Business Quarterly" },
  { id: "INV-2025-0038", date: "Nov 26, 2025", amount: "₹500", status: "pending", method: "—", plan: "AI Faces Add-on" },
  { id: "INV-2025-0037", date: "Oct 26, 2025", amount: "₹1,200", status: "failed", method: "Visa •• 4242", plan: "Starter Monthly" },
];

const statusConfig: Record<string, { icon: typeof Check; color: string; label: string }> = {
  paid: { icon: CheckCircle2, color: "success", label: "Paid" },
  pending: { icon: Clock, color: "warning", label: "Pending" },
  failed: { icon: XCircle, color: "destructive", label: "Failed" },
};

const Invoices = () => {
  const totalPaid = "₹15,300";
  const stats = [
    { label: "Total Spent", value: totalPaid, icon: TrendingUp, color: "success" },
    { label: "Invoices", value: "12", icon: Receipt, color: "primary" },
    { label: "Pending", value: "₹500", icon: Clock, color: "warning" },
    { label: "Refunds", value: "₹0", icon: ArrowUpRight, color: "info" },
  ];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl bg-gradient-card border border-border/60 p-5 shadow-card relative overflow-hidden">
            <div className={`absolute -top-10 -right-10 size-28 rounded-full bg-${s.color}/15 blur-2xl pointer-events-none`} />
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">{s.label}</p>
                <p className="font-display font-bold text-2xl mt-1">{s.value}</p>
              </div>
              <div className={`size-11 rounded-xl bg-${s.color}/15 text-${s.color} grid place-items-center`}>
                <s.icon className="size-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-3xl bg-gradient-card border border-border/60 shadow-elevated overflow-hidden">
        <div className="p-5 lg:p-6 flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-border/60">
          <div>
            <p className="font-display font-bold text-xl">Invoices & Transactions</p>
            <p className="text-sm text-muted-foreground">Download receipts and review billing history</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search invoices..." className="pl-9 h-10 w-64 rounded-xl bg-secondary/40 border-border/60" />
            </div>
            <Button variant="secondary" size="sm" className="rounded-xl h-10">
              <Filter className="size-4" /> Filter
            </Button>
            <Button size="sm" className="rounded-xl h-10 bg-gradient-primary text-primary-foreground shadow-glow">
              <Download className="size-4" /> Export
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs uppercase tracking-widest text-muted-foreground bg-secondary/30">
                <th className="px-6 py-3 font-medium">Invoice</th>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium">Plan</th>
                <th className="px-6 py-3 font-medium">Method</th>
                <th className="px-6 py-3 font-medium">Amount</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => {
                const s = statusConfig[inv.status];
                return (
                  <tr key={inv.id} className="border-t border-border/40 hover:bg-secondary/30 transition-colors">
                    <td className="px-6 py-4 font-mono text-sm font-medium">{inv.id}</td>
                    <td className="px-6 py-4 text-sm">{inv.date}</td>
                    <td className="px-6 py-4 text-sm">{inv.plan}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{inv.method}</td>
                    <td className="px-6 py-4 font-semibold">{inv.amount}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-${s.color}/15 text-${s.color}`}>
                        <s.icon className="size-3.5" /> {s.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="sm" className="rounded-lg">
                        <Download className="size-4" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

/* -------------------- Plans -------------------- */
const plans = [
  {
    name: "Starter",
    price: "₹800",
    icon: Zap,
    color: "info",
    description: "Perfect for solo photographers getting started.",
    features: ["50 GB storage", "50 clients", "20 events / mo", "10K photos", "Email support"],
    cta: "Downgrade",
    current: false,
  },
  {
    name: "Business",
    price: "₹1,600",
    icon: Crown,
    color: "primary",
    description: "For growing studios with active client work.",
    features: ["500 GB storage", "400 clients", "200 events / mo", "100K photos", "Priority support", "AI Face Search"],
    cta: "Current Plan",
    current: true,
    popular: true,
  },
  {
    name: "Studio",
    price: "₹3,200",
    icon: Rocket,
    color: "warning",
    description: "Unlimited scale for high-volume teams.",
    features: ["2 TB storage", "Unlimited clients", "Unlimited events", "1M photos", "Dedicated manager", "White-label gallery"],
    cta: "Upgrade",
    current: false,
  },
];

const Plans = () => {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center">
        <div className="inline-flex items-center gap-1 p-1 rounded-2xl bg-card/60 border border-border/60 backdrop-blur-md">
          {(["monthly", "yearly"] as const).map((b) => (
            <button
              key={b}
              onClick={() => setBilling(b)}
              className={`px-5 py-2 rounded-xl text-sm font-medium capitalize transition-all ${
                billing === b ? "bg-gradient-primary text-primary-foreground shadow-glow" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {b} {b === "yearly" && <span className="ml-1 text-[10px] font-bold text-success">−20%</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {plans.map((p) => (
          <div
            key={p.name}
            className={`relative rounded-3xl p-6 lg:p-8 shadow-elevated overflow-hidden transition-all hover:-translate-y-1 ${
              p.popular
                ? "bg-gradient-card border-2 border-primary/60"
                : "bg-gradient-card border border-border/60"
            }`}
          >
            {p.popular && (
              <div className="absolute top-4 right-4">
                <Badge className="bg-gradient-primary text-primary-foreground shadow-glow border-0">Most Popular</Badge>
              </div>
            )}
            <div className={`absolute -top-20 -right-20 size-60 rounded-full bg-${p.color}/15 blur-3xl pointer-events-none`} />
            <div className="relative">
              <div className={`size-12 rounded-2xl bg-${p.color}/15 text-${p.color} grid place-items-center mb-4`}>
                <p.icon className="size-6" />
              </div>
              <p className="font-display font-bold text-2xl">{p.name}</p>
              <p className="text-sm text-muted-foreground mt-1 mb-5">{p.description}</p>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="font-display font-extrabold text-4xl">
                  {billing === "yearly"
                    ? `₹${(parseInt(p.price.replace(/[₹,]/g, "")) * 12 * 0.8).toLocaleString("en-IN")}`
                    : p.price}
                </span>
                <span className="text-muted-foreground">/{billing === "yearly" ? "year" : "month"}</span>
              </div>
              <ul className="space-y-2.5 mb-6">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm">
                    <div className={`size-5 rounded-full bg-${p.color}/15 text-${p.color} grid place-items-center shrink-0`}>
                      <Check className="size-3" />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                disabled={p.current}
                className={`w-full rounded-xl h-11 font-semibold ${
                  p.popular
                    ? "bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-90"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {p.cta}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* -------------------- Add-ons -------------------- */
const addons = [
  { name: "Extra Storage", desc: "Add 100 GB of additional storage.", price: "₹200/mo", icon: HardDrive, color: "info", active: true },
  { name: "WhatsApp Credits", desc: "5,000 outbound WhatsApp messages.", price: "₹400/mo", icon: MessageSquare, color: "success", active: false },
  { name: "AI Face Search", desc: "Add 20,000 face recognition lookups.", price: "₹500/mo", icon: ScanFace, color: "primary", active: false },
  { name: "Premium Templates", desc: "Unlock 50+ premium gallery themes.", price: "₹250/mo", icon: ImageIcon, color: "warning", active: false },
  { name: "Custom Domain", desc: "Connect your own domain to galleries.", price: "₹150/mo", icon: Sparkles, color: "primary-glow", active: true },
  { name: "Priority Support", desc: "24/7 dedicated chat & call support.", price: "₹600/mo", icon: Crown, color: "warning", active: false },
];

const Addons = () => (
  <div className="space-y-5">
    <div className="rounded-3xl bg-gradient-aurora border border-border/60 p-6 lg:p-8 relative overflow-hidden">
      <div className="absolute -top-20 -right-20 size-60 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
      <div className="relative flex items-center justify-between gap-4 flex-wrap">
        <div>
          <p className="font-display font-bold text-2xl">Boost your Business plan</p>
          <p className="text-sm text-muted-foreground mt-1">Add power-ups to your subscription. Cancel any time.</p>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Active add-ons</p>
          <p className="font-display font-bold text-2xl">2 <span className="text-sm font-normal text-muted-foreground">/ ₹350 mo</span></p>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      {addons.map((a) => (
        <div key={a.name} className="rounded-3xl bg-gradient-card border border-border/60 p-6 shadow-card relative overflow-hidden group hover:-translate-y-0.5 transition-transform">
          <div className={`absolute -top-16 -right-16 size-40 rounded-full bg-${a.color}/15 blur-3xl pointer-events-none`} />
          <div className="relative">
            <div className="flex items-start justify-between mb-4">
              <div className={`size-12 rounded-2xl bg-${a.color}/15 text-${a.color} grid place-items-center`}>
                <a.icon className="size-6" />
              </div>
              {a.active && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-success/15 text-success text-xs font-medium">
                  <CheckCircle2 className="size-3.5" /> Active
                </span>
              )}
            </div>
            <p className="font-display font-bold text-lg">{a.name}</p>
            <p className="text-sm text-muted-foreground mt-1 mb-4 min-h-[40px]">{a.desc}</p>
            <div className="flex items-center justify-between">
              <span className="font-display font-bold text-xl">{a.price}</span>
              {a.active ? (
                <Button variant="outline" size="sm" className="rounded-xl border-destructive/40 text-destructive hover:bg-destructive/10">
                  Remove
                </Button>
              ) : (
                <Button size="sm" className="rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
                  <Plus className="size-4" /> Add
                </Button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

/* -------------------- Page -------------------- */
const Billing = () => {
  const [tab, setTab] = useState<Tab>("Overview");

  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="Billing & Subscription"
        title={<>Manage your <span className="gradient-text">plan</span> & usage</>}
        description="Subscription details, payment information and usage statistics in one place."
      />

      <div className="flex items-center gap-1 mb-6 p-1 rounded-2xl bg-card/60 border border-border/60 backdrop-blur-md w-fit overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
              tab === t ? "bg-gradient-primary text-primary-foreground shadow-glow" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Overview" && <Overview />}
      {tab === "Invoices & Transactions" && <Invoices />}
      {tab === "Plans" && <Plans />}
      {tab === "Add-ons" && <Addons />}
    </DashboardLayout>
  );
};

export default Billing;
