import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';

export default async function OnboardingPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  // Skip onboarding and go directly to inventory
  // Users will add their pieces manually
  redirect('/inventory');
}
