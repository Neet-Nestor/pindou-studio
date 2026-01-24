import { MetadataRoute } from 'next';
import { db } from '@/lib/db';
import { buildHistory } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://pindou.neet.coffee';

  // Fetch all public builds for gallery
  const publicBuilds = await db
    .select({ id: buildHistory.id, updatedAt: buildHistory.updatedAt })
    .from(buildHistory)
    .where(eq(buildHistory.isPublic, true));

  const buildUrls = publicBuilds.map((build) => ({
    url: `${baseUrl}/gallery/${build.id}`,
    lastModified: build.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/signup`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/gallery`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    ...buildUrls,
  ];
}
