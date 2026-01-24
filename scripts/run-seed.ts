import { sql } from '@vercel/postgres';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function runSeed() {
  try {
    console.log('Reading seed SQL file...');
    const seedSQL = fs.readFileSync(
      path.join(__dirname, 'seed-color-catalog.sql'),
      'utf-8'
    );

    console.log('Executing seed SQL...');
    await sql.query(seedSQL);

    console.log('\n✓ Seed completed successfully!');
    console.log('  - Brand catalog populated');
    console.log('  - Color catalog populated');

    // Verify the data
    const brandCount = await sql`SELECT COUNT(*) as count FROM brand_catalog`;
    const colorCount = await sql`SELECT COUNT(*) as count FROM color_catalog`;

    console.log('\nVerification:');
    console.log(`  - ${brandCount.rows[0].count} brands in catalog`);
    console.log(`  - ${colorCount.rows[0].count} colors in catalog`);

    process.exit(0);
  } catch (error) {
    console.error('Error running seed:', error);
    process.exit(1);
  }
}

runSeed();
