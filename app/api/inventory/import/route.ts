import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { userInventory, colors, userSettings } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { auth } from '@/lib/auth';

interface ImportInventoryItem {
  colorCode: string;
  hexColor?: string;
  quantity: number;
  customColor?: boolean;
}

interface ImportData {
  inventory: ImportInventoryItem[];
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data: ImportData = await request.json();

    if (!data.inventory || !Array.isArray(data.inventory)) {
      return NextResponse.json(
        { message: 'Invalid import data format' },
        { status: 400 }
      );
    }

    // Get user's brand settings
    const settings = await db.query.userSettings.findFirst({
      where: eq(userSettings.userId, session.user.id),
    });
    const primaryBrand = settings?.primaryBrand || 'MARD';

    let updatedCount = 0;
    let errorCount = 0;

    for (const item of data.inventory) {
      try {
        // Find the color by code
        const color = await db
          .select()
          .from(colors)
          .where(eq(colors.code, item.colorCode))
          .limit(1);

        if (color.length === 0) {
          console.warn(`Color not found: ${item.colorCode}`);
          errorCount++;
          continue;
        }

        // Check if user already has this color in inventory
        const existingInventory = await db
          .select()
          .from(userInventory)
          .where(
            and(
              eq(userInventory.userId, session.user.id),
              eq(userInventory.colorId, color[0].id)
            )
          )
          .limit(1);

        if (existingInventory.length > 0) {
          // Update existing inventory
          await db
            .update(userInventory)
            .set({
              quantity: item.quantity,
              customColor: item.customColor || false,
              updatedAt: new Date(),
            })
            .where(eq(userInventory.id, existingInventory[0].id));
        } else {
          // Create new inventory entry
          await db.insert(userInventory).values({
            userId: session.user.id,
            colorId: color[0].id,
            hexColor: color[0].hexColor,
            brand: primaryBrand,
            quantity: item.quantity,
            customColor: item.customColor || false,
            updatedAt: new Date(),
          });
        }

        updatedCount++;
      } catch (itemError) {
        console.error(`Error importing item ${item.colorCode}:`, itemError);
        errorCount++;
      }
    }

    return NextResponse.json({
      message: 'Import completed',
      updated: updatedCount,
      errors: errorCount,
      total: data.inventory.length,
    });
  } catch (error) {
    console.error('Error importing inventory:', error);
    return NextResponse.json(
      { message: 'An error occurred while importing inventory' },
      { status: 500 }
    );
  }
}
