import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyAdminSession } from '../../auth-utils';

// Create Supabase client with service role (server-side only)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  // Verify admin session
  if (!verifyAdminSession(request)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const { id } = await context.params;
    const body = await request.json();

    const {
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

    // Update question using service role key
    const { data, error } = await supabase
      .from('questions')
      .update({
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
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating question:', error);
      return NextResponse.json(
        { error: 'Failed to update question' },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error('Error in PATCH /api/admin/questions/[id]:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  // Verify admin session
  if (!verifyAdminSession(request)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const { id } = await context.params;

    // Delete question using service role key
    const { error } = await supabase
      .from('questions')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting question:', error);
      return NextResponse.json(
        { error: 'Failed to delete question' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error('Error in DELETE /api/admin/questions/[id]:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
