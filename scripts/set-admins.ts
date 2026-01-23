import { db } from '../lib/db';
import { users } from '../lib/db/schema';
import { eq } from 'drizzle-orm';

const ADMIN_EMAILS = [
  'imba.qxy@gmail.com',
  'ccliu1945@gmail.com'
];

async function setAdmins() {
  console.log('Setting admin roles for specified users...\n');

  for (const email of ADMIN_EMAILS) {
    try {
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      if (!user) {
        console.log(`❌ User not found: ${email}`);
        continue;
      }

      if (user.role === 'admin') {
        console.log(`✓ Already admin: ${email}`);
        continue;
      }

      await db
        .update(users)
        .set({ role: 'admin' })
        .where(eq(users.email, email));

      console.log(`✅ Set admin role: ${email}`);
    } catch (error) {
      console.error(`❌ Error updating ${email}:`, error);
    }
  }

  console.log('\n✓ Done!');
  process.exit(0);
}

setAdmins();
