import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyAdminSession } from '../auth-utils';

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

    const {
      section_id,
      round_type,
      content,
      answer_type,
      option_a,
      option_b,
      option_c,
      option_d,
      correct_answer,
      points,
      difficulty_tier,
    } = body;

    // Validate required fields
    if (!section_id || !round_type || !content || !correct_answer || !answer_type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Insert question using service role key
    const { data, error } = await supabase
      .from('questions')
      .insert({
        section_id,
        round_type,
        content,
        answer_type,
        option_a: answer_type === 'mcq' ? option_a : null,
        option_b: answer_type === 'mcq' ? option_b : null,
        option_c: answer_type === 'mcq' ? option_c : null,
        option_d: answer_type === 'mcq' ? option_d : null,
        correct_answer,
        points,
        difficulty_tier,
      })
      .select()
      .single();

    if (error) {
      console.error('Error inserting question:', error);
      return NextResponse.json(
        { error: 'Failed to create question' },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error('Error in POST /api/admin/questions:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
