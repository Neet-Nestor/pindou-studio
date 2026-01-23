import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { blueprints, NewBlueprint } from '@/lib/db/schema';
import { z } from 'zod';

const blueprintSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  description: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal('')),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
  pieceRequirements: z.record(z.string(), z.number()).optional(),
  tags: z.string().optional(),
  isOfficial: z.boolean().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = blueprintSchema.parse(body);

    // Check if user is admin
    const isAdmin = session.user.role === 'admin';

    // Only admins can publish official blueprints
    const isOfficial = isAdmin && validatedData.isOfficial === true;

    // Convert pieceRequirements object to JSON string
    const pieceRequirementsJson = validatedData.pieceRequirements
      ? JSON.stringify(validatedData.pieceRequirements)
      : null;

    const newBlueprint: NewBlueprint = {
      name: validatedData.name,
      description: validatedData.description || null,
      imageUrl: validatedData.imageUrl || null,
      difficulty: validatedData.difficulty || null,
      pieceRequirements: pieceRequirementsJson,
      tags: validatedData.tags || null,
      isOfficial,
      createdBy: session.user.id,
    };

    const [blueprint] = await db.insert(blueprints).values(newBlueprint).returning();

    return NextResponse.json(
      {
        message: 'Blueprint created successfully',
        blueprint,
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

    console.error('Blueprint creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create blueprint' },
      { status: 500 }
    );
  }
}
