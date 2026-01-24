import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { userInventory, colors, userColorCustomizations, userHiddenColors, userSettings, colorCatalog } from '@/lib/db/schema';
import { eq, and, isNull, isNotNull, sql, inArray } from 'drizzle-orm';
import InventoryGrid from '@/components/inventory/inventory-grid';
import EmptyInventory from '@/components/inventory/empty-inventory';
import { BrandSettingsDialog } from '@/components/inventory/brand-settings-dialog';

export default async function DashboardInventoryPage() {
  const session = await auth();

  // Get user's brand settings
  const settings = await db.query.userSettings.findFirst({
    where: eq(userSettings.userId, session!.user!.id),
  });

  const primaryBrand = settings?.primaryBrand || 'MARD';
  const multiBrandEnabled = settings?.multiBrandEnabled || false;
  const enabledBrands = settings?.enabledBrands ? JSON.parse(settings.enabledBrands) : [];

  // Fetch colors from catalog based on user's primary brand
  // LEFT JOIN with user's inventory to show quantities
  const inventory = await db
    .select({
      id: userInventory.id,
      quantity: userInventory.quantity,
      customColor: userInventory.customColor,
      updatedAt: userInventory.updatedAt,
      brand: userInventory.brand,
      color: {
        id: colorCatalog.id,
        code: colorCatalog.code,
        hexColor: colorCatalog.hexColor,
        brand: colorCatalog.brand,
      },
      // Legacy support: also fetch from colors table if available
      legacyColor: {
        id: colors.id,
        code: colors.code,
      },
    })
    .from(colorCatalog)
    .leftJoin(
      userInventory,
      and(
        eq(userInventory.hexColor, colorCatalog.hexColor),
        eq(userInventory.brand, colorCatalog.brand),
        eq(userInventory.userId, session!.user!.id)
      )
    )
    .leftJoin(
      colors,
      eq(colors.hexColor, colorCatalog.hexColor)
    )
    .where(
      multiBrandEnabled && enabledBrands.length > 0
        ? inArray(colorCatalog.brand, enabledBrands) // Show only enabled brands in multi-brand mode
        : eq(colorCatalog.brand, primaryBrand) // Only show primary brand in single-brand mode
    )
    .orderBy(
      colorCatalog.brand,
      sql`SUBSTRING(${colorCatalog.code} FROM '^([A-Z]+)')`,
      sql`CAST(SUBSTRING(${colorCatalog.code} FROM '([0-9]+)$') AS INTEGER)`
    );

  // Transform inventory: handle colors without inventory records (default to quantity 0)
  const inventoryWithBrands = inventory.map(item => ({
    id: item.id || `temp-${item.color!.id}`, // Use temp ID if no inventory record yet
    quantity: item.quantity ?? 0, // Default to 0 if no inventory record
    customColor: item.customColor ?? false,
    updatedAt: item.updatedAt,
    brand: item.brand || item.color?.brand || primaryBrand,
    color: {
      id: item.color!.id,
      code: item.color!.code,
      hexColor: item.color!.hexColor,
      brand: item.color!.brand,
    },
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
    <div className="container mx-auto max-w-7xl space-y-6 px-6 py-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">
            库存管理
          </h1>
          <p className="text-muted-foreground">
            共 <span className="font-semibold text-foreground">{inventoryWithBrands.length}</span> 种颜色
            {multiBrandEnabled && <span className="ml-2 text-xs">· 多品牌模式</span>}
            {!multiBrandEnabled && <span className="ml-2 text-xs">· 品牌: {primaryBrand}</span>}
          </p>
        </div>
        <BrandSettingsDialog
          initialSettings={{
            primaryBrand,
            multiBrandEnabled,
            enabledBrands,
          }}
        />
      </div>

      {inventoryWithBrands.length === 0 ? (
        <EmptyInventory />
      ) : (
        <InventoryGrid
          inventory={inventoryWithBrands}
          initialHiddenFamilies={hiddenFamilies}
          initialHiddenColors={hiddenColors}
          brandSettings={{
            primaryBrand,
            multiBrandEnabled,
          }}
        />
      )}
    </div>
  );
}
