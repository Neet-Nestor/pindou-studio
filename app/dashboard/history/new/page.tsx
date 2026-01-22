import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { blueprints } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { BuildForm } from '@/components/history/build-form';

export default async function NewBuildPage() {
  const session = await auth();

  // Fetch user's blueprints for optional linking
  const userBlueprints = await db
    .select()
    .from(blueprints)
    .where(eq(blueprints.createdBy, session!.user!.id))
    .orderBy(desc(blueprints.createdAt));

  return (
    <div className="container mx-auto max-w-2xl space-y-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">记录作品</h2>
        <p className="text-sm text-muted-foreground">
          添加新的拼豆作品到历史记录
        </p>
      </div>

      <BuildForm mode="create" blueprints={userBlueprints} />
    </div>
  );
}
