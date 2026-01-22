import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { userInventory, inventoryHistory } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { auth } from '@/lib/auth';

export async function PATCH(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { inventoryId, colorId, quantity, reason } = await request.json();

    if (typeof quantity !== 'number' || quantity < 0) {
      return NextResponse.json(
        { message: 'Invalid quantity' },
        { status: 400 }
      );
    }

    // Check if this is a new inventory item (temp ID) or existing
    const isNewItem = inventoryId && inventoryId.startsWith('temp-');

    let updatedItem;
    let previousQuantity = 0;
    let actualColorId = colorId;

    if (isNewItem) {
      // Create new inventory record for this color
      if (!colorId) {
        return NextResponse.json(
          { message: 'Color ID required for new inventory item' },
          { status: 400 }
        );
      }

      [updatedItem] = await db
        .insert(userInventory)
        .values({
          userId: session.user.id,
          colorId,
          quantity,
          customColor: false,
        })
        .returning();

      actualColorId = colorId;
    } else {
      // Update existing inventory item
      const [currentItem] = await db
        .select()
        .from(userInventory)
        .where(
          and(
            eq(userInventory.id, inventoryId),
            eq(userInventory.userId, session.user.id)
          )
        )
        .limit(1);

      if (!currentItem) {
        return NextResponse.json(
          { message: 'Inventory item not found' },
          { status: 404 }
        );
      }

      previousQuantity = currentItem.quantity;
      actualColorId = currentItem.colorId;

      [updatedItem] = await db
        .update(userInventory)
        .set({
          quantity,
          updatedAt: new Date(),
        })
        .where(eq(userInventory.id, inventoryId))
        .returning();
    }

    // Record history
    await db.insert(inventoryHistory).values({
      userId: session.user.id,
      colorId: actualColorId,
      changeAmount: quantity - previousQuantity,
      previousQuantity,
      newQuantity: quantity,
      reason: reason || null,
    });

    return NextResponse.json({
      message: 'Quantity updated successfully',
      inventory: updatedItem,
    });
  } catch (error) {
    console.error('Error updating inventory:', error);
    return NextResponse.json(
      { message: 'An error occurred while updating inventory' },
      { status: 500 }
    );
  }
}
