/**
 * Centralized Date Utilities
 */

export function formatDate(dateString: string | Date | undefined | null): string {
  if (!dateString) return '-';
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  if (isNaN(date.getTime())) return '-';

  const day = date.getDate().toString().padStart(2, '0');
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
}

export function formatDateTime(dateString: string | Date | undefined | null): string {
  if (!dateString) return '-';
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  if (isNaN(date.getTime())) return '-';

  const dateFormatted = formatDate(date);
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  const hoursStr = hours.toString().padStart(2, '0');

  return `${dateFormatted}, ${hoursStr}:${minutes} ${ampm}`;
}

export function getDaysRemaining(expiryDateString: string): number {
  if (!expiryDateString) return 0;
  const expiryDate = new Date(expiryDateString);
  const today = new Date();
  
  // Clear time part for accurate day calculation
  expiryDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diffTime = expiryDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function isExpired(expiryDateString: string): boolean {
  return getDaysRemaining(expiryDateString) < 0;
}

export function isExpiringSoon(expiryDateString: string, daysThreshold = 30): boolean {
  const days = getDaysRemaining(expiryDateString);
  return days >= 0 && days <= daysThreshold;
}
