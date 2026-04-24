import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/hooks/use-theme";
import {
  User,
  Building2,
  Lock,
  Bell,
  Plug,
  Palette,
  Users,
  AlertTriangle,
  Camera,
  Mail,
  Phone,
  Globe,
  Instagram,
  Facebook,
  KeyRound,
  Smartphone,
  Trash2,
  Upload,
  Check,
  Sun,
  Moon,
  MessageSquare,
  CreditCard,
  Cloud,
  Sparkles,
  Plus,
  ShieldCheck,
  LogOut,
} from "lucide-react";

type SectionId =
  | "profile"
  | "studio"
  | "appearance"
  | "notifications"
  | "security"
  | "integrations"
  | "team"
  | "danger";

const sections: { id: SectionId; label: string; icon: typeof User; color: string }[] = [
  { id: "profile", label: "Profile", icon: User, color: "primary" },
  { id: "studio", label: "Studio", icon: Building2, color: "info" },
  { id: "appearance", label: "Appearance", icon: Palette, color: "primary-glow" },
  { id: "notifications", label: "Notifications", icon: Bell, color: "warning" },
  { id: "security", label: "Security", icon: Lock, color: "success" },
  { id: "integrations", label: "Integrations", icon: Plug, color: "info" },
  { id: "team", label: "Team", icon: Users, color: "primary" },
  { id: "danger", label: "Danger Zone", icon: AlertTriangle, color: "destructive" },
];

