const ils = new Intl.NumberFormat('he-IL', { maximumFractionDigits: 0 });

/** "12,345 ₪" with a non-breaking space so the symbol never wraps alone. */
export function formatILS(n: number): string {
  return `${ils.format(Math.round(n))}\u00A0₪`;
}

export function formatNumber(n: number): string {
  return ils.format(Math.round(n));
}

export function normalisePhone(raw: string): string {
  return raw.replace(/[\s\-().]/g, '');
}

/** Israeli mobile or landline, local or international. */
export function isValidIsraeliPhone(raw: string): boolean {
  const p = normalisePhone(raw);
  return /^(?:\+972|972|0)(?:5\d|[2-4]|[89]|7[2-9])\d{7}$/.test(p);
}

export function isValidEmail(raw: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(raw.trim());
}
