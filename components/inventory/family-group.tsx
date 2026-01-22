'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ColorCard from './color-card';

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

interface FamilyGroupProps {
  family: string;
  items: InventoryItem[];
  onQuantityUpdate: (itemId: string, newQuantity: number) => void;
  isHidden: boolean;
  onToggleHidden: (family: string) => void;
}

export default function FamilyGroup({
  family,
  items,
  onQuantityUpdate,
  isHidden,
  onToggleHidden,
}: FamilyGroupProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const inStockCount = items.filter((item) => item.quantity > 0).length;
  const totalCount = items.length;

  return (
    <div className="space-y-3">
      {/* Family Header */}
      <div className="flex items-center justify-between bg-muted/50 rounded-lg p-3 border">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>

          <div>
            <h3 className="font-bold text-lg">{family} 系列</h3>
            <p className="text-xs text-muted-foreground">
              {inStockCount} / {totalCount} 有库存
            </p>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onToggleHidden(family)}
          className="gap-2"
        >
          {isHidden ? (
            <>
              <EyeOff className="h-4 w-4" />
              <span className="text-xs">已隐藏</span>
            </>
          ) : (
            <>
              <Eye className="h-4 w-4" />
              <span className="text-xs">隐藏此系列</span>
            </>
          )}
        </Button>
      </div>

      {/* Family Items */}
      {isExpanded && !isHidden && (
        <div className="grid gap-3 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {items.map((item) => (
            <ColorCard
              key={item.id}
              item={item}
              onQuantityUpdate={onQuantityUpdate}
            />
          ))}
        </div>
      )}

      {isExpanded && isHidden && (
        <div className="text-center py-8 text-muted-foreground text-sm">
          此系列已隐藏。点击上方按钮显示。
        </div>
      )}
    </div>
  );
}
