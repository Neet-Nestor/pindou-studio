import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { buildHistory, users } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET() {
  try {
    // Fetch public builds with user information
    const publicBuilds = await db
      .select({
        build: buildHistory,
        user: {
          id: users.id,
          name: users.name,
        },
      })
      .from(buildHistory)
      .leftJoin(users, eq(buildHistory.userId, users.id))
      .where(eq(buildHistory.isPublic, true))
      .orderBy(desc(buildHistory.completedAt))
      .limit(50); // Limit to latest 50 public builds

    return NextResponse.json({ builds: publicBuilds }, { status: 200 });
  } catch (error) {
    console.error('Error fetching public builds:', error);
    return NextResponse.json(
      { error: 'Failed to fetch public builds' },
      { status: 500 }
    );
  }
}
