import Link from 'next/link';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { blueprints } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { BlueprintGrid } from '@/components/blueprints/blueprint-grid';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default async function BlueprintsPage() {
  const session = await auth();

  const userBlueprints = await db
    .select()
    .from(blueprints)
    .where(eq(blueprints.createdBy, session!.user!.id))
    .orderBy(desc(blueprints.createdAt));

  return (
    <div className="container mx-auto max-w-7xl space-y-6 px-6 py-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">
            图纸库
          </h1>
          <p className="text-muted-foreground">
            共 <span className="font-semibold text-foreground">{userBlueprints.length}</span> 个图纸
          </p>
        </div>
        <Link href="/dashboard/blueprints/new">
          <Button size="lg" className="shadow-lg hover:shadow-xl transition-all">
            <Plus className="mr-2 h-5 w-5" />
            添加图纸
          </Button>
        </Link>
      </div>

      <BlueprintGrid blueprints={userBlueprints} />
    </div>
  );
}
