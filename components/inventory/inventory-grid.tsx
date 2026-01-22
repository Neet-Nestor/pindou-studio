'use client';

import { useState, useMemo, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, Download, Upload, Plus } from 'lucide-react';
import AddCustomColorDialog from './add-custom-color-dialog';
import FamilyGroup from './family-group';
import { colorFamilies } from '@/lib/db/default-colors';

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
  colorSet: {
    id: string;
    name: string;
    brand: string;
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
}

// Helper function to extract family from color code
function extractFamily(code: string): string {
  // Match patterns like "ZG1", "A5", "B12", etc.
  const match = code.match(/^([A-Z]+)/);
  return match ? match[1] : 'Other';
}

export default function InventoryGrid({
  inventory: initialInventory,
  initialHiddenFamilies = [],
}: InventoryGridProps) {
  const [inventory, setInventory] = useState(initialInventory);
  const [searchQuery, setSearchQuery] = useState('');
  const [stockFilter, setStockFilter] = useState<'all' | 'in-stock' | 'low-stock' | 'out-of-stock'>('all');
  const [sortBy, setSortBy] = useState<'code' | 'name' | 'quantity'>('code');
  const [showAddColorDialog, setShowAddColorDialog] = useState(false);
  const [hiddenFamilies, setHiddenFamilies] = useState<Set<string>>(new Set(initialHiddenFamilies));

  // Sync inventory state when prop changes (after router.refresh())
  useEffect(() => {
    setInventory(initialInventory);
  }, [initialInventory]);

  // Filter, sort, and group inventory by family
  const groupedInventory = useMemo(() => {
    const filtered = inventory.filter((item) => {
      if (!item.color) return false;

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

    // Sort within each family
    filtered.sort((a, b) => {
      if (sortBy === 'quantity') {
        return (b.quantity || 0) - (a.quantity || 0);
      } else if (sortBy === 'name') {
        const nameA = a.color?.nameZh || a.color?.name || '';
        const nameB = b.color?.nameZh || b.color?.name || '';
        return nameA.localeCompare(nameB);
      } else {
        return (a.color?.code || '').localeCompare(b.color?.code || '');
      }
    });

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

    // Sort families according to colorFamilies order
    const sortedFamilies = colorFamilies.filter((f) => grouped.has(f));
    const otherFamilies = Array.from(grouped.keys()).filter((f) => !colorFamilies.includes(f));
    const allFamilies = [...sortedFamilies, ...otherFamilies];

    return {
      families: allFamilies,
      items: grouped,
      totalCount: filtered.length,
    };
  }, [inventory, searchQuery, stockFilter, sortBy]);

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

    // TODO: Save to database via API
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

  return (
    <div className="space-y-4">
      {/* Search and filters - Compact */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center">
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

        <Select value={sortBy} onValueChange={(value) => setSortBy(value as 'code' | 'name' | 'quantity')}>
          <SelectTrigger className="w-full md:w-[120px] h-9 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="code" className="text-xs">按代码</SelectItem>
            <SelectItem value="name" className="text-xs">按名称</SelectItem>
            <SelectItem value="quantity" className="text-xs">按数量</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex gap-1.5">
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
        </div>
      </div>

      {/* Stock Insights - Compact */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <div className="rounded-md p-2.5 bg-gradient-to-br from-card to-muted/20 border shadow-sm">
          <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">总计</div>
          <div className="text-xl font-bold mt-0.5">{groupedInventory.totalCount}</div>
        </div>
        <div className="rounded-md p-2.5 bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-200 dark:border-green-900 shadow-sm">
          <div className="text-[10px] text-green-700 dark:text-green-400 font-medium uppercase tracking-wide">有库存</div>
          <div className="text-xl font-bold text-green-600 dark:text-green-400 mt-0.5">
            {Array.from(groupedInventory.items.values()).flat().filter(i => i.quantity > 10).length}
          </div>
        </div>
        <div className="rounded-md p-2.5 bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 border border-yellow-200 dark:border-yellow-900 shadow-sm">
          <div className="text-[10px] text-yellow-700 dark:text-yellow-400 font-medium uppercase tracking-wide">低库存</div>
          <div className="text-xl font-bold text-yellow-600 dark:text-yellow-400 mt-0.5">
            {Array.from(groupedInventory.items.values()).flat().filter(i => i.quantity > 0 && i.quantity <= 10).length}
          </div>
        </div>
        <div className="rounded-md p-2.5 bg-gradient-to-br from-red-500/10 to-red-500/5 border border-red-200 dark:border-red-900 shadow-sm">
          <div className="text-[10px] text-red-700 dark:text-red-400 font-medium uppercase tracking-wide">缺货</div>
          <div className="text-xl font-bold text-red-600 dark:text-red-400 mt-0.5">
            {Array.from(groupedInventory.items.values()).flat().filter(i => i.quantity === 0).length}
          </div>
        </div>
      </div>

      {/* Inventory by family groups - Compact spacing */}
      <div className="space-y-4">
        {groupedInventory.families.map((family) => {
          const items = groupedInventory.items.get(family) || [];
          return (
            <FamilyGroup
              key={family}
              family={family}
              items={items}
              onQuantityUpdate={handleQuantityUpdate}
              isHidden={hiddenFamilies.has(family)}
              onToggleHidden={handleToggleHidden}
            />
          );
        })}
      </div>

      {groupedInventory.totalCount === 0 && (
        <div className="text-center py-8 text-muted-foreground text-sm">
          搜索 &quot;{searchQuery}&quot; - 没有找到结果
        </div>
      )}

      <AddCustomColorDialog
        open={showAddColorDialog}
        onOpenChange={setShowAddColorDialog}
      />
    </div>
  );
}
