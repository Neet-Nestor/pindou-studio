'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface EditColorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  color: {
    id: string;
    code: string;
    name: string;
    nameEn: string | null;
    nameZh: string | null;
    hexColor: string;
  };
  customization?: {
    customCode: string | null;
    customName: string | null;
    customNameEn: string | null;
    customNameZh: string | null;
    customHexColor: string | null;
    pieceId: string | null;
    notes: string | null;
  } | null;
}

export default function EditColorDialog({
  open,
  onOpenChange,
  color,
  customization,
}: EditColorDialogProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    pieceId: customization?.pieceId || '',
    customHexColor: customization?.customHexColor || '',
    notes: customization?.notes || '',
  });

  useEffect(() => {
    if (open) {
      setFormData({
        pieceId: customization?.pieceId || '',
        customHexColor: customization?.customHexColor || '',
        notes: customization?.notes || '',
      });
    }
  }, [open, customization]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const payload = {
      colorId: color.id,
      pieceId: formData.pieceId || undefined,
      customHexColor: formData.customHexColor || undefined,
      notes: formData.notes || undefined,
    };

    try {
      const response = await fetch('/api/colors/customize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to customize color');
      }

      onOpenChange(false);
      router.refresh();
    } catch (error) {
      console.error('Error customizing color:', error);
      alert('保存失败: ' + (error instanceof Error ? error.message : '请重试'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>编辑 {color.code}</DialogTitle>
          <DialogDescription>
            自定义片号和备注
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Color preview */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <div
              className="w-16 h-16 rounded-lg border-2 border-border shadow-sm"
              style={{ backgroundColor: formData.customHexColor || color.hexColor }}
            />
            <div className="flex-1">
              <div className="font-mono text-lg font-bold">{color.code}</div>
            </div>
          </div>

          {/* Piece ID - main field */}
          <div className="space-y-2">
            <Label htmlFor="pieceId">拼豆片号</Label>
            <Input
              id="pieceId"
              value={formData.pieceId}
              onChange={(e) => setFormData({ ...formData, pieceId: e.target.value })}
              placeholder={color.code}
              className="text-base"
            />
          </div>

          {/* Custom hex color - optional */}
          <div className="space-y-2">
            <Label htmlFor="customHexColor">颜色调整 (可选)</Label>
            <div className="flex gap-2">
              <Input
                id="customHexColor"
                type="color"
                value={formData.customHexColor || color.hexColor}
                onChange={(e) => setFormData({ ...formData, customHexColor: e.target.value })}
                className="w-16 h-10 p-1 cursor-pointer"
              />
              <Input
                value={formData.customHexColor}
                onChange={(e) => setFormData({ ...formData, customHexColor: e.target.value })}
                placeholder={color.hexColor}
                className="flex-1 font-mono text-sm"
              />
            </div>
          </div>

          {/* Notes - optional */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="flex items-center justify-between">
              <span>备注 (可选)</span>
              <span className="text-xs text-muted-foreground">
                {formData.notes.length}/50
              </span>
            </Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value.slice(0, 50) })}
              placeholder="添加备注..."
              rows={2}
              maxLength={50}
              className="text-sm"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              取消
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? '保存中...' : '保存'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
