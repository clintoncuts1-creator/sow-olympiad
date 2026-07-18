'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/Logo';

// Feature flag: temporarily disable room/competition features
const IS_ROOM_FEATURE_ENABLED = false;

export function Header() {
  const headerRef = useRef<HTMLHeadingElement>(null);
  const [scrolled, setScrolled] = useState(false);

  // Scroll handler for sticky header with frosted effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      ref={headerRef}
      className={`sticky top-0 z-50 transition-all duration-200 ${
        scrolled 
          ? 'bg-white/85 backdrop-blur-lg border-b border-gray-200' 
          : 'bg-white border-b border-gray-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between">
        <Link href="/" className="focus-ring rounded">
          <Logo />
        </Link>
        <nav className="flex gap-2 sm:gap-4 items-center">
          {IS_ROOM_FEATURE_ENABLED ? (
            <Link 
              href="/join" 
              className="text-xs sm:text-sm text-ink-navy font-body hover:text-marigold transition focus-ring rounded px-2 sm:px-3 py-2"
            >
              Join room
            </Link>
          ) : (
            <div 
              className="text-xs sm:text-sm text-ink-navy font-body rounded px-2 sm:px-3 py-2 relative group cursor-not-allowed"
              style={{ opacity: 0.45, filter: 'grayscale(60%)', pointerEvents: 'none' }}
              tabIndex={-1}
              role="status"
              aria-label="Join room - coming soon"
            >
              Join room
              {/* Tooltip on hover */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-ink-navy text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                Coming soon
              </div>
            </div>
          )}
          <Link 
            href="/admin" 
            className="text-xs sm:text-sm text-ink-navy font-body hover:text-marigold transition focus-ring rounded px-2 sm:px-3 py-2"
          >
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
