'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  label?: string;
  fallbackHref?: string;
}

export function BackButton({ label = '返回', fallbackHref }: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else if (fallbackHref) {
      router.push(fallbackHref);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleBack}
      className="gap-2 hover:bg-accent"
    >
      <ArrowLeft className="h-4 w-4" />
      {label}
    </Button>
  );
}
