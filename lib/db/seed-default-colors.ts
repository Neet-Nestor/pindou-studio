import { db } from './index';
import { colors, userHiddenColors } from './schema';
import { defaultColors, commonFamilies, colorFamilies } from './default-colors';
import { eq } from 'drizzle-orm';

// Seed the database with all default colors (291 total)
export async function seedDefaultColors() {
  try {
    // Check if colors already exist
    const existingColors = await db
      .select()
      .from(colors)
      .limit(1);

    if (existingColors.length > 0) {
      console.log('✓ Colors already seeded');
      return;
    }

    // Insert all colors (code is globally unique)
    const colorInserts = defaultColors.map((color) => ({
      code: color.code,
      hexColor: color.hexColor,
      userId: null, // System colors, not user-created
    }));

    await db.insert(colors).values(colorInserts);

    console.log(`✓ Seeded ${defaultColors.length} default colors`);
  } catch (error) {
    console.error('Error seeding default colors:', error);
    throw error;
  }
}

// Initialize user preferences by hiding unselected families
// No need to create inventory rows - they see all colors by default
export async function initializeUserInventory(userId: string, families?: readonly string[]) {
  try {
    // Default to common families if not specified
    const selectedFamilies = families || commonFamilies;

    // Ensure colors are seeded
    await seedDefaultColors();

    // Check if user already has hidden families configured
    const existingHidden = await db
      .select()
      .from(userHiddenColors)
      .where(eq(userHiddenColors.userId, userId))
      .limit(1);

    if (existingHidden.length > 0) {
      console.log('✓ User preferences already initialized');
      return;
    }

    // Hide families that were not selected
    const selectedFamilySet = new Set(selectedFamilies);
    const hiddenFamilies = colorFamilies.filter(f => !selectedFamilySet.has(f));

    if (hiddenFamilies.length > 0) {
      const hiddenFamilyInserts = hiddenFamilies.map((family) => ({
        userId,
        family,
        colorCode: null,
      }));

      await db.insert(userHiddenColors).values(hiddenFamilyInserts);

      console.log(`✓ User initialized with ${selectedFamilies.length} visible families, ${hiddenFamilies.length} hidden`);
    } else {
      console.log(`✓ User initialized with all families visible`);
    }
  } catch (error) {
    console.error('Error initializing user inventory:', error);
    throw error;
  }
}
