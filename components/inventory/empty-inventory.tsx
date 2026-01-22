'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function EmptyInventory() {
  const [isInitializing, setIsInitializing] = useState(false);
  const router = useRouter();

  const handleInitialize = async () => {
    setIsInitializing(true);
    try {
      const response = await fetch('/api/inventory/initialize', {
        method: 'POST',
      });

      if (response.ok) {
        router.refresh();
      } else {
        const data = await response.json();
        alert('初始化失败: ' + data.message);
      }
    } catch (error) {
      console.error('Initialize error:', error);
      alert('初始化失败');
    } finally {
      setIsInitializing(false);
    }
  };

  return (
    <div className="text-center py-12 space-y-4">
      <div className="text-5xl mb-2">📦</div>
      <h3 className="text-xl font-bold">库存为空</h3>
      <p className="text-sm text-muted-foreground max-w-md mx-auto">
        点击下方按钮初始化 221 色标准套装
      </p>
      <Button
        onClick={handleInitialize}
        disabled={isInitializing}
        size="lg"
      >
        {isInitializing ? '初始化中...' : '初始化 221 色套装'}
      </Button>
    </div>
  );
}
