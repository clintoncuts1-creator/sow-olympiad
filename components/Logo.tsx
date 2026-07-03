/**
 * Logo Lockup Component
 * Circular monogram badge + wordmark
 */

export function Logo() {
  return (
    <div className="flex items-center gap-3">
      {/* Monogram Badge */}
      <div className="w-12 h-12 rounded-full border-2 border-marigold bg-ink-navy flex items-center justify-center flex-shrink-0">
        <span className="text-marigold font-display font-bold text-sm">SW</span>
      </div>

      {/* Wordmark */}
      <div className="flex flex-col leading-tight">
        <span className="text-ink-navy font-display font-semibold text-xs sm:text-sm">
          Seat of Wisdom
        </span>
        <span className="text-ink-navy font-display font-normal text-xs">
          Math Olympiad
        </span>
      </div>
    </div>
  );
}
