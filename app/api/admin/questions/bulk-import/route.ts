import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyAdminSession } from '../../auth-utils';

// Create Supabase client with service role (server-side only)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export async function POST(request: NextRequest) {
  // Verify admin session
  if (!verifyAdminSession(request)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { rows, sections } = body;

    if (!Array.isArray(rows) || !Array.isArray(sections)) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    const results = {
      successCount: 0,
      errors: [] as string[],
    };

    // Insert each row
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];

      try {
        // Validate required fields
        if (!row.content || !row.correct_answer || !row.answer_type) {
          results.errors.push(`Row ${i + 2}: Missing required fields`);
          continue;
        }

        if (!['mcq', 'numeric'].includes(row.answer_type)) {
          results.errors.push(`Row ${i + 2}: Invalid answer_type`);
          continue;
        }

        // Find section
        const section = sections.find((s: any) => s.name === row.section);
        if (!section) {
          results.errors.push(`Row ${i + 2}: Section not found`);
          continue;
        }

        // Insert question
        const { error } = await supabase
          .from('questions')
          .insert({
            section_id: section.id,
            round_type: row.round_type,
            difficulty_tier: row.difficulty_tier || null,
            content: row.content,
            answer_type: row.answer_type,
            option_a: row.answer_type === 'mcq' ? row.option_a : null,
            option_b: row.answer_type === 'mcq' ? row.option_b : null,
            option_c: row.answer_type === 'mcq' ? row.option_c : null,
            option_d: row.answer_type === 'mcq' ? row.option_d : null,
            correct_answer: row.correct_answer,
            points: parseInt(row.points) || 1,
          });

        if (error) {
          results.errors.push(`Row ${i + 2}: ${error.message}`);
          continue;
        }

        results.successCount++;
      } catch (err) {
        results.errors.push(`Row ${i + 2}: Parse error`);
      }
    }

    return NextResponse.json(results, { status: 200 });
  } catch (err) {
    console.error('Error in POST /api/admin/questions/bulk-import:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
