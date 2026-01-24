import Link from 'next/link';
import { Metadata } from 'next';
import { db } from '@/lib/db';
import { buildHistory, users } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { PublicBuildCard } from '@/components/history/public-build-card';

export const metadata: Metadata = {
  title: '作品展示',
  description: '探索来自拼豆工坊社区的精彩拼豆作品，发现创意灵感，分享拼豆创作的乐趣。',
  openGraph: {
    title: '作品展示 - 拼豆工坊',
    description: '探索来自拼豆工坊社区的精彩拼豆作品',
    type: 'website',
  },
};

export default async function GalleryPage() {
  // Fetch public builds with user information including avatar
  const publicBuilds = await db
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
    .where(eq(buildHistory.isPublic, true))
    .orderBy(desc(buildHistory.completedAt))
    .limit(50);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              返回首页
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-primary">作品展示</h1>
          <div></div>
        </div>
      </header>

      {/* Gallery Grid */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight mb-2">社区作品</h2>
          <p className="text-muted-foreground">探索来自拼豆爱好者的精彩创作</p>
        </div>

        {publicBuilds.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-lg text-muted-foreground mb-4">还没有公开作品</p>
            <p className="text-sm text-muted-foreground">成为第一个分享作品的用户！</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {publicBuilds.map(({ build, user }) => (
              <PublicBuildCard key={build.id} build={build} author={user} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
