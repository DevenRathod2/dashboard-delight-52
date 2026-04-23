import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  hint?: string;
  icon: LucideIcon;
  tint?: string;
  trend?: string;
}

export const StatCard = ({ label, value, hint, icon: Icon, tint = "from-primary to-primary-glow", trend }: StatCardProps) => (
  <div className="relative overflow-hidden rounded-2xl bg-gradient-card border border-border/60 p-5 shadow-card hover:shadow-elevated transition-all hover:-translate-y-0.5">
    <div className={cn("absolute -right-6 -top-6 size-24 rounded-full bg-gradient-to-br opacity-20 blur-2xl", tint)} />
    <div className="relative flex items-start justify-between">
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-display font-bold text-3xl mt-2 tracking-tight">{value}</p>
        {hint && <p className="text-[11px] text-muted-foreground mt-1">{hint}</p>}
        {trend && <p className="text-[11px] text-success mt-1">{trend}</p>}
      </div>
      <div className={cn("inline-flex size-10 rounded-xl bg-gradient-to-br items-center justify-center text-white shadow-card", tint)}>
        <Icon className="size-4" />
      </div>
    </div>
  </div>
);
