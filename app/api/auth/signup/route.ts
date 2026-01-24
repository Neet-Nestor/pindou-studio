import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { seedDefaultColors, initializeUserInventory } from '@/lib/db/seed-default-colors';

const signupSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = signupSchema.parse(body);

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    console.log('[signup] Hashing password for user:', email);
    console.log('[signup] Password length:', password.length);
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('[signup] Hashed password length:', hashedPassword.length);
    console.log('[signup] Hash starts with:', hashedPassword.substring(0, 7)); // Should be '$2a$10$' or '$2b$10$'

    // Ensure default colors are seeded
    await seedDefaultColors();

    // Create user
    console.log('[signup] Creating user in database...');
    const [newUser] = await db
      .insert(users)
      .values({
        name,
        email,
        password: hashedPassword,
      })
      .returning();

    console.log('[signup] User created successfully:', newUser.email);
    console.log('[signup] Stored password hash length:', newUser.password?.length);

    // Initialize user inventory with 221 default colors at quantity 0
    await initializeUserInventory(newUser.id);

    return NextResponse.json(
      {
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: error.issues[0].message },
        { status: 400 }
      );
    }

    console.error('Signup error:', error);
    return NextResponse.json(
      { message: 'An error occurred during signup' },
      { status: 500 }
    );
  }
}
