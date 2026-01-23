import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { buildHistory } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const builds = await db
      .select()
      .from(buildHistory)
      .where(eq(buildHistory.userId, session.user.id))
      .orderBy(desc(buildHistory.completedAt));

    return NextResponse.json({ builds }, { status: 200 });
  } catch (error) {
    console.error('Build history list error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch build history' },
      { status: 500 }
    );
  }
}
