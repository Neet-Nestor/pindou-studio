import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { colorCatalog } from '@/lib/db/schema';
import { eq, and, or, like, inArray } from 'drizzle-orm';

// GET /api/colors/catalog - Search colors by hex, brand, or code
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const hex = searchParams.get('hex');
    const brand = searchParams.get('brand');
    const code = searchParams.get('code');
    const brands = searchParams.get('brands')?.split(','); // Multiple brands

    // Build query conditions
    const conditions = [];

    if (hex) {
      conditions.push(eq(colorCatalog.hexColor, hex.toLowerCase()));
    }

    if (brand) {
      conditions.push(eq(colorCatalog.brand, brand));
    }

    if (code) {
      conditions.push(like(colorCatalog.code, `%${code}%`));
    }

    if (brands && brands.length > 0) {
      conditions.push(inArray(colorCatalog.brand, brands));
    }

    // Execute query
    let colors;
    if (conditions.length > 0) {
      colors = await db
        .select()
        .from(colorCatalog)
        .where(and(...conditions))
        .limit(100);
    } else {
      // No filters - return first 100 colors
      colors = await db
        .select()
        .from(colorCatalog)
        .limit(100);
    }

    return NextResponse.json(colors);
  } catch (error) {
    console.error('Error searching color catalog:', error);
    return NextResponse.json(
      { error: 'Failed to search color catalog' },
      { status: 500 }
    );
  }
}
