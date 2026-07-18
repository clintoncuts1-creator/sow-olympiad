'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { IconDownload, IconClipboardList } from '@tabler/icons-react';
import { getCertificate, getSection } from '@/lib/db';
import type { Certificate, Section } from '@/lib/db';

export default function CertificatePage() {
  const params = useParams();
  const id = params.id as string;

  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [section, setSection] = useState<Section | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const loadCertificate = async () => {
      const cert = await getCertificate(id);
      if (!cert) {
        setError('Certificate not found');
        setLoading(false);
        return;
      }

      setCertificate(cert);
      const sectionData = await getSection(cert.section_id);
      setSection(sectionData);
      setLoading(false);
    };

    loadCertificate();
  }, [id]);

  const handleDownload = async () => {
    if (!certificate || !section) return;

    setDownloading(true);
    try {
      // Call server-side API to render certificate as PNG using Canvas
      const response = await fetch('/api/certificate/render', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipient_name: certificate.recipient_name,
          section_name: section.name,
          tier_color: section.tier_color || '#14213D',
          round_type: certificate.round_type,
          score: certificate.score,
          max_score: (certificate as any).max_score || null,
          rank: (certificate as any).rank || null,
          issue_date: certificate.issued_at,
          mode: certificate.mode,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to render certificate');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `certificate-${certificate.recipient_name
        .replace(/\s+/g, '-')
        .toLowerCase()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setDownloading(false);
    } catch (err) {
      setError('Failed to download certificate. Please try again.');
      setDownloading(false);
      console.error('Certificate download error:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-ink-slate">Loading certificate…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <SiteHeader />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <p className="text-coral mb-8">{error}</p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-sage text-white font-space-grotesk font-bold rounded-lg hover:opacity-90 transition"
          >
            Back home
          </Link>
        </main>
      </div>
    );
  }

  if (!certificate) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      <SiteHeader />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Certificate preview placeholder */}
        <div className="w-full mb-8 bg-gray-50 rounded-lg p-4">
          <div className="text-center mb-4">
            <p className="text-sm text-ink-slate">Certificate will be generated on download</p>
          </div>
          <div className="flex justify-center">
            <div className="w-full max-w-2xl border-2 border-dashed border-gray-300 rounded-lg h-64 flex items-center justify-center bg-white">
              <div className="text-center">
                <IconClipboardList size={48} className="mx-auto mb-2 text-gray-400" aria-hidden="true" />
                <p className="text-gray-500 font-body">
                  {certificate?.recipient_name} — {section?.name} ({certificate?.round_type})
                </p>
                <p className="text-gray-400 text-sm font-body">
                  Score: {certificate?.score} points
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Download button */}
        <div className="text-center mb-8">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="px-8 py-4 bg-marigold text-white font-space-grotesk font-bold text-lg rounded-lg hover:opacity-90 disabled:opacity-50 transition inline-flex items-center gap-2 mx-auto"
          >
            <IconDownload size={20} aria-hidden="true" />
            {downloading ? 'Generating image…' : 'Download as image'}
          </button>
        </div>

        {/* Preview info */}
        <div className="text-center text-ink-slate text-sm bg-blue-50 rounded-lg p-4 flex items-center justify-center gap-2">
          <IconClipboardList size={18} aria-hidden="true" />
          <p>Downloads as a high-quality PNG image (1200×800px, print-ready).</p>
        </div>
      </main>
    </div>
  );
}

function SiteHeader() {
  // NOTE: if a shared <Header /> component already exists elsewhere in the
  // codebase (used on the homepage), import and use that instead of this —
  // this is a stand-in that matches the same branding so every page is
  // visually consistent while that shared component is confirmed/extracted.
  return (
    <header className="bg-ink-navy text-white sticky top-0 z-40 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition">
          <img
            src="/logo.jpg"
            alt="Seat of Wisdom Group of Schools logo"
            style={{ width: 40, height: 40, borderRadius: '50%' }}
          />
          <span>
            <span className="block font-space-grotesk font-bold text-sm leading-tight">
              Seat of Wisdom
            </span>
            <span className="block font-inter text-xs text-gray-300 leading-tight">
              Math Olympiad
            </span>
          </span>
        </Link>
        <nav className="flex items-center gap-6 text-sm font-inter">
          <Link href="/" className="hover:opacity-80 transition">
            Home
          </Link>
        </nav>
      </div>
    </header>
  );
}