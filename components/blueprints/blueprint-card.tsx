'use client';

import Link from 'next/link';
import { Blueprint } from '@/lib/db/schema';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, Sparkles } from 'lucide-react';

interface BlueprintCardProps {
  blueprint: Blueprint;
}

const difficultyConfig = {
  easy: {
    color: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    label: '✨ 简单',
  },
  medium: {
    color: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
    label: '⚡ 中等',
  },
  hard: {
    color: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30',
    label: '🔥 困难',
  },
};

export function BlueprintCard({ blueprint }: BlueprintCardProps) {
  const pieceCount = blueprint.pieceRequirements
    ? Object.values(JSON.parse(blueprint.pieceRequirements)).reduce(
        (sum: number, count) => sum + (count as number),
        0
      )
    : 0;

  return (
    <Link href={`/dashboard/blueprints/${blueprint.id}`} className="group">
      <Card className="overflow-hidden border-2 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 hover:border-primary/30 hover:scale-[1.02] bg-card/80 backdrop-blur">
        {/* Image with overlay gradient */}
        <div className="aspect-square bg-gradient-to-br from-muted to-muted/50 relative overflow-hidden">
          {blueprint.imageUrl ? (
            <>
              <img
                src={blueprint.imageUrl}
                alt={blueprint.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5">
              <div className="relative">
                <Package className="h-16 w-16 text-muted-foreground/40" />
                <Sparkles className="h-6 w-6 text-primary/60 absolute -top-2 -right-2 animate-pulse" />
              </div>
            </div>
          )}

          {/* Difficulty badge overlay */}
          {blueprint.difficulty && (
            <div className="absolute top-3 right-3">
              <Badge
                variant="secondary"
                className={`${difficultyConfig[blueprint.difficulty as keyof typeof difficultyConfig].color} font-semibold px-3 py-1 shadow-lg backdrop-blur-sm border`}
              >
                {difficultyConfig[blueprint.difficulty as keyof typeof difficultyConfig].label}
              </Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 space-y-3">
          <h3 className="font-bold text-lg line-clamp-2 group-hover:text-primary transition-colors">
            {blueprint.name}
          </h3>

          {blueprint.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {blueprint.description}
            </p>
          )}

          {/* Footer info */}
          <div className="flex items-center gap-2 pt-2 border-t border-border/50">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground/70">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Package className="h-4 w-4 text-primary" />
              </div>
              <span className="font-semibold">{pieceCount} 颗拼豆</span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
