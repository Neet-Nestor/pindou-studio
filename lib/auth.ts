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
        const { email, password } = await loginSchema.parseAsync(credentials)

        // Find user by email
        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, email))
          .limit(1)

        if (!user || !user.password) {
          return null
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password)

        if (!isValidPassword) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
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
