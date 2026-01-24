'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { commonFamilies, uncommonFamilies } from '@/lib/db/default-colors';

type SelectionMode = 'common' | 'all' | 'custom';

export default function OnboardingForm() {
  const router = useRouter();
  const [mode, setMode] = useState<SelectionMode>('common');
  const [selectedFamilies, setSelectedFamilies] = useState<Set<string>>(
    new Set(commonFamilies)
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleModeChange = (newMode: SelectionMode) => {
    setMode(newMode);
    if (newMode === 'common') {
      setSelectedFamilies(new Set(commonFamilies));
    } else if (newMode === 'all') {
      setSelectedFamilies(new Set([...commonFamilies, ...uncommonFamilies]));
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

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/inventory/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          families: Array.from(selectedFamilies),
        }),
      });

      if (response.ok) {
        router.push('/inventory');
        router.refresh();
      } else {
        console.error('Failed to initialize inventory');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error initializing inventory:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">欢迎使用拼豆工坊</CardTitle>
          <CardDescription className="text-base">
            选择您拥有的拼豆颜色系列，我们将为您初始化库存
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Quick Selection */}
          <div className="space-y-3">
            <div className="text-sm font-medium">快速选择</div>
            <div className="grid gap-3">
              <Button
                variant={mode === 'common' ? 'default' : 'outline'}
                className="w-full justify-start h-auto py-4"
                onClick={() => handleModeChange('common')}
              >
                <div className="text-left">
                  <div className="font-semibold">常用系列 (221种颜色)</div>
                  <div className="text-xs opacity-80 mt-1">
                    包含 A, B, C, D, E, F, G, H, M 系列
                  </div>
                </div>
              </Button>
              <Button
                variant={mode === 'all' ? 'default' : 'outline'}
                className="w-full justify-start h-auto py-4"
                onClick={() => handleModeChange('all')}
              >
                <div className="text-left">
                  <div className="font-semibold">全部系列 (291种颜色)</div>
                  <div className="text-xs opacity-80 mt-1">
                    包含所有系列（ZG, A-M, P, Q, R, T, Y）
                  </div>
                </div>
              </Button>
              <Button
                variant={mode === 'custom' ? 'default' : 'outline'}
                className="w-full justify-start h-auto py-4"
                onClick={() => handleModeChange('custom')}
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

          {/* Custom Family Selection */}
          {mode === 'custom' && (
            <div className="space-y-3">
              <div className="text-sm font-medium">选择系列</div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <div className="text-xs text-muted-foreground font-medium">常用系列</div>
                  {commonFamilies.map((family) => (
                    <div key={family} className="flex items-center space-x-2">
                      <Checkbox
                        id={family}
                        checked={selectedFamilies.has(family)}
                        onCheckedChange={() => toggleFamily(family)}
                      />
                      <label
                        htmlFor={family}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {family} 系列
                      </label>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  <div className="text-xs text-muted-foreground font-medium">其他系列</div>
                  {uncommonFamilies.map((family) => (
                    <div key={family} className="flex items-center space-x-2">
                      <Checkbox
                        id={family}
                        checked={selectedFamilies.has(family)}
                        onCheckedChange={() => toggleFamily(family)}
                      />
                      <label
                        htmlFor={family}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {family} 系列
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Summary */}
          <div className="pt-4 border-t">
            <div className="text-sm text-muted-foreground mb-4">
              已选择 <span className="font-semibold text-foreground">{selectedFamilies.size}</span> 个系列
            </div>
            <Button
              onClick={handleSubmit}
              disabled={isLoading || selectedFamilies.size === 0}
              className="w-full"
              size="lg"
            >
              {isLoading ? '初始化中...' : '开始使用'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
