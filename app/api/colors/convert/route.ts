import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { colorCatalog } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

// GET /api/colors/convert - Convert color between brands
// Query params: hex (required), targetBrand or targetBrands (required)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const hex = searchParams.get('hex');
    const targetBrand = searchParams.get('targetBrand');
    const targetBrands = searchParams.get('targetBrands')?.split(',');

    if (!hex) {
      return NextResponse.json(
        { error: 'hex parameter is required' },
        { status: 400 }
      );
    }

    if (!targetBrand && !targetBrands) {
      return NextResponse.json(
        { error: 'targetBrand or targetBrands parameter is required' },
        { status: 400 }
      );
    }

    const normalizedHex = hex.toLowerCase();

    // Single brand conversion
    if (targetBrand) {
      const color = await db.query.colorCatalog.findFirst({
        where: and(
          eq(colorCatalog.hexColor, normalizedHex),
          eq(colorCatalog.brand, targetBrand)
        ),
      });

      if (!color) {
        return NextResponse.json(
          { error: 'Color not found in target brand' },
          { status: 404 }
        );
      }

      return NextResponse.json(color);
    }

    // Multiple brands conversion
    if (targetBrands) {
      const colors = await db
        .select()
        .from(colorCatalog)
        .where(eq(colorCatalog.hexColor, normalizedHex));

      const filteredColors = colors.filter(c => targetBrands.includes(c.brand));

      return NextResponse.json(filteredColors);
    }
  } catch (error) {
    console.error('Error converting color:', error);
    return NextResponse.json(
      { error: 'Failed to convert color' },
      { status: 500 }
    );
  }
}
