import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { userHiddenColors } from '@/lib/db/schema';
import { and, eq, isNull } from 'drizzle-orm';
import { z } from 'zod';

const toggleColorSchema = z.object({
  colorCode: z.string().min(1),
  hidden: z.boolean(),
});

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { colorCode, hidden } = toggleColorSchema.parse(body);

    if (hidden) {
      // Add hidden color record (with colorCode, no family)
      await db.insert(userHiddenColors).values({
        userId: session.user.id!,
        family: null,
        colorCode,
      });
    } else {
      // Remove hidden color record
      await db
        .delete(userHiddenColors)
        .where(
          and(
            eq(userHiddenColors.userId, session.user.id!),
            eq(userHiddenColors.colorCode, colorCode),
            isNull(userHiddenColors.family)
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

    console.error('Toggle color error:', error);
    return NextResponse.json(
      { message: 'An error occurred' },
      { status: 500 }
    );
  }
}
