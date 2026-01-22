'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, Download, Upload, Plus, List, LayoutGrid, RotateCcw, Eye } from 'lucide-react';
import AddCustomColorDialog from './add-custom-color-dialog';
import FamilyGroup from './family-group';
import ColorCard from './color-card';
import { TutorialBanner } from './mobile-tutorial';

interface InventoryItem {
  id: string;
  quantity: number;
  customColor: boolean;
  updatedAt: Date | null;
  color: {
    id: string;
    code: string;
    name: string;
    nameEn: string | null;
    nameZh: string | null;
    hexColor: string;
  } | null;
  customization: {
    id: string;
    customCode: string | null;
    customName: string | null;
    customNameEn: string | null;
    customNameZh: string | null;
    customHexColor: string | null;
    pieceId: string | null;
    notes: string | null;
  } | null;
}

interface InventoryGridProps {
  inventory: InventoryItem[];
  initialHiddenFamilies?: string[];
  initialHiddenColors?: string[];
}

// Helper function to extract family from color code
function extractFamily(code: string): string {
  // Match patterns like "ZG1", "A5", "B12", etc.
  const match = code.match(/^([A-Z]+)/);
  return match ? match[1] : 'Other';
}

// Helper function for natural/numeric sorting of color codes
function compareColorCodes(codeA: string, codeB: string): number {
  // Extract family (letter prefix) and number
  const matchA = codeA.match(/^([A-Z]+)(\d+)$/);
  const matchB = codeB.match(/^([A-Z]+)(\d+)$/);

  if (!matchA && !matchB) return codeA.localeCompare(codeB);
  if (!matchA) return 1;
  if (!matchB) return -1;

  const [, familyA, numStrA] = matchA;
  const [, familyB, numStrB] = matchB;

  // First compare families alphabetically
  const familyCompare = familyA.localeCompare(familyB);
  if (familyCompare !== 0) return familyCompare;

  // Then compare numbers numerically
  const numA = parseInt(numStrA, 10);
  const numB = parseInt(numStrB, 10);
  return numA - numB;
}

