'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, ChevronLeft, Check, Package, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

// Brand data
const chineseBrands = [
  {
    id: 'MARD',
    name: 'Mard融合豆',
    description: '国内主流品牌',
    sizes: '2.6mm, 5mm',
    recommended: true,
    hasFamilies: true, // MARD uses A-M family system
  },
  {
    id: 'COCO',
    name: 'COCO',
    sizes: '2.6mm, 5mm',
  },
  {
    id: '漫漫',
    name: '漫漫',
    sizes: '2.6mm, 5mm',
  },
  {
    id: '盼盼',
    name: '盼盼',
    sizes: '2.6mm, 5mm',
  },
  {
    id: '咪小窝',
    name: '咪小窝',
    sizes: '2.6mm, 5mm',
  },
];

const internationalBrands = [
  {
    id: 'HAMA',
    name: 'Hama',
    sizes: 'Mini, Midi, Maxi',
  },
  {
    id: 'PERLER',
    name: 'Perler',
    sizes: '5mm',
  },
  {
    id: 'ARTKAL_R',
    name: 'Artkal Regular',
    sizes: '5mm',
  },
];

// MARD family presets
const mardCommonFamilies = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'M']; // 221 colors
const mardAllFamilies = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'M', 'P', 'Q', 'R', 'T', 'Y', 'ZG']; // 291 colors

type MardPreset = 'common' | 'all' | 'custom';


