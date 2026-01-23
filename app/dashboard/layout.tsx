import { redirect } from 'next/navigation';
import { auth, signOut } from '@/lib/auth';
import { Sidebar } from '@/components/dashboard/sidebar';
import { DashboardHeader } from '@/components/dashboard/header';
import { SessionProvider } from '@/components/providers/session-provider';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  async function handleSignOut() {
    'use server';
    await signOut();
  }

  return (
    <SessionProvider>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <DashboardHeader
            onSignOut={handleSignOut}
            user={{
              name: session.user.name,
              image: session.user.image,
              role: session.user.role,
            }}
          />

          {/* Page Content */}
          <main className="flex-1 p-4 pb-20 md:pb-4">
            {children}
          </main>
        </div>
      </div>
    </SessionProvider>
  );
}
