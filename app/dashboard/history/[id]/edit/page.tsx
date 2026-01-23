import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { buildHistory, blueprints } from '@/lib/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { BuildForm } from '@/components/history/build-form';

interface EditBuildPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditBuildPage({ params }: EditBuildPageProps) {
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

  // Fetch user's blueprints for optional linking
  const userBlueprints = await db
    .select()
    .from(blueprints)
    .where(eq(blueprints.createdBy, session!.user!.id))
    .orderBy(desc(blueprints.createdAt));

  return (
    <div className="container mx-auto max-w-2xl space-y-6 px-6 py-8">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">编辑作品</h1>
        <p className="text-muted-foreground">
          修改作品信息
        </p>
      </div>

      <BuildForm mode="edit" build={build} blueprints={userBlueprints} />
    </div>
  );
}
