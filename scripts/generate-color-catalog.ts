import * as fs from 'fs';
import * as path from 'path';

// Brand catalog data - 14 brands total
const brandCatalog = [
  // Chinese brands (5)
  {
    id: 'MARD',
    name: 'Mard融合豆',
    region: 'chinese',
    sizes: '2.6mm, 5mm',
    description: '国内主流拼豆品牌，色彩丰富，质量稳定',
    website: null,
    displayOrder: 1
  },
  {
    id: 'COCO',
    name: 'COCO',
    region: 'chinese',
    sizes: '2.6mm, 5mm',
    description: '国产拼豆品牌',
    website: null,
    displayOrder: 2
  },
  {
    id: '漫漫',
    name: '漫漫',
    region: 'chinese',
    sizes: '2.6mm, 5mm',
    description: '国产拼豆品牌',
    website: null,
    displayOrder: 3
  },
  {
    id: '盼盼',
    name: '盼盼',
    region: 'chinese',
    sizes: '2.6mm, 5mm',
    description: '国产拼豆品牌',
    website: null,
    displayOrder: 4
  },
  {
    id: '咪小窝',
    name: '咪小窝',
    region: 'chinese',
    sizes: '2.6mm, 5mm',
    description: '国产拼豆品牌',
    website: null,
    displayOrder: 5
  },
  // International brands (9)
  {
    id: 'HAMA',
    name: 'Hama',
    region: 'international',
    sizes: '2.5mm (Mini), 5mm (Midi), 10mm (Maxi)',
    description: 'Danish brand, high quality perler beads',
    website: 'https://www.hama.dk',
    displayOrder: 6
  },
  {
    id: 'PERLER',
    name: 'Perler',
    region: 'international',
    sizes: '5mm',
    description: 'American brand, popular in North America',
    website: 'https://www.perler.com',
    displayOrder: 7
  },
  {
    id: 'PERLER_MINI',
    name: 'Perler Mini',
    region: 'international',
    sizes: '2.5mm',
    description: 'Mini version of Perler beads',
    website: 'https://www.perler.com',
    displayOrder: 8
  },
  {
    id: 'NABBI',
    name: 'Nabbi',
    region: 'international',
    sizes: '5mm',
    description: 'European bead brand',
    website: null,
    displayOrder: 9
  },
  {
    id: 'ARTKAL_S',
    name: 'Artkal-S',
    region: 'international',
    sizes: '2.6mm',
    description: 'Artkal soft series - mini beads',
    website: 'https://www.artkal.com',
    displayOrder: 10
  },
  {
    id: 'ARTKAL_R',
    name: 'Artkal-R',
    region: 'international',
    sizes: '5mm',
    description: 'Artkal regular series - standard size',
    website: 'https://www.artkal.com',
    displayOrder: 11
  },
  {
    id: 'ARTKAL_C',
    name: 'Artkal-C',
    region: 'international',
    sizes: '5mm',
    description: 'Artkal clear series - translucent beads',
    website: 'https://www.artkal.com',
    displayOrder: 12
  },
  {
    id: 'ARTKAL_A',
    name: 'Artkal-A',
    region: 'international',
    sizes: '5mm',
    description: 'Artkal special series',
    website: 'https://www.artkal.com',
    displayOrder: 13
  }
];

// Normalize hex color
function normalizeHex(hex: string): string {
  // Remove # if present
  hex = hex.replace('#', '').toLowerCase();
  // Ensure 6 characters
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('');
  }
  return '#' + hex;
}

// Load Chinese brand data from colorSystemMapping.json
function loadChineseBrands(): Map<string, Record<string, string>> {
  const filePath = path.join(__dirname, '../perler-beads-ref/colorSystemMapping.json');
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  const colorMap = new Map<string, Record<string, string>>();

  for (const [hex, brands] of Object.entries(data)) {
    const normalizedHex = normalizeHex(hex);
    colorMap.set(normalizedHex, brands as Record<string, string>);
  }

  return colorMap;
}

