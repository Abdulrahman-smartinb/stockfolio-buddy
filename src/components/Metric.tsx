import { formatCurrency } from "@/hooks/helpers";

const Metric = ({ label, value }: any) => (
  <div className="rounded-2xl bg-muted/10 ring-1 ring-muted/10 p-3">
    <p className="text-[11px] text-muted/60">{label}</p>
    <p className="mt-1 text-base font-extrabold">{formatCurrency(value)}</p>
  </div>
);

export default Metric;
