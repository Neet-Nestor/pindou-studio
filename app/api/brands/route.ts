import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { brandCatalog } from '@/lib/db/schema';
import { asc } from 'drizzle-orm';

// GET /api/brands - List all available brands
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const region = searchParams.get('region'); // 'chinese' | 'international'

    const query = db.select().from(brandCatalog).orderBy(asc(brandCatalog.displayOrder));

    // Filter by region if specified
    if (region === 'chinese' || region === 'international') {
      const brands = await query;
      const filtered = brands.filter(brand => brand.region === region);
      return NextResponse.json(filtered);
    }

    const brands = await query;
    return NextResponse.json(brands);
  } catch (error) {
    console.error('Error fetching brands:', error);
    return NextResponse.json(
      { error: 'Failed to fetch brands' },
      { status: 500 }
    );
  }
}
