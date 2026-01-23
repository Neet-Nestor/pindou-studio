import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { blueprints } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch all blueprints (all are public)
    const allBlueprints = await db
      .select()
      .from(blueprints)
      .orderBy(desc(blueprints.createdAt));

    return NextResponse.json(
      {
        blueprints: allBlueprints,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Blueprints fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blueprints' },
      { status: 500 }
    );
  }
}
