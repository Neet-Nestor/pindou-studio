import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { userInventory } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import OnboardingForm from '@/components/onboarding/onboarding-form';

export default async function OnboardingPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  // Check if user already has inventory
  const existingInventory = await db
    .select()
    .from(userInventory)
    .where(eq(userInventory.userId, session.user.id))
    .limit(1);

  // If user already has inventory, redirect to inventory page
  if (existingInventory.length > 0) {
    redirect('/inventory');
  }

  return <OnboardingForm userId={session.user.id} />;
}
