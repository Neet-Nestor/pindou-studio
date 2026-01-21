'use client';

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, Download, Upload, Plus } from 'lucide-react';
import ColorCard from './color-card';
import AddCustomColorDialog from './add-custom-color-dialog';

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
}

export default function InventoryGrid({ inventory: initialInventory }: InventoryGridProps) {
  const [inventory, setInventory] = useState(initialInventory);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSet, setSelectedSet] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'code' | 'name' | 'quantity'>('code');
  const [showAddColorDialog, setShowAddColorDialog] = useState(false);

  // Extract unique color sets
  const colorSets = useMemo(() => {
    const sets = new Map<string, { id: string; name: string; brand: string }>();
    inventory.forEach((item) => {
      if (item.colorSet) {
        sets.set(item.colorSet.id, item.colorSet);
      }
    });
    return Array.from(sets.values());
  }, [inventory]);

  // Filter and sort inventory
  const filteredInventory = useMemo(() => {
    const filtered = inventory.filter((item) => {
      if (!item.color) return false;

      const matchesSearch =
        item.color.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.color.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.color.nameEn?.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.color.nameZh?.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesSet =
        selectedSet === 'all' ||
        item.colorSet?.id === selectedSet ||
        (selectedSet === 'custom' && item.customColor);

      return matchesSearch && matchesSet;
    });

    // Sort
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

    return filtered;
  }, [inventory, searchQuery, selectedSet, sortBy]);

  const handleQuantityUpdate = (itemId: string, newQuantity: number) => {
    setInventory((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
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
    <div className="space-y-6">
      {/* Search and filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索颜色代码或名称"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={selectedSet} onValueChange={setSelectedSet}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部套装</SelectItem>
            {colorSets.map((set) => (
              <SelectItem key={set.id} value={set.id}>
                {set.name}
              </SelectItem>
            ))}
            <SelectItem value="custom">自定义颜色</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={(value) => setSortBy(value as 'code' | 'name' | 'quantity')}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="code">按代码排序</SelectItem>
            <SelectItem value="name">按名称排序</SelectItem>
            <SelectItem value="quantity">按数量排序</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={handleExport} title="导出">
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" title="导入">
            <Upload className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            title="添加自定义颜色"
            onClick={() => setShowAddColorDialog(true)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Results count */}
      <div className="text-sm text-muted-foreground">
        库存: {filteredInventory.length} / {inventory.length}
      </div>

      {/* Inventory grid */}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {filteredInventory.map((item) => (
          <ColorCard
            key={item.id}
            item={item}
            onQuantityUpdate={handleQuantityUpdate}
          />
        ))}
      </div>

      {filteredInventory.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
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
