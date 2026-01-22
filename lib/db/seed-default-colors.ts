import { db } from './index';
import { colors, colorSets, userInventory } from './schema';
import { defaultColors } from './default-colors';
import { eq } from 'drizzle-orm';

// Seed the database with 221 default colors
export async function seedDefaultColors() {
  try {
    // Check if default color set already exists
    const existingSet = await db
      .select()
      .from(colorSets)
      .where(eq(colorSets.name, '221色标准套装'))
      .limit(1);

    let colorSetId: string;

    if (existingSet.length === 0) {
      // Create the default color set
      const [newSet] = await db
        .insert(colorSets)
        .values({
          name: '221色标准套装',
          brand: '标准',
          description: '221色标准拼豆套装，包含ZG、A-H、M、P、Q、R、T、Y等15个色系',
        })
        .returning();

      colorSetId = newSet.id;

      // Insert all 221 colors
      const colorInserts = defaultColors.map((color) => ({
        code: color.code,
        name: color.name,
        nameZh: color.name,
        hexColor: color.hexColor,
        colorSetId,
      }));

      await db.insert(colors).values(colorInserts);

      console.log('✓ Seeded 221 default colors');
    } else {
      colorSetId = existingSet[0].id;
      console.log('✓ Default color set already exists');
    }

    return colorSetId;
  } catch (error) {
    console.error('Error seeding default colors:', error);
    throw error;
  }
}

// Initialize a new user with all 221 default colors at quantity 0
export async function initializeUserInventory(userId: string) {
  try {
    // Get the default color set
    const colorSet = await db
      .select()
      .from(colorSets)
      .where(eq(colorSets.name, '221色标准套装'))
      .limit(1);

    if (colorSet.length === 0) {
      // Seed if not exists
      await seedDefaultColors();
    }

    // Get all colors from the default set
    const defaultColorSet = await db
      .select()
      .from(colorSets)
      .where(eq(colorSets.name, '221色标准套装'))
      .limit(1);

    if (defaultColorSet.length === 0) {
      throw new Error('Failed to find default color set');
    }

    const allDefaultColors = await db
      .select()
      .from(colors)
      .where(eq(colors.colorSetId, defaultColorSet[0].id));

    // Check if user already has inventory initialized
    const existingInventory = await db
      .select()
      .from(userInventory)
      .where(eq(userInventory.userId, userId))
      .limit(1);

    if (existingInventory.length > 0) {
      console.log('✓ User inventory already initialized');
      return;
    }

    // Insert all colors into user inventory at quantity 0
    const inventoryInserts = allDefaultColors.map((color) => ({
      userId,
      colorId: color.id,
      quantity: 0,
      customColor: false,
    }));

    await db.insert(userInventory).values(inventoryInserts);

    console.log(`✓ Initialized inventory for user ${userId} with ${allDefaultColors.length} colors`);
  } catch (error) {
    console.error('Error initializing user inventory:', error);
    throw error;
  }
}
