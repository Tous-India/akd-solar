export function formatINR(n: number) {
  return "₹" + Math.round(n).toLocaleString("en-IN");
}

/** ₹4.9 L / ₹1.25 Cr style for large amounts */
export function formatLakh(n: number) {
  if (n >= 1e7) return `₹${parseFloat((n / 1e7).toFixed(2))} Cr`;
  if (n >= 1e5) return `₹${parseFloat((n / 1e5).toFixed(1))} L`;
  return formatINR(n);
}

export function formatNumber(n: number, decimals = 0) {
  return n.toLocaleString("en-IN", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}
