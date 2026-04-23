import { Calendar, User, Share2, MoreHorizontal, Edit3, ImageIcon, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type EventStatus = "Not Started" | "In Progress" | "Selection Submitted" | "Completed";

export interface EventCardProps {
  title: string;
  date: string;
  client: string;
  status: EventStatus;
  image?: string;
  photos?: number;
  progress?: number;
}

const statusStyles: Record<EventStatus, string> = {
  "Not Started": "bg-muted/80 text-muted-foreground border-border",
  "In Progress": "bg-warning/15 text-warning border-warning/30",
  "Selection Submitted": "bg-info/15 text-info border-info/30",
  "Completed": "bg-success/15 text-success border-success/30",
};

export const EventCard = ({ title, date, client, status, image, photos = 0, progress = 0 }: EventCardProps) => {
  return (
    <article className="group relative rounded-3xl overflow-hidden bg-gradient-card border border-border/60 shadow-card hover:shadow-elevated transition-all duration-500 hover:-translate-y-1 animate-fade-up">
      {/* Glow ring on hover */}
      <div className="absolute -inset-px rounded-3xl bg-gradient-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-md" />

      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
        {image ? (
          <img
            src={image}
            alt={title}
            loading="lazy"
            width={1024}
            height={768}
            className="size-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="size-full grid place-items-center bg-gradient-aurora">
            <ImageIcon className="size-12 text-muted-foreground/50" />
          </div>
        )}

        {/* Top overlay actions */}
        <div className="absolute inset-x-0 top-0 p-3 flex items-start justify-between bg-gradient-to-b from-black/50 to-transparent">
          <span className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border backdrop-blur-md",
            statusStyles[status]
          )}>
            <span className="size-1.5 rounded-full bg-current" />
            {status}
          </span>

          <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button className="size-8 rounded-lg glass grid place-items-center hover:bg-primary hover:text-primary-foreground transition-colors">
              <Edit3 className="size-3.5" />
            </button>
            <button className="size-8 rounded-lg glass grid place-items-center hover:bg-secondary transition-colors">
              <MoreHorizontal className="size-3.5" />
            </button>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-card to-transparent pointer-events-none" />

        {/* Photo count chip */}
        {photos > 0 && (
          <div className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full glass text-[11px] font-medium">
            <ImageIcon className="size-3" />
            {photos} photos
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-5 space-y-4">
        <div>
          <h3 className="font-display font-bold text-lg leading-tight tracking-tight group-hover:gradient-text transition-all">
            {title}
          </h3>
          <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="size-3.5" /> {date}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <User className="size-3.5" /> {client}
            </span>
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px]">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-semibold">{progress}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-primary transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-1">
          <Button size="sm" className="flex-1 rounded-xl bg-secondary text-foreground hover:bg-gradient-primary hover:text-primary-foreground border border-border/60 transition-all">
            View Details
            <ArrowUpRight className="size-3.5 ml-1" />
          </Button>
          <Button size="sm" variant="ghost" className="rounded-xl border border-border/60 hover:bg-secondary">
            <Share2 className="size-3.5 mr-1.5" /> Share
          </Button>
        </div>
      </div>
    </article>
  );
};
