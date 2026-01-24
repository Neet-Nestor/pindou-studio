'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Settings, Loader2, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';

interface BrandSettingsDialogProps {
  initialSettings: {
    primaryBrand: string;
    multiBrandEnabled: boolean;
    enabledBrands: string[];
  };
}

export function BrandSettingsDialog({ initialSettings }: BrandSettingsDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [brandSettings, setBrandSettings] = useState(initialSettings);
  const [brands, setBrands] = useState<Array<{ id: string; name: string; sizes: string; region: string }>>([]);
  const [chineseOpen, setChineseOpen] = useState(true);
  const [internationalOpen, setInternationalOpen] = useState(false);

  useEffect(() => {
    if (open) {
      fetchBrands();
    }
  }, [open]);

  const fetchBrands = async () => {
    try {
      const response = await fetch('/api/brands');
      if (!response.ok) throw new Error('Failed to fetch brands');

      const data = await response.json();
      setBrands(data);
    } catch (error) {
      console.error('Failed to fetch brands:', error);
    }
  };

  const handleSave = async () => {
    // Validation
    if (brandSettings.multiBrandEnabled && brandSettings.enabledBrands.length === 0) {
      toast.error('至少需要选择一个品牌');
      return;
    }

    setSaving(true);

    try {
      const response = await fetch('/api/user/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(brandSettings),
      });

      if (!response.ok) {
        throw new Error('Failed to update brand settings');
      }

      toast.success('品牌设置已更新');
      setOpen(false);

      // Refresh the page to show updated inventory
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '无法更新设置');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          品牌设置
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>拼豆品牌设置</DialogTitle>
          <DialogDescription>
            选择你常用的拼豆品牌和库存管理模式
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Multi-Brand Mode Toggle */}
          <div className="flex items-center justify-between space-x-4 rounded-lg border p-4">
            <div className="flex-1 space-y-1">
              <Label htmlFor="multi-brand" className="text-base">
                多品牌管理模式
              </Label>
              <p className="text-sm text-muted-foreground">
                开启后可以同时管理多个品牌的库存。如果你只使用一个品牌，建议保持关闭以获得更简洁的界面。
              </p>
            </div>
            <Switch
              id="multi-brand"
              checked={brandSettings.multiBrandEnabled}
              onCheckedChange={(checked) => {
                if (checked) {
                  // Switching to multi-brand: auto-enable primary brand if no brands enabled
                  const enabledBrands = brandSettings.enabledBrands.length === 0
                    ? [brandSettings.primaryBrand]
                    : brandSettings.enabledBrands;
                  setBrandSettings({
                    ...brandSettings,
                    multiBrandEnabled: true,
                    enabledBrands,
                  });
                } else {
                  // Switching to single-brand: clear enabled brands
                  setBrandSettings({
                    ...brandSettings,
                    multiBrandEnabled: false,
                    enabledBrands: [],
                  });
                }
              }}
              disabled={saving}
            />
          </div>

          {/* Brand Selection */}
          {!brandSettings.multiBrandEnabled ? (
            /* Single-brand mode: Radio selection */
            <div className="space-y-3">
              <Label>选择品牌</Label>
              <p className="text-sm text-muted-foreground">
                选择你使用的拼豆品牌
              </p>

              {/* Chinese Brands */}
              <Collapsible open={chineseOpen} onOpenChange={setChineseOpen}>
                <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border p-3 hover:bg-accent">
                  <span className="text-sm font-medium">国内品牌</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${chineseOpen ? 'rotate-180' : ''}`} />
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-3">
                  <RadioGroup
                    value={brandSettings.primaryBrand}
                    onValueChange={(value) =>
                      setBrandSettings({ ...brandSettings, primaryBrand: value })
                    }
                    disabled={saving}
                    className="grid grid-cols-1 md:grid-cols-2 gap-3"
                  >
                    {brands.filter(b => b.region === 'chinese').map((brand) => (
                      <div key={brand.id} className="flex items-center space-x-2">
                        <RadioGroupItem value={brand.id} id={`primary-${brand.id}`} />
                        <Label
                          htmlFor={`primary-${brand.id}`}
                          className="flex-1 cursor-pointer rounded-lg border p-3 hover:bg-accent"
                        >
                          <div className="font-medium">{brand.name}</div>
                          <div className="text-xs text-muted-foreground">{brand.sizes}</div>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </CollapsibleContent>
              </Collapsible>

              {/* International Brands */}
              <Collapsible open={internationalOpen} onOpenChange={setInternationalOpen}>
                <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border p-3 hover:bg-accent">
                  <span className="text-sm font-medium">国际品牌</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${internationalOpen ? 'rotate-180' : ''}`} />
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-3">
                  <RadioGroup
                    value={brandSettings.primaryBrand}
                    onValueChange={(value) =>
                      setBrandSettings({ ...brandSettings, primaryBrand: value })
                    }
                    disabled={saving}
                    className="grid grid-cols-1 md:grid-cols-2 gap-3"
                  >
                    {brands.filter(b => b.region === 'international').map((brand) => (
                      <div key={brand.id} className="flex items-center space-x-2">
                        <RadioGroupItem value={brand.id} id={`primary-${brand.id}`} />
                        <Label
                          htmlFor={`primary-${brand.id}`}
                          className="flex-1 cursor-pointer rounded-lg border p-3 hover:bg-accent"
                        >
                          <div className="font-medium">{brand.name}</div>
                          <div className="text-xs text-muted-foreground">{brand.sizes}</div>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </CollapsibleContent>
              </Collapsible>
            </div>
          ) : (
            /* Multi-brand mode: Checkbox selection */
            <div className="space-y-3">
              <Label>选择品牌</Label>
              <p className="text-sm text-muted-foreground">
                选择你想在库存中管理的品牌。至少需要选择一个品牌。
              </p>
              {brandSettings.enabledBrands.length === 0 && (
                <p className="text-sm text-destructive">
                  ⚠️ 至少需要选择一个品牌，否则库存将为空
                </p>
              )}

              {/* Chinese Brands */}
              <Collapsible open={chineseOpen} onOpenChange={setChineseOpen}>
                <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border p-3 hover:bg-accent">
                  <span className="text-sm font-medium">国内品牌</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${chineseOpen ? 'rotate-180' : ''}`} />
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {brands.filter(b => b.region === 'chinese').map((brand) => (
                      <div
                        key={brand.id}
                        className="flex items-center space-x-3 rounded-lg border p-3"
                      >
                        <Checkbox
                          id={`enable-${brand.id}`}
                          checked={brandSettings.enabledBrands.includes(brand.id)}
                          onCheckedChange={(checked) => {
                            const newEnabled = checked
                              ? [...brandSettings.enabledBrands, brand.id]
                              : brandSettings.enabledBrands.filter(b => b !== brand.id);
                            setBrandSettings({ ...brandSettings, enabledBrands: newEnabled });
                          }}
                          disabled={saving}
                        />
                        <Label
                          htmlFor={`enable-${brand.id}`}
                          className="flex-1 cursor-pointer"
                        >
                          <div className="font-medium text-sm">{brand.name}</div>
                          <div className="text-xs text-muted-foreground">{brand.sizes}</div>
                        </Label>
                      </div>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* International Brands */}
              <Collapsible open={internationalOpen} onOpenChange={setInternationalOpen}>
                <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border p-3 hover:bg-accent">
                  <span className="text-sm font-medium">国际品牌</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${internationalOpen ? 'rotate-180' : ''}`} />
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {brands.filter(b => b.region === 'international').map((brand) => (
                      <div
                        key={brand.id}
                        className="flex items-center space-x-3 rounded-lg border p-3"
                      >
                        <Checkbox
                          id={`enable-${brand.id}`}
                          checked={brandSettings.enabledBrands.includes(brand.id)}
                          onCheckedChange={(checked) => {
                            const newEnabled = checked
                              ? [...brandSettings.enabledBrands, brand.id]
                              : brandSettings.enabledBrands.filter(b => b !== brand.id);
                            setBrandSettings({ ...brandSettings, enabledBrands: newEnabled });
                          }}
                          disabled={saving}
                        />
                        <Label
                          htmlFor={`enable-${brand.id}`}
                          className="flex-1 cursor-pointer"
                        >
                          <div className="font-medium text-sm">{brand.name}</div>
                          <div className="text-xs text-muted-foreground">{brand.sizes}</div>
                        </Label>
                      </div>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={saving}
          >
            取消
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                保存中...
              </>
            ) : (
              '保存更改'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
