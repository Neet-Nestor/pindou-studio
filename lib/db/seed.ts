import { db } from './index';
import { colorSets, colors } from './schema';
import fs from 'fs';
import path from 'path';

interface ColorData {
  code: string;
  nameEn: string;
  nameZh: string;
  hexColor: string;
}

interface ColorSetData {
  setName: string;
  brand: string;
  description: string;
  colors: ColorData[];
}

async function seed() {
  console.log('🌱 Starting database seed...');

  const colorDataPath = path.join(process.cwd(), 'public', 'color-data');
  const colorSetFiles = [
    'perler-standard-63.json',
    'hama-midi-48.json',
    'artkal-s-series.json',
    'dodo-standard-96.json',
  ];

  try {
    for (const file of colorSetFiles) {
      const filePath = path.join(colorDataPath, file);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const colorSetData: ColorSetData = JSON.parse(fileContent);

      console.log(`\n📦 Processing ${colorSetData.setName}...`);

      // Insert color set
      const [colorSet] = await db
        .insert(colorSets)
        .values({
          name: colorSetData.setName,
          brand: colorSetData.brand,
          description: colorSetData.description,
        })
        .returning();

      console.log(`✅ Created color set: ${colorSet.name} (${colorSet.id})`);

      // Insert colors
      const colorValues = colorSetData.colors.map((color) => ({
        code: color.code,
        name: color.nameZh,
        nameEn: color.nameEn,
        nameZh: color.nameZh,
        hexColor: color.hexColor,
        colorSetId: colorSet.id,
      }));

      await db.insert(colors).values(colorValues);

      console.log(`✅ Added ${colorValues.length} colors to ${colorSet.name}`);
    }

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
