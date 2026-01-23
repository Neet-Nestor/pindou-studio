import Link from 'next/link';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { buildHistory } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { BuildHistoryTimeline } from '@/components/history/build-history-timeline';
import { StatsCard } from '@/components/dashboard/stats-card';
import { Button } from '@/components/ui/button';
import { Plus, Package, TrendingUp } from 'lucide-react';

export default async function HistoryPage() {
  const session = await auth();

  const builds = await db
    .select()
    .from(buildHistory)
    .where(eq(buildHistory.userId, session!.user!.id))
    .orderBy(desc(buildHistory.completedAt));

  // Calculate stats
  const totalBuilds = builds.length;
  let totalPieces = 0;

  builds.forEach((build) => {
    if (build.piecesUsed) {
      const piecesUsed = JSON.parse(build.piecesUsed);
      const buildPieces = Object.values(piecesUsed).reduce(
        (sum: number, count) => sum + (count as number),
        0
      );
      totalPieces += buildPieces;
    }
  });

  return (
    <div className="container mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight text-primary">
            我的作品
          </h2>
          <p className="text-sm text-muted-foreground">
            共 <span className="font-semibold text-foreground">{totalBuilds}</span> 个作品
          </p>
        </div>
        <Link href="/dashboard/history/new">
          <Button size="lg" className="shadow-lg hover:shadow-xl transition-all">
            <Plus className="mr-2 h-5 w-5" />
            记录作品
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        <StatsCard
          title="完成作品"
          value={totalBuilds}
          icon={TrendingUp}
          description="记录的作品总数"
        />
        <StatsCard
          title="使用颗粒"
          value={totalPieces.toLocaleString()}
          icon={Package}
          description="所有作品使用的拼豆总数"
        />
      </div>

      {/* Timeline */}
      <BuildHistoryTimeline builds={builds} />
    </div>
  );
}
