'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
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
    if (!certificate) return;

    setDownloading(true);
    try {
      // Use html2canvas to capture the certificate template
      const { default: html2canvas } = await import('html2canvas');
      
      const element = document.getElementById('certificatePreview');
      if (!element) {
        setError('Failed to render certificate');
        setDownloading(false);
        return;
      }

      // Make element visible temporarily for capture
      const originalDisplay = element.style.display;
      element.style.display = 'block';
      
      // Wait a moment for fonts to render
      await new Promise(resolve => setTimeout(resolve, 100));

      // Generate canvas from HTML
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: '#ffffff',
        allowTaint: true,
        useCORS: true,
        logging: false,
        imageTimeout: 0,
        windowWidth: 1200,
        windowHeight: 800,
      } as any);

      // Restore original display
      element.style.display = originalDisplay;

      // Download the PNG
      canvas.toBlob((blob) => {
        if (!blob) {
          setError('Failed to generate image');
          setDownloading(false);
          return;
        }

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
      }, 'image/png');
    } catch (err) {
      setError('Failed to download certificate. Please try again.');
      setDownloading(false);
      console.error('Certificate download error:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-ink-slate">Loading certificate...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <header className="bg-ink-navy text-white sticky top-0 z-40 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link href="/" className="text-white hover:opacity-80 transition">
              ← Back Home
            </Link>
          </div>
        </header>
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <p className="text-coral mb-8">{error}</p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-sage text-white font-space-grotesk font-bold rounded-lg hover:opacity-90 transition"
          >
            Back Home
          </Link>
        </main>
      </div>
    );
  }

  if (!certificate) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-ink-navy text-white sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="text-white hover:opacity-80 transition">
            ← Back Home
          </Link>
          <h1 className="text-2xl font-space-grotesk font-bold">Certificate</h1>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Certificate Info */}
        <div className="bg-white rounded-lg shadow-xl p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <p className="text-sm text-ink-slate font-inter mb-1">Recipient</p>
              <p className="text-3xl font-space-grotesk font-bold text-ink-navy mb-6">
                {certificate.recipient_name}
              </p>

              <p className="text-sm text-ink-slate font-inter mb-1">Section</p>
              <p className="text-xl font-space-grotesk font-bold text-ink-navy mb-6">
                {section?.name || 'Math Olympiad'}
              </p>

              <p className="text-sm text-ink-slate font-inter mb-1">Round Type</p>
              <p className="text-xl font-space-grotesk font-bold text-ink-navy mb-6">
                {certificate.round_type === 'grid'
                  ? 'Grid Round'
                  : certificate.round_type === 'tiered'
                    ? 'Tiered Round'
                    : 'Speed Sprint'}
              </p>
            </div>

            <div>
              <p className="text-sm text-ink-slate font-inter mb-1">Mode</p>
              <p className="text-xl font-space-grotesk font-bold text-sage mb-6 capitalize">
                {certificate.mode} Mode
              </p>

              <p className="text-sm text-ink-slate font-inter mb-1">Score</p>
              <p className="text-4xl font-space-grotesk font-bold text-marigold mb-6">
                {certificate.score}
              </p>

              <p className="text-sm text-ink-slate font-inter mb-1">Issued</p>
              <p className="text-lg font-inter text-ink-navy">
                {new Date(certificate.issued_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Certificate Preview (hidden, used for PNG generation) */}
        <div id="certificatePreview" style={{ display: 'none' }}>
          <CertificateTemplate certificate={certificate} section={section} />
        </div>

        {/* Download Button */}
        <div className="text-center mb-8">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="px-8 py-4 bg-marigold text-white font-space-grotesk font-bold text-lg rounded-lg hover:opacity-90 disabled:opacity-50 transition inline-block"
          >
            {downloading ? '⬇ Generating PNG...' : '⬇ Download as PNG'}
          </button>
        </div>

        {/* Preview Info */}
        <div className="text-center text-ink-slate text-sm bg-blue-50 rounded-lg p-4">
          <p className="mb-2">📋 Certificate Preview</p>
          <p>Your certificate will be downloaded as a high-quality PNG image (1200×800px, print-ready at 150 DPI).</p>
        </div>
      </main>
    </div>
  );
}

