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
    <div className="container mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">图纸库</h2>
          <p className="text-xs text-muted-foreground">
            共 {userBlueprints.length} 个图纸
          </p>
        </div>
        <Link href="/dashboard/blueprints/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            添加图纸
          </Button>
        </Link>
      </div>

      <BlueprintGrid blueprints={userBlueprints} />
    </div>
  );
}
