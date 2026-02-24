import { Input } from "./ui/input";

const Field = ({ label, icon, value, onChange }: any) => (
  <div>
    <label className="text-xs font-medium text-jadwa-muted mb-1 block">
      {label}
    </label>
    <div className="relative">
      <span className="absolute ms-3 top-1/2 -translate-y-1/2 text-jadwa-muted">
        {icon}
      </span>
      <Input
        className="ps-10 h-11"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  </div>
);

export default Field;
