import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { blueprints } from '@/lib/db/schema';
import { eq, desc, like, or } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search');
    const difficulty = searchParams.get('difficulty');

    let query = db
      .select()
      .from(blueprints)
      .where(eq(blueprints.createdBy, session.user.id))
      .$dynamic();

    // Add search filter
    if (search) {
      query = query.where(
        or(
          like(blueprints.name, `%${search}%`),
          like(blueprints.description, `%${search}%`),
          like(blueprints.tags, `%${search}%`)
        )
      );
    }

    // Add difficulty filter
    if (difficulty && ['easy', 'medium', 'hard'].includes(difficulty)) {
      query = query.where(eq(blueprints.difficulty, difficulty));
    }

    const results = await query.orderBy(desc(blueprints.createdAt));

    return NextResponse.json({ blueprints: results }, { status: 200 });
  } catch (error) {
    console.error('Blueprint list error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blueprints' },
      { status: 500 }
    );
  }
}
