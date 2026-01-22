'use client';

import { BuildHistory } from '@/lib/db/schema';
import { BuildCard } from './build-card';
import { Package } from 'lucide-react';

interface BuildHistoryTimelineProps {
  builds: BuildHistory[];
}

export function BuildHistoryTimeline({ builds }: BuildHistoryTimelineProps) {
  if (builds.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Package className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">还没有记录作品</h3>
        <p className="text-sm text-muted-foreground">
          开始创作你的第一个拼豆作品吧！
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {builds.map((build) => (
        <BuildCard key={build.id} build={build} />
      ))}
    </div>
  );
}
