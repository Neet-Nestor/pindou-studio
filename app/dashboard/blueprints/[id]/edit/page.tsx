import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { blueprints } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { BlueprintForm } from '@/components/blueprints/blueprint-form';

interface EditBlueprintPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditBlueprintPage({ params }: EditBlueprintPageProps) {
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

  return (
    <div className="container mx-auto max-w-2xl space-y-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">编辑图纸</h2>
        <p className="text-sm text-muted-foreground">
          修改图纸信息
        </p>
      </div>

      <BlueprintForm mode="edit" blueprint={blueprint} />
    </div>
  );
}
