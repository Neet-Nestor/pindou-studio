'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Share2, Check } from 'lucide-react';
import { toast } from 'sonner';

interface CopyLinkButtonProps {
  buildId: string;
}

export function CopyLinkButton({ buildId }: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const url = `${window.location.origin}/gallery/${buildId}`;

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('链接已复制到剪贴板');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('复制失败，请重试');
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleCopy}
      disabled={copied}
    >
      {copied ? (
        <>
          <Check className="mr-2 h-4 w-4 text-secondary" />
          已复制
        </>
      ) : (
        <>
          <Share2 className="mr-2 h-4 w-4" />
          分享链接
        </>
      )}
    </Button>
  );
}
