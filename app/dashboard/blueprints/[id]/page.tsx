import { redirect } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { blueprints } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Edit, Trash2, Package } from 'lucide-react';

interface BlueprintDetailPageProps {
  params: Promise<{
    id: string;
  }>;
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

export default async function BlueprintDetailPage({ params }: BlueprintDetailPageProps) {
  const session = await auth();
  const { id } = await params;

  const [blueprint] = await db
    .select()
    .from(blueprints)
    .where(
      and(
        eq(blueprints.id, id),
        eq(blueprints.createdBy, session!.user!.id)
      )
    );

  if (!blueprint) {
    redirect('/dashboard/blueprints');
  }

  const pieceRequirements = blueprint.pieceRequirements
    ? JSON.parse(blueprint.pieceRequirements)
    : {};

  const pieceEntries = Object.entries(pieceRequirements);
  const totalPieces = pieceEntries.reduce(
    (sum, [, count]) => sum + (count as number),
    0
  );

  async function handleDelete() {
    'use server';
    await db.delete(blueprints).where(eq(blueprints.id, id));
    redirect('/dashboard/blueprints');
  }

  return (
    <div className="container mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">{blueprint.name}</h1>
          {blueprint.difficulty && (
            <Badge
              variant="secondary"
              className={difficultyColors[blueprint.difficulty as keyof typeof difficultyColors]}
            >
              {difficultyLabels[blueprint.difficulty as keyof typeof difficultyLabels]}
            </Badge>
          )}
        </div>
        <div className="flex gap-2">
          <Link href={`/dashboard/blueprints/${blueprint.id}/edit`}>
            <Button variant="outline" size="sm">
              <Edit className="mr-2 h-4 w-4" />
              编辑
            </Button>
          </Link>
          <form action={handleDelete}>
            <Button variant="destructive" size="sm" type="submit">
              <Trash2 className="mr-2 h-4 w-4" />
              删除
            </Button>
          </form>
        </div>
      </div>

      {/* Image */}
      {blueprint.imageUrl && (
        <div className="aspect-video bg-muted rounded-lg overflow-hidden">
          <img
            src={blueprint.imageUrl}
            alt={blueprint.name}
            className="w-full h-full object-contain"
          />
        </div>
      )}

      {/* Description */}
      {blueprint.description && (
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-2">描述</h3>
            <p className="text-muted-foreground whitespace-pre-wrap">
              {blueprint.description}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Piece Requirements */}
      {pieceEntries.length > 0 && (
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">颗粒需求</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Package className="h-4 w-4" />
                <span>共 {totalPieces} 颗，{pieceEntries.length} 种颜色</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {pieceEntries.map(([code, qty]) => (
                <div
                  key={code}
                  className="flex items-center gap-2 px-3 py-2 bg-secondary rounded-md"
                >
                  <span className="font-medium">{code}</span>
                  <span className="text-muted-foreground">×</span>
                  <span>{qty as number}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tags */}
      {blueprint.tags && (
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-2">标签</h3>
            <div className="flex flex-wrap gap-2">
              {blueprint.tags.split(',').map((tag, idx) => (
                <Badge key={idx} variant="outline">
                  {tag.trim()}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
