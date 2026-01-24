import NextAuth from "next-auth"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { db } from "@/lib/db"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import { z } from "zod"
import bcrypt from "bcryptjs"
import { eq } from "drizzle-orm"
import { users } from "@/lib/db/schema"

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const { email, password } = await loginSchema.parseAsync(credentials)

          console.log('[auth] Login attempt for email:', email)

          // Find user by email
          const [user] = await db
            .select()
            .from(users)
            .where(eq(users.email, email))
            .limit(1)

          if (!user) {
            console.log('[auth] User not found:', email)
            return null
          }

          if (!user.password) {
            console.log('[auth] User has no password (OAuth user):', email)
            return null
          }

          console.log('[auth] User found, verifying password...')
          console.log('[auth] Stored hash length:', user.password?.length)
          console.log('[auth] Input password length:', password?.length)

          // Verify password
          const isValidPassword = await bcrypt.compare(password, user.password)

          console.log('[auth] Password validation result:', isValidPassword)

          if (!isValidPassword) {
            console.log('[auth] Invalid password for user:', email)
            return null
          }

          console.log('[auth] Login successful for user:', email)

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
          }
        } catch (error) {
          console.error('[auth] Authorization error:', error)
          return null
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub!
        session.user.name = token.name as string | null
        session.user.email = token.email as string
        session.user.image = token.picture as string | null
        session.user.role = token.role as string
      }
      return session
    },
    async jwt({ token, user, trigger, session }) {
      if (user && user.id) {
        token.sub = user.id
        token.name = user.name
        token.email = user.email
        token.picture = user.image

        // Fetch role from database
        const [dbUser] = await db
          .select()
          .from(users)
          .where(eq(users.id, user.id))
          .limit(1)

        token.role = dbUser?.role || 'user'
      }
      // Handle session updates (e.g., after profile update)
      if (trigger === "update" && session) {
        token.name = session.user.name
        token.picture = session.user.image
      }
      return token
    },
  },
  session: {
    strategy: "jwt",
  },
})
