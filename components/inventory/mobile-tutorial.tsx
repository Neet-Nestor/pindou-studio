'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Info } from 'lucide-react';

interface MobileTutorialProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MobileTutorial({ open, onOpenChange }: MobileTutorialProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm w-[calc(100%-2rem)] sm:w-full">
        <DialogHeader>
          <DialogTitle>使用提示</DialogTitle>
          <DialogDescription>
            快速了解如何使用拼豆库存管理
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 text-sm">
          <div className="space-y-2">
            <div className="font-semibold flex items-center gap-2">
              📱 触摸操作
            </div>
            <ul className="space-y-1.5 text-muted-foreground">
              <li>• <strong>点击数量</strong> - 直接输入数字</li>
              <li>• <strong>点击 +/-</strong> - 增减数量</li>
              <li>• <strong>长按颜色</strong> - 编辑片号和备注</li>
            </ul>
          </div>

          <div className="space-y-2">
            <div className="font-semibold flex items-center gap-2">
              🔍 搜索和筛选
            </div>
            <ul className="space-y-1.5 text-muted-foreground">
              <li>• 使用搜索栏快速查找颜色</li>
              <li>• 按库存状态筛选</li>
              <li>• 按数量或代码排序</li>
            </ul>
          </div>

          <div className="space-y-2">
            <div className="font-semibold flex items-center gap-2">
              🎯 状态指示
            </div>
            <ul className="space-y-1.5 text-muted-foreground">
              <li>• <span className="inline-block w-2 h-2 rounded-full bg-red-500"></span> 红点 - 缺货</li>
              <li>• <span className="inline-block w-2 h-2 rounded-full bg-yellow-500"></span> 黄点 - 低库存 (1-10)</li>
              <li>• 无圆点 - 充足库存</li>
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} className="w-full">
            知道了
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function MobileTutorialBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  useEffect(() => {
    // Check if user has permanently dismissed the banner
    const isPermanentlyDismissed = localStorage.getItem('hideMobileTutorialPermanently') === 'true';
    const isMobile = window.innerWidth < 768;

    // Force show if ?tutorial=1 in URL (for testing)
    const forceShow = new URLSearchParams(window.location.search).get('tutorial') === '1';

    if ((forceShow || (!isPermanentlyDismissed && isMobile))) {
      // Show banner after a short delay
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    // Show confirmation dialog instead of directly dismissing
    setShowConfirmDialog(true);
  };

  const handleConfirmPermanent = () => {
    setShowBanner(false);
    setShowConfirmDialog(false);
    localStorage.setItem('hideMobileTutorialPermanently', 'true');
  };

  const handleConfirmTemporary = () => {
    setShowBanner(false);
    setShowConfirmDialog(false);
    // Don't set localStorage, so it shows again next time
  };

  const handleLearnMore = () => {
    setShowDialog(true);
  };

  if (!showBanner && !showConfirmDialog) return <MobileTutorial open={showDialog} onOpenChange={setShowDialog} />;

  return (
    <>
      {showBanner && (
        <div className="md:hidden bg-primary/10 border-b border-primary/20 px-4 py-3 animate-in slide-in-from-top">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div className="flex-1 space-y-1 min-w-0">
              <p className="text-sm font-medium">使用提示</p>
              <p className="text-xs text-muted-foreground">
                <strong>长按颜色</strong>可编辑片号 • 点击<strong>数量</strong>快速输入
              </p>
            </div>
            <div className="flex gap-1 flex-shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLearnMore}
                className="h-7 text-xs px-2"
              >
                详情
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDismiss}
                className="h-7 w-7 p-0"
              >
                ×
              </Button>
            </div>
          </div>
        </div>
      )}

      <MobileTutorial open={showDialog} onOpenChange={setShowDialog} />

      {/* Confirmation dialog for closing the banner */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="w-[calc(100%-2rem)] sm:w-full max-w-sm">
          <DialogHeader>
            <DialogTitle>隐藏提示</DialogTitle>
            <DialogDescription>
              是否永久隐藏此提示横幅？
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={handleConfirmTemporary}
              className="w-full sm:w-auto"
            >
              仅此次隐藏
            </Button>
            <Button
              onClick={handleConfirmPermanent}
              className="w-full sm:w-auto"
            >
              永久隐藏
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
