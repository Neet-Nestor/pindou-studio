import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { userInventory, colors, colorSets, userColorCustomizations } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import InventoryGrid from '@/components/inventory/inventory-grid';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { signOut } from '@/lib/auth';

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
      customization: {
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

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-background">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-xl font-bold">拼豆Studio</h1>
          <div className="flex items-center gap-4">
            <Link href="/onboarding">
              <Button variant="outline" size="sm">
                选择颜色套装
              </Button>
            </Link>
            <form
              action={async () => {
                'use server';
                await signOut();
              }}
            >
              <Button type="submit" variant="ghost" size="sm">
                退出
              </Button>
            </form>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                我的库存
              </h2>
              <p className="text-muted-foreground">
                {inventory.length} 种颜色
              </p>
            </div>
          </div>

          {inventory.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-muted-foreground mb-4">
                库存为空
              </p>
              <Link href="/onboarding">
                <Button size="lg">
                  选择颜色套装
                </Button>
              </Link>
            </div>
          ) : (
            <InventoryGrid inventory={inventory} />
          )}
        </div>
      </main>
    </div>
  );
}
