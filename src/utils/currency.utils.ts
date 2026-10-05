/**
 * Formats a number into Indian Rupee currency format (e.g., ₹1,25,000)
 */
export function formatCurrency(amount: number | undefined | null, showSymbol = true): string {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return showSymbol ? '₹0' : '0';
  }

  const formatted = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(amount);

  return showSymbol ? `₹${formatted}` : formatted;
}

/**
 * Formats large amounts into human-readable compact notation (e.g. ₹1.25 L, ₹2.5 Cr)
 */
export function formatCompactCurrency(amount: number | undefined | null): string {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0';
  
  const absAmount = Math.abs(amount);
  const sign = amount < 0 ? '-' : '';

  if (absAmount >= 10000000) {
    return `${sign}₹${(absAmount / 10000000).toFixed(2)} Cr`;
  }
  if (absAmount >= 100000) {
    return `${sign}₹${(absAmount / 100000).toFixed(2)} L`;
  }
  if (absAmount >= 1000) {
    return `${sign}₹${(absAmount / 1000).toFixed(1)} K`;
  }
  return formatCurrency(amount);
}
