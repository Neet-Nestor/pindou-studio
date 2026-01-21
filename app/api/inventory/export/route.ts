import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { userInventory, colors, colorSets } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch user's inventory with full details
    const inventory = await db
      .select({
        quantity: userInventory.quantity,
        customColor: userInventory.customColor,
        color: {
          code: colors.code,
          name: colors.name,
          nameEn: colors.nameEn,
          nameZh: colors.nameZh,
          hexColor: colors.hexColor,
        },
        colorSet: {
          name: colorSets.name,
          brand: colorSets.brand,
        },
      })
      .from(userInventory)
      .leftJoin(colors, eq(userInventory.colorId, colors.id))
      .leftJoin(colorSets, eq(colors.colorSetId, colorSets.id))
      .where(eq(userInventory.userId, session.user.id));

    const exportData = {
      exportDate: new Date().toISOString(),
      userId: session.user.id,
      userName: session.user.name,
      userEmail: session.user.email,
      totalColors: inventory.length,
      inventory: inventory.map((item) => ({
        colorCode: item.color?.code,
        colorName: item.color?.name,
        colorNameEn: item.color?.nameEn,
        colorNameZh: item.color?.nameZh,
        hexColor: item.color?.hexColor,
        quantity: item.quantity,
        colorSet: item.colorSet?.name,
        brand: item.colorSet?.brand,
        customColor: item.customColor,
      })),
    };

    return NextResponse.json(exportData);
  } catch (error) {
    console.error('Error exporting inventory:', error);
    return NextResponse.json(
      { message: 'An error occurred while exporting inventory' },
      { status: 500 }
    );
  }
}
