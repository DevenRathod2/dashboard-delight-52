import {
  Calendar,
  CheckCircle2,
  CreditCard,
  FolderPlus,
  ImageUp,
  Link2,
  Receipt,
  Send,
  UserPlus,
  ListChecks,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

const money = (n: number, currency = "INR") => {
  try {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency, maximumFractionDigits: 0 }).format(n);
  } catch {
    return `${currency} ${n.toLocaleString()}`;
  }
};

const Shell = ({
  icon: Icon,
  title,
  subtitle,
  tint = "from-primary to-primary-glow",
  children,
}: {
  icon: React.ElementType;
  title: string;
  subtitle?: string;
  tint?: string;
  children?: React.ReactNode;
}) => (
  <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/70 backdrop-blur-xl p-4 shadow-card">
    <div className={cn("absolute -right-8 -top-8 size-24 rounded-full bg-gradient-to-br opacity-20 blur-2xl", tint)} />
    <div className="relative flex items-start gap-3">
      <div className={cn("shrink-0 grid size-9 place-items-center rounded-xl bg-gradient-to-br text-white shadow-card", tint)}>
        <Icon className="size-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-display font-semibold text-sm leading-tight">{title}</p>
        {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
        {children && <div className="mt-3">{children}</div>}
      </div>
      <CheckCircle2 className="size-4 text-success shrink-0" />
    </div>
  </div>
);

const Rows = ({ items }: { items: [string, React.ReactNode][] }) => (
  <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
    {items.map(([k, v]) => (
      <div key={k} className="min-w-0">
        <dt className="text-[10px] uppercase tracking-widest text-muted-foreground">{k}</dt>
        <dd className="text-xs font-medium truncate">{v}</dd>
      </div>
    ))}
  </dl>
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ToolResultCard = ({ name, output }: { name: string; output: any }) => {
  if (!output || typeof output !== "object") return null;

  switch (name) {
    case "create_client":
      return (
        <Shell icon={UserPlus} title={output.name} subtitle="Client added to your CRM" tint="from-info to-cyan-400">
          <Rows items={[["Phone", output.phone], ["Email", output.email]]} />
        </Shell>
      );

    case "create_event":
      return (
        <Shell icon={Calendar} title={output.name} subtitle={`Event created for ${output.client}`}>
          <Rows
            items={[
              ["Type", output.type],
              ["Date", output.date],
              ["Location", output.location],
              ["Status", output.status],
            ]}
          />
        </Shell>
      );

    case "create_collection":
      return (
        <Shell icon={FolderPlus} title={output.name} subtitle={`Collection in ${output.event}`} tint="from-warning to-orange-400">
          <Rows items={[["Photos", output.photos], ["Videos", output.videos]]} />
        </Shell>
      );

    case "upload_media":
      return (
        <Shell
          icon={ImageUp}
          title={`${output.uploaded} files uploaded`}
          subtitle={`${output.source} → ${output.collection}`}
          tint="from-success to-emerald-400"
        >
          <Progress value={output.progress} className="h-1.5 mb-3" />
          <Rows
            items={[
              ["Quality", output.quality],
              ["Size", `${output.sizeMb} MB`],
              ["Duration", `${output.durationSec}s`],
              ["Failed", output.failed],
            ]}
          />
        </Shell>
      );

    case "share_gallery":
      return (
        <Shell icon={Link2} title="Gallery shared" subtitle={`${output.event} · ${output.client}`}>
          <a
            href={output.url}
            target="_blank"
            rel="noreferrer"
            className="block truncate rounded-lg bg-secondary/60 border border-border/60 px-3 py-2 text-xs font-medium text-primary"
          >
            {output.url}
          </a>
          <div className="mt-3">
            <Rows
              items={[
                ["Access code", <span className="font-mono">{output.accessCode}</span>],
                ["Expires in", `${output.expiresInDays} days`],
              ]}
            />
          </div>
        </Shell>
      );

    case "create_invoice":
      return (
        <Shell icon={Receipt} title={output.number} subtitle={`${output.client} · ${output.status}`} tint="from-warning to-orange-400">
          <div className="space-y-1.5 mb-3">
            {(output.items ?? []).map((it: { description: string; quantity: number; subtotal: number }, i: number) => (
              <div key={i} className="flex items-center justify-between gap-3 text-xs">
                <span className="truncate text-muted-foreground">
                  {it.description} × {it.quantity}
                </span>
                <span className="font-medium shrink-0">{money(it.subtotal, output.currency)}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between border-t border-border/60 pt-2">
            <span className="text-xs text-muted-foreground">Total due {output.dueDate}</span>
            <span className="font-display font-bold text-base">{money(output.total, output.currency)}</span>
          </div>
        </Shell>
      );

    case "send_invoice":
      return (
        <Shell icon={Send} title={`${output.invoiceNumber} sent`} subtitle={`To ${output.client} via ${output.channel}`} tint="from-success to-emerald-400">
          <a href={output.payLink} target="_blank" rel="noreferrer" className="text-xs font-medium text-primary truncate block">
            {output.payLink}
          </a>
        </Shell>
      );

    case "get_billing_usage": {
      const storage = Math.round((output.storageUsedGb / output.storageTotalGb) * 100);
      const credits = Math.round((output.aiCreditsUsed / output.aiCreditsTotal) * 100);
      return (
        <Shell icon={CreditCard} title={output.plan} subtitle={`Renews ${output.renewsOn}`} tint="from-info to-cyan-400">
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-muted-foreground">Storage</span>
                <span className="font-medium">{output.storageUsedGb} / {output.storageTotalGb} GB</span>
              </div>
              <Progress value={storage} className="h-1.5" />
            </div>
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-muted-foreground">AI credits</span>
                <span className="font-medium">{output.aiCreditsUsed.toLocaleString()} / {output.aiCreditsTotal.toLocaleString()}</span>
              </div>
              <Progress value={credits} className="h-1.5" />
            </div>
            <Rows
              items={[
                ["Revenue", money(output.revenueThisMonth, output.currency)],
                ["Pending", money(output.pendingAmount, output.currency)],
                ["Events", output.eventsThisMonth],
                ["Galleries", output.galleriesShared],
              ]}
            />
          </div>
        </Shell>
      );
    }

    case "list_events":
      return (
        <Shell icon={ListChecks} title="Recent events" subtitle={`${output.events?.length ?? 0} results`}>
          <div className="space-y-1.5">
            {(output.events ?? []).map((e: { name: string; client: string; date: string; status: string; photos: number }) => (
              <div key={e.name} className="flex items-center justify-between gap-3 rounded-lg bg-secondary/50 px-3 py-2">
                <div className="min-w-0">
                  <p className="text-xs font-medium truncate">{e.name}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{e.client} · {e.date}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[10px] font-medium">{e.status}</p>
                  <p className="text-[10px] text-muted-foreground">{e.photos} photos</p>
                </div>
              </div>
            ))}
          </div>
        </Shell>
      );

    default:
      return null;
  }
};
