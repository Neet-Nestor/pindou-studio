import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { userInventory, colors, userColorCustomizations, userHiddenColors } from '@/lib/db/schema';
import { eq, and, isNull, isNotNull, sql } from 'drizzle-orm';
import InventoryGrid from '@/components/inventory/inventory-grid';
import EmptyInventory from '@/components/inventory/empty-inventory';

export default async function DashboardInventoryPage() {
  const session = await auth();

  // Fetch ALL colors and LEFT JOIN with user's inventory
  // This ensures users see all colors even when new ones are added
  const inventory = await db
    .select({
      id: userInventory.id,
      quantity: userInventory.quantity,
      customColor: userInventory.customColor,
      updatedAt: userInventory.updatedAt,
      color: {
        id: colors.id,
        code: colors.code,
        hexColor: colors.hexColor,
      },
      customizationRaw: {
        id: userColorCustomizations.id,
        customCode: userColorCustomizations.customCode,
        customHexColor: userColorCustomizations.customHexColor,
        pieceId: userColorCustomizations.pieceId,
        notes: userColorCustomizations.notes,
      },
    })
    .from(colors)
    .leftJoin(
      userInventory,
      and(
        eq(userInventory.colorId, colors.id),
        eq(userInventory.userId, session!.user!.id)
      )
    )
    .leftJoin(
      userColorCustomizations,
      and(
        eq(userColorCustomizations.colorId, colors.id),
        eq(userColorCustomizations.userId, session!.user!.id)
      )
    )
    .orderBy(
      sql`SUBSTRING(${colors.code} FROM '^([A-Z]+)')`,
      sql`CAST(SUBSTRING(${colors.code} FROM '([0-9]+)$') AS INTEGER)`
    );

  // Transform inventory: handle colors without inventory records (default to quantity 0)
  const inventoryWithCustomizations = inventory.map(item => ({
    id: item.id || `temp-${item.color!.id}`, // Use temp ID if no inventory record yet
    quantity: item.quantity ?? 0, // Default to 0 if no inventory record
    customColor: item.customColor ?? false,
    updatedAt: item.updatedAt,
    color: item.color,
    customization: item.customizationRaw?.id ? item.customizationRaw : null,
  }));

  // Fetch hidden families (where colorCode is null, meaning entire family is hidden)
  const hiddenFamiliesData = await db
    .select({
      family: userHiddenColors.family,
    })
    .from(userHiddenColors)
    .where(
      and(
        eq(userHiddenColors.userId, session!.user!.id),
        isNotNull(userHiddenColors.family),
        isNull(userHiddenColors.colorCode)
      )
    );

  const hiddenFamilies = hiddenFamiliesData
    .map((row) => row.family)
    .filter((f): f is string => f !== null);

  // Fetch hidden individual colors (where colorCode is set, family is null)
  const hiddenColorsData = await db
    .select({
      colorCode: userHiddenColors.colorCode,
    })
    .from(userHiddenColors)
    .where(
      and(
        eq(userHiddenColors.userId, session!.user!.id),
        isNotNull(userHiddenColors.colorCode),
        isNull(userHiddenColors.family)
      )
    );

  const hiddenColors = hiddenColorsData
    .map((row) => row.colorCode)
    .filter((c): c is string => c !== null);

  return (
    <div className="container mx-auto space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            我的库存
          </h2>
          <p className="text-xs text-muted-foreground">
            {inventoryWithCustomizations.length} 种颜色
          </p>
        </div>
      </div>

      {inventoryWithCustomizations.length === 0 ? (
        <EmptyInventory />
      ) : (
        <InventoryGrid
          inventory={inventoryWithCustomizations}
          initialHiddenFamilies={hiddenFamilies}
          initialHiddenColors={hiddenColors}
        />
      )}
    </div>
  );
}
