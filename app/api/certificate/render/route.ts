import { NextRequest, NextResponse } from 'next/server';
import { createCanvas } from 'canvas';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      recipient_name,
      section_name,
      tier_color,
      round_type,
      score,
      max_score,
      rank,
      issue_date,
      mode,
    } = body;

    // Create canvas (1200x800 for print-ready resolution)
    const canvas = createCanvas(1200, 800);
    const ctx = canvas.getContext('2d');

    // Fill background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 1200, 800);

    // Outer dark border
    ctx.strokeStyle = '#14213D';
    ctx.lineWidth = 8;
    ctx.strokeRect(18, 18, 1200 - 36, 800 - 36);

    // Inner gold border
    ctx.strokeStyle = '#F4A73B';
    ctx.lineWidth = 2;
    ctx.strokeRect(26, 26, 1200 - 52, 800 - 52);

    // Header section
    ctx.fillStyle = '#14213D';
    ctx.font = 'bold 24px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('SEAT OF WISDOM GROUP OF SCHOOLS', 600, 70);

    ctx.font = '12px Arial, sans-serif';
    ctx.fillStyle = '#999';
    ctx.fillText('EXCELLENCE · KNOWLEDGE · CHARACTER', 600, 95);

    // Decorative line with diamond
    ctx.strokeStyle = '#14213D';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(120, 130);
    ctx.lineTo(540, 130);
    ctx.stroke();

    ctx.fillStyle = '#F4A73B';
    ctx.fillRect(590, 125, 20, 10); // Diamond shape (simplified)

    ctx.beginPath();
    ctx.moveTo(660, 130);
    ctx.lineTo(1080, 130);
    ctx.stroke();

    // Gradient bar
    const gradient = ctx.createLinearGradient(0, 150, 1200, 150);
    gradient.addColorStop(0, '#4CAF7D');
    gradient.addColorStop(0.33, '#6C4EE3');
    gradient.addColorStop(0.66, '#FF6B5B');
    gradient.addColorStop(1, '#F4A73B');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 150, 1200, 154);

    // Main content area - start around y=180
    ctx.fillStyle = '#14213D';
    ctx.font = 'bold 40px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('CERTIFICATE OF ACHIEVEMENT', 600, 250);

    ctx.font = '600 16px Arial, sans-serif';
    ctx.fillText(`MATH OLYMPIAD — ${section_name.toUpperCase()}`, 600, 290);

    ctx.font = 'italic 13px Arial, sans-serif';
    ctx.fillStyle = '#666';
    ctx.fillText('This is to certify that', 600, 330);

    // Recipient name
    ctx.font = 'bold 38px Georgia, serif';
    ctx.fillStyle = tier_color;
    ctx.fillText(recipient_name, 600, 390);

    // Rank badge background
    ctx.fillStyle = `${tier_color}20`;
    ctx.strokeStyle = tier_color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(300, 415, 600, 40, 20);
    ctx.fill();
    ctx.stroke();

    // Rank text
    ctx.font = '600 13px Arial, sans-serif';
    ctx.fillStyle = tier_color;
    ctx.textAlign = 'center';
    const rankDisplay = mode === 'practice' 
      ? 'Practice complete'
      : rank === 1 ? '1st place' : rank === 2 ? '2nd place' : rank === 3 ? '3rd place' : 'Participant';
    ctx.fillText(rankDisplay, 600, 442);

    // Achievement text
    ctx.fillStyle = '#666';
    ctx.font = '13px Arial, sans-serif';
    ctx.fillText('has demonstrated outstanding mathematical skill and achieved', 600, 485);

    // Score display
    ctx.font = 'bold 42px monospace';
    ctx.fillStyle = '#14213D';
    const scoreDisplay = max_score ? `${score}/${max_score}` : `${score}`;
    ctx.textAlign = 'right';
    ctx.fillText(scoreDisplay, 550, 530);

    ctx.font = '13px monospace';
    ctx.fillStyle = '#666';
    ctx.textAlign = 'left';
    ctx.fillText('points', 560, 530);

    // Round type
    ctx.font = '13px Arial, sans-serif';
    ctx.fillStyle = '#666';
    ctx.textAlign = 'center';
    const roundTypeDisplay = round_type === 'grid' ? 'Grid Round' : round_type === 'tiered' ? 'Tiered Round' : 'Speed Sprint';
    ctx.fillText(`in the ${roundTypeDisplay} Round`, 600, 565);

    // Separator line
    ctx.strokeStyle = '#14213D';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(240, 600);
    ctx.lineTo(960, 600);
    ctx.stroke();

    // Signature section
    ctx.font = '11px Arial, sans-serif';
    ctx.fillStyle = '#666';
    ctx.textAlign = 'center';

    // Left signature line
    ctx.beginPath();
    ctx.moveTo(300, 650);
    ctx.lineTo(450, 650);
    ctx.stroke();
    ctx.fillText('Host / Teacher', 375, 675);

    // Center date
    const issueDateFormatted = new Date(issue_date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    ctx.font = '12px monospace';
    ctx.fillStyle = '#14213D';
    ctx.fillText(issueDateFormatted, 600, 635);
    ctx.font = '11px Arial, sans-serif';
    ctx.fillStyle = '#666';
    ctx.fillText('Date', 600, 675);

    // Right signature line
    ctx.strokeStyle = '#14213D';
    ctx.beginPath();
    ctx.moveTo(750, 650);
    ctx.lineTo(900, 650);
    ctx.stroke();
    ctx.font = '11px Arial, sans-serif';
    ctx.fillStyle = '#666';
    ctx.fillText('Principal', 825, 675);

    // Decorative dots
    ctx.fillStyle = '#F4A73B';
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.arc(480 + i * 48, 740, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    // Convert to PNG buffer
    const buffer = canvas.toBuffer('image/png');

    return new NextResponse(buffer as any, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': `inline; filename="certificate.png"`,
      },
    });
  } catch (err) {
    console.error('Certificate render error:', err);
    return NextResponse.json(
      { error: 'Failed to render certificate', details: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
