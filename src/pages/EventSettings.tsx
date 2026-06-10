import { Link, useParams } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft, Image as ImageIcon, CheckCircle2, HardDrive, CalendarDays,
  KeyRound, Eye, Copy, Sparkles,
} from "lucide-react";

const Stat = ({
  icon: Icon, value, label, tint,
}: { icon: any; value: string; label: string; tint: string }) => (
  <div className="flex items-center gap-3 p-4 rounded-2xl bg-card/60 border border-border/60">
    <div className={`size-11 rounded-xl bg-gradient-to-br ${tint} grid place-items-center text-white shadow-card`}>
      <Icon className="size-5" />
    </div>
    <div className="leading-tight">
      <p className="text-lg font-bold">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  </div>
);

const Section = ({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) => (
  <section className="rounded-3xl bg-card/60 border border-border/60 backdrop-blur-md shadow-card p-6">
    <div className="mb-5">
      <h2 className="font-display font-bold text-lg">{title}</h2>
      {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
    </div>
    {children}
  </section>
);

const Row = ({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) => (
  <div className="flex items-center justify-between gap-4 py-3 border-b border-border/40 last:border-0">
    <div>
      <p className="text-sm font-medium">{label}</p>
      {hint && <p className="text-[11px] text-muted-foreground mt-0.5">{hint}</p>}
    </div>
    {children}
  </div>
);

const EventSettings = () => {
  const { id } = useParams();
  const eventTitle = "Wedding";

  return (
    <DashboardLayout>
      <div className="flex items-center gap-3 mb-6">
        <Link
          to={`/events/${id}`}
          className="size-10 rounded-xl bg-card/70 border border-border/60 backdrop-blur-md grid place-items-center hover:bg-secondary transition-colors"
          aria-label="Back to event"
        >
          <ArrowLeft className="size-4" />
        </Link>
        <div>
          <p className="text-[11px] font-medium text-primary uppercase tracking-widest">Event Settings</p>
          <h1 className="font-display font-extrabold text-xl lg:text-2xl tracking-tight">{eventTitle}</h1>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <Stat icon={ImageIcon} value="152" label="Total Photos" tint="from-primary to-primary-glow" />
        <Stat icon={CheckCircle2} value="6" label="Selected" tint="from-success to-emerald-400" />
        <Stat icon={HardDrive} value="2.99 GB" label="Storage" tint="from-warning to-orange-400" />
        <Stat icon={CalendarDays} value="31/03/2026" label="Completed" tint="from-info to-cyan-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Section title="Gallery Access" description="Control how clients reach this event gallery.">
          <Row label="Access Code" hint="Share this code with clients.">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-secondary/60 border border-border/60">
              <KeyRound className="size-3.5 text-muted-foreground" />
              <span className="text-sm font-semibold">2233</span>
              <button className="text-muted-foreground hover:text-foreground" aria-label="Copy code">
                <Copy className="size-3.5" />
              </button>
            </div>
          </Row>
          <Row label="Gallery URL">
            <Button size="sm" variant="secondary" className="rounded-xl border border-border/60">
              <Eye className="size-3.5 mr-1.5" /> Preview
            </Button>
          </Row>
          <Row label="Publish gallery" hint="Make the gallery visible to clients.">
            <Switch defaultChecked />
          </Row>
          <Row label="AI Face Search" hint="Let guests find themselves by face.">
            <Switch />
          </Row>
        </Section>

        <Section title="Workflow" description="Selection and delivery status.">
          <Row label="Selection Status">
            <Select defaultValue="under">
              <SelectTrigger className="h-9 w-[180px] rounded-xl bg-secondary/60 border-border/60 text-xs font-semibold uppercase tracking-wide">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="under">Under Selection</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
              </SelectContent>
            </Select>
          </Row>
          <Row label="Event Status">
            <Select defaultValue="planned">
              <SelectTrigger className="h-9 w-[180px] rounded-xl bg-secondary/60 border-border/60 text-xs font-semibold uppercase tracking-wide">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="planned">Planned</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </Row>
          <Row label="AI Suggestions" hint="Get smart curation hints.">
            <Button size="sm" variant="secondary" className="rounded-xl border border-border/60">
              <Sparkles className="size-3.5 mr-1.5" /> Configure
            </Button>
          </Row>
        </Section>

        <Section title="Event Details">
          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground">Event name</label>
              <Input defaultValue={eventTitle} className="mt-1 rounded-xl bg-secondary/60 border-border/60" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Event date</label>
              <Input defaultValue="2026-03-29" type="date" className="mt-1 rounded-xl bg-secondary/60 border-border/60" />
            </div>
          </div>
        </Section>

        <Section title="Danger Zone" description="Irreversible actions.">
          <Row label="Archive event" hint="Hide from active list.">
            <Button size="sm" variant="secondary" className="rounded-xl border border-border/60">Archive</Button>
          </Row>
          <Row label="Delete event" hint="Permanently delete this event and its media.">
            <Button size="sm" variant="ghost" className="rounded-xl border border-destructive/40 text-destructive hover:text-destructive">
              Delete
            </Button>
          </Row>
        </Section>
      </div>
    </DashboardLayout>
  );
};

export default EventSettings;
