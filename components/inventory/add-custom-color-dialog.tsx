'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface AddCustomColorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddCustomColorDialog({ open, onOpenChange }: AddCustomColorDialogProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    pieceId: '',
    hexColor: '#808080',
    initialQuantity: '0',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/colors/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: formData.pieceId, // Use pieceId as code
          nameZh: formData.pieceId, // Use pieceId as name
          pieceId: formData.pieceId,
          hexColor: formData.hexColor,
          initialQuantity: formData.initialQuantity,
          notes: formData.notes,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create color');
      }

      // Reset form and close dialog
      setFormData({
        pieceId: '',
        hexColor: '#808080',
        initialQuantity: '0',
        notes: '',
      });
      onOpenChange(false);
      router.refresh();
    } catch (error) {
      console.error('Error creating color:', error);
      alert('Failed to create color. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-[calc(100%-2rem)] sm:w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>添加自定义颜色</DialogTitle>
          <DialogDescription>
            添加新颜色到库存
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Color preview */}
          <div className="flex items-center justify-center p-4">
            <div
              className="w-24 h-24 rounded-lg border-2 border-border shadow-lg"
              style={{ backgroundColor: formData.hexColor }}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pieceId">拼豆片号 *</Label>
            <Input
              id="pieceId"
              value={formData.pieceId}
              onChange={(e) => setFormData({ ...formData, pieceId: e.target.value })}
              placeholder="例如: A1, B5, C12"
              required
              className="text-base"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hexColor">颜色 *</Label>
            <div className="flex gap-2">
              <Input
                id="hexColor"
                type="color"
                value={formData.hexColor}
                onChange={(e) => setFormData({ ...formData, hexColor: e.target.value })}
                className="w-16 h-10 p-1 cursor-pointer"
              />
              <Input
                value={formData.hexColor}
                onChange={(e) => setFormData({ ...formData, hexColor: e.target.value })}
                placeholder="#808080"
                className="flex-1 font-mono text-sm"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="initialQuantity">初始数量</Label>
            <Input
              id="initialQuantity"
              type="number"
              min="0"
              value={formData.initialQuantity}
              onChange={(e) => setFormData({ ...formData, initialQuantity: e.target.value })}
              className="text-base"
            />
          </div>

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
              {isLoading ? '创建中...' : '创建'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
