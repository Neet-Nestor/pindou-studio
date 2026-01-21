'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

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
  inventoryId: string;
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
  inventoryId,
  customization,
}: EditColorDialogProps) {
  const t = useTranslations('customColor');
  const tCommon = useTranslations('common');
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    customCode: customization?.customCode || '',
    customNameZh: customization?.customNameZh || '',
    customNameEn: customization?.customNameEn || '',
    customHexColor: customization?.customHexColor || '',
    pieceId: customization?.pieceId || '',
    notes: customization?.notes || '',
  });

  useEffect(() => {
    if (open) {
      setFormData({
        customCode: customization?.customCode || '',
        customNameZh: customization?.customNameZh || '',
        customNameEn: customization?.customNameEn || '',
        customHexColor: customization?.customHexColor || '',
        pieceId: customization?.pieceId || '',
        notes: customization?.notes || '',
      });
    }
  }, [open, customization]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/colors/customize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          colorId: color.id,
          ...formData,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to customize color');
      }

      onOpenChange(false);
      router.refresh();
    } catch (error) {
      console.error('Error customizing color:', error);
      alert('Failed to customize color. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const hasCustomization =
    formData.customCode ||
    formData.customNameZh ||
    formData.customNameEn ||
    formData.customHexColor ||
    formData.pieceId ||
    formData.notes;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('editTitle')}</DialogTitle>
          <DialogDescription>
            Customize this color's information to match your actual beads
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Original color info */}
          <div className="bg-muted/50 p-3 rounded-lg space-y-2">
            <div className="text-sm font-medium">Original Color</div>
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded border-2 border-border"
                style={{ backgroundColor: color.hexColor }}
              />
              <div className="flex-1">
                <div className="font-mono text-sm font-semibold">{color.code}</div>
                <div className="text-xs text-muted-foreground">
                  {color.nameZh || color.name}
                </div>
                <div className="text-xs text-muted-foreground">{color.hexColor}</div>
              </div>
            </div>
          </div>

          {/* Custom code */}
          <div className="space-y-2">
            <Label htmlFor="customCode">
              {t('code')} <span className="text-muted-foreground">(optional override)</span>
            </Label>
            <Input
              id="customCode"
              value={formData.customCode}
              onChange={(e) => setFormData({ ...formData, customCode: e.target.value })}
              placeholder={color.code}
            />
          </div>

          {/* Piece ID */}
          <div className="space-y-2">
            <Label htmlFor="pieceId">{t('pieceId')}</Label>
            <Input
              id="pieceId"
              value={formData.pieceId}
              onChange={(e) => setFormData({ ...formData, pieceId: e.target.value })}
              placeholder={t('pieceIdHelp')}
            />
            <p className="text-xs text-muted-foreground">{t('pieceIdHelp')}</p>
          </div>

          {/* Custom Chinese name */}
          <div className="space-y-2">
            <Label htmlFor="customNameZh">
              {t('nameZh')} <span className="text-muted-foreground">(optional override)</span>
            </Label>
            <Input
              id="customNameZh"
              value={formData.customNameZh}
              onChange={(e) => setFormData({ ...formData, customNameZh: e.target.value })}
              placeholder={color.nameZh || color.name}
            />
          </div>

          {/* Custom English name */}
          <div className="space-y-2">
            <Label htmlFor="customNameEn">
              {t('nameEn')} <span className="text-muted-foreground">(optional override)</span>
            </Label>
            <Input
              id="customNameEn"
              value={formData.customNameEn}
              onChange={(e) => setFormData({ ...formData, customNameEn: e.target.value })}
              placeholder={color.nameEn || color.name}
            />
          </div>

          {/* Custom hex color */}
          <div className="space-y-2">
            <Label htmlFor="customHexColor">
              {t('hexColor')} <span className="text-muted-foreground">(optional override)</span>
            </Label>
            <div className="flex gap-2">
              <Input
                id="customHexColor"
                type="color"
                value={formData.customHexColor || color.hexColor}
                onChange={(e) => setFormData({ ...formData, customHexColor: e.target.value })}
                className="w-20 h-10 p-1 cursor-pointer"
              />
              <Input
                value={formData.customHexColor}
                onChange={(e) => setFormData({ ...formData, customHexColor: e.target.value })}
                placeholder={color.hexColor}
                pattern="^#[0-9A-Fa-f]{6}$"
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">{t('notes')}</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder={t('notesPlaceholder')}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              {tCommon('cancel')}
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : tCommon('save')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
