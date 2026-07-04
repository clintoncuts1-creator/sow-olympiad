/**
 * Logo Lockup Component
 * Uses logo image from public folder + wordmark
 */

export function Logo() {
  return (
    <div className="flex items-center gap-3">
      {/* Logo Image */}
      <div className="relative w-12 h-12 flex-shrink-0">
        {/* Using img tag to avoid Image optimization overhead */}
        <img
          src="/logo.jpg"
          alt="Seat of Wisdom Math Olympiad"
          width="48"
          height="48"
          className="w-full h-full object-cover rounded-full"
        />
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
