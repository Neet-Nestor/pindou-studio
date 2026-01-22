import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { seedDefaultColors, initializeUserInventory } from '@/lib/db/seed-default-colors';

export async function POST() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Ensure default colors are seeded
    await seedDefaultColors();

    // Initialize user inventory
    await initializeUserInventory(session.user.id!);

    return NextResponse.json({ success: true, message: 'Inventory initialized with 221 colors' });
  } catch (error) {
    console.error('Initialize inventory error:', error);
    return NextResponse.json(
      { message: 'An error occurred', error: String(error) },
      { status: 500 }
    );
  }
}
