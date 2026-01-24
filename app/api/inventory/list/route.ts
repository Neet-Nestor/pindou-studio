import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { userInventory, colors, userSettings, colorCatalog } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { auth } from '@/lib/auth';

// GET /api/inventory/list - Get user's inventory with brand-aware display
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const brandFilter = searchParams.get('brand'); // Filter by specific brand

    // Get user settings to determine display mode
    const settings = await db.query.userSettings.findFirst({
      where: eq(userSettings.userId, session.user.id),
    });

    const primaryBrand = settings?.primaryBrand || 'MARD';
    const multiBrandEnabled = settings?.multiBrandEnabled || false;

    // Get user's inventory
    const inventory = await db
      .select({
        id: userInventory.id,
        userId: userInventory.userId,
        colorId: userInventory.colorId,
        hexColor: userInventory.hexColor,
        brand: userInventory.brand,
        quantity: userInventory.quantity,
        customColor: userInventory.customColor,
        createdAt: userInventory.createdAt,
        updatedAt: userInventory.updatedAt,
        // Join with colors table for legacy code lookup
        colorCode: colors.code,
        colorHex: colors.hexColor,
      })
      .from(userInventory)
      .leftJoin(colors, eq(userInventory.colorId, colors.id))
      .where(eq(userInventory.userId, session.user.id));

    // Filter by brand if specified
    let filteredInventory = inventory;
    if (brandFilter) {
      filteredInventory = inventory.filter(item => item.brand === brandFilter);
    }

    // Enhance inventory with color codes based on user's settings
    const enhancedInventory = await Promise.all(
      filteredInventory.map(async (item) => {
        // If no hexColor (legacy data), use color from colors table
        const hex = item.hexColor || item.colorHex;
        const brand = item.brand || primaryBrand;

        // Look up the color code for this hex+brand combination
        let displayCode = item.colorCode; // fallback to legacy code
        let displayBrand = brand;

        if (hex) {
          const catalogEntry = await db.query.colorCatalog.findFirst({
            where: and(
              eq(colorCatalog.hexColor, hex),
              eq(colorCatalog.brand, brand)
            ),
          });

          if (catalogEntry) {
            displayCode = catalogEntry.code;
            displayBrand = catalogEntry.brand;
          }
        }

        return {
          id: item.id,
          hexColor: hex,
          brand: displayBrand,
          code: displayCode,
          quantity: item.quantity,
          customColor: item.customColor,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        };
      })
    );

    return NextResponse.json({
      inventory: enhancedInventory,
      settings: {
        primaryBrand,
        multiBrandEnabled,
      },
    });
  } catch (error) {
    console.error('Error fetching inventory:', error);
    return NextResponse.json(
      { error: 'Failed to fetch inventory' },
      { status: 500 }
    );
  }
}
