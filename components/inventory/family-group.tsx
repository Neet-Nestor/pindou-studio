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
    <div className="space-y-2">
      {/* Family Header - Compact and modern */}
      <div
        className="group flex items-center justify-between px-3 py-2 rounded-md bg-gradient-to-r from-muted/50 to-muted/30 border hover:border-primary/30 transition-all cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 hover:bg-transparent"
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
          >
            {isExpanded ? (
              <ChevronDown className="h-3.5 w-3.5 transition-transform" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5 transition-transform" />
            )}
          </Button>

          <div className="flex items-baseline gap-2">
            <h3 className="font-semibold text-base">{family}</h3>
            <span className="text-xs text-muted-foreground font-medium">
              {inStockCount}/{totalCount}
            </span>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onToggleHidden(family);
          }}
          className="h-7 gap-1.5 px-2 opacity-60 hover:opacity-100 transition-opacity"
        >
          {isHidden ? (
            <>
              <EyeOff className="h-3 w-3" />
              <span className="text-[10px]">已隐藏</span>
            </>
          ) : (
            <>
              <Eye className="h-3 w-3" />
              <span className="text-[10px]">隐藏</span>
            </>
          )}
        </Button>
      </div>

      {/* Family Items - Responsive grid for square cards */}
      {isExpanded && !isHidden && (
        <div className="grid gap-2 grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 2xl:grid-cols-12">
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
        <div className="text-center py-6 text-muted-foreground text-xs">
          此系列已隐藏
        </div>
      )}
    </div>
  );
}
