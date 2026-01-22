import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { userHiddenColors } from '@/lib/db/schema';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod';

const toggleFamilySchema = z.object({
  family: z.string().min(1),
  hidden: z.boolean(),
});

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { family, hidden } = toggleFamilySchema.parse(body);

    if (hidden) {
      // Add hidden family record
      await db.insert(userHiddenColors).values({
        userId: session.user.id!,
        family,
        colorCode: null, // null means hiding entire family
      });
    } else {
      // Remove hidden family record
      await db
        .delete(userHiddenColors)
        .where(
          and(
            eq(userHiddenColors.userId, session.user.id!),
            eq(userHiddenColors.family, family)
          )
        );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: error.issues[0].message },
        { status: 400 }
      );
    }

    console.error('Toggle family error:', error);
    return NextResponse.json(
      { message: 'An error occurred' },
      { status: 500 }
    );
  }
}
