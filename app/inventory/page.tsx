import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { userInventory, colors, colorSets, userColorCustomizations, userHiddenColors } from '@/lib/db/schema';
import { eq, and, isNull, isNotNull } from 'drizzle-orm';
import InventoryGrid from '@/components/inventory/inventory-grid';
import EmptyInventory from '@/components/inventory/empty-inventory';
import { Button } from '@/components/ui/button';
import { signOut } from '@/lib/auth';
import { ThemeToggle } from '@/components/theme-toggle';

export default async function InventoryPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  // Fetch user's inventory with color, color set, and customization details
  const inventory = await db
    .select({
      id: userInventory.id,
      quantity: userInventory.quantity,
      customColor: userInventory.customColor,
      updatedAt: userInventory.updatedAt,
      color: {
        id: colors.id,
        code: colors.code,
        name: colors.name,
        nameEn: colors.nameEn,
        nameZh: colors.nameZh,
        hexColor: colors.hexColor,
      },
      colorSet: {
        id: colorSets.id,
        name: colorSets.name,
        brand: colorSets.brand,
      },
      customizationRaw: {
        id: userColorCustomizations.id,
        customCode: userColorCustomizations.customCode,
        customName: userColorCustomizations.customName,
        customNameEn: userColorCustomizations.customNameEn,
        customNameZh: userColorCustomizations.customNameZh,
        customHexColor: userColorCustomizations.customHexColor,
        pieceId: userColorCustomizations.pieceId,
        notes: userColorCustomizations.notes,
      },
    })
    .from(userInventory)
    .leftJoin(colors, eq(userInventory.colorId, colors.id))
    .leftJoin(colorSets, eq(colors.colorSetId, colorSets.id))
    .leftJoin(
      userColorCustomizations,
      and(
        eq(userColorCustomizations.colorId, colors.id),
        eq(userColorCustomizations.userId, session.user.id)
      )
    )
    .where(eq(userInventory.userId, session.user.id));

  // Transform inventory: convert customizationRaw to customization (null if no data)
  const inventoryWithCustomizations = inventory.map(item => ({
    ...item,
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
        eq(userHiddenColors.userId, session.user.id),
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
        eq(userHiddenColors.userId, session.user.id),
        isNotNull(userHiddenColors.colorCode),
        isNull(userHiddenColors.family)
      )
    );

  const hiddenColors = hiddenColorsData
    .map((row) => row.colorCode)
    .filter((c): c is string => c !== null);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto flex h-12 items-center justify-between px-4">
          <h1 className="text-lg font-bold">拼豆Studio</h1>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <form
              action={async () => {
                'use server';
                await signOut();
              }}
            >
              <Button type="submit" variant="ghost" size="sm" className="h-8 text-xs">
                退出
              </Button>
            </form>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-4">
        <div className="space-y-3">
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
      </main>
    </div>
  );
}
