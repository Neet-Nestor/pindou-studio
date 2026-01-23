import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { buildHistory } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const builds = await db
      .select()
      .from(buildHistory)
      .where(eq(buildHistory.userId, session.user.id));

    const totalBuilds = builds.length;
    let totalPieces = 0;

    builds.forEach((build) => {
      if (build.piecesUsed) {
        const piecesUsed = JSON.parse(build.piecesUsed);
        const buildPieces = Object.values(piecesUsed).reduce(
          (sum: number, count) => sum + (count as number),
          0
        );
        totalPieces += buildPieces;
      }
    });

    return NextResponse.json(
      {
        totalBuilds,
        totalPieces,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Build history stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