const Card = ({ title, description, children, action }: { title: string; description?: string; children: React.ReactNode; action?: React.ReactNode }) => (
  <div className="rounded-3xl bg-gradient-card border border-border/60 p-6 lg:p-8 shadow-card relative overflow-hidden">
    <div className="absolute -top-20 -right-20 size-60 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
    <div className="relative">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <p className="font-display font-bold text-xl tracking-tight">{title}</p>
          {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
        </div>
        {action}
      </div>
      {children}
    </div>
  </div>
);

const Field = ({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) => (
  <div className={full ? "md:col-span-2" : ""}>
    <label className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</label>
    <div className="mt-1.5">{children}</div>
  </div>
);

const Row = ({ icon: Icon, title, description, color = "primary", action }: any) => (
  <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-secondary/40 border border-border/60">
    <div className="flex items-center gap-3 min-w-0">
      <div className={`size-10 rounded-xl bg-${color}/15 text-${color} grid place-items-center shrink-0`}>
        <Icon className="size-5" />
      </div>
      <div className="min-w-0">
        <p className="font-semibold text-sm truncate">{title}</p>
        <p className="text-xs text-muted-foreground truncate">{description}</p>
      </div>
    </div>
    {action}
  </div>
);

/* ---------------- Sections ---------------- */
const ProfileSection = () => (
  <div className="space-y-5">
    <Card title="Personal Information" description="Update your photo and personal details.">
      <div className="flex items-center gap-5 mb-6 p-5 rounded-2xl bg-secondary/30 border border-border/60">
        <div className="relative">
          <div className="size-20 rounded-2xl bg-gradient-primary grid place-items-center text-2xl font-display font-bold text-primary-foreground shadow-glow">
            DR
          </div>
          <button className="absolute -bottom-1 -right-1 size-7 rounded-full bg-card border border-border grid place-items-center hover:bg-secondary">
            <Camera className="size-3.5" />
          </button>
        </div>
        <div className="flex-1">
          <p className="font-display font-bold text-lg">Dhruv Raj</p>
          <p className="text-sm text-muted-foreground">Owner · EventBit Studios</p>
          <div className="flex gap-2 mt-3">
            <Button size="sm" className="rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
              <Upload className="size-3.5" /> Upload new
            </Button>
            <Button size="sm" variant="outline" className="rounded-xl">Remove</Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="First Name"><Input defaultValue="Dhruv" className="rounded-xl bg-secondary/40 border-border/60 h-11" /></Field>
        <Field label="Last Name"><Input defaultValue="Raj" className="rounded-xl bg-secondary/40 border-border/60 h-11" /></Field>
        <Field label="Email"><Input defaultValue="admin@eventbit.io" className="rounded-xl bg-secondary/40 border-border/60 h-11" /></Field>
        <Field label="Phone"><Input defaultValue="+91 87888 87373" className="rounded-xl bg-secondary/40 border-border/60 h-11" /></Field>
        <Field label="Role"><Input defaultValue="Owner" className="rounded-xl bg-secondary/40 border-border/60 h-11" /></Field>
        <Field label="Timezone"><Input defaultValue="Asia/Kolkata (GMT +5:30)" className="rounded-xl bg-secondary/40 border-border/60 h-11" /></Field>
        <Field label="Bio" full>
          <Textarea
            defaultValue="Wedding & event photographer based in Bengaluru. 10+ years capturing the moments that matter."
            className="rounded-xl bg-secondary/40 border-border/60 min-h-[90px]"
          />
        </Field>
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <Button variant="outline" className="rounded-xl">Cancel</Button>
        <Button className="rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
          <Check className="size-4" /> Save changes
        </Button>
      </div>
    </Card>
  </div>
);

const StudioSection = () => (
  <div className="space-y-5">
    <Card title="Studio Details" description="Information shown on galleries and invoices.">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Studio Name"><Input defaultValue="EventBit Studios" className="rounded-xl bg-secondary/40 border-border/60 h-11" /></Field>
        <Field label="Public URL"><Input defaultValue="eventbit.lensly.app" className="rounded-xl bg-secondary/40 border-border/60 h-11" /></Field>
        <Field label="Tagline" full><Input defaultValue="Weddings, portraits & cinematic stories." className="rounded-xl bg-secondary/40 border-border/60 h-11" /></Field>
        <Field label="Address" full><Input defaultValue="Site No. 26, Hosur Road, Adugodi, Bengaluru" className="rounded-xl bg-secondary/40 border-border/60 h-11" /></Field>
        <Field label="City"><Input defaultValue="Bengaluru" className="rounded-xl bg-secondary/40 border-border/60 h-11" /></Field>
        <Field label="Pincode"><Input defaultValue="560029" className="rounded-xl bg-secondary/40 border-border/60 h-11" /></Field>
        <Field label="Website" full>
          <div className="relative">
            <Globe className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input defaultValue="https://eventbit.io" className="pl-9 rounded-xl bg-secondary/40 border-border/60 h-11" />
          </div>
        </Field>
        <Field label="Instagram">
          <div className="relative">
            <Instagram className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input defaultValue="@eventbit" className="pl-9 rounded-xl bg-secondary/40 border-border/60 h-11" />
          </div>
        </Field>
        <Field label="Facebook">
          <div className="relative">
            <Facebook className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input defaultValue="/eventbit" className="pl-9 rounded-xl bg-secondary/40 border-border/60 h-11" />
          </div>
        </Field>
      </div>
      <div className="flex justify-end gap-2 mt-6">
        <Button className="rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
          <Check className="size-4" /> Save studio
        </Button>
      </div>
    </Card>

    <Card title="Brand Assets" description="Logo & watermark used across galleries and exports.">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {["Studio Logo", "Watermark"].map((label) => (
          <div key={label} className="rounded-2xl border-2 border-dashed border-border bg-secondary/30 p-6 text-center hover:border-primary/60 transition-colors">
            <div className="size-12 rounded-xl bg-primary/15 text-primary grid place-items-center mx-auto mb-3">
              <Upload className="size-5" />
            </div>
            <p className="font-semibold text-sm">{label}</p>
            <p className="text-xs text-muted-foreground mt-1">PNG, SVG up to 2 MB</p>
            <Button size="sm" variant="secondary" className="rounded-xl mt-3">Choose file</Button>
          </div>
        ))}
      </div>
    </Card>
  </div>
);

const AppearanceSection = () => {
  const { theme, toggleTheme } = useTheme();
  const accents = [
    { name: "Violet", color: "from-primary to-primary-glow", active: true },
    { name: "Ocean", color: "from-info to-cyan-400", active: false },
    { name: "Sunset", color: "from-warning to-destructive", active: false },
    { name: "Forest", color: "from-success to-info", active: false },
  ];
  return (
    <div className="space-y-5">
      <Card title="Theme" description="Switch between light and dark interface.">
        <div className="grid grid-cols-2 gap-4">
          {(["light", "dark"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => { if (theme !== mode) toggleTheme(); }}
              className={`relative rounded-2xl border-2 p-5 text-left transition-all ${
                theme === mode ? "border-primary shadow-glow bg-primary/5" : "border-border/60 bg-secondary/30 hover:border-border"
              }`}
            >
              <div className="size-10 rounded-xl bg-gradient-primary grid place-items-center text-primary-foreground mb-3 shadow-glow">
                {mode === "light" ? <Sun className="size-5" /> : <Moon className="size-5" />}
              </div>
              <p className="font-semibold capitalize">{mode} mode</p>
              <p className="text-xs text-muted-foreground mt-1">
                {mode === "light" ? "Bright & airy interface." : "Cinematic studio aesthetic."}
              </p>
              {theme === mode && (
                <div className="absolute top-3 right-3 size-6 rounded-full bg-gradient-primary text-primary-foreground grid place-items-center shadow-glow">
                  <Check className="size-3.5" />
                </div>
              )}
            </button>
          ))}
        </div>
      </Card>

      <Card title="Accent Color" description="Customize the highlight color across the app.">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {accents.map((a) => (
            <button
              key={a.name}
              className={`relative rounded-2xl p-4 border-2 transition-all ${
                a.active ? "border-primary shadow-glow" : "border-border/60 hover:border-border"
              } bg-secondary/30`}
            >
              <div className={`h-16 rounded-xl bg-gradient-to-br ${a.color} mb-3 shadow-card`} />
              <p className="text-sm font-semibold">{a.name}</p>
              {a.active && (
                <div className="absolute top-2 right-2 size-5 rounded-full bg-gradient-primary text-primary-foreground grid place-items-center">
                  <Check className="size-3" />
                </div>
              )}
            </button>
          ))}
        </div>
      </Card>

      <Card title="Display Density" description="Adjust spacing across tables and lists.">
        <div className="grid grid-cols-3 gap-3">
          {["Compact", "Comfortable", "Spacious"].map((d, i) => (
            <button
              key={d}
              className={`rounded-2xl p-4 border-2 text-sm font-semibold transition-all ${
                i === 1 ? "border-primary bg-primary/10 text-primary" : "border-border/60 bg-secondary/30 hover:border-border"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
};

const NotificationsSection = () => {
  const groups = [
    {
      title: "Email",
      icon: Mail,
      items: [
        { t: "New leads", d: "When a new lead enquires from your portfolio.", on: true },
        { t: "Booking confirmations", d: "When a client confirms a booking.", on: true },
        { t: "Invoice paid", d: "When a client clears an invoice.", on: true },
        { t: "Weekly summary", d: "Sunday digest with key metrics.", on: false },
      ],
    },
    {
      title: "Push & Mobile",
      icon: Smartphone,
      items: [
        { t: "Gallery viewed", d: "When a client opens their gallery.", on: false },
        { t: "Photo selections", d: "Get notified about client picks.", on: true },
        { t: "Storage alerts", d: "When you cross 80% of your quota.", on: true },
      ],
    },
    {
      title: "WhatsApp",
      icon: MessageSquare,
      items: [
        { t: "Event reminders", d: "24h before each event.", on: true },
        { t: "Payment reminders", d: "For overdue invoices.", on: true },
      ],
    },
  ];
  return (
    <div className="space-y-5">
      {groups.map((g) => (
        <Card key={g.title} title={g.title}>
          <div className="space-y-3">
            {g.items.map((it) => (
              <Row
                key={it.t}
                icon={g.icon}
                title={it.t}
                description={it.d}
                color="primary"
                action={<Switch defaultChecked={it.on} />}
              />
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
};

const SecuritySection = () => (
  <div className="space-y-5">
    <Card title="Password" description="Use a strong password unique to this account.">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Current Password" full><Input type="password" defaultValue="••••••••••" className="rounded-xl bg-secondary/40 border-border/60 h-11" /></Field>
        <Field label="New Password"><Input type="password" className="rounded-xl bg-secondary/40 border-border/60 h-11" /></Field>
        <Field label="Confirm New Password"><Input type="password" className="rounded-xl bg-secondary/40 border-border/60 h-11" /></Field>
      </div>
      <div className="flex justify-end mt-5">
        <Button className="rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
          <KeyRound className="size-4" /> Update password
        </Button>
      </div>
    </Card>

    <Card title="Two-Factor Authentication" description="Add an extra layer of security to your account.">
      <div className="space-y-3">
        <Row
          icon={ShieldCheck}
          title="Authenticator app"
          description="Use Google Authenticator or 1Password."
          color="success"
          action={<Switch defaultChecked />}
        />
        <Row
          icon={Phone}
          title="SMS verification"
          description="Receive a code on +91 87888 87373."
          color="info"
          action={<Switch />}
        />
      </div>
    </Card>

    <Card title="Active Sessions" description="Devices currently signed in to your account.">
      <div className="space-y-3">
        {[
          { d: "MacBook Pro · Chrome", l: "Bengaluru, IN · This device", on: true },
          { d: "iPhone 15 · Safari", l: "Bengaluru, IN · 2h ago", on: false },
          { d: "Windows · Firefox", l: "Mumbai, IN · 3 days ago", on: false },
        ].map((s) => (
          <div key={s.d} className="flex items-center justify-between p-4 rounded-2xl bg-secondary/40 border border-border/60">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-info/15 text-info grid place-items-center">
                <Smartphone className="size-5" />
              </div>
              <div>
                <p className="font-semibold text-sm flex items-center gap-2">
                  {s.d}
                  {s.on && <Badge className="bg-success/15 text-success border-0 text-[10px]">Current</Badge>}
                </p>
                <p className="text-xs text-muted-foreground">{s.l}</p>
              </div>
            </div>
            {!s.on && (
              <Button variant="outline" size="sm" className="rounded-xl border-destructive/40 text-destructive hover:bg-destructive/10">
                <LogOut className="size-3.5" /> Sign out
              </Button>
            )}
          </div>
        ))}
      </div>
    </Card>
  </div>
);

const IntegrationsSection = () => {
  const items = [
    { name: "Google Drive", desc: "Sync deliveries to client folders.", icon: Cloud, color: "info", on: true },
    { name: "Stripe", desc: "Accept card payments worldwide.", icon: CreditCard, color: "primary", on: true },
    { name: "WhatsApp Business", desc: "Send updates and gallery links.", icon: MessageSquare, color: "success", on: true },
    { name: "Mailchimp", desc: "Newsletter & client journeys.", icon: Mail, color: "warning", on: false },
    { name: "Instagram", desc: "Auto-publish portfolio updates.", icon: Instagram, color: "primary-glow", on: false },
    { name: "AI Studio", desc: "Smart culling & face search.", icon: Sparkles, color: "primary", on: true },
  ];
  return (
    <Card title="Integrations" description="Connect your favorite tools to streamline your workflow." action={
      <Button size="sm" variant="secondary" className="rounded-xl"><Plus className="size-4" /> Browse all</Button>
    }>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {items.map((i) => (
          <div key={i.name} className="flex items-center justify-between gap-3 p-4 rounded-2xl bg-secondary/40 border border-border/60">
            <div className="flex items-center gap-3 min-w-0">
              <div className={`size-11 rounded-xl bg-${i.color}/15 text-${i.color} grid place-items-center shrink-0`}>
                <i.icon className="size-5" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-sm">{i.name}</p>
                <p className="text-xs text-muted-foreground truncate">{i.desc}</p>
              </div>
            </div>
            {i.on ? (
              <Button size="sm" variant="outline" className="rounded-xl">Manage</Button>
            ) : (
              <Button size="sm" className="rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">Connect</Button>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};

const TeamSection = () => {
  const team = [
    { n: "Dhruv Raj", e: "admin@eventbit.io", r: "Owner", c: "primary" },
    { n: "Aanya Kapoor", e: "aanya@eventbit.io", r: "Editor", c: "info" },
    { n: "Rohan Mehta", e: "rohan@eventbit.io", r: "Photographer", c: "warning" },
    { n: "Priya Shah", e: "priya@eventbit.io", r: "Assistant", c: "success" },
  ];
  return (
    <Card
      title="Team Members"
      description="Invite people to collaborate on your studio."
      action={
        <Button size="sm" className="rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
          <Plus className="size-4" /> Invite member
        </Button>
      }
    >
      <div className="space-y-3">
        {team.map((m) => (
          <div key={m.e} className="flex items-center justify-between p-4 rounded-2xl bg-secondary/40 border border-border/60">
            <div className="flex items-center gap-3">
              <div className={`size-11 rounded-xl bg-${m.c}/15 text-${m.c} grid place-items-center font-display font-bold`}>
                {m.n.split(" ").map((p) => p[0]).join("")}
              </div>
              <div>
                <p className="font-semibold text-sm">{m.n}</p>
                <p className="text-xs text-muted-foreground">{m.e}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="rounded-full">{m.r}</Badge>
              {m.r !== "Owner" && (
                <Button variant="ghost" size="sm" className="rounded-lg text-destructive hover:bg-destructive/10">
                  <Trash2 className="size-4" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

const DangerSection = () => (
  <div className="space-y-5">
    <div className="rounded-3xl bg-gradient-card border border-destructive/40 p-6 lg:p-8 shadow-elevated relative overflow-hidden">
      <div className="absolute -top-20 -right-20 size-60 rounded-full bg-destructive/15 blur-3xl pointer-events-none" />
      <div className="relative space-y-5">
        <div className="flex items-start gap-3">
          <div className="size-12 rounded-2xl bg-destructive/15 text-destructive grid place-items-center shrink-0">
            <AlertTriangle className="size-6" />
          </div>
          <div>
            <p className="font-display font-bold text-xl text-destructive">Danger Zone</p>
            <p className="text-sm text-muted-foreground mt-1">These actions are permanent and cannot be undone.</p>
          </div>
        </div>

        <div className="space-y-3">
          {[
            { t: "Export all data", d: "Download a ZIP of your studio data.", btn: "Export", variant: "outline" as const },
            { t: "Transfer ownership", d: "Move ownership of this studio to another member.", btn: "Transfer", variant: "outline" as const },
            { t: "Delete studio", d: "Permanently delete the studio and all associated data.", btn: "Delete", danger: true },
          ].map((a) => (
            <div key={a.t} className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-secondary/40 border border-border/60">
              <div>
                <p className="font-semibold text-sm">{a.t}</p>
                <p className="text-xs text-muted-foreground">{a.d}</p>
              </div>
              {a.danger ? (
                <Button className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  <Trash2 className="size-4" /> {a.btn}
                </Button>
              ) : (
                <Button variant="outline" className="rounded-xl">{a.btn}</Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

/* ---------------- Page ---------------- */
const Settings = () => {
  const [section, setSection] = useState<SectionId>("profile");

  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="Settings"
        title={<>Tune your <span className="gradient-text">studio</span> experience</>}
        description="Manage profile, studio branding, security, integrations and team — all in one place."
      />

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-5">
        {/* Side nav */}
        <aside className="rounded-3xl bg-gradient-card border border-border/60 p-3 shadow-card h-fit lg:sticky lg:top-20">
          <nav className="space-y-1">
            {sections.map((s) => {
              const active = section === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setSection(s.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    active
                      ? "bg-gradient-primary text-primary-foreground shadow-glow"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                  }`}
                >
                  <span className={`size-8 rounded-lg grid place-items-center ${
                    active ? "bg-white/15" : `bg-${s.color}/15 text-${s.color}`
                  }`}>
                    <s.icon className="size-4" />
                  </span>
                  {s.label}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Content */}
        <div>
          {section === "profile" && <ProfileSection />}
          {section === "studio" && <StudioSection />}
          {section === "appearance" && <AppearanceSection />}
          {section === "notifications" && <NotificationsSection />}
          {section === "security" && <SecuritySection />}
          {section === "integrations" && <IntegrationsSection />}
          {section === "team" && <TeamSection />}
          {section === "danger" && <DangerSection />}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
