import { sql } from '@vercel/postgres';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function migrateExistingData() {
  try {
    console.log('Starting data migration...\n');

    // 1. Create user_settings for all existing users
    console.log('Step 1: Creating user_settings for existing users...');
    const result1 = await sql`
      INSERT INTO user_settings (user_id, primary_brand, multi_brand_enabled)
      SELECT id, 'MARD', false
      FROM users
      WHERE id NOT IN (SELECT user_id FROM user_settings)
    `;
    console.log(`  ✓ Created ${result1.rowCount} user_settings entries`);

    // 2. Update existing inventory items to have brand = 'MARD'
    console.log('\nStep 2: Updating existing inventory items with brand...');

    // First, get the hex colors from colors table and join with inventory
    const result2 = await sql`
      UPDATE user_inventory
      SET
        brand = 'MARD',
        hex_color = colors.hex_color
      FROM colors
      WHERE user_inventory.color_id = colors.id
        AND user_inventory.brand IS NULL
    `;
    console.log(`  ✓ Updated ${result2.rowCount} inventory items`);

    // 3. Verify the migration
    console.log('\nStep 3: Verifying migration...');

    const userSettingsCount = await sql`SELECT COUNT(*) as count FROM user_settings`;
    const usersCount = await sql`SELECT COUNT(*) as count FROM users`;
    const inventoryWithBrand = await sql`SELECT COUNT(*) as count FROM user_inventory WHERE brand IS NOT NULL`;
    const totalInventory = await sql`SELECT COUNT(*) as count FROM user_inventory`;

    console.log('\nVerification:');
    console.log(`  - ${userSettingsCount.rows[0].count}/${usersCount.rows[0].count} users have settings`);
    console.log(`  - ${inventoryWithBrand.rows[0].count}/${totalInventory.rows[0].count} inventory items have brand`);

    // 4. Check for any issues
    const missingSettings = await sql`
      SELECT COUNT(*) as count
      FROM users
      WHERE id NOT IN (SELECT user_id FROM user_settings)
    `;

    const missingBrand = await sql`
      SELECT COUNT(*) as count
      FROM user_inventory
      WHERE brand IS NULL
    `;

    if (missingSettings.rows[0].count > 0) {
      console.warn(`\n⚠ Warning: ${missingSettings.rows[0].count} users missing settings`);
    }

    if (missingBrand.rows[0].count > 0) {
      console.warn(`\n⚠ Warning: ${missingBrand.rows[0].count} inventory items missing brand`);
    }

    if (missingSettings.rows[0].count === 0 && missingBrand.rows[0].count === 0) {
      console.log('\n✓ Migration completed successfully with no issues!');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error during migration:', error);
    process.exit(1);
  }
}

migrateExistingData();
