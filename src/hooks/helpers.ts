export const isLoggedIn = (): boolean => {
  const token = localStorage.getItem("authToken");
  return Boolean(token);
};

export const isInvestor = () => {
  try {
    const role = JSON.parse(localStorage.getItem("profile")).role || null;
    return role === "investor";
  } catch {
    return false;
  }
};

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

  if (min === max) return [min];

  const options = new Set<number>();
  options.add(min);
  options.add(max);

  const midCount = Math.max(0, totalOptions - 2);
  const logMin = Math.log10(min);
  const logMax = Math.log10(max);

  for (let i = 1; i <= midCount; i++) {
    const t = i / (midCount + 1);
    const raw = Math.pow(10, logMin + (logMax - logMin) * t);
    const rounded = niceRound(raw);
    options.add(clamp(rounded, min, max));
  }

  return Array.from(options).sort((a, b) => a - b);
};