export default function InventoryGrid({
  inventory: initialInventory,
  initialHiddenFamilies = [],
  initialHiddenColors = [],
}: InventoryGridProps) {
  const router = useRouter();
  const [inventory, setInventory] = useState(initialInventory);
  const [searchQuery, setSearchQuery] = useState('');
  const [stockFilter, setStockFilter] = useState<'all' | 'in-stock' | 'low-stock' | 'out-of-stock'>('all');
  const [sortBy, setSortBy] = useState<'code' | 'quantity'>('quantity');
  const [showAddColorDialog, setShowAddColorDialog] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [hiddenFamilies, setHiddenFamilies] = useState<Set<string>>(new Set(initialHiddenFamilies));
  const [hiddenColors, setHiddenColors] = useState<Set<string>>(new Set(initialHiddenColors));
  const [groupByFamily, setGroupByFamily] = useState(true);

  // Sync inventory state when prop changes (after router.refresh())
  useEffect(() => {
    setInventory(initialInventory);
  }, [initialInventory]);

  // Stats calculation - only exclude hidden items
  const stats = useMemo(() => {
    const visibleItems = inventory.filter((item) => {
      if (!item.color) return false;

      const colorCode = item.customization?.pieceId || item.color.code;
      if (hiddenColors.has(colorCode)) return false;

      const family = extractFamily(item.color.code);
      if (hiddenFamilies.has(family)) return false;

      return true;
    });

    return {
      total: visibleItems.length,
      inStock: visibleItems.filter(i => i.quantity > 10).length,
      lowStock: visibleItems.filter(i => i.quantity > 0 && i.quantity <= 10).length,
      outOfStock: visibleItems.filter(i => i.quantity === 0).length,
    };
  }, [inventory, hiddenColors, hiddenFamilies]);

  // Filter, sort, and optionally group inventory by family
  const groupedInventory = useMemo(() => {
    const filtered = inventory.filter((item) => {
      if (!item.color) return false;

      // Filter out hidden colors
      const colorCode = item.customization?.pieceId || item.color.code;
      if (hiddenColors.has(colorCode)) return false;

      // Filter out colors from hidden families
      const family = extractFamily(item.color.code);
      if (hiddenFamilies.has(family)) return false;

      const matchesSearch =
        item.color.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.color.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.color.nameEn?.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.color.nameZh?.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStock =
        stockFilter === 'all' ||
        (stockFilter === 'in-stock' && item.quantity > 10) ||
        (stockFilter === 'low-stock' && item.quantity > 0 && item.quantity <= 10) ||
        (stockFilter === 'out-of-stock' && item.quantity === 0);

      return matchesSearch && matchesStock;
    });

    // Sort items
    filtered.sort((a, b) => {
      if (sortBy === 'quantity') {
        const qtyDiff = (b.quantity || 0) - (a.quantity || 0);
        if (qtyDiff !== 0) return qtyDiff;
        // Secondary sort by code when quantities are equal (numeric sort)
        return compareColorCodes(a.color?.code || '', b.color?.code || '');
      } else {
        // Sort by code with numeric ordering
        return compareColorCodes(a.color?.code || '', b.color?.code || '');
      }
    });

    if (!groupByFamily) {
      // Return ungrouped view - all items in a single "all" group
      return {
        families: ['all'],
        items: new Map([['all', filtered]]),
        totalCount: filtered.length,
      };
    }

    // Group by family
    const grouped = new Map<string, typeof filtered>();
    filtered.forEach((item) => {
      if (!item.color) return;
      const family = extractFamily(item.color.code);
      if (!grouped.has(family)) {
        grouped.set(family, []);
      }
      grouped.get(family)?.push(item);
    });

    // Sort families by total quantity
    const familiesWithTotals = Array.from(grouped.entries()).map(([family, items]) => ({
      family,
      totalQuantity: items.reduce((sum, item) => sum + (item.quantity || 0), 0),
    }));

    familiesWithTotals.sort((a, b) => {
      const qtyDiff = b.totalQuantity - a.totalQuantity;
      if (qtyDiff !== 0) return qtyDiff;
      // Secondary sort by family name when totals are equal
      return a.family.localeCompare(b.family);
    });

    const allFamilies = familiesWithTotals.map(({ family }) => family);

    return {
      families: allFamilies,
      items: grouped,
      totalCount: filtered.length,
    };
  }, [inventory, searchQuery, stockFilter, sortBy, hiddenColors, hiddenFamilies, groupByFamily]);

  const handleQuantityUpdate = (itemId: string, newQuantity: number) => {
    setInventory((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleToggleHidden = async (family: string) => {
    const newHiddenFamilies = new Set(hiddenFamilies);
    if (newHiddenFamilies.has(family)) {
      newHiddenFamilies.delete(family);
    } else {
      newHiddenFamilies.add(family);
    }
    setHiddenFamilies(newHiddenFamilies);

    try {
      await fetch('/api/inventory/toggle-family', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          family,
          hidden: newHiddenFamilies.has(family),
        }),
      });
    } catch (error) {
      console.error('Failed to toggle family visibility:', error);
    }
  };

  const handleHideColor = async (colorCode: string) => {
    const newHiddenColors = new Set(hiddenColors);
    newHiddenColors.add(colorCode);
    setHiddenColors(newHiddenColors);

    try {
      await fetch('/api/inventory/toggle-color', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          colorCode,
          hidden: true,
        }),
      });
    } catch (error) {
      console.error('Failed to hide color:', error);
    }
  };

  const handleUnhideColor = async (colorCode: string) => {
    const newHiddenColors = new Set(hiddenColors);
    newHiddenColors.delete(colorCode);
    setHiddenColors(newHiddenColors);

    try {
      await fetch('/api/inventory/toggle-color', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          colorCode,
          hidden: false,
        }),
      });
    } catch (error) {
      console.error('Failed to unhide color:', error);
    }
  };

  const handleExport = async () => {
    try {
      const response = await fetch('/api/inventory/export');
      const data = await response.json();

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `perler-beads-inventory-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const handleReset = async () => {
    setIsResetting(true);
    try {
      const response = await fetch('/api/inventory/reset', {
        method: 'POST',
      });

      if (response.ok) {
        router.push('/onboarding');
        router.refresh();
      } else {
        console.error('Reset failed');
        setIsResetting(false);
        setShowResetDialog(false);
      }
    } catch (error) {
      console.error('Reset failed:', error);
      setIsResetting(false);
      setShowResetDialog(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Tutorial banner - shows on first visit */}
      <TutorialBanner />

      {/* Search and filters - Compact, sticky on mobile */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center sticky top-12 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/90 z-10 py-2 -mx-4 px-4 md:static md:bg-transparent md:backdrop-blur-none md:p-0 md:m-0">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="搜索颜色代码或名称"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-sm"
          />
        </div>

        <Select value={stockFilter} onValueChange={(value) => setStockFilter(value as typeof stockFilter)}>
          <SelectTrigger className="w-full md:w-[120px] h-9 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-xs">全部</SelectItem>
            <SelectItem value="in-stock" className="text-xs">有库存</SelectItem>
            <SelectItem value="low-stock" className="text-xs">低库存</SelectItem>
            <SelectItem value="out-of-stock" className="text-xs">缺货</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={(value) => setSortBy(value as 'code' | 'quantity')}>
          <SelectTrigger className="w-full md:w-[120px] h-9 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="quantity" className="text-xs">按数量排序</SelectItem>
            <SelectItem value="code" className="text-xs">按代码排序</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex gap-1.5">
          <Button
            variant={groupByFamily ? "default" : "outline"}
            size="icon"
            onClick={() => setGroupByFamily(!groupByFamily)}
            title={groupByFamily ? "取消分组" : "按系列分组"}
            className="h-9 w-9"
          >
            {groupByFamily ? <LayoutGrid className="h-3.5 w-3.5" /> : <List className="h-3.5 w-3.5" />}
          </Button>
          <Button variant="outline" size="icon" onClick={handleExport} title="导出" className="h-9 w-9">
            <Download className="h-3.5 w-3.5" />
          </Button>
          <Button variant="outline" size="icon" title="导入" className="h-9 w-9">
            <Upload className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            title="添加自定义颜色"
            onClick={() => setShowAddColorDialog(true)}
            className="h-9 w-9"
          >
            <Plus className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            title="重新初始化"
            onClick={() => setShowResetDialog(true)}
            className="h-9 w-9 text-destructive hover:text-destructive"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Stock Insights - Compact, more compact on mobile */}
      <div className="grid grid-cols-4 gap-2 md:gap-3 mt-2">
        {/* Total */}
        <div className="rounded-lg p-2 md:p-4 bg-card border hover:shadow-md transition-all">
          <div className="text-[10px] md:text-xs text-muted-foreground font-medium mb-0.5 md:mb-1">总计</div>
          <div className="text-xl md:text-3xl font-bold tracking-tight">{stats.total}</div>
        </div>

        {/* In Stock */}
        <div className="rounded-lg p-2 md:p-4 bg-card border border-green-200 dark:border-green-900/40 hover:shadow-md hover:border-green-300 dark:hover:border-green-800/60 transition-all">
          <div className="text-[10px] md:text-xs font-medium mb-0.5 md:mb-1 text-green-700 dark:text-green-300">有库存</div>
          <div className="text-xl md:text-3xl font-bold tracking-tight text-green-700 dark:text-green-300">
            {stats.inStock}
          </div>
        </div>

        {/* Low Stock */}
        <div className="rounded-lg p-2 md:p-4 bg-card border border-orange-200 dark:border-orange-900/40 hover:shadow-md hover:border-orange-300 dark:hover:border-orange-800/60 transition-all">
          <div className="text-[10px] md:text-xs font-medium mb-0.5 md:mb-1 text-orange-700 dark:text-orange-300">低库存</div>
          <div className="text-xl md:text-3xl font-bold tracking-tight text-orange-700 dark:text-orange-300">
            {stats.lowStock}
          </div>
        </div>

        {/* Out of Stock */}
        <div className="rounded-lg p-2 md:p-4 bg-card border border-red-200 dark:border-red-900/40 hover:shadow-md hover:border-red-300 dark:hover:border-red-800/60 transition-all">
          <div className="text-[10px] md:text-xs font-medium mb-0.5 md:mb-1 text-red-700 dark:text-red-300">缺货</div>
          <div className="text-xl md:text-3xl font-bold tracking-tight text-red-700 dark:text-red-300">
            {stats.outOfStock}
          </div>
        </div>
      </div>

      {/* Inventory display - grouped or ungrouped */}
      {!groupByFamily ? (
        // Ungrouped view - flat grid, very dense layout
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-1.5 md:gap-2">
          {groupedInventory.items.get('all')?.map((item) => (
            <ColorCard
              key={item.id}
              item={item}
              onQuantityUpdate={handleQuantityUpdate}
              onHideColor={handleHideColor}
            />
          ))}
        </div>
      ) : (
        // Grouped view - by family
        <div className="space-y-4">
          {groupedInventory.families.map((family) => {
            const items = groupedInventory.items.get(family) || [];
            return (
              <FamilyGroup
                key={family}
                family={family}
                items={items}
                onQuantityUpdate={handleQuantityUpdate}
                onHideColor={handleHideColor}
                isHidden={hiddenFamilies.has(family)}
                onToggleHidden={handleToggleHidden}
              />
            );
          })}
        </div>
      )}

      {groupedInventory.totalCount === 0 && (
        <div className="text-center py-8 text-muted-foreground text-sm">
          搜索 &quot;{searchQuery}&quot; - 没有找到结果
        </div>
      )}

      {/* Hidden items section */}
      {(hiddenFamilies.size > 0 || hiddenColors.size > 0) && (
        <div className="border-t pt-6 mt-8 space-y-4">
          <h3 className="text-lg font-semibold px-2">已隐藏的拼豆片</h3>

          {/* Hidden families */}
          {hiddenFamilies.size > 0 && (
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground px-2">
                系列 ({hiddenFamilies.size})
              </div>
              <div className="flex flex-wrap gap-2 px-2">
                {Array.from(hiddenFamilies).map((family) => (
                  <Button
                    key={family}
                    variant="secondary"
                    size="sm"
                    onClick={() => handleToggleHidden(family)}
                    className="h-9 gap-2"
                  >
                    <span className="font-semibold">{family}</span>
                    <Eye className="h-3.5 w-3.5" />
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Hidden individual colors */}
          {hiddenColors.size > 0 && (
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground px-2">
                单个颜色 ({hiddenColors.size})
              </div>
              <div className="flex flex-wrap gap-2 px-2">
                {Array.from(hiddenColors).map((colorCode) => (
                  <Button
                    key={colorCode}
                    variant="secondary"
                    size="sm"
                    onClick={() => handleUnhideColor(colorCode)}
                    className="h-9 gap-2"
                  >
                    <span className="font-mono text-xs">{colorCode}</span>
                    <Eye className="h-3.5 w-3.5" />
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <AddCustomColorDialog
        open={showAddColorDialog}
        onOpenChange={setShowAddColorDialog}
      />

      <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <DialogContent className="w-[calc(100%-2rem)] sm:w-full">
          <DialogHeader>
            <DialogTitle>确认重置库存</DialogTitle>
            <DialogDescription className="space-y-2">
              <p className="text-destructive font-semibold">
                警告：此操作将删除所有库存数据！
              </p>
              <p>
                重置后，您将返回初始化页面重新选择颜色系列。所有数量记录、自定义颜色和备注都将永久删除。
              </p>
              <p className="font-medium">
                此操作无法撤销，请确认是否继续？
              </p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowResetDialog(false)}
              disabled={isResetting}
            >
              取消
            </Button>
            <Button
              variant="destructive"
              onClick={handleReset}
              disabled={isResetting}
            >
              {isResetting ? '重置中...' : '确认重置'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
