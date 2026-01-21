import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { colorSets } from '@/lib/db/schema';
import ColorSetSelector from '@/components/onboarding/color-set-selector';

export default async function OnboardingPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  // Fetch all available color sets
  const allColorSets = await db.select().from(colorSets);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-xl font-bold">选择您的拼豆颜色套装</h1>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">
              选择您的拼豆颜色套装
            </h2>
            <p className="text-lg text-muted-foreground">
              选择您拥有的拼豆颜色套装，我们会为您初始化库存
            </p>
          </div>

          <ColorSetSelector colorSets={allColorSets} userId={session.user.id} />
        </div>
      </main>
    </div>
  );
}
