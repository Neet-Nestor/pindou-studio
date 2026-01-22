'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Minus, Plus, Edit2 } from 'lucide-react';
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
  const [isUpdating, setIsUpdating] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [inputValue, setInputValue] = useState(item.quantity.toString());

  if (!item.color) return null;

  // Use customized values if available
  const displayCode = item.customization?.customCode || item.color.code;
  const displayHexColor = item.customization?.customHexColor || item.color.hexColor;
  const displayPieceId = item.customization?.pieceId;

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
      <div className={`group relative rounded-lg overflow-hidden border bg-card transition-all hover:shadow-lg hover:border-primary/50 ${
        isOutOfStock ? 'opacity-50' : ''
      }`}>
        {/* Large color swatch - PROMINENT */}
        <div
          className="w-full aspect-square relative"
          style={{ backgroundColor: displayHexColor }}
        >
          {/* Status indicator - top right corner */}
          {isOutOfStock && (
            <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 border border-white shadow-sm" />
          )}
          {isLowStock && !isOutOfStock && (
            <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-yellow-500 border border-white shadow-sm" />
          )}

          {/* Edit button on hover */}
          <Button
            size="icon"
            variant="secondary"
            className="absolute top-1 left-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
            onClick={() => setShowEditDialog(true)}
          >
            <Edit2 className="h-3 w-3" />
          </Button>
        </div>

        {/* Minimal info bar */}
        <div className="px-2 py-1.5 bg-background/95 backdrop-blur space-y-1">
          {/* Piece ID - large and clear */}
          <div className="font-bold text-sm text-center truncate">
            {displayPieceId || displayCode}
          </div>

          {/* Notes - visible but compact */}
          {item.customization?.notes && (
            <div className="text-[10px] text-muted-foreground text-center leading-tight truncate px-1" title={item.customization.notes}>
              {item.customization.notes}
            </div>
          )}

          {/* Quantity controls - clean and simple */}
          <div className="flex items-center justify-center gap-1">
            {showInput ? (
              <>
                <Input
                  type="number"
                  min="0"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleInputSubmit()}
                  onBlur={handleInputSubmit}
                  className="h-7 text-xs text-center w-16"
                  autoFocus
                />
                <Button
                  size="sm"
                  onClick={handleInputSubmit}
                  disabled={isUpdating}
                  className="h-7 w-7 p-0"
                >
                  <Plus className="h-3 w-3 rotate-45" />
                </Button>
              </>
            ) : (
              <>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleQuickAdjust(-1)}
                  disabled={isUpdating || item.quantity < 1}
                  className="h-7 w-7 p-0"
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <div
                  className="font-bold text-lg cursor-pointer hover:text-primary transition-colors min-w-[2.5rem] text-center"
                  onClick={() => {
                    setShowInput(true);
                    setInputValue(item.quantity.toString());
                  }}
                  title="点击编辑"
                >
                  {item.quantity}
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleQuickAdjust(1)}
                  disabled={isUpdating}
                  className="h-7 w-7 p-0"
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {showEditDialog && (
        <EditColorDialog
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          color={item.color}
          customization={item.customization}
        />
      )}
    </>
  );
}
