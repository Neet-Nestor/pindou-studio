import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { colors, userInventory } from '@/lib/db/schema';
import { auth } from '@/lib/auth';
import { z } from 'zod';

const createColorSchema = z.object({
  code: z.string().min(1, 'Color code is required'),
  hexColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color'),
  pieceId: z.string().optional(),
  initialQuantity: z.string().optional(),
  notes: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = createColorSchema.parse(body);

    // Create the custom color (belongs to user)
    const [newColor] = await db
      .insert(colors)
      .values({
        code: validatedData.pieceId || validatedData.code,
        hexColor: validatedData.hexColor,
        userId: session.user.id,
      })
      .returning();

    // Create inventory entry for this color
    await db.insert(userInventory).values({
      userId: session.user.id,
      colorId: newColor.id,
      quantity: parseInt(validatedData.initialQuantity || '0'),
      customColor: true,
    });

    return NextResponse.json({
      message: 'Custom color created successfully',
      color: newColor,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: error.issues[0].message },
        { status: 400 }
      );
    }

    console.error('Error creating custom color:', error);
    return NextResponse.json(
      { message: 'An error occurred while creating the color' },
      { status: 500 }
    );
  }
}
