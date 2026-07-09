/**
 * Returns today's date as an ISO (yyyy-MM-dd) string in local time.
 * @returns {string} Today's date, ISO-formatted.
 */
export function todayIso(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}

/**
 * Formats an ISO (yyyy-MM-dd) date string as MM/DD/YYYY for display.
 * @param isoDate - The ISO date string to format, or null.
 * @returns {string} The formatted date, or an empty string when isoDate is null/invalid.
 */
export function formatUsDate(isoDate: string | null): string {
  if (!isoDate) {
    return '';
  }
  const [year, month, day] = isoDate.split('-');
  if (!year || !month || !day) {
    return '';
  }
  return `${month}/${day}/${year}`;
}
