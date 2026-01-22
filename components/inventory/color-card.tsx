'use client';

import { useState, useEffect, useRef } from 'react';
import EditColorDialog from './edit-color-dialog';
import QuantityDialog from './quantity-dialog';

interface ColorCardProps {
  item: {
    id: string;
    quantity: number;
    customColor: boolean;
    color: {
      id: string;
      code: string;
      hexColor: string;
    } | null;
    customization: {
      id: string;
      customCode: string | null;
      customHexColor: string | null;
      pieceId: string | null;
      notes: string | null;
    } | null;
  };
  onQuantityUpdate: (itemId: string, newQuantity: number) => void;
  onHideColor: (colorCode: string) => void;
}

export default function ColorCard({ item, onQuantityUpdate }: ColorCardProps) {
  const [showQuantityDialog, setShowQuantityDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [localQuantity, setLocalQuantity] = useState(item.quantity);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pendingQuantityRef = useRef<number | null>(null);

  // Sync local quantity when item changes from parent
  useEffect(() => {
    setLocalQuantity(item.quantity);
  }, [item.quantity]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  if (!item.color) return null;

  // Use customized values if available
  const displayHexColor = item.customization?.customHexColor || item.color.hexColor;
  const displayPieceId = item.customization?.pieceId || item.color.code;

  const isLowStock = localQuantity > 0 && localQuantity < 10;
  const isOutOfStock = localQuantity === 0;

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

  return (
    <>
      <div
        className="group relative flex flex-col rounded-lg overflow-hidden border bg-card transition-all hover:shadow-lg hover:border-primary/50 cursor-pointer"
        onClick={() => setShowQuantityDialog(true)}
      >
        {/* Color swatch */}
        <div
          className="w-full aspect-square relative"
          style={{ backgroundColor: displayHexColor }}
        >
          {/* Status indicator */}
          {isOutOfStock && (
            <div className="absolute top-0.5 right-0.5 md:top-1 md:right-1 w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-red-500 border-2 border-white shadow-md" />
          )}
          {isLowStock && !isOutOfStock && (
            <div className="absolute top-0.5 right-0.5 md:top-1 md:right-1 w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-yellow-500 border-2 border-white shadow-md" />
          )}
        </div>

        {/* Info section - compact and beautiful */}
        <div className="px-2 py-2 md:px-2.5 md:py-2.5 bg-card flex flex-col items-center gap-1 md:gap-1.5">
          {/* Piece ID */}
          <div className="font-bold text-xs md:text-sm text-center truncate w-full" title={displayPieceId}>
            {displayPieceId}
          </div>

          {/* Quantity - large and prominent */}
          <div className="font-bold text-2xl md:text-3xl text-center text-primary transition-colors group-hover:text-primary/80">
            {localQuantity}
          </div>

          {/* Notes (if any) - shown on desktop only */}
          {item.customization?.notes && (
            <div className="hidden md:block text-[10px] text-muted-foreground text-center truncate w-full" title={item.customization.notes}>
              {item.customization.notes}
            </div>
          )}
        </div>
      </div>

      <QuantityDialog
        open={showQuantityDialog}
        onOpenChange={setShowQuantityDialog}
        currentQuantity={localQuantity}
        pieceId={displayPieceId}
        hexColor={displayHexColor}
        onConfirm={updateQuantity}
        onEditDetails={() => setShowEditDialog(true)}
      />

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
