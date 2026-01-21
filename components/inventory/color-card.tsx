'use client';

import { useState } from 'react';
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
  const [isUpdating, setIsUpdating] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [inputValue, setInputValue] = useState(item.quantity.toString());

  if (!item.color) return null;

  // Use customized values if available
  const displayCode = item.customization?.customCode || item.color.code;
  const displayHexColor = item.customization?.customHexColor || item.color.hexColor;
  const displayPieceId = item.customization?.pieceId;
  const colorName = item.customization?.customNameZh || item.color.nameZh || item.color.name;

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
      <div className="group border rounded-lg p-3 hover:border-primary/50 transition-colors bg-card relative">
        {/* Status badges - top right */}
        <div className="absolute top-2 right-2 flex gap-1">
          {isOutOfStock && (
            <Badge variant="destructive" className="text-[10px] h-4 px-1.5">
              缺货
            </Badge>
          )}
          {isLowStock && (
            <Badge className="text-[10px] h-4 px-1.5 bg-yellow-500 text-white border-yellow-600">
              低库存
            </Badge>
          )}
        </div>

        <div className="flex items-start gap-3">
          {/* Small color swatch - de-emphasized */}
          <div
            className="w-8 h-8 rounded border shrink-0 mt-1"
            style={{ backgroundColor: displayHexColor }}
          />

          {/* Main content - piece name emphasized */}
          <div className="flex-1 min-w-0 space-y-2">
            {/* Piece ID/Name - PROMINENT */}
            <div className="space-y-0.5">
              <div className="flex items-baseline gap-2">
                <span className="font-bold text-base truncate">
                  {displayPieceId || displayCode}
                </span>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                  onClick={() => setShowEditDialog(true)}
                >
                  <Edit2 className="h-3 w-3" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground truncate">
                {colorName}
              </p>
              {item.colorSet && (
                <p className="text-[10px] text-muted-foreground">
                  {item.colorSet.brand}
                </p>
              )}
            </div>

            {/* Quantity controls - compact */}
            <div className="flex items-center gap-2">
              {showInput ? (
                <>
                  <Input
                    type="number"
                    min="0"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleInputSubmit()}
                    onBlur={handleInputSubmit}
                    className="h-7 text-sm w-20"
                    autoFocus
                  />
                  <Button
                    size="sm"
                    onClick={handleInputSubmit}
                    disabled={isUpdating}
                    className="h-7 px-2"
                  >
                    确定
                  </Button>
                </>
              ) : (
                <>
                  <div
                    className="font-bold text-lg cursor-pointer hover:text-primary min-w-[2rem] text-center"
                    onClick={() => {
                      setShowInput(true);
                      setInputValue(item.quantity.toString());
                    }}
                  >
                    {item.quantity}
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleQuickAdjust(-1)}
                      disabled={isUpdating || item.quantity < 1}
                      className="h-7 w-7 p-0"
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleQuickAdjust(1)}
                      disabled={isUpdating}
                      className="h-7 w-7 p-0"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleQuickAdjust(5)}
                      disabled={isUpdating}
                      className="h-7 px-2"
                    >
                      +5
                    </Button>
                  </div>
                </>
              )}
            </div>
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
