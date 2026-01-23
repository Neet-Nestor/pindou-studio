import { redirect } from 'next/navigation';
import Link from 'next/link';
import { db } from '@/lib/db';
import { buildHistory, users, blueprints } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Package, Calendar, ExternalLink, ArrowLeft } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface PublicBuildPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PublicBuildPage({ params }: PublicBuildPageProps) {
  const { id } = await params;

  // Fetch build with user info - only if public
  const [result] = await db
    .select({
      build: buildHistory,
      user: {
        id: users.id,
        name: users.name,
        image: users.image,
      },
    })
    .from(buildHistory)
    .leftJoin(users, eq(buildHistory.userId, users.id))
    .where(
      and(
        eq(buildHistory.id, id),
        eq(buildHistory.isPublic, true)
      )
    );

  if (!result) {
    redirect('/gallery');
  }

  const { build, user } = result;

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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/gallery">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              返回作品展示
            </Button>
          </Link>
          <Link href="/">
            <Button variant="ghost" size="sm">
              返回首页
            </Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto max-w-5xl space-y-6 p-6">
        {/* Header */}
        <div className="space-y-3">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{build.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8 border-2 border-primary">
                <AvatarImage src={user?.image || undefined} alt={user?.name || '匿名用户'} />
                <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                  {user?.name?.charAt(0).toUpperCase() || 'A'}
                </AvatarFallback>
              </Avatar>
              <span className="font-medium text-foreground">{user?.name || '匿名用户'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{completedDate}</span>
            </div>
            {totalPieces > 0 && (
              <div className="flex items-center gap-2 text-foreground">
                <Package className="h-4 w-4 text-primary" />
                <span className="font-semibold">{totalPieces} 颗拼豆</span>
              </div>
            )}
          </div>
        </div>

        {/* Image Gallery */}
        {imageUrls.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {imageUrls.map((url: string, index: number) => (
              <div
                key={index}
                className={`aspect-[4/3] bg-muted rounded-2xl overflow-hidden border-2 ${
                  index === 0 && imageUrls.length % 2 !== 0 ? 'md:col-span-2' : ''
                }`}
              >
                <img
                  src={url}
                  alt={`${build.title} - 图片 ${index + 1}`}
                  className="w-full h-full object-contain bg-muted"
                />
              </div>
            ))}
          </div>
        )}

        {/* Description */}
        {build.description && (
          <Card className="border-2">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">作品描述</h3>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {build.description}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Pieces Used */}
        {pieceEntries.length > 0 && (
          <Card className="border-2">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">使用的颗粒</h3>
                <span className="text-sm text-muted-foreground">
                  共 {pieceEntries.length} 种颜色
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {pieceEntries.map(([colorCode, count]) => (
                  <div
                    key={colorCode}
                    className="flex items-center justify-between p-3 rounded-xl bg-accent border"
                  >
                    <span className="font-mono text-sm font-medium">{colorCode}</span>
                    <span className="text-sm font-semibold">{count as number}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Linked Blueprint */}
        {linkedBlueprint && (
          <Card className="border-2 border-secondary/30 bg-secondary/5">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold mb-1">关联图纸</h3>
                  <p className="text-lg font-medium text-secondary">{linkedBlueprint.name}</p>
                  {linkedBlueprint.description && (
                    <p className="text-sm text-muted-foreground mt-2">
                      {linkedBlueprint.description}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
