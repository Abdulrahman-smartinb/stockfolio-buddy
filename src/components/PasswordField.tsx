import { Eye, EyeOff, Lock } from "lucide-react";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";

const PasswordField = ({
  label,
  value,
  show,
  toggle,
  onChange,
  isRtl,
  hint,
  numericOnly = false,
  maxLength,
}: any) => (
  <div>
    <label className="text-xs font-medium text-jadwa-muted mb-1 block">
      {label}
    </label>

    <div className="relative">
      <Lock className="absolute ms-3 top-1/2 -translate-y-1/2 w-4 h-4 jadwa-icon-gold" />
      <Input
        type={show ? "text" : "password"}
        inputMode={numericOnly ? "numeric" : "text"}
        pattern={numericOnly ? "[0-9]*" : undefined}
        maxLength={maxLength}
        className="ps-10 pr-10 h-11"
        value={value}
        onChange={(e) => {
          const val = numericOnly
            ? e.target.value.replace(/\D/g, "")
            : e.target.value;
          onChange(val);
        }}
      />

      <button
        type="button"
        onClick={toggle}
        className={cn(
          "absolute top-1/2 -translate-y-1/2 text-jadwa-muted",
          isRtl ? "left-3" : "right-3",
        )}
      >
        {show ? (
          <EyeOff className="w-4 h-4 jadwa-icon-gold" />
        ) : (
          <Eye className="w-4 h-4 jadwa-icon-gold" />
        )}
      </button>
    </div>

    {hint && <p className="mt-1 text-[11px] text-jadwa-muted">{hint}</p>}
  </div>
);

export default PasswordField;
