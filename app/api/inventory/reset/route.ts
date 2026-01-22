import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { userInventory, inventoryHistory, userColorCustomizations, userHiddenColors } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';

export async function POST() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Delete all user data in parallel
    await Promise.all([
      // Delete all user inventory
      db.delete(userInventory).where(eq(userInventory.userId, session.user.id)),

      // Delete inventory history
      db.delete(inventoryHistory).where(eq(inventoryHistory.userId, session.user.id)),

      // Delete customizations
      db.delete(userColorCustomizations).where(eq(userColorCustomizations.userId, session.user.id)),

      // Delete hidden colors/families
      db.delete(userHiddenColors).where(eq(userHiddenColors.userId, session.user.id)),
    ]);

    return NextResponse.json({
      success: true,
      message: 'Inventory reset successfully',
    });
  } catch (error) {
    console.error('Error resetting inventory:', error);
    return NextResponse.json(
      { message: 'An error occurred while resetting inventory' },
      { status: 500 }
    );
  }
}
