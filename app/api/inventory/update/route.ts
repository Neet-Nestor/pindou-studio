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

    const { inventoryId, quantity, reason } = await request.json();

    if (typeof quantity !== 'number' || quantity < 0) {
      return NextResponse.json(
        { message: 'Invalid quantity' },
        { status: 400 }
      );
    }

    // Get current inventory item
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

    // Update inventory
    const [updatedItem] = await db
      .update(userInventory)
      .set({
        quantity,
        updatedAt: new Date(),
      })
      .where(eq(userInventory.id, inventoryId))
      .returning();

    // Record history
    await db.insert(inventoryHistory).values({
      userId: session.user.id,
      colorId: currentItem.colorId,
      changeAmount: quantity - currentItem.quantity,
      previousQuantity: currentItem.quantity,
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
