'use client';

import { BuildHistory } from '@/lib/db/schema';
import { BuildCard } from './build-card';
import { Sparkles } from 'lucide-react';

interface BuildHistoryTimelineProps {
  builds: BuildHistory[];
}

export function BuildHistoryTimeline({ builds }: BuildHistoryTimelineProps) {
  if (builds.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <Sparkles className="relative h-16 w-16 text-primary/60" />
        </div>
        <h3 className="text-xl font-bold mb-2 text-primary">
          还没有记录作品
        </h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          开始创作你的第一个拼豆作品，记录每一次创作的精彩瞬间！
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {builds.map((build, index) => (
        <div
          key={build.id}
          style={{ animationDelay: `${index * 50}ms` }}
          className="animate-in fade-in slide-in-from-bottom-4"
        >
          <BuildCard build={build} />
        </div>
      ))}
    </div>
  );
}
