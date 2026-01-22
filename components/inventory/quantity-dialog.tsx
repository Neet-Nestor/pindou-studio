'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings } from 'lucide-react';

interface QuantityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentQuantity: number;
  pieceId: string;
  hexColor: string;
  onConfirm: (newQuantity: number) => void;
  onEditDetails: () => void;
}

export default function QuantityDialog({
  open,
  onOpenChange,
  currentQuantity,
  pieceId,
  hexColor,
  onConfirm,
  onEditDetails,
}: QuantityDialogProps) {
  const [inputValue, setInputValue] = useState('');

  // Calculate preview and error derived from inputValue
  const { preview, error } = (() => {
    if (!inputValue.trim()) {
      return { preview: null, error: '' };
    }

    const trimmed = inputValue.trim();

    // Check if it's a relative adjustment (+/-)
    if (trimmed.startsWith('+') || trimmed.startsWith('-')) {
      const isAdd = trimmed.startsWith('+');
      const numberPart = trimmed.slice(1).trim();
      const amount = parseInt(numberPart, 10);

      if (isNaN(amount)) {
        return { preview: null, error: '请输入有效数字' };
      }

      const result = isAdd ? currentQuantity + amount : currentQuantity - amount;

      if (result < 0) {
        return { preview: null, error: '数量不能为负数' };
      } else {
        return { preview: result, error: '' };
      }
    } else {
      // Direct set
      const amount = parseInt(trimmed, 10);

      if (isNaN(amount)) {
        return { preview: null, error: '请输入有效数字' };
      }

      if (amount < 0) {
        return { preview: null, error: '数量不能为负数' };
      } else {
        return { preview: amount, error: '' };
      }
    }
  })();

  // Reset input when dialog closes
  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange(newOpen);
    if (!newOpen) {
      // Clear input after dialog closes
      setTimeout(() => setInputValue(''), 150);
    }
  };

  const handleConfirm = () => {
    if (preview !== null && !error) {
      onConfirm(preview);
      handleOpenChange(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && preview !== null && !error) {
      handleConfirm();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="w-[calc(100%-2rem)] sm:w-full max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>更新数量</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                handleOpenChange(false);
                onEditDetails();
              }}
              className="h-8 gap-1.5"
            >
              <Settings className="h-3.5 w-3.5" />
              <span className="text-xs">编辑片号</span>
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Color preview */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <div
              className="w-12 h-12 rounded-md border-2 border-border shadow-sm flex-shrink-0"
              style={{ backgroundColor: hexColor }}
            />
            <div className="flex-1">
              <div className="font-mono text-base font-bold">{pieceId}</div>
              <div className="text-sm text-muted-foreground">当前: {currentQuantity} 颗</div>
            </div>
          </div>

          {/* Input field */}
          <div className="space-y-2">
            <Label htmlFor="quantity-input">新数量</Label>
            <Input
              id="quantity-input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="输入数字或 +50 / -15"
              autoFocus
              className="text-base"
            />
            <div className="text-xs text-muted-foreground space-y-1">
              <p>💡 <strong>提示：</strong>输入 +50 增加，-15 减少</p>
              <p className="pl-5">或直接输入数字设置精确值</p>
            </div>
          </div>

          {/* Preview */}
          {preview !== null && !error && (
            <div className="rounded-lg bg-primary/10 border border-primary/20 p-3">
              <div className="text-sm font-medium text-primary">
                {currentQuantity} → {preview} 颗
                {preview > currentQuantity && (
                  <span className="ml-2 text-green-600">(+{preview - currentQuantity})</span>
                )}
                {preview < currentQuantity && (
                  <span className="ml-2 text-orange-600">(-{currentQuantity - preview})</span>
                )}
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="text-sm text-destructive">
              {error}
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
          >
            取消
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={preview === null || !!error}
          >
            确认
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
