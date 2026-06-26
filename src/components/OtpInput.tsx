import { useRef } from "react";

type Props = {
  value: string;
  onChange: (value: string) => void;
  length?: number;
};

export default function OtpInput({ value, onChange, length = 6 }: Props) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const values = Array.from({ length }, (_, i) => value[i] || "");

  const handleChange = (index: number, val: string) => {
    const digit = val.replace(/\D/g, "").slice(-1);

    const next = [...values];
    next[index] = digit;

    onChange(next.join(""));

    if (digit && index < length - 1) {
      refs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace") {
      if (values[index]) {
        const next = [...values];
        next[index] = "";
        onChange(next.join(""));
      } else if (index > 0) {
        refs.current[index - 1]?.focus();
      }
    }

    if (e.key === "ArrowLeft" && index > 0) {
      refs.current[index - 1]?.focus();
    }

    if (e.key === "ArrowRight" && index < length - 1) {
      refs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();

    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, length);

    if (!pasted) return;

    const next = [...values];

    pasted.split("").forEach((char, i) => {
      next[i] = char;
    });

    onChange(next.join(""));

    refs.current[Math.min(pasted.length, length) - 1]?.focus();
  };

  return (
    <div className="flex justify-around gap-2">
      {values.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            refs.current[index] = el;
          }}
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={1}
          className="h-12 w-12 rounded-lg border text-center text-xl font-semibold focus:ring-2 focus:ring-primary outline-none"
        />
      ))}
    </div>
  );
}
