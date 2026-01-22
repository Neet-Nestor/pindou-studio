import { db } from '@/lib/db';
import {
  inventoryHistory,
  userInventory,
  userColorCustomizations,
  userHiddenColors,
  colors,
  colorSets,
} from '@/lib/db/schema';

async function cleanDatabase() {
  console.log('Starting database cleanup...');
  console.log('⚠️  This will delete all data except users!');

  const tables = [
    { name: 'inventory history', table: inventoryHistory },
    { name: 'user inventory', table: userInventory },
    { name: 'user color customizations', table: userColorCustomizations },
    { name: 'user hidden colors', table: userHiddenColors },
    { name: 'colors', table: colors },
    { name: 'color sets', table: colorSets },
  ];

  for (const { name, table } of tables) {
    try {
      console.log(`Deleting ${name}...`);
      await db.delete(table);
      console.log(`✅ Deleted ${name}`);
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'cause' in error) {
        const cause = (error as { cause?: { code?: string } }).cause;
        if (cause?.code === '42P01') {
          console.log(`⏭️  Skipped ${name} (table does not exist)`);
          continue;
        }
      }
      console.error(`❌ Error deleting ${name}:`, error);
      throw error;
    }
  }

  console.log('\n✅ Database cleanup complete! Users have been preserved.');
}

cleanDatabase();
