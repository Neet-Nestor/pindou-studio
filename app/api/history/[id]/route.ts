import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { buildHistory } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { z } from 'zod';

const buildHistoryUpdateSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().optional(),
  imageUrls: z.array(z.string().url()).max(5).optional(),
  piecesUsed: z.record(z.string(), z.number()).optional(),
  blueprintId: z.string().uuid().optional().nullable(),
  completedAt: z.string().datetime().optional(),
});

// GET - Fetch single build
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const [build] = await db
      .select()
      .from(buildHistory)
      .where(
        and(
          eq(buildHistory.id, id),
          eq(buildHistory.userId, session.user.id)
        )
      );

    if (!build) {
      return NextResponse.json({ error: 'Build not found' }, { status: 404 });
    }

    return NextResponse.json({ build }, { status: 200 });
  } catch (error) {
    console.error('Build fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch build' },
      { status: 500 }
    );
  }
}

// PATCH - Update build
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const validatedData = buildHistoryUpdateSchema.parse(body);

    // Check ownership
    const [existing] = await db
      .select()
      .from(buildHistory)
      .where(
        and(
          eq(buildHistory.id, id),
          eq(buildHistory.userId, session.user.id)
        )
      );

    if (!existing) {
      return NextResponse.json({ error: 'Build not found' }, { status: 404 });
    }

    // Prepare update data
    const updateData: Record<string, unknown> = { ...validatedData };
    if (validatedData.imageUrls) {
      updateData.imageUrls = JSON.stringify(validatedData.imageUrls);
    }
    if (validatedData.piecesUsed) {
      updateData.piecesUsed = JSON.stringify(validatedData.piecesUsed);
    }
    if (validatedData.completedAt) {
      updateData.completedAt = new Date(validatedData.completedAt);
    }
    updateData.updatedAt = new Date();

    const [updated] = await db
      .update(buildHistory)
      .set(updateData)
      .where(eq(buildHistory.id, id))
      .returning();

    return NextResponse.json(
      {
        message: 'Build updated successfully',
        build: updated,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Build update error:', error);
    return NextResponse.json(
      { error: 'Failed to update build' },
      { status: 500 }
    );
  }
}

// DELETE - Delete build
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Check ownership
    const [existing] = await db
      .select()
      .from(buildHistory)
      .where(
        and(
          eq(buildHistory.id, id),
          eq(buildHistory.userId, session.user.id)
        )
      );

    if (!existing) {
      return NextResponse.json({ error: 'Build not found' }, { status: 404 });
    }

    await db.delete(buildHistory).where(eq(buildHistory.id, id));

    return NextResponse.json(
      { message: 'Build deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Build delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete build' },
      { status: 500 }
    );
  }
}
