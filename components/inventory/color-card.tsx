'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Minus, Plus, Edit2, EyeOff } from 'lucide-react';
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
  onHideColor: (colorCode: string) => void;
}

export default function ColorCard({ item, onQuantityUpdate, onHideColor }: ColorCardProps) {
  const [showInput, setShowInput] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [inputValue, setInputValue] = useState(item.quantity.toString());
  const [localQuantity, setLocalQuantity] = useState(item.quantity);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pendingQuantityRef = useRef<number | null>(null);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync local quantity when item changes from parent
  useEffect(() => {
    setLocalQuantity(item.quantity);
  }, [item.quantity]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
      }
    };
  }, []);

  // Long press handlers for mobile edit
  const handleTouchStart = () => {
    longPressTimerRef.current = setTimeout(() => {
      setShowEditDialog(true);
    }, 500); // 500ms long press
  };

  const handleTouchEnd = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
    }
  };

  if (!item.color) return null;

  // Use customized values if available
  const displayCode = item.customization?.customCode || item.color.code;
  const displayHexColor = item.customization?.customHexColor || item.color.hexColor;
  const displayPieceId = item.customization?.pieceId;

  const updateQuantity = (newQuantity: number) => {
    if (newQuantity < 0) return;

    // Update UI immediately (optimistic)
    setLocalQuantity(newQuantity);
    onQuantityUpdate(item.id, newQuantity);

    // Store the pending quantity
    pendingQuantityRef.current = newQuantity;

    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Debounce the API call (500ms)
    debounceTimerRef.current = setTimeout(async () => {
      const quantityToSave = pendingQuantityRef.current;
      if (quantityToSave === null) return;

      try {
        if (!item.color) return;

        const response = await fetch('/api/inventory/update', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            inventoryId: item.id,
            colorId: item.color.id,
            quantity: quantityToSave,
          }),
        });

        if (!response.ok) {
          // Revert on failure - refresh from server
          console.error('Failed to update quantity');
        }
      } catch (error) {
        console.error('Failed to update quantity:', error);
      } finally {
        pendingQuantityRef.current = null;
      }
    }, 500);
  };

  const handleQuickAdjust = (amount: number) => {
    updateQuantity(localQuantity + amount);
  };

  const handleInputSubmit = () => {
    const value = parseInt(inputValue);
    if (!isNaN(value) && value >= 0) {
      updateQuantity(value);
      setShowInput(false);
    }
  };

  const isLowStock = localQuantity > 0 && localQuantity < 10;
  const isOutOfStock = localQuantity === 0;

  return (
    <>
      <div className="group relative flex flex-col rounded-lg overflow-hidden border bg-card transition-all hover:shadow-lg hover:border-primary/50">
        {/* Large color swatch - PROMINENT, long press on mobile to edit */}
        <div
          className="w-full aspect-square relative md:pointer-events-none"
          style={{ backgroundColor: displayHexColor }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
        >
          {/* Status indicator - top right corner, larger on mobile */}
          {isOutOfStock && (
            <div className="absolute top-0.5 right-0.5 md:top-1 md:right-1 w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-red-500 border-2 border-white shadow-md" />
          )}
          {isLowStock && !isOutOfStock && (
            <div className="absolute top-0.5 right-0.5 md:top-1 md:right-1 w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-yellow-500 border-2 border-white shadow-md" />
          )}

          {/* Action buttons on hover - hidden on mobile */}
          <div className="hidden md:flex absolute top-1 left-1 right-1 justify-between opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="icon"
              variant="secondary"
              className="h-6 w-6 shadow-sm"
              onClick={() => setShowEditDialog(true)}
            >
              <Edit2 className="h-3 w-3" />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="h-6 w-6 shadow-sm"
              onClick={() => onHideColor(displayCode)}
              title="Hide this color"
            >
              <EyeOff className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Minimal info bar - more compact on mobile */}
        <div className="px-1 py-1 md:px-2 md:py-1.5 bg-card space-y-0.5 md:space-y-1 flex-shrink-0">
          {/* Piece ID - smaller on mobile */}
          <div className="font-bold text-[10px] md:text-sm text-center truncate">
            {displayPieceId || displayCode}
          </div>

          {/* Notes - hidden on mobile to save space */}
          <div className="hidden md:block text-[10px] text-muted-foreground text-center leading-tight truncate px-1 min-h-[14px]" title={item.customization?.notes || ''}>
            {item.customization?.notes || '\u00A0'}
          </div>

          {/* Quantity controls - larger touch targets on mobile */}
          <div className="flex items-center justify-center gap-0.5 md:gap-1">
            {showInput ? (
              <>
                <Input
                  type="number"
                  min="0"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleInputSubmit()}
                  onBlur={handleInputSubmit}
                  className="h-6 md:h-7 text-xs text-center w-12 md:w-16"
                  autoFocus
                />
                <Button
                  size="sm"
                  onClick={handleInputSubmit}
                  className="h-6 w-6 md:h-7 md:w-7 p-0"
                >
                  <Plus className="h-2.5 w-2.5 md:h-3 md:w-3 rotate-45" />
                </Button>
              </>
            ) : (
              <>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleQuickAdjust(-1)}
                  disabled={localQuantity < 1}
                  className="h-6 w-6 md:h-7 md:w-7 p-0 active:bg-accent"
                >
                  <Minus className="h-2.5 w-2.5 md:h-3 md:w-3" />
                </Button>
                <div
                  className="font-bold text-sm md:text-lg cursor-pointer hover:text-primary active:text-primary transition-colors min-w-[1.75rem] md:min-w-[2.5rem] text-center"
                  onClick={() => {
                    setShowInput(true);
                    setInputValue(localQuantity.toString());
                  }}
                  title="点击编辑"
                >
                  {localQuantity}
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleQuickAdjust(1)}
                  className="h-6 w-6 md:h-7 md:w-7 p-0 active:bg-accent"
                >
                  <Plus className="h-2.5 w-2.5 md:h-3 md:w-3" />
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
