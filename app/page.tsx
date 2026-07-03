'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getAllSections } from '@/lib/db';
import { Logo } from '@/components/Logo';
import { getIconComponent } from '@/lib/iconMap';
import type { Section } from '@/lib/db';

// Background patterns - 5 math-themed patterns per design.md
const PATTERN_DATA = [
  // 1. Graph Paper - fine grid lines
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><rect fill="%23F5F7FB" width="20" height="20"/><path stroke="%23D4D8E0" d="M0 0h20v20" stroke-width="0.5" fill="none"/><path stroke="%23D4D8E0" d="M0 0v20h20v20" stroke-width="0.5" fill="none"/></svg>',
  // 2. Dot Grid - evenly spaced dots
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><circle cx="2" cy="2" r="1.5" fill="%23D4D8E0"/></svg>',
  // 3. Coordinate Plane - axes with grid
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><rect fill="%23F5F7FB" width="40" height="40"/><path stroke="%23D4D8E0" d="M20 0v40M0 20h40" stroke-width="1"/><circle cx="20" cy="20" r="2" fill="%23D4D8E0"/></svg>',
  // 4. Number Line - horizontal with marks
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><rect fill="%23F5F7FB" width="40" height="40"/><path stroke="%23D4D8E0" d="M0 20h40" stroke-width="1"/><line x1="0" y1="16" x2="0" y2="24" stroke="%23D4D8E0" stroke-width="1"/><line x1="20" y1="16" x2="20" y2="24" stroke="%23D4D8E0" stroke-width="1"/><line x1="40" y1="16" x2="40" y2="24" stroke="%23D4D8E0" stroke-width="1"/></svg>',
  // 5. Geometric Shapes - circles and triangles
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50"><rect fill="%23F5F7FB" width="50" height="50"/><circle cx="10" cy="10" r="3" fill="none" stroke="%23D4D8E0" stroke-width="1"/><circle cx="40" cy="40" r="4" fill="none" stroke="%23D4D8E0" stroke-width="1"/><polygon points="25,5 30,20 20,20" fill="none" stroke="%23D4D8E0" stroke-width="1"/></svg>',
];

const HERO_HEADLINE = 'From your first sprout to a legend of numbers.';
const HERO_SUBHEADING = 'Choose your challenge level and master mathematics at your own pace.';

