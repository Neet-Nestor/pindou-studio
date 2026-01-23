import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { blueprints } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch all public blueprints
    const allBlueprints = await db
      .select()
      .from(blueprints)
      .where(eq(blueprints.isPublic, true))
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
