import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { userInventory, inventoryHistory, colorCatalog, userSettings } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { auth } from '@/lib/auth';

// POST /api/inventory/add - Add new color to inventory
export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { hexColor, brand, code, quantity = 0 } = await request.json();

    // Validate required fields
    if (!hexColor) {
      return NextResponse.json(
        { error: 'hexColor is required' },
        { status: 400 }
      );
    }

    if (typeof quantity !== 'number' || quantity < 0) {
      return NextResponse.json(
        { error: 'Invalid quantity' },
        { status: 400 }
      );
    }

    // Get user settings for default brand
    const settings = await db.query.userSettings.findFirst({
      where: eq(userSettings.userId, session.user.id),
    });

    const actualBrand = brand || settings?.primaryBrand || 'MARD';
    const normalizedHex = hexColor.toLowerCase();

    // Verify color exists in catalog
    const catalogEntry = await db.query.colorCatalog.findFirst({
      where: and(
        eq(colorCatalog.hexColor, normalizedHex),
        eq(colorCatalog.brand, actualBrand)
      ),
    });

    if (!catalogEntry) {
      return NextResponse.json(
        { error: `Color ${normalizedHex} not found in ${actualBrand} catalog` },
        { status: 404 }
      );
    }

    // Check if this color+brand combination already exists for user
    const existingInventory = await db
      .select()
      .from(userInventory)
      .where(
        and(
          eq(userInventory.userId, session.user.id),
          eq(userInventory.hexColor, normalizedHex),
          eq(userInventory.brand, actualBrand)
        )
      )
      .limit(1);

    if (existingInventory.length > 0) {
      return NextResponse.json(
        { error: 'This color already exists in your inventory' },
        { status: 409 }
      );
    }

    // Create new inventory item
    const [newItem] = await db
      .insert(userInventory)
      .values({
        userId: session.user.id,
        colorId: null, // No legacy colorId for new multi-brand items
        hexColor: normalizedHex,
        brand: actualBrand,
        quantity,
        customColor: false,
      })
      .returning();

    // Record history if quantity > 0
    if (quantity > 0) {
      await db.insert(inventoryHistory).values({
        userId: session.user.id,
        colorId: null,
        changeAmount: quantity,
        previousQuantity: 0,
        newQuantity: quantity,
        reason: 'Initial add',
      });
    }

    return NextResponse.json({
      message: 'Color added successfully',
      inventory: {
        ...newItem,
        code: catalogEntry.code,
      },
    });
  } catch (error) {
    console.error('Error adding to inventory:', error);
    return NextResponse.json(
      { error: 'Failed to add color to inventory' },
      { status: 500 }
    );
  }
}
