'use client';

import Link from 'next/link';
import { Blueprint } from '@/lib/db/schema';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package } from 'lucide-react';

interface BlueprintCardProps {
  blueprint: Blueprint;
}

const difficultyColors = {
  easy: 'bg-green-500/10 text-green-500',
  medium: 'bg-yellow-500/10 text-yellow-500',
  hard: 'bg-red-500/10 text-red-500',
};

const difficultyLabels = {
  easy: '简单',
  medium: '中等',
  hard: '困难',
};

export function BlueprintCard({ blueprint }: BlueprintCardProps) {
  const pieceCount = blueprint.pieceRequirements
    ? Object.values(JSON.parse(blueprint.pieceRequirements)).reduce(
        (sum: number, count) => sum + (count as number),
        0
      )
    : 0;

  return (
    <Link href={`/dashboard/blueprints/${blueprint.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
        {/* Image */}
        <div className="aspect-square bg-muted relative">
          {blueprint.imageUrl ? (
            <img
              src={blueprint.imageUrl}
              alt={blueprint.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
        </div>

        {/* Content */}
        <CardContent className="p-4 space-y-2">
          <h3 className="font-semibold line-clamp-2">{blueprint.name}</h3>
          {blueprint.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {blueprint.description}
            </p>
          )}
        </CardContent>

        {/* Footer */}
        <CardFooter className="p-4 pt-0 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Package className="h-4 w-4" />
            <span>{pieceCount} 颗</span>
          </div>
          {blueprint.difficulty && (
            <Badge
              variant="secondary"
              className={difficultyColors[blueprint.difficulty as keyof typeof difficultyColors]}
            >
              {difficultyLabels[blueprint.difficulty as keyof typeof difficultyLabels]}
            </Badge>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
}
