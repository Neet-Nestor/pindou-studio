'use client';

import { useState, useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
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
  const t = useTranslations();
  const locale = useLocale();
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
    let filtered = inventory.filter((item) => {
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
        const nameA = locale === 'zh' ? (a.color?.nameZh || a.color?.name || '') : (a.color?.nameEn || a.color?.name || '');
        const nameB = locale === 'zh' ? (b.color?.nameZh || b.color?.name || '') : (b.color?.nameEn || b.color?.name || '');
        return nameA.localeCompare(nameB);
      } else {
        return (a.color?.code || '').localeCompare(b.color?.code || '');
      }
    });

    return filtered;
  }, [inventory, searchQuery, selectedSet, sortBy, locale]);

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
            placeholder={t('inventory.searchPlaceholder')}
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
            <SelectItem value="all">{t('inventory.allSets')}</SelectItem>
            {colorSets.map((set) => (
              <SelectItem key={set.id} value={set.id}>
                {set.name}
              </SelectItem>
            ))}
            <SelectItem value="custom">{t('inventory.customColor')}</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="code">{t('inventory.sortByCode')}</SelectItem>
            <SelectItem value="name">{t('inventory.sortByName')}</SelectItem>
            <SelectItem value="quantity">{t('inventory.sortByQuantity')}</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={handleExport} title={t('common.export')}>
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" title={t('common.import')}>
            <Upload className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            title={t('inventory.addCustomColor')}
            onClick={() => setShowAddColorDialog(true)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Results count */}
      <div className="text-sm text-muted-foreground">
        {t('inventory.title')}: {filteredInventory.length} / {inventory.length}
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
          {t('common.search')} "{searchQuery}" - No results found
        </div>
      )}

      <AddCustomColorDialog
        open={showAddColorDialog}
        onOpenChange={setShowAddColorDialog}
      />
    </div>
  );
}
