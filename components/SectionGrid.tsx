'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { getIconComponent } from '@/lib/iconMap';
import type { Section } from '@/lib/db';

interface SectionGridProps {
  sections: Section[];
  linkPrefix?: string; // e.g., "/practice" or "" (homepage default)
}

export function SectionGrid({ sections, linkPrefix = '/practice' }: SectionGridProps) {
  return (
    <div className="grid gap-4 md:gap-6" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
      {sections.map((section, idx) => {
        const IconComponent = getIconComponent(section.icon_name);
        
        return (
          <ScrollRevealCard key={section.id} index={idx}>
            <Link
              href={`${linkPrefix}?section=${section.id}`}
              className="group cursor-pointer focus-ring rounded-lg transition-all duration-200 block h-full"
            >
              <div className="bg-white border-l-4 rounded-lg overflow-hidden h-full flex flex-col transition-all duration-150 hover:shadow-xl active:scale-95 shadow-md hover:shadow-lg"
              style={{
                borderLeftColor: section.tier_color,
              }}
              >
                {/* Top accent bar */}
                <div 
                  className="h-1" 
                  style={{ backgroundColor: section.tier_color }}
                />

                {/* Content */}
                <div className="flex-1 p-3 sm:p-4 md:p-6 flex flex-col items-center text-center">
                  {/* Icon badge - render icon component inline */}
                  <div 
                    className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center mb-2 sm:mb-3 text-white transition-transform group-hover:scale-110 shadow-md"
                    style={{ backgroundColor: section.tier_color }}
                  >
                    <IconComponent size={20} className="sm:hidden" stroke={1.5} color="white" />
                    <IconComponent size={24} className="hidden sm:block md:hidden" stroke={1.5} color="white" />
                    <IconComponent size={28} className="hidden md:block" stroke={1.5} color="white" />
                  </div>

                  {/* Section name */}
                  <h3 className="text-xs sm:text-sm md:text-base font-display font-semibold text-ink-navy mb-1">
                    {section.name}
                  </h3>

                  {/* Grade range */}
                  <p className="text-xs md:text-sm font-body text-gray-500">
                    {section.grade_range}
                  </p>
                </div>
              </div>
            </Link>
          </ScrollRevealCard>
        );
      })}
    </div>
  );
}

// Scroll-Reveal Card Component
function ScrollRevealCard({ children, index }: { children: React.ReactNode; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <div
      ref={ref}
      style={{
        animationName: isVisible ? 'slideUpFade' : 'none',
        animationDuration: '0.6s',
        animationTimingFunction: 'ease-out',
        animationFillMode: 'forwards',
        animationDelay: `${index * 60}ms`,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(16px)',
      } as React.CSSProperties}
    >
      {children}
    </div>
  );
}
