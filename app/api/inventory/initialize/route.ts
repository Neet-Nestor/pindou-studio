import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { colors, userInventory } from '@/lib/db/schema';
import { inArray } from 'drizzle-orm';
import { auth } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { colorSetIds } = await request.json();

    if (!Array.isArray(colorSetIds) || colorSetIds.length === 0) {
      return NextResponse.json(
        { message: 'Invalid color set IDs' },
        { status: 400 }
      );
    }

    // Fetch all colors from selected color sets
    const selectedColors = await db
      .select()
      .from(colors)
      .where(inArray(colors.colorSetId, colorSetIds));

    // Create inventory entries for all selected colors
    const inventoryEntries = selectedColors.map((color) => ({
      userId: session.user.id,
      colorId: color.id,
      quantity: 0,
      customColor: false,
    }));

    await db.insert(userInventory).values(inventoryEntries);

    return NextResponse.json({
      message: 'Inventory initialized successfully',
      count: inventoryEntries.length,
    });
  } catch (error) {
    console.error('Error initializing inventory:', error);
    return NextResponse.json(
      { message: 'An error occurred while initializing inventory' },
      { status: 500 }
    );
  }
}
