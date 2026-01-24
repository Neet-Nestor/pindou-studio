import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { userSettings } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// GET /api/user/settings - Get user settings
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user settings
    const settings = await db.query.userSettings.findFirst({
      where: eq(userSettings.userId, session.user.id),
    });

    if (!settings) {
      // If no settings exist, create default settings
      const [newSettings] = await db.insert(userSettings).values({
        userId: session.user.id,
        primaryBrand: 'MARD',
        multiBrandEnabled: false,
        enabledBrands: '[]',
      }).returning();

      return NextResponse.json({
        ...newSettings,
        enabledBrands: JSON.parse(newSettings.enabledBrands || '[]'),
      });
    }

    return NextResponse.json({
      ...settings,
      enabledBrands: JSON.parse(settings.enabledBrands || '[]'),
    });
  } catch (error) {
    console.error('Error fetching user settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user settings' },
      { status: 500 }
    );
  }
}

// POST /api/user/settings - Update user settings
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { primaryBrand, multiBrandEnabled, enabledBrands } = body;

    // Validate input
    if (primaryBrand !== undefined && typeof primaryBrand !== 'string') {
      return NextResponse.json(
        { error: 'primaryBrand must be a string' },
        { status: 400 }
      );
    }

    if (multiBrandEnabled !== undefined && typeof multiBrandEnabled !== 'boolean') {
      return NextResponse.json(
        { error: 'multiBrandEnabled must be a boolean' },
        { status: 400 }
      );
    }

    if (enabledBrands !== undefined && !Array.isArray(enabledBrands)) {
      return NextResponse.json(
        { error: 'enabledBrands must be an array' },
        { status: 400 }
      );
    }

    // Check if settings exist
    const existingSettings = await db.query.userSettings.findFirst({
      where: eq(userSettings.userId, session.user.id),
    });

    if (existingSettings) {
      // Update existing settings
      const [updatedSettings] = await db
        .update(userSettings)
        .set({
          ...(primaryBrand !== undefined && { primaryBrand }),
          ...(multiBrandEnabled !== undefined && { multiBrandEnabled }),
          ...(enabledBrands !== undefined && { enabledBrands: JSON.stringify(enabledBrands) }),
          updatedAt: new Date(),
        })
        .where(eq(userSettings.userId, session.user.id))
        .returning();

      return NextResponse.json({
        ...updatedSettings,
        enabledBrands: JSON.parse(updatedSettings.enabledBrands || '[]'),
      });
    } else {
      // Create new settings
      const [newSettings] = await db.insert(userSettings).values({
        userId: session.user.id,
        primaryBrand: primaryBrand || 'MARD',
        multiBrandEnabled: multiBrandEnabled || false,
        enabledBrands: JSON.stringify(enabledBrands || []),
      }).returning();

      return NextResponse.json({
        ...newSettings,
        enabledBrands: JSON.parse(newSettings.enabledBrands || '[]'),
      });
    }
  } catch (error) {
    console.error('Error updating user settings:', error);
    return NextResponse.json(
      { error: 'Failed to update user settings' },
      { status: 500 }
    );
  }
}
