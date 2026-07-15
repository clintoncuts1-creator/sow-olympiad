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
        windowHeight: 900,
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
  // Get tier color for recipient name and badge
  const tierColorMap: Record<string, string> = {
    'Little Maths Sprout': '#4CAF7D',
    'Rising Maths Explorers': '#3FA79A',
    'Clever Calculators': '#3E8FC4',
    'Elite Problem Solvers': '#6C4EE3',
    'Algebra Warriors': '#C2478C',
    'Grand Maths Master League': '#F4A73B',
  };
  
  const sectionName = section?.name || 'Math Olympiad';
  const tierColor = tierColorMap[sectionName] || '#14213D';

  // Determine rank for competition mode
  const getRankDisplay = () => {
    if (certificate.mode === 'practice') {
      return { label: 'Practice complete', icon: '✓' };
    }
    
    // For competition mode, we need to check if it's a top-3 finisher
    // This would require additional data, so we'll use a placeholder
    // In a real scenario, you'd pass rank data from the database
    return { label: 'Participant', icon: '⭐' };
  };

  const rank = getRankDisplay();

  // Round type display name
  const roundTypeDisplay =
    certificate.round_type === 'grid'
      ? 'Grid Round'
      : certificate.round_type === 'tiered'
        ? 'Tiered Round'
        : 'Speed Sprint';

  // Date formatting
  const issueDate = new Date(certificate.issued_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div
      style={{
        width: '1200px',
        height: '900px',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        position: 'relative',
        color: '#14213D',
        boxSizing: 'border-box',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      {/* Outer border (navy) */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          right: '20px',
          bottom: '20px',
          border: '8px solid #14213D',
          boxSizing: 'border-box',
          pointerEvents: 'none',
        }}
      />

      {/* Inner accent border (marigold) */}
      <div
        style={{
          position: 'absolute',
          top: '28px',
          left: '28px',
          right: '28px',
          bottom: '28px',
          border: '2px solid #F4A73B',
          boxSizing: 'border-box',
          pointerEvents: 'none',
        }}
      />

      {/* Top-left logo seal */}
      <div
        style={{
          position: 'absolute',
          top: '40px',
          left: '40px',
          width: '90px',
          height: '90px',
          borderRadius: '50%',
          backgroundColor: '#14213D',
          border: '3px solid #F4A73B',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '28px',
          fontWeight: 'bold',
          color: '#F4A73B',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          zIndex: 10,
        }}
      >
        SW
      </div>

      {/* Top-right logo seal */}
      <div
        style={{
          position: 'absolute',
          top: '40px',
          right: '40px',
          width: '90px',
          height: '90px',
          borderRadius: '50%',
          backgroundColor: '#14213D',
          border: '3px solid #F4A73B',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '28px',
          fontWeight: 'bold',
          color: '#F4A73B',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          zIndex: 10,
        }}
      >
        SW
      </div>

      {/* Header section */}
      <div
        style={{
          textAlign: 'center',
          paddingTop: '60px',
          paddingBottom: '20px',
          position: 'relative',
          zIndex: 5,
        }}
      >
        {/* School name */}
        <div
          style={{
            fontSize: '26px',
            fontWeight: 'bold',
            color: '#14213D',
            letterSpacing: '0.5px',
            marginBottom: '4px',
            fontFamily: 'Georgia, serif',
          }}
        >
          SEAT OF WISDOM GROUP OF SCHOOLS
        </div>

        {/* Motto */}
        <div
          style={{
            fontSize: '13px',
            color: '#999',
            letterSpacing: '1px',
            marginBottom: '16px',
            fontFamily: 'Arial, sans-serif',
          }}
        >
          EXCELLENCE · KNOWLEDGE · CHARACTER
        </div>
      </div>

      {/* Divider line with diamond */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          paddingLeft: '60px',
          paddingRight: '60px',
          marginBottom: '16px',
          position: 'relative',
          zIndex: 5,
        }}
      >
        <div style={{ flex: 1, height: '1px', backgroundColor: '#14213D' }} />
        <div
          style={{
            width: '10px',
            height: '10px',
            backgroundColor: '#F4A73B',
            transform: 'rotate(45deg)',
          }}
        />
        <div style={{ flex: 1, height: '1px', backgroundColor: '#14213D' }} />
      </div>

      {/* Multi-color accent band */}
      <div
        style={{
          height: '4px',
          background: 'linear-gradient(to right, #4CAF7D, #6C4EE3, #FF6B5B, #F4A73B)',
          marginBottom: '20px',
          position: 'relative',
          zIndex: 5,
        }}
      />

      {/* Main content area */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          paddingLeft: '80px',
          paddingRight: '80px',
          paddingTop: '10px',
          paddingBottom: '40px',
          textAlign: 'center',
          position: 'relative',
          zIndex: 5,
          overflow: 'hidden',
        }}
      >
        {/* Main title - with responsive sizing */}
        <div
          style={{
            fontSize: '48px',
            fontWeight: 'bold',
            color: '#14213D',
            marginBottom: '8px',
            maxWidth: '100%',
            wordWrap: 'break-word',
            lineHeight: '1.2',
            fontFamily: 'Georgia, serif',
          }}
        >
          CERTIFICATE OF ACHIEVEMENT
        </div>

        {/* Section subtitle */}
        <div
          style={{
            fontSize: '18px',
            color: '#14213D',
            marginBottom: '16px',
            fontWeight: '600',
            fontFamily: 'Arial, sans-serif',
          }}
        >
          MATH OLYMPIAD — {sectionName.toUpperCase()}
        </div>

        {/* Italic intro line */}
        <div
          style={{
            fontSize: '14px',
            fontStyle: 'italic',
            color: '#666',
            marginBottom: '12px',
            fontFamily: 'Arial, sans-serif',
          }}
        >
          This is to certify that
        </div>

        {/* Recipient name - colored by tier */}
        <div
          style={{
            fontSize: '42px',
            fontWeight: 'bold',
            color: tierColor,
            marginBottom: '16px',
            maxWidth: '100%',
            wordWrap: 'break-word',
            fontFamily: 'Georgia, serif',
          }}
        >
          {certificate.recipient_name}
        </div>

        {/* Badge pill */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: `${tierColor}20`,
            border: `2px solid ${tierColor}`,
            borderRadius: '20px',
            paddingLeft: '12px',
            paddingRight: '12px',
            paddingTop: '6px',
            paddingBottom: '6px',
            marginBottom: '16px',
            fontSize: '13px',
            fontWeight: '600',
            color: tierColor,
            fontFamily: 'Arial, sans-serif',
          }}
        >
          <span>{rank.icon}</span>
          <span>{rank.label}</span>
        </div>

        {/* Accomplishment text */}
        <div
          style={{
            fontSize: '13px',
            color: '#666',
            marginBottom: '8px',
            fontFamily: 'Arial, sans-serif',
          }}
        >
          has demonstrated outstanding mathematical skill and achieved
        </div>

        {/* Score display */}
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'center',
            gap: '6px',
            marginBottom: '8px',
          }}
        >
          <div
            style={{
              fontSize: '48px',
              fontWeight: 'bold',
              color: '#14213D',
              fontFamily: 'monospace',
            }}
          >
            {certificate.score}
          </div>
          <div
            style={{
              fontSize: '14px',
              color: '#666',
              fontFamily: 'monospace',
            }}
          >
            /20
          </div>
        </div>

        {/* Round type line */}
        <div
          style={{
            fontSize: '13px',
            color: '#666',
            marginBottom: '12px',
            fontFamily: 'Arial, sans-serif',
          }}
        >
          in the <span style={{ fontWeight: 'bold', color: '#14213D' }}>{roundTypeDisplay}</span> Round
        </div>
      </div>

      {/* Bottom divider */}
      <div
        style={{
          height: '1px',
          backgroundColor: '#14213D',
          marginLeft: '80px',
          marginRight: '80px',
          position: 'relative',
          zIndex: 5,
        }}
      />

      {/* Footer section with signature lines */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '40px',
          padding: '24px 80px',
          position: 'relative',
          zIndex: 5,
        }}
      >
        {/* Left signature line */}
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              height: '1px',
              backgroundColor: '#14213D',
              marginBottom: '4px',
            }}
          />
          <div
            style={{
              fontSize: '11px',
              color: '#666',
              fontFamily: 'Arial, sans-serif',
            }}
          >
            Host / Teacher
          </div>
        </div>

        {/* Center date */}
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              fontSize: '12px',
              color: '#14213D',
              marginBottom: '4px',
              fontFamily: 'monospace',
            }}
          >
            {issueDate}
          </div>
          <div
            style={{
              fontSize: '11px',
              color: '#666',
              fontFamily: 'Arial, sans-serif',
            }}
          >
            Date
          </div>
        </div>

        {/* Right signature line */}
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              height: '1px',
              backgroundColor: '#14213D',
              marginBottom: '4px',
            }}
          />
          <div
            style={{
              fontSize: '11px',
              color: '#666',
              fontFamily: 'Arial, sans-serif',
            }}
          >
            Principal
          </div>
        </div>
      </div>

      {/* Decorative bottom accent marks */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '12px',
          paddingBottom: '12px',
          position: 'relative',
          zIndex: 5,
        }}
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{
              width: '6px',
              height: '6px',
              backgroundColor: '#F4A73B',
              borderRadius: '50%',
            }}
          />
        ))}
      </div>
    </div>
  );
}
