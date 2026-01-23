'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Globe, Lock, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ShareToggleProps {
  buildId: string;
  initialIsPublic: boolean;
}

export function ShareToggle({ buildId, initialIsPublic }: ShareToggleProps) {
  const router = useRouter();
  const [isPublic, setIsPublic] = useState(initialIsPublic);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/history/${buildId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isPublic: !isPublic,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update public status');
      }

      setIsPublic(!isPublic);
      toast.success(isPublic ? '作品已设为私密' : '作品已公开');
      router.refresh();
    } catch (error) {
      toast.error('更新失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={isPublic ? "default" : "outline"}
      size="sm"
      onClick={handleToggle}
      disabled={isLoading}
      className={isPublic ? "bg-secondary hover:bg-secondary/90" : ""}
    >
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : isPublic ? (
        <Globe className="mr-2 h-4 w-4" />
      ) : (
        <Lock className="mr-2 h-4 w-4" />
      )}
      {isPublic ? '公开中' : '设为公开'}
    </Button>
  );
}