// Certificate template component
function CertificateTemplate({
  certificate,
  section,
}: {
  certificate: Certificate;
  section: Section | null;
}) {
  return (
    <div
      style={{
        width: '1200px',
        height: '800px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff',
        position: 'relative',
        padding: '0',
        color: '#14213D',
        boxSizing: 'border-box',
      }}
    >
      {/* Outer border (navy) */}
      <div
        style={{
          position: 'absolute',
          top: '16px',
          left: '16px',
          right: '16px',
          bottom: '16px',
          border: '20px solid #14213D',
          boxSizing: 'border-box',
        }}
      />

      {/* Inner border (marigold) */}
      <div
        style={{
          position: 'absolute',
          top: '36px',
          left: '36px',
          right: '36px',
          bottom: '36px',
          border: '6px solid #F4A73B',
          boxSizing: 'border-box',
        }}
      />

      {/* Content */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1,
          textAlign: 'center',
          gap: '16px',
          padding: '60px 80px',
          boxSizing: 'border-box',
        }}
      >
        {/* Title */}
        <div style={{ fontSize: '54px', fontWeight: 'bold', color: '#14213D' }}>
          Certificate of Achievement
        </div>

        {/* Mode */}
        <div style={{ fontSize: '18px', color: '#666' }}>
          {certificate.mode === 'practice' ? 'Practice Mode' : 'Competition Mode'}
        </div>

        {/* Section */}
        <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#14213D', marginTop: '10px' }}>
          {section?.name || 'Math Olympiad'}
        </div>

        {/* Round Type */}
        <div style={{ fontSize: '16px', color: '#666' }}>
          {certificate.round_type === 'grid'
            ? 'Grid Round'
            : certificate.round_type === 'tiered'
              ? 'Tiered Round'
              : 'Speed Sprint'}
        </div>

        {/* Presented to text */}
        <div style={{ fontSize: '16px', color: '#666', marginTop: '20px' }}>
          This certificate is proudly presented to
        </div>

        {/* Recipient Name */}
        <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#14213D', marginTop: '8px' }}>
          {certificate.recipient_name}
        </div>

        {/* Congratulations text */}
        <div style={{ fontSize: '14px', color: '#666', marginTop: '12px', maxWidth: '600px' }}>
          for demonstrating exceptional mathematical skill and perseverance
        </div>

        {/* Score */}
        <div style={{ fontSize: '40px', fontWeight: 'bold', color: '#4CAF7D', marginTop: '24px' }}>
          Score: {certificate.score}
        </div>

        {/* Date */}
        <div style={{ fontSize: '14px', color: '#666', marginTop: '12px' }}>
          Issued:{' '}
          {new Date(certificate.issued_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </div>
      </div>

      {/* Seal (navy circle with gold border) */}
      <div
        style={{
          position: 'absolute',
          bottom: '80px',
          right: '80px',
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          backgroundColor: '#14213D',
          border: '4px solid #F4A73B',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '32px',
          fontWeight: 'bold',
          color: '#ffffff',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        }}
      >
        SW
      </div>

      {/* Footer line */}
      <div
        style={{
          position: 'absolute',
          bottom: '50px',
          left: '100px',
          right: '100px',
          height: '2px',
          backgroundColor: '#F4A73B',
        }}
      />

      {/* Footer text */}
      <div
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '0',
          right: '0',
          fontSize: '13px',
          color: '#666',
          textAlign: 'center',
          padding: '0 40px',
        }}
      >
        © 2026 Seat of Wisdom Math Olympiad
      </div>
    </div>
  );
}
