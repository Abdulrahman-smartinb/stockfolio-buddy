export const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const niceRound = (value: number) => {
  if (value <= 0) return 0;

  const exponent = Math.floor(Math.log10(value));
  const base = Math.pow(10, exponent);
  const normalized = value / base;

  if (normalized <= 1) return 1 * base;
  if (normalized <= 2) return 2 * base;
  if (normalized <= 5) return 5 * base;
  return 10 * base;
};

export const generateQuickShareOptions = (
  minShares: number,
  maxShares: number,
  totalOptions = 4,
): number[] => {
  const min = Math.max(1, minShares);
  const max = Math.max(min, maxShares);

  const multipliers = [1, 2, 5, 10, 50, 100];
  const options: number[] = [];

  for (const m of multipliers) {
    const value = min * m;

    if (value > max) break;

    options.push(value);

    if (options.length >= totalOptions) break;
  }

  // Fallback: always at least min
  if (options.length === 0) {
    options.push(min);
  }

  return options;
};

export const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

/* ================= Numbers ================= */

export const formatNumber = (
  value?: number | string,
  options?: Intl.NumberFormatOptions,
) => {
  if (value === null || value === undefined || value === "") return "—";

  const num = Number(value);
  if (Number.isNaN(num)) return "—";

  return new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 2,
    ...options,
  }).format(num);
};

export const formatCurrency = (
  value?: number | string,
  currency: string = "USD",
) => {
  if (value === null || value === undefined || value === "") return "—";

  const num = Number(value);
  if (!Number.isFinite(num)) return "—";

  // Format number ONLY (no currency)
  const formattedNumber = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);

  // Get currency symbol safely
  const parts = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    currencyDisplay: "narrowSymbol",
  }).formatToParts(0);

  const symbol = parts.find((p) => p.type === "currency")?.value || currency;

  // Unicode LTR isolate to prevent RTL flipping
  const LTR = "\u2066";
  const PDI = "\u2069";

  return `${LTR}${formattedNumber} ${symbol}${PDI}`;
};

export const formatShares = (value?: number | string) =>
  formatNumber(value, { maximumFractionDigits: 0 });
