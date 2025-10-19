/**
 * Formats a date to `DD/MM/YYYY` using Intl.DateTimeFormat.
 *
 * @param {string | number | Date} input ISO 8601 string, timestamp in ms, or Date.
 * @param {Intl.LocalesArgument} [locales='es-ES'] Locale(s) to use for Intl.
 * @param {Intl.DateTimeFormatOptions} [options] Extra Intl.DateTimeFormat options (e.g., timeZone).
 * @returns {string} Formatted date string (`DD/MM/YYYY`), or '' if the input is invalid.
 */
export function formatDate(
  input: string | number | Date,
  locales: Intl.LocalesArgument = 'es-ES',
  options: Intl.DateTimeFormatOptions = { timeZone: 'UTC' },
): string {
  if (input === null || input === undefined || input === '') return '';

  const date = new Date(input);
  if (Number.isNaN(date.getTime())) return '';

  const df = new Intl.DateTimeFormat(locales, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    ...options,
  });

  return df.format(date);
}
