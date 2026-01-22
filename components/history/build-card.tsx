'use client';

import Link from 'next/link';
import { BuildHistory } from '@/lib/db/schema';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Calendar, Package } from 'lucide-react';

interface BuildCardProps {
  build: BuildHistory;
}

export function BuildCard({ build }: BuildCardProps) {
  const imageUrls = build.imageUrls ? JSON.parse(build.imageUrls) : [];
  const piecesUsed = build.piecesUsed ? JSON.parse(build.piecesUsed) : {};
  const pieceCount = Object.values(piecesUsed).reduce(
    (sum: number, count) => sum + (count as number),
    0
  );

  const completedDate = new Date(build.completedAt).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Link href={`/dashboard/history/${build.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer flex flex-col">
        {/* Image Gallery */}
        <div className="aspect-video bg-muted relative flex-shrink-0">
          {imageUrls.length > 0 ? (
            <div className="grid grid-cols-2 h-full">
              <img
                src={imageUrls[0]}
                alt={build.title}
                className={`w-full h-full object-cover ${imageUrls.length === 1 ? 'col-span-2' : ''}`}
              />
              {imageUrls[1] && (
                <img
                  src={imageUrls[1]}
                  alt={build.title}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
          {imageUrls.length > 2 && (
            <div className="absolute bottom-2 right-2 bg-background/80 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-medium">
              +{imageUrls.length - 2}
            </div>
          )}
        </div>

        {/* Content */}
        <CardContent className="p-4">
          <h3 className="font-semibold line-clamp-2 mb-2">{build.title}</h3>
          {build.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {build.description}
            </p>
          )}
        </CardContent>

        {/* Footer */}
        <CardFooter className="px-4 pb-4 pt-0 flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{completedDate}</span>
          </div>
          {pieceCount > 0 && (
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              <span>{pieceCount} 颗</span>
            </div>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
}
