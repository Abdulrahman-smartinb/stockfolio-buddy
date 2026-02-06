import { cn } from "@/lib/utils";

export const Skeleton = () => (
  <div className="space-y-3">
    {[1, 2, 3].map((i) => (
      <div key={i} className="h-24 rounded-xl bg-[#042623]/10 animate-pulse" />
    ))}
  </div>
);

export const Empty = ({ text }: { text?: string }) => (
  <div className="text-center text-sm text-muted-foreground py-10">
    {text ?? "—"}
  </div>
);
type StatusBadgeProps = {
  status: string;
  label?: string;
};

export const StatusBadge = ({ status, label }: StatusBadgeProps) => {
  const map: Record<string, string> = {
    pending: "bg-amber-500/10 text-amber-700",
    confirmed: "bg-emerald-500/10 text-emerald-700",
    rejected: "bg-rose-500/10 text-rose-700",
    cancelled: "bg-muted/30 text-muted-foreground",
  };

  return (
    <span
      className={cn(
        "px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap",
        map[status] ?? "bg-muted/20 text-muted-foreground"
      )}
    >
      {label ?? status.toUpperCase()}
    </span>
  );
};
