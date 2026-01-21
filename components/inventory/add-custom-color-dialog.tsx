'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
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
  const t = useTranslations('customColor');
  const tCommon = useTranslations('common');
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    nameZh: '',
    nameEn: '',
    hexColor: '#808080',
    pieceId: '',
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
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to create color');
      }

      // Reset form and close dialog
      setFormData({
        code: '',
        nameZh: '',
        nameEn: '',
        hexColor: '#808080',
        pieceId: '',
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
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>
            Create a new custom color for your inventory
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="code">{t('code')} *</Label>
            <Input
              id="code"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              placeholder={t('codePlaceholder')}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pieceId">{t('pieceId')}</Label>
            <Input
              id="pieceId"
              value={formData.pieceId}
              onChange={(e) => setFormData({ ...formData, pieceId: e.target.value })}
              placeholder={t('pieceIdHelp')}
            />
            <p className="text-xs text-muted-foreground">
              {t('pieceIdHelp')}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="nameZh">{t('nameZh')} *</Label>
            <Input
              id="nameZh"
              value={formData.nameZh}
              onChange={(e) => setFormData({ ...formData, nameZh: e.target.value })}
              placeholder="例如: 自定义红色"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nameEn">{t('nameEn')}</Label>
            <Input
              id="nameEn"
              value={formData.nameEn}
              onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
              placeholder="e.g., Custom Red"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hexColor">{t('hexColor')} *</Label>
            <div className="flex gap-2">
              <Input
                id="hexColor"
                type="color"
                value={formData.hexColor}
                onChange={(e) => setFormData({ ...formData, hexColor: e.target.value })}
                className="w-20 h-10 p-1 cursor-pointer"
              />
              <Input
                value={formData.hexColor}
                onChange={(e) => setFormData({ ...formData, hexColor: e.target.value })}
                placeholder="#808080"
                pattern="^#[0-9A-Fa-f]{6}$"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="initialQuantity">{t('initialQuantity')}</Label>
            <Input
              id="initialQuantity"
              type="number"
              min="0"
              value={formData.initialQuantity}
              onChange={(e) => setFormData({ ...formData, initialQuantity: e.target.value })}
            />
          </div>

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
              {isLoading ? 'Creating...' : t('create')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