export default function Home() {
  const [sections, setSections] = useState<Section[]>([]);
  const [patternIndex, setPatternIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    getAllSections().then(setSections);

    // Cycle background patterns every 4.5 seconds, respecting prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReducedMotion) {
      const interval = setInterval(() => {
        setPatternIndex((prev) => {
          const next = (prev + 1) % PATTERN_DATA.length;
          console.log('Pattern cycling: index', next);
          return next;
        });
      }, 4500);

      return () => clearInterval(interval);
    }
  }, []);

  if (!mounted) return null;

  const currentPatternUrl = `url('${PATTERN_DATA[patternIndex]}')`;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Logo />
          <nav className="flex gap-4 items-center">
            <Link 
              href="/join" 
              className="text-ink-navy font-body text-sm hover:text-marigold transition focus:outline-2 focus:outline-offset-2 focus:outline-marigold rounded px-2 py-1"
            >
              Join room
            </Link>
            <Link 
              href="/admin" 
              className="text-ink-navy font-body text-sm hover:text-marigold transition focus:outline-2 focus:outline-offset-2 focus:outline-marigold rounded px-2 py-1"
            >
              Admin
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section with Dynamic Background Pattern */}
      <section 
        className="relative min-h-[600px] md:min-h-[700px] flex items-center justify-center transition-all duration-1000"
        style={{
          backgroundImage: currentPatternUrl,
          backgroundRepeat: 'repeat',
        }}
      >
        {/* Background gradient overlay - positioned behind text */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white pointer-events-none z-0" />

        <div className="relative z-10 text-center px-4 sm:px-6 max-w-3xl mx-auto">
          {/* Hero Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-display font-bold text-ink-navy mb-4 animate-fade-in">
            {HERO_HEADLINE}
          </h1>

          {/* Hero Subheading */}
          <p className="text-lg sm:text-xl text-ink-navy font-body mb-12 opacity-80 animate-fade-in" style={{ animationDelay: '100ms' }}>
            {HERO_SUBHEADING}
          </p>

          {/* Level-up Path - Using HTML divs for better icon rendering */}
          <div className="mb-12 flex items-center justify-center overflow-x-auto pb-4 animate-fade-in" style={{ animationDelay: '200ms' }}>
            <div className="relative w-full max-w-4xl flex justify-between items-center px-4">
              {/* Path line connecting nodes */}
              <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-300 z-0 transform -translate-y-1/2" />
              
              {/* Nodes */}
              <div className="relative z-10 w-full flex justify-between">
                {sections.map((section) => {
                  const IconComponent = getIconComponent(section.icon_name);
                  const color = section.tier_color || '#14213D';
                  
                  return (
                    <div 
                      key={section.id} 
                      className="flex flex-col items-center group"
                    >
                      {/* Node circle with icon */}
                      <div 
                        className="w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center mb-2 transition-opacity hover:opacity-100 cursor-pointer shadow-md"
                        style={{ 
                          backgroundColor: color,
                          opacity: 0.95,
                        }}
                      >
                        <IconComponent size={24} stroke={2} color="white" />
                      </div>
                      
                      {/* Label - full section name */}
                      <p className="text-xs md:text-sm font-semibold text-ink-navy text-center whitespace-normal max-w-[80px] leading-tight">
                        {section.name}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '300ms' }}>
            <Link
              href="/practice"
              className="px-8 py-3 bg-leaf-green text-white font-display font-bold rounded-lg hover:opacity-90 active:scale-95 transition-all duration-200 focus:outline-2 focus:outline-offset-2 focus:outline-marigold"
            >
              Start practicing
            </Link>
            <Link
              href="/join"
              className="px-8 py-3 border-2 border-ink-navy text-ink-navy font-display font-bold rounded-lg hover:bg-ink-navy hover:text-white active:scale-95 transition-all duration-200 focus:outline-2 focus:outline-offset-2 focus:outline-marigold"
            >
              Enter competition room
            </Link>
          </div>
        </div>
      </section>

      {/* Section Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 bg-white">
        <h2 className="text-4xl md:text-5xl font-display font-bold text-ink-navy mb-4 text-center">
          6 levels of challenge
        </h2>
        <p className="text-center text-ink-navy font-body mb-12 opacity-80">
          Find your starting point and climb to mastery
        </p>

        {/* Grid: 2 cols on mobile, 3 cols on tablet, 6 cols on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {sections.map((section) => {
            const IconComponent = getIconComponent(section.icon_name);
            const isGrandMaster = section.id === sections[sections.length - 1]?.id;
            
            return (
              <Link
                key={section.id}
                href={`/practice?section=${section.id}`}
                className={`group cursor-pointer focus:outline-2 focus:outline-offset-2 focus:outline-marigold rounded-lg transition-all duration-200 ${
                  isGrandMaster ? 'md:col-span-1 lg:col-span-1 transform scale-105' : ''
                }`}
              >
                <div className="bg-white border-l-4 rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition-all duration-200 overflow-hidden h-full flex flex-col">
                  {/* Top accent bar */}
                  <div 
                    className="h-1" 
                    style={{ backgroundColor: section.tier_color }}
                  />

                  {/* Content */}
                  <div className="flex-1 p-4 md:p-6 flex flex-col items-center text-center">
                    {/* Icon badge - render icon component inline */}
                    <div 
                      className="w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center mb-3 text-white"
                      style={{ backgroundColor: section.tier_color }}
                    >
                      <IconComponent size={24} stroke={1.5} color="white" />
                    </div>

                    {/* Section name */}
                    <h3 className="text-sm md:text-base font-display font-semibold text-ink-navy mb-1">
                      {section.name}
                    </h3>

                    {/* Grade range */}
                    <p className="text-xs md:text-sm font-body text-gray-500">
                      {section.grade_range}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-ink-navy text-white py-8 text-center text-sm font-body opacity-75">
        <p>© 2026 Seat of Wisdom Math Olympiad. All rights reserved.</p>
      </footer>
    </div>
  );
}
