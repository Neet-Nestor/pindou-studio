import { db } from '../lib/db';
import { users } from '../lib/db/schema';

async function listUsers() {
  console.log('Fetching all users from database...\n');

  try {
    const allUsers = await db
      .select()
      .from(users);

    if (allUsers.length === 0) {
      console.log('No users found in the database.');
      process.exit(0);
    }

    console.log(`Found ${allUsers.length} user(s):\n`);
    console.log('─'.repeat(100));

    allUsers.forEach((user, index) => {
      console.log(`\n${index + 1}. User ID: ${user.id}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Name: ${user.name || 'N/A'}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Email Verified: ${user.emailVerified ? new Date(user.emailVerified).toISOString() : 'No'}`);
      console.log(`   Image: ${user.image || 'N/A'}`);
      console.log(`   Created At: ${new Date(user.createdAt).toISOString()}`);
      console.log('─'.repeat(100));
    });

    console.log(`\nTotal: ${allUsers.length} user(s)`);
  } catch (error) {
    console.error('❌ Error fetching users:', error);
    process.exit(1);
  }

  process.exit(0);
}

listUsers();
