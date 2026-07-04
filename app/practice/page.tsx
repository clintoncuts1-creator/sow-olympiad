'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { getSection } from '@/lib/db';
import type { Section } from '@/lib/db';

const ROUND_TYPES = [
  {
    id: 'grid',
    name: 'Grid Round',
    description: '5×5 grid of clickable cells. Pick your strategy.',
    emoji: '🔲',
    color: 'bg-sky',
  },
  {
    id: 'tiered',
    name: 'Tiered Round',
    description: 'Easy → Medium → Hard. Progress through difficulty levels.',
    emoji: '📈',
    color: 'bg-sage',
  },
  {
    id: 'sprint',
    name: 'Speed Sprint',
    description: 'Rapid-fire questions against the clock. Fast and furious.',
    emoji: '⚡',
    color: 'bg-coral',
  },
];

function PracticeSelectorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sectionId = searchParams.get('section');

  const [section, setSection] = useState<Section | null>(null);
  const [selectedRound, setSelectedRound] = useState<string | null>(null);

  useEffect(() => {
    if (sectionId) {
      getSection(sectionId).then((s) => {
        if (s) setSection(s);
      });
    }
  }, [sectionId]);

  const handleRoundSelect = (roundType: string) => {
    if (section) {
      router.push(`/practice/${section.id}/${roundType}`);
    }
  };

  return (
    <div className="min-h-screen bg-graph-paper">
      {/* Header */}
      <header className="bg-ink-navy text-white sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="text-white hover:opacity-80 transition focus-ring rounded px-2 py-1">
            <h1 className="text-lg sm:text-xl font-display font-bold">
              Seat of Wisdom
            </h1>
          </Link>
          <Link href="/" className="text-marigold hover:opacity-80 transition focus-ring rounded px-2 py-1 text-sm sm:text-base font-body">
            Back Home
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {!sectionId ? (
          <div className="text-center py-8 sm:py-12">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-ink-navy mb-3 sm:mb-4">
              Select a Section
            </h2>
            <p className="text-base sm:text-lg text-ink-navy font-body mb-6 sm:mb-8 opacity-75">
              Choose which math level you want to practice.
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-leaf-green text-white font-display font-bold rounded-lg hover:opacity-90 active:scale-95 transition-all focus-ring"
            >
              Back to Sections
            </Link>
          </div>
        ) : section ? (
          <div>
            <div className="mb-8 sm:mb-12">
              <div
                className="h-28 sm:h-32 rounded-lg p-6 sm:p-8 text-white flex flex-col justify-between"
                style={{ backgroundColor: section.tier_color }}
              >
                <div>
                  <h2 className="text-2xl sm:text-4xl font-display font-bold mb-1 sm:mb-2">
                    {section.name}
                  </h2>
                  <p className="text-sm sm:text-lg font-body opacity-90">{section.grade_range}</p>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xl sm:text-2xl font-display font-bold text-ink-navy mb-4 sm:mb-6">
                Choose a Round Type
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                {ROUND_TYPES.map((roundType) => (
                  <button
                    key={roundType.id}
                    onClick={() => handleRoundSelect(roundType.id)}
                    onMouseEnter={() => setSelectedRound(roundType.id)}
                    onMouseLeave={() => setSelectedRound(null)}
                    className={`p-6 rounded-lg border-2 transition-all transform hover:scale-105 active:scale-95 text-left focus-ring ${
                      selectedRound === roundType.id
                        ? `border-leaf-green bg-opacity-10`
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">{roundType.emoji}</div>
                    <h4 className="text-lg sm:text-xl font-display font-bold text-ink-navy mb-2">
                      {roundType.name}
                    </h4>
                    <p className="text-xs sm:text-sm text-ink-navy font-body opacity-75">{roundType.description}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="text-center pt-6 sm:pt-8">
              <Link
                href="/"
                className="text-ink-navy hover:text-marigold transition focus-ring rounded px-2 py-1 text-sm sm:text-base font-body"
              >
                ← Change section
              </Link>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-ink-navy font-body">Loading section...</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default function PracticeSelector() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <p>Loading...</p>
        </div>
      }
    >
      <PracticeSelectorContent />
    </Suspense>
  );
}
