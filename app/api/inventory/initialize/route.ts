import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { initializeUserInventory } from '@/lib/db/seed-default-colors';

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    let families;
    try {
      const body = await request.json();
      families = body.families;
    } catch {
      // Empty body, use default families
      families = undefined;
    }

    // Initialize user inventory with selected families
    await initializeUserInventory(session.user.id!, families);

    return NextResponse.json({
      success: true,
      message: `Inventory initialized with ${families?.length || 'common'} families`
    });
  } catch (error) {
    console.error('Initialize inventory error:', error);
    return NextResponse.json(
      { message: 'An error occurred', error: String(error) },
      { status: 500 }
    );
  }
}
