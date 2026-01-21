import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { userColorCustomizations } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { z } from 'zod';

const customizeColorSchema = z.object({
  colorId: z.string().uuid(),
  customCode: z.string().optional(),
  customNameZh: z.string().optional(),
  customNameEn: z.string().optional(),
  customHexColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional().or(z.literal('')),
  pieceId: z.string().optional(),
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
    const validatedData = customizeColorSchema.parse(body);

    // Check if customization already exists
    const [existing] = await db
      .select()
      .from(userColorCustomizations)
      .where(
        and(
          eq(userColorCustomizations.userId, session.user.id),
          eq(userColorCustomizations.colorId, validatedData.colorId)
        )
      )
      .limit(1);

    const customizationData = {
      userId: session.user.id,
      colorId: validatedData.colorId,
      customCode: validatedData.customCode || null,
      customNameZh: validatedData.customNameZh || null,
      customNameEn: validatedData.customNameEn || null,
      customHexColor: validatedData.customHexColor || null,
      pieceId: validatedData.pieceId || null,
      notes: validatedData.notes || null,
      updatedAt: new Date(),
    };

    let result;
    if (existing) {
      // Update existing customization
      [result] = await db
        .update(userColorCustomizations)
        .set(customizationData)
        .where(eq(userColorCustomizations.id, existing.id))
        .returning();
    } else {
      // Create new customization
      [result] = await db
        .insert(userColorCustomizations)
        .values(customizationData)
        .returning();
    }

    return NextResponse.json({
      message: 'Color customization saved successfully',
      customization: result,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error('Error customizing color:', error);
    return NextResponse.json(
      { message: 'An error occurred while customizing the color' },
      { status: 500 }
    );
  }
}