export default function OnboardingFormNew() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Step 1: Brand selection
  const [selectedBrand, setSelectedBrand] = useState('MARD');
  const [showInternational, setShowInternational] = useState(false);

  // Step 2: MARD family selection (only if MARD is selected)
  const [mardPreset, setMardPreset] = useState<MardPreset>('common');
  const [selectedFamilies, setSelectedFamilies] = useState<Set<string>>(
    new Set(mardCommonFamilies)
  );

  // Step 3: Multi-brand option
  const [enableMultiBrand, setEnableMultiBrand] = useState(false);

  const isMardSelected = selectedBrand === 'MARD';
  const totalSteps = isMardSelected ? 3 : 2;

  const handleMardPresetChange = (preset: MardPreset) => {
    setMardPreset(preset);
    if (preset === 'common') {
      setSelectedFamilies(new Set(mardCommonFamilies));
    } else if (preset === 'all') {
      setSelectedFamilies(new Set(mardAllFamilies));
    }
  };

  const toggleFamily = (family: string) => {
    const newSelected = new Set(selectedFamilies);
    if (newSelected.has(family)) {
      newSelected.delete(family);
    } else {
      newSelected.add(family);
    }
    setSelectedFamilies(newSelected);
  };

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      // Save user settings (brand + multi-brand mode + enabled brands)
      const settingsResponse = await fetch('/api/user/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          primaryBrand: selectedBrand,
          multiBrandEnabled: enableMultiBrand,
          enabledBrands: enableMultiBrand ? [selectedBrand] : [], // Enable primary brand by default
        }),
      });

      if (!settingsResponse.ok) {
        throw new Error('Failed to save settings');
      }

      // For MARD, initialize with selected families
      if (isMardSelected) {
        const inventoryResponse = await fetch('/api/inventory/initialize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            families: Array.from(selectedFamilies),
          }),
        });

        if (!inventoryResponse.ok) {
          throw new Error('Failed to initialize inventory');
        }
      }

      toast.success('设置完成！欢迎使用拼豆工坊');
      router.push('/dashboard/inventory');
      router.refresh();
    } catch (error) {
      console.error('Error during onboarding:', error);
      toast.error('初始化失败，请重试');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted/20">
      <Card className="w-full max-w-3xl shadow-xl">
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <div className="flex gap-2">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div
                  key={i + 1}
                  className={`h-2 rounded-full transition-all ${
                    (i + 1) === step
                      ? 'bg-primary w-24'
                      : (i + 1) < step
                      ? 'bg-primary/50 w-16'
                      : 'bg-muted w-16'
                  }`}
                />
              ))}
            </div>
            <Badge variant="outline">
              第 {step} / {totalSteps} 步
            </Badge>
          </div>
          <CardTitle className="text-3xl font-bold">
            {step === 1 && '选择你的拼豆品牌'}
            {step === 2 && (isMardSelected ? '选择颜色系列' : '完成设置')}
            {step === 3 && '完成设置'}
          </CardTitle>
          <CardDescription className="text-base">
            {step === 1 && '选择你主要使用的拼豆品牌，稍后可以在设置中更改'}
            {step === 2 && (isMardSelected ? '选择你拥有的Mard颜色系列' : '确认你的选择，马上就可以开始使用了')}
            {step === 3 && '确认你的选择，马上就可以开始使用了'}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Step 1: Brand Selection */}
          {step === 1 && (
            <div className="space-y-6">
              {/* Chinese Brands */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg">国内品牌</h3>
                  <Badge variant="secondary" className="gap-1">
                    <Sparkles className="h-3 w-3" />
                    推荐
                  </Badge>
                </div>
                <RadioGroup value={selectedBrand} onValueChange={setSelectedBrand}>
                  <div className="grid gap-3">
                    {chineseBrands.map((brand) => {
                      const isSelected = selectedBrand === brand.id;
                      return (
                        <div key={brand.id} className="relative">
                          <RadioGroupItem
                            value={brand.id}
                            id={brand.id}
                            className="sr-only"
                          />
                          <Label
                            htmlFor={brand.id}
                            className={`flex items-center gap-4 rounded-lg border-2 p-4 hover:bg-accent cursor-pointer transition-all ${
                              isSelected
                                ? 'border-primary bg-primary/5'
                                : 'border-muted bg-card'
                            }`}
                          >
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                              <Package className="h-6 w-6 text-primary" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <div className="font-semibold text-base">{brand.name}</div>
                                {brand.recommended && (
                                  <Badge variant="default" className="text-xs">
                                    推荐
                                  </Badge>
                                )}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {brand.description && <span>{brand.description} </span>}
                                {brand.sizes}
                              </div>
                            </div>
                            <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all ${
                              isSelected
                                ? 'border-primary bg-primary'
                                : 'border-muted-foreground'
                            }`}>
                              {isSelected && (
                                <Check className="h-3 w-3 text-primary-foreground" />
                              )}
                            </div>
                          </Label>
                        </div>
                      );
                    })}
                  </div>
                </RadioGroup>
              </div>

              {/* International Brands (Collapsible) */}
              <div className="space-y-3">
                <Button
                  variant="ghost"
                  onClick={() => setShowInternational(!showInternational)}
                  className="w-full justify-between"
                >
                  <span className="font-semibold">国际品牌</span>
                  <ChevronRight
                    className={`h-4 w-4 transition-transform ${
                      showInternational ? 'rotate-90' : ''
                    }`}
                  />
                </Button>

                {showInternational && (
                  <RadioGroup value={selectedBrand} onValueChange={setSelectedBrand}>
                    <div className="grid gap-3">
                      {internationalBrands.map((brand) => {
                        const isSelected = selectedBrand === brand.id;
                        return (
                          <div key={brand.id} className="relative">
                            <RadioGroupItem
                              value={brand.id}
                              id={brand.id}
                              className="sr-only"
                            />
                            <Label
                              htmlFor={brand.id}
                              className={`flex items-center gap-4 rounded-lg border-2 p-4 hover:bg-accent cursor-pointer transition-all ${
                                isSelected
                                  ? 'border-primary bg-primary/5'
                                  : 'border-muted bg-card'
                              }`}
                            >
                              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                                <Package className="h-6 w-6 text-muted-foreground" />
                              </div>
                              <div className="flex-1">
                                <div className="font-semibold text-base">{brand.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  {brand.sizes}
                                </div>
                              </div>
                              <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all ${
                                isSelected
                                  ? 'border-primary bg-primary'
                                  : 'border-muted-foreground'
                              }`}>
                                {isSelected && (
                                  <Check className="h-3 w-3 text-primary-foreground" />
                                )}
                              </div>
                            </Label>
                          </div>
                        );
                      })}
                    </div>
                  </RadioGroup>
                )}
              </div>
            </div>
          )}

          {/* Step 2: MARD Family Selection (only for MARD) */}
          {step === 2 && isMardSelected && (
            <>
              <div className="space-y-3">
                <div className="text-sm font-medium">快速选择</div>
                <div className="grid gap-3">
                  <Button
                    variant={mardPreset === 'common' ? 'default' : 'outline'}
                    className="w-full justify-start h-auto py-4"
                    onClick={() => handleMardPresetChange('common')}
                  >
                    <div className="text-left">
                      <div className="font-semibold">常用系列（221色）</div>
                      <div className="text-xs opacity-80 mt-1">
                        包含 A, B, C, D, E, F, G, H, M 系列
                      </div>
                    </div>
                  </Button>
                  <Button
                    variant={mardPreset === 'all' ? 'default' : 'outline'}
                    className="w-full justify-start h-auto py-4"
                    onClick={() => handleMardPresetChange('all')}
                  >
                    <div className="text-left">
                      <div className="font-semibold">全部系列（291色）</div>
                      <div className="text-xs opacity-80 mt-1">
                        包含所有系列（A-M, P, Q, R, T, Y, ZG）
                      </div>
                    </div>
                  </Button>
                  <Button
                    variant={mardPreset === 'custom' ? 'default' : 'outline'}
                    className="w-full justify-start h-auto py-4"
                    onClick={() => handleMardPresetChange('custom')}
                  >
                    <div className="text-left">
                      <div className="font-semibold">自定义选择</div>
                      <div className="text-xs opacity-80 mt-1">
                        手动选择您拥有的系列
                      </div>
                    </div>
                  </Button>
                </div>
              </div>

              {mardPreset === 'custom' && (
                <div className="space-y-3">
                  <div className="text-sm font-medium">选择系列</div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <div className="text-xs text-muted-foreground font-medium">
                        常用系列
                      </div>
                      {mardCommonFamilies.map((family) => (
                        <div key={family} className="flex items-center space-x-2">
                          <Checkbox
                            id={family}
                            checked={selectedFamilies.has(family)}
                            onCheckedChange={() => toggleFamily(family)}
                          />
                          <label
                            htmlFor={family}
                            className="text-sm font-medium leading-none cursor-pointer"
                          >
                            {family} 系列
                          </label>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-2">
                      <div className="text-xs text-muted-foreground font-medium">
                        其他系列
                      </div>
                      {mardAllFamilies.filter(f => !mardCommonFamilies.includes(f)).map((family) => (
                        <div key={family} className="flex items-center space-x-2">
                          <Checkbox
                            id={family}
                            checked={selectedFamilies.has(family)}
                            onCheckedChange={() => toggleFamily(family)}
                          />
                          <label
                            htmlFor={family}
                            className="text-sm font-medium leading-none cursor-pointer"
                          >
                            {family} 系列
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Step 2 or 3: Confirmation */}
          {((step === 2 && !isMardSelected) || (step === 3 && isMardSelected)) && (
            <div className="space-y-6">
              {/* Summary */}
              <div className="rounded-lg border bg-muted/50 p-6 space-y-4">
                <div>
                  <div className="text-sm text-muted-foreground">你的主要品牌</div>
                  <div className="text-lg font-semibold">
                    {[...chineseBrands, ...internationalBrands].find(
                      (b) => b.id === selectedBrand
                    )?.name}
                  </div>
                  {isMardSelected && (
                    <div className="text-sm text-muted-foreground mt-2">
                      已选择 {selectedFamilies.size} 个系列：{Array.from(selectedFamilies).join(', ')}
                    </div>
                  )}
                  {!isMardSelected && (
                    <div className="text-sm text-muted-foreground mt-2">
                      我们将为你显示该品牌的所有颜色
                    </div>
                  )}
                </div>
              </div>

              {/* Advanced: Multi-brand option */}
              <div className="rounded-lg border p-4">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="multi-brand"
                    checked={enableMultiBrand}
                    onCheckedChange={(checked) => setEnableMultiBrand(checked as boolean)}
                  />
                  <div className="flex-1">
                    <Label
                      htmlFor="multi-brand"
                      className="text-base font-medium cursor-pointer"
                    >
                      我使用多个品牌
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      开启后可以同时管理不同品牌的库存。大多数用户不需要此功能。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            {step > 1 && (
              <Button
                variant="outline"
                onClick={() => setStep(step - 1)}
                disabled={isLoading}
                className="gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                上一步
              </Button>
            )}

            {step < totalSteps ? (
              <Button
                onClick={() => setStep(step + 1)}
                disabled={step === 2 && isMardSelected && selectedFamilies.size === 0}
                className="ml-auto gap-2"
                size="lg"
              >
                下一步
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleComplete}
                disabled={isLoading}
                className="ml-auto gap-2"
                size="lg"
              >
                {isLoading ? '初始化中...' : '完成设置'}
                {!isLoading && <Check className="h-4 w-4" />}
              </Button>
            )}
          </div>

          {/* Helper text */}
          <div className="text-center text-xs text-muted-foreground">
            设置完成后可以随时在设置页面修改
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
