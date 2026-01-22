'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Plus } from 'lucide-react';

interface PieceRequirementsInputProps {
  value: Record<string, number>;
  onChange: (value: Record<string, number>) => void;
  disabled?: boolean;
}

export function PieceRequirementsInput({
  value,
  onChange,
  disabled = false,
}: PieceRequirementsInputProps) {
  const [colorCode, setColorCode] = useState('');
  const [quantity, setQuantity] = useState('');

  const handleAdd = () => {
    if (!colorCode || !quantity) return;

    const qty = parseInt(quantity);
    if (isNaN(qty) || qty <= 0) return;

    onChange({
      ...value,
      [colorCode.toUpperCase()]: qty,
    });

    setColorCode('');
    setQuantity('');
  };

  const handleRemove = (code: string) => {
    const newValue = { ...value };
    delete newValue[code];
    onChange(newValue);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  const entries = Object.entries(value);
  const totalPieces = entries.reduce((sum, [, qty]) => sum + qty, 0);

  return (
    <div className="space-y-3">
      {/* Add New Item */}
      <div className="flex gap-2">
        <Input
          placeholder="颜色代码 (如: A5)"
          value={colorCode}
          onChange={(e) => setColorCode(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={disabled}
          className="w-32"
        />
        <Input
          type="number"
          placeholder="数量"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={disabled}
          className="w-24"
          min="1"
        />
        <Button
          type="button"
          onClick={handleAdd}
          disabled={disabled || !colorCode || !quantity}
          size="icon"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Current Items */}
      {entries.length > 0 && (
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {entries.map(([code, qty]) => (
              <div
                key={code}
                className="flex items-center gap-2 px-3 py-1.5 bg-secondary text-secondary-foreground rounded-md text-sm"
              >
                <span className="font-medium">{code}</span>
                <span className="text-muted-foreground">×</span>
                <span>{qty}</span>
                <button
                  type="button"
                  onClick={() => handleRemove(code)}
                  disabled={disabled}
                  className="ml-1 hover:text-destructive transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            共 {totalPieces} 颗拼豆，{entries.length} 种颜色
          </p>
        </div>
      )}
    </div>
  );
}