// Parse international brands from palette.v2.1.js
function loadInternationalBrands(): Map<string, Map<string, string>> {
  const filePath = path.join(__dirname, '../fuse-bead-tool-ref/palette.v2.1.js');
  const content = fs.readFileSync(filePath, 'utf-8');

  const brandMap = new Map<string, Map<string, string>>();

  // Map brand names in file to our brand IDs
  const brandNameMapping: Record<string, string> = {
    'mard': 'MARD',
    'hama': 'HAMA',
    'perler': 'PERLER',
    'perler-mini': 'PERLER_MINI',
    'nabbi': 'NABBI',
    'artkal-s': 'ARTKAL_S',
    'artkal-r': 'ARTKAL_R',
    'artkal-c': 'ARTKAL_C',
    'artkal-a': 'ARTKAL_A',
  };

  // Parse each palette
  for (const [fileBrandName, brandId] of Object.entries(brandNameMapping)) {
    if (fileBrandName === 'mard') continue; // Skip MARD, we have it from Chinese brands

    const regex = new RegExp(`allPalettes\\.set\\("${fileBrandName}",\\s*\\[([^\\]]+)\\]`, 's');
    const match = content.match(regex);

    if (match) {
      const paletteData = match[1];
      const colorRegex = /\{\s*name:\s*'([^']+)',\s*color:\s*'([^']+)'\s*\}/g;

      const colors = new Map<string, string>();
      let colorMatch;

      while ((colorMatch = colorRegex.exec(paletteData)) !== null) {
        const code = colorMatch[1];
        const hex = normalizeHex(colorMatch[2]);
        colors.set(hex, code);
      }

      brandMap.set(brandId, colors);
    }
  }

  return brandMap;
}

// Generate color catalog
function generateColorCatalog() {
  console.log('Loading color data...');

  const chineseBrands = loadChineseBrands();
  const internationalBrands = loadInternationalBrands();

  console.log(`Loaded ${chineseBrands.size} colors from Chinese brands`);
  console.log(`Loaded ${internationalBrands.size} international brand palettes`);

  // Collect all unique hex colors
  const allHexColors = new Set<string>();

  // Add from Chinese brands
  for (const hex of chineseBrands.keys()) {
    allHexColors.add(hex);
  }

  // Add from international brands
  for (const brandColors of internationalBrands.values()) {
    for (const hex of brandColors.keys()) {
      allHexColors.add(hex);
    }
  }

  console.log(`Total unique hex colors: ${allHexColors.size}`);

  // Build color catalog entries
  const colorCatalog: Array<{
    hexColor: string;
    brand: string;
    code: string;
    category: string | null;
  }> = [];

  // Process Chinese brands
  for (const [hex, brands] of chineseBrands) {
    for (const brandId of ['MARD', 'COCO', '漫漫', '盼盼', '咪小窝']) {
      const code = brands[brandId];
      if (code && code !== '-') {
        colorCatalog.push({
          hexColor: hex,
          brand: brandId,
          code: code,
          category: null
        });
      }
    }
  }

  // Process international brands
  for (const [brandId, brandColors] of internationalBrands) {
    for (const [hex, code] of brandColors) {
      colorCatalog.push({
        hexColor: hex,
        brand: brandId,
        code: code,
        category: null
      });
    }
  }

  console.log(`Generated ${colorCatalog.length} color catalog entries`);

  return { brandCatalog, colorCatalog, uniqueColors: allHexColors.size };
}

// Generate SQL seed file
function generateSeedSQL() {
  const { brandCatalog, colorCatalog, uniqueColors } = generateColorCatalog();

  let sql = `-- Multi-brand color system seed data
-- Generated: ${new Date().toISOString()}
-- Total unique colors: ${uniqueColors}
-- Total catalog entries: ${colorCatalog.length}

-- Insert brand catalog (14 brands)
INSERT INTO brand_catalog (id, name, region, sizes, description, website, display_order) VALUES\n`;

  const brandValues = brandCatalog.map(brand => {
    const desc = brand.description ? `'${brand.description.replace(/'/g, "''")}'` : 'NULL';
    const website = brand.website ? `'${brand.website}'` : 'NULL';
    return `  ('${brand.id}', '${brand.name}', '${brand.region}', '${brand.sizes}', ${desc}, ${website}, ${brand.displayOrder})`;
  });

  sql += brandValues.join(',\n') + ';\n\n';

  // Insert color catalog
  sql += `-- Insert color catalog (${colorCatalog.length} entries)\n`;
  sql += `INSERT INTO color_catalog (hex_color, brand, code, category) VALUES\n`;

  const colorValues = colorCatalog.map(color => {
    const category = color.category ? `'${color.category}'` : 'NULL';
    return `  ('${color.hexColor}', '${color.brand}', '${color.code}', ${category})`;
  });

  sql += colorValues.join(',\n') + ';\n';

  // Write to file
  const outputPath = path.join(__dirname, 'seed-color-catalog.sql');
  fs.writeFileSync(outputPath, sql, 'utf-8');

  console.log(`\n✓ SQL seed file generated: ${outputPath}`);
  console.log(`  - ${brandCatalog.length} brands`);
  console.log(`  - ${colorCatalog.length} color mappings`);
  console.log(`  - ${uniqueColors} unique hex colors`);
}

// Run generation
try {
  generateSeedSQL();
} catch (error) {
  console.error('Error generating color catalog:', error);
  process.exit(1);
}
