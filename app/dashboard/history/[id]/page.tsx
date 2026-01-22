import { redirect } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { buildHistory, blueprints } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Trash2, Package, Calendar, ExternalLink } from 'lucide-react';

interface BuildDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function BuildDetailPage({ params }: BuildDetailPageProps) {
  const session = await auth();
  const { id } = await params;

  const [build] = await db
    .select()
    .from(buildHistory)
    .where(
      and(
        eq(buildHistory.id, id),
        eq(buildHistory.userId, session!.user!.id)
      )
    );

  if (!build) {
    redirect('/dashboard/history');
  }

  // Fetch linked blueprint if exists
  let linkedBlueprint = null;
  if (build.blueprintId) {
    [linkedBlueprint] = await db
      .select()
      .from(blueprints)
      .where(eq(blueprints.id, build.blueprintId));
  }

  const imageUrls = build.imageUrls ? JSON.parse(build.imageUrls) : [];
  const piecesUsed = build.piecesUsed ? JSON.parse(build.piecesUsed) : {};
  const pieceEntries = Object.entries(piecesUsed);
  const totalPieces = pieceEntries.reduce(
    (sum, [, count]) => sum + (count as number),
    0
  );

  const completedDate = new Date(build.completedAt).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  async function handleDelete() {
    'use server';
    await db.delete(buildHistory).where(eq(buildHistory.id, id));
    redirect('/dashboard/history');
  }

  return (
    <div className="container mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">{build.title}</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{completedDate}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <form action={handleDelete}>
            <Button variant="destructive" size="sm" type="submit">
              <Trash2 className="mr-2 h-4 w-4" />
              删除
            </Button>
          </form>
        </div>
      </div>

      {/* Image Gallery */}
      {imageUrls.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {imageUrls.map((url: string, idx: number) => (
            <div
              key={idx}
              className={`aspect-square bg-muted rounded-lg overflow-hidden ${
                imageUrls.length === 1 ? 'sm:col-span-2' : ''
              }`}
            >
              <img
                src={url}
                alt={`${build.title} - 图 ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}

      {/* Description */}
      {build.description && (
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-2">描述</h3>
            <p className="text-muted-foreground whitespace-pre-wrap">
              {build.description}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Linked Blueprint */}
      {linkedBlueprint && (
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-2">关联图纸</h3>
            <Link
              href={`/dashboard/blueprints/${linkedBlueprint.id}`}
              className="flex items-center gap-2 text-primary hover:underline"
            >
              <span>{linkedBlueprint.name}</span>
              <ExternalLink className="h-4 w-4" />
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Pieces Used */}
      {pieceEntries.length > 0 && (
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">使用的颗粒</h3>
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
    </div>
  );
}
