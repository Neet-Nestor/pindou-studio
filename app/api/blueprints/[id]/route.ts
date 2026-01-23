import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { blueprints } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { z } from 'zod';

const blueprintUpdateSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal('')),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
  pieceRequirements: z.record(z.string(), z.number()).optional(),
  tags: z.string().optional(),
  isOfficial: z.boolean().optional(),
});

// GET - Fetch single blueprint
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

    const [blueprint] = await db
      .select()
      .from(blueprints)
      .where(
        and(
          eq(blueprints.id, id),
          eq(blueprints.createdBy, session.user.id)
        )
      );

    if (!blueprint) {
      return NextResponse.json({ error: 'Blueprint not found' }, { status: 404 });
    }

    return NextResponse.json({ blueprint }, { status: 200 });
  } catch (error) {
    console.error('Blueprint fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blueprint' },
      { status: 500 }
    );
  }
}

// PATCH - Update blueprint
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
    const validatedData = blueprintUpdateSchema.parse(body);

    // Check ownership
    const [existing] = await db
      .select()
      .from(blueprints)
      .where(
        and(
          eq(blueprints.id, id),
          eq(blueprints.createdBy, session.user.id)
        )
      );

    if (!existing) {
      return NextResponse.json({ error: 'Blueprint not found' }, { status: 404 });
    }

    // Check if user is admin
    const isAdmin = session.user.role === 'admin';

    // Prepare update data
    const updateData: Record<string, unknown> = { ...validatedData };

    // Only admins can set isOfficial
    if ('isOfficial' in validatedData) {
      if (isAdmin) {
        updateData.isOfficial = validatedData.isOfficial;
      } else {
        // Non-admins cannot change isOfficial status
        delete updateData.isOfficial;
      }
    }

    if (validatedData.pieceRequirements) {
      updateData.pieceRequirements = JSON.stringify(validatedData.pieceRequirements);
    }
    updateData.updatedAt = new Date();

    const [updated] = await db
      .update(blueprints)
      .set(updateData)
      .where(eq(blueprints.id, id))
      .returning();

    return NextResponse.json(
      {
        message: 'Blueprint updated successfully',
        blueprint: updated,
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

    console.error('Blueprint update error:', error);
    return NextResponse.json(
      { error: 'Failed to update blueprint' },
      { status: 500 }
    );
  }
}

// DELETE - Delete blueprint
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
      .from(blueprints)
      .where(
        and(
          eq(blueprints.id, id),
          eq(blueprints.createdBy, session.user.id)
        )
      );

    if (!existing) {
      return NextResponse.json({ error: 'Blueprint not found' }, { status: 404 });
    }

    await db.delete(blueprints).where(eq(blueprints.id, id));

    return NextResponse.json(
      { message: 'Blueprint deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Blueprint delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete blueprint' },
      { status: 500 }
    );
  }
}
