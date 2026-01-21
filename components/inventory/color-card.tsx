'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Minus, Plus, Edit2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import EditColorDialog from './edit-color-dialog';

interface ColorCardProps {
  item: {
    id: string;
    quantity: number;
    customColor: boolean;
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
  };
  onQuantityUpdate: (itemId: string, newQuantity: number) => void;
}

export default function ColorCard({ item, onQuantityUpdate }: ColorCardProps) {
  const t = useTranslations('inventory');
  const locale = useLocale();
  const [isUpdating, setIsUpdating] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [inputValue, setInputValue] = useState(item.quantity.toString());

  if (!item.color) return null;

  // Use customized values if available
  const displayCode = item.customization?.customCode || item.color.code;
  const displayHexColor = item.customization?.customHexColor || item.color.hexColor;
  const displayPieceId = item.customization?.pieceId;

  const colorName = locale === 'zh'
    ? (item.customization?.customNameZh || item.color.nameZh || item.color.name)
    : (item.customization?.customNameEn || item.color.nameEn || item.color.name);

  const hasCustomization = !!item.customization?.id;

  const updateQuantity = async (newQuantity: number) => {
    if (newQuantity < 0) return;

    setIsUpdating(true);
    try {
      const response = await fetch('/api/inventory/update', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inventoryId: item.id,
          quantity: newQuantity,
        }),
      });

      if (response.ok) {
        onQuantityUpdate(item.id, newQuantity);
      }
    } catch (error) {
      console.error('Failed to update quantity:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleQuickAdjust = (amount: number) => {
    updateQuantity(item.quantity + amount);
  };

  const handleInputSubmit = () => {
    const value = parseInt(inputValue);
    if (!isNaN(value) && value >= 0) {
      updateQuantity(value);
      setShowInput(false);
    }
  };

  const isLowStock = item.quantity > 0 && item.quantity < 10;
  const isOutOfStock = item.quantity === 0;

  return (
    <>
      <Card className="overflow-hidden hover:shadow-md transition-shadow">
        <div className="relative">
          {/* Color swatch */}
          <div
            className="h-24 w-full"
            style={{ backgroundColor: displayHexColor }}
          />

          {/* Stock badges */}
          <div className="absolute top-2 right-2 flex gap-1 flex-wrap max-w-[calc(100%-1rem)]">
            {isOutOfStock && (
              <Badge variant="destructive" className="text-xs">
                {t('outOfStock')}
              </Badge>
            )}
            {isLowStock && (
              <Badge variant="secondary" className="text-xs bg-yellow-500 text-white">
                {t('lowStock')}
              </Badge>
            )}
            {item.customColor && (
              <Badge variant="outline" className="text-xs">
                {t('customColor')}
              </Badge>
            )}
            {hasCustomization && (
              <Badge variant="secondary" className="text-xs">
                {t('customized')}
              </Badge>
            )}
          </div>

          {/* Edit button */}
          <Button
            size="icon"
            variant="secondary"
            className="absolute bottom-2 right-2 h-8 w-8 opacity-0 hover:opacity-100 transition-opacity"
            onClick={() => setShowEditDialog(true)}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
        </div>

        <CardContent className="p-4 space-y-3">
          {/* Color info */}
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1 min-w-0">
                <span className="font-mono text-sm font-semibold truncate">
                  {displayCode}
                </span>
                {displayPieceId && (
                  <span className="text-xs text-muted-foreground">
                    ({displayPieceId})
                  </span>
                )}
              </div>
              {item.colorSet && (
                <span className="text-xs text-muted-foreground shrink-0">
                  {item.colorSet.brand}
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground line-clamp-1">
              {colorName}
            </p>
          </div>

        {/* Quantity display */}
        {showInput ? (
          <div className="flex gap-2">
            <Input
              type="number"
              min="0"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleInputSubmit()}
              className="h-8 text-sm"
              autoFocus
            />
            <Button
              size="sm"
              onClick={handleInputSubmit}
              disabled={isUpdating}
            >
              OK
            </Button>
          </div>
        ) : (
          <div
            className="text-2xl font-bold text-center cursor-pointer hover:text-primary"
            onClick={() => {
              setShowInput(true);
              setInputValue(item.quantity.toString());
            }}
          >
            {item.quantity}
          </div>
        )}

        {/* Quick adjust buttons */}
        <div className="grid grid-cols-5 gap-1">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleQuickAdjust(-10)}
            disabled={isUpdating || item.quantity < 10}
            className="h-8 px-2"
          >
            -10
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleQuickAdjust(-5)}
            disabled={isUpdating || item.quantity < 5}
            className="h-8 px-2"
          >
            -5
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleQuickAdjust(-1)}
            disabled={isUpdating || item.quantity < 1}
            className="h-8 px-2"
          >
            <Minus className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleQuickAdjust(1)}
            disabled={isUpdating}
            className="h-8 px-2"
          >
            <Plus className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleQuickAdjust(5)}
            disabled={isUpdating}
            className="h-8 px-2"
          >
            +5
          </Button>
        </div>
      </CardContent>
    </Card>

    {showEditDialog && (
      <EditColorDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        color={item.color}
        inventoryId={item.id}
        customization={item.customization}
      />
    )}
    </>
  );
}
