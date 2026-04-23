import { ReactNode } from "react";

interface PageHeaderProps {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  actions?: ReactNode;
}

export const PageHeader = ({ eyebrow, title, description, actions }: PageHeaderProps) => (
  <div className="relative overflow-hidden rounded-3xl bg-gradient-aurora border border-border/60 p-6 lg:p-8 mb-8">
    <div className="absolute -top-20 -right-20 size-72 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
    <div className="absolute -bottom-20 -left-20 size-72 rounded-full bg-info/15 blur-3xl pointer-events-none" />
    <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        {eyebrow && <p className="text-xs font-medium text-primary uppercase tracking-widest mb-2">{eyebrow}</p>}
        <h1 className="font-display font-extrabold text-3xl lg:text-4xl tracking-tight">{title}</h1>
        {description && <p className="text-muted-foreground mt-2 max-w-xl">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 self-start md:self-auto">{actions}</div>}
    </div>
  </div>
);
