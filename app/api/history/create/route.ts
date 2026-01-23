import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { buildHistory, NewBuildHistory } from '@/lib/db/schema';
import { z } from 'zod';

const buildHistorySchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().optional(),
  imageUrls: z.array(z.string().url()).max(5, 'Maximum 5 images allowed'),
  piecesUsed: z.record(z.string(), z.number()).optional(),
  blueprintId: z.string().uuid().optional(),
  completedAt: z.string().datetime(),
  isPublic: z.boolean().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = buildHistorySchema.parse(body);

    // Convert arrays/objects to JSON strings
    const imageUrlsJson = JSON.stringify(validatedData.imageUrls);
    const piecesUsedJson = validatedData.piecesUsed
      ? JSON.stringify(validatedData.piecesUsed)
      : null;

    const newBuild: NewBuildHistory = {
      userId: session.user.id,
      blueprintId: validatedData.blueprintId || null,
      title: validatedData.title,
      description: validatedData.description || null,
      imageUrls: imageUrlsJson,
      piecesUsed: piecesUsedJson,
      isPublic: validatedData.isPublic || false,
      completedAt: new Date(validatedData.completedAt),
    };

    const [build] = await db.insert(buildHistory).values(newBuild).returning();

    return NextResponse.json(
      {
        message: 'Build history created successfully',
        build,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Build history creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create build history' },
      { status: 500 }
    );
  }
}
