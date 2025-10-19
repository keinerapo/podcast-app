/**
 * Formats a duration in milliseconds as a digital time string `mm:ss` or `hh:mm:ss`.
 *
 * @param {number} milliseconds Duration in milliseconds. If `<= 0`, returns `'00:00'`.
 * @param {Intl.LocalesArgument} [locales] Locale(s) to use with `Intl`. Optional.
 * @returns {string} Formatted string in `mm:ss` or `hh:mm:ss` (as applicable).
 */
export function formatDuration(milliseconds: number, locales?: Intl.LocalesArgument): string {
  if (!milliseconds || milliseconds <= 0) return '00:00';

  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const DurationFormat = (Intl as any).DurationFormat as
    | (new (
        // eslint-disable-next-line no-unused-vars
        locales?: Intl.LocalesArgument,
        // eslint-disable-next-line no-unused-vars
        options?: Record<string, unknown>,
        // eslint-disable-next-line no-unused-vars
      ) => { format: (duration: Record<string, number>) => string })
    | undefined;

  if (typeof DurationFormat === 'function') {
    const df = new DurationFormat(locales, {
      style: 'digital',
      hours: '2-digit',
      minutes: '2-digit',
      seconds: '2-digit',
      hoursDisplay: 'auto',
      fractionalDigits: 0,
    });

    return df.format({ hours, minutes, seconds });
  }

  const pad2 = new Intl.NumberFormat(locales, {
    minimumIntegerDigits: 2,
    useGrouping: false,
  }).format;

  const mm = pad2(minutes);
  const ss = pad2(seconds);

  if (hours === 0) return `${mm}:${ss}`;
  const hh = pad2(hours);
  return `${hh}:${mm}:${ss}`;
}
