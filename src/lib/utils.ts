import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import imageCompression from "browser-image-compression";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
/**
 * 🔢 Format number with correct decimal/thousand separators
 * @param {number} value - The number to format
 * @returns {string}
 */
export const formatNumber = (value: number) => {
  if (value === null || value === undefined || isNaN(value)) return "";

  const decimalSeparator = ".",
    thousandSeparator = ",",
    decimals = "2";

  const decimalsToUse = Number(decimals);

  const fixed = Number(value).toFixed(decimalsToUse);
  const [intPart, decimalPart] = fixed.split(".");

  const withThousands = intPart.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    thousandSeparator,
  );
  if (!decimalPart || /^0+$/.test(decimalPart)) {
    return withThousands;
  }
  return `${withThousands}${decimalSeparator}${decimalPart}`;
};
/**
 * 🔢 Format a number into a compact, human-readable string (e.g., 1200000 -> 1.2M)
 * @param {number} value - The number to format
 * @param {number} [maxDecimals=1] - The maximum number of decimal places to show
 * @returns {string} The formatted compact string
 */
export const formatNumberCompact = (
  value: number,
  maxDecimals: number = 1,
): string => {
  if (value === null || value === undefined || isNaN(value)) {
    return "";
  }
  if (value === 0) {
    return "0";
  }

  const absValue = Math.abs(value);

  const T = 1e12; // Trillions
  const B = 1e9; // Billions
  const M = 1e6; // Millions
  const K = 1e3; // Thousands

  const tiers = [
    { value: T, symbol: "T" },
    { value: B, symbol: "B" },
    { value: M, symbol: "M" },
    { value: K, symbol: "K" },
  ];

  const tier = tiers.find((t) => absValue >= t.value);

  if (tier) {
    const scaled = absValue / tier.value;

    const formatted = (+scaled.toFixed(maxDecimals)).toString();

    const prefix = value < 0 ? "-" : "";

    return `${prefix}${formatted}${tier.symbol}`;
  }

  return (+value.toFixed(maxDecimals)).toString();
};

/**
 * 🖼️ On-Browser image compressor
 * @param {File} file - The image file to be compressed
 * @returns {File} The compressed image file
 */
export const compressImage = async (file: File) => {
  const options = {
    maxSizeMB: 1.5, // target size
    maxWidthOrHeight: 1600,
    useWebWorker: true,
    initialQuality: 0.7,
  };

  return await imageCompression(file, options);
};
