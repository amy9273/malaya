export type ReaderWidthMode = 'full' | 'standard' | 'compact';

/**
 * Calculates current scroll percentage from 0 to 100.
 * Safely guards against division by zero and clamped between 0 and 100.
 */
export function calculateScrollProgress(
  scrollTop: number,
  scrollHeight: number,
  clientHeight: number,
): number {
  const maxScroll = scrollHeight - clientHeight;
  if (maxScroll <= 0) return 100;

  const percentage = (scrollTop / maxScroll) * 100;
  return Math.min(100, Math.max(0, Math.round(percentage)));
}

/**
 * Validates whether a touch interaction was an intentional tap or a scroll gesture.
 * If total Euclidean distance traveled is < threshold (default 8px), it is a tap.
 */
export function isIntentionalTap(
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  threshold = 8,
): boolean {
  const deltaX = endX - startX;
  const deltaY = endY - startY;
  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  return distance < threshold;
}

/**
 * Determines whether a scroll distance exceeds the threshold (default 40px)
 * to automatically dismiss the transient dual HUD.
 */
export function isScrollDismissTrigger(deltaY: number, threshold = 40): boolean {
  return Math.abs(deltaY) > threshold;
}

/**
 * Returns Tailwind max-width class for the webtoon reader canvas width mode.
 */
export function getReaderWidthClass(mode: ReaderWidthMode): string {
  switch (mode) {
    case 'compact':
      return 'max-w-xl';
    case 'standard':
      return 'max-w-3xl';
    case 'full':
    default:
      return 'max-w-full';
  }
}
