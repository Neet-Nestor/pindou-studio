// This seed file is deprecated.
// Use seed-default-colors.ts to seed colors from default-colors.ts
// Run: npm run db:seed

import { seedDefaultColors } from './seed-default-colors';

async function seed() {
  console.log('🌱 Starting database seed...');

  try {
    await seedDefaultColors();
    console.log('\n✨ Database seed completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

seed()
  .catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
