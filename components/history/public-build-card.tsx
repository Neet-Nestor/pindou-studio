'use client';

import Link from 'next/link';
import { BuildHistory } from '@/lib/db/schema';
import { Card } from '@/components/ui/card';
import { Calendar, Package, Image as ImageIcon, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface PublicBuildCardProps {
  build: BuildHistory;
  author: {
    id: string;
    name: string | null;
    image?: string | null;
  } | null;
}

export function PublicBuildCard({ build, author }: PublicBuildCardProps) {
  const imageUrls = build.imageUrls ? JSON.parse(build.imageUrls) : [];
  const piecesUsed = build.piecesUsed ? JSON.parse(build.piecesUsed) : {};
  const pieceCount = Object.values(piecesUsed).reduce(
    (sum: number, count) => sum + (count as number),
    0
  );

  const completedDate = new Date(build.completedAt).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const authorName = author?.name || '匿名用户';
  const authorInitial = authorName.charAt(0).toUpperCase();

  return (
    <Link href={`/gallery/${build.id}`} className="group">
      <Card className="overflow-hidden border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-primary/30 bg-card backdrop-blur flex flex-col h-full">
        {/* Image Gallery with stagger effect */}
        <div className="aspect-video bg-gradient-to-br from-muted to-muted/50 relative overflow-hidden flex-shrink-0">
          {imageUrls.length > 0 ? (
            <div className="grid grid-cols-2 h-full gap-px">
              <div className={`relative ${imageUrls.length === 1 ? 'col-span-2' : ''}`}>
                <img
                  src={imageUrls[0]}
                  alt={build.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              {imageUrls[1] && (
                <div className="relative">
                  <img
                    src={imageUrls[1]}
                    alt={build.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              )}
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5">
              <div className="relative">
                <ImageIcon className="h-16 w-16 text-muted-foreground/40" />
              </div>
            </div>
          )}

          {/* Image count badge */}
          {imageUrls.length > 2 && (
            <div className="absolute bottom-2 right-2">
              <div className="bg-black/70 backdrop-blur-sm rounded-lg px-2.5 py-1 text-xs font-semibold text-white shadow-lg">
                +{imageUrls.length - 2} 张
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 space-y-2.5 flex-1 flex flex-col">
          <h3 className="font-semibold text-base line-clamp-2 group-hover:text-primary transition-colors leading-snug">
            {build.title}
          </h3>

          {build.description && (
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed flex-1">
              {build.description}
            </p>
          )}

          {/* Footer info */}
          <div className="space-y-2.5 pt-2.5 border-t mt-auto">
            {/* Author */}
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={author?.image || undefined} alt={authorName} />
                <AvatarFallback className="text-xs bg-secondary text-secondary-foreground">
                  {authorInitial}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs font-medium text-muted-foreground">{authorName}</span>
            </div>

            {/* Date and pieces */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                <span className="font-medium">{completedDate}</span>
              </div>
              {pieceCount > 0 && (
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Package className="h-3 w-3 text-primary" />
                  </div>
                  <span className="font-semibold text-foreground">{pieceCount} 颗</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
