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
    <div className="container mx-auto max-w-2xl space-y-6 px-6 py-8">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">记录作品</h1>
        <p className="text-muted-foreground">
          添加新的拼豆作品到历史记录
        </p>
      </div>

      <BuildForm mode="create" blueprints={userBlueprints} />
    </div>
  );
}
