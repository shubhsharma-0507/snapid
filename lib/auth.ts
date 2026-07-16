// lib/auth.ts
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { connectDB } from './db';
import User from '@/models/User';
import bcryptjs from 'bcryptjs';
import { rateLimit } from './rate-limit';
import { isValidEmail } from './validation';

export const { handlers, auth, signIn, signOut } = NextAuth({
   trustHost: true,   // ye line add karo
  providers: [
    Credentials({
      credentials: {
        email:    { label: 'Email',    type: 'email'    },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        const email    = (credentials?.email    as string || '').toLowerCase().trim();
        const password = credentials?.password  as string || '';

        if (!email || !password) throw new Error('Missing credentials');
        if (!isValidEmail(email)) throw new Error('Invalid email');

        // ── Brute-force protection ─────────────────────────────────────
        const rl = rateLimit(`login:${email}`, { limit: 5, windowMs: 15 * 60 * 1000 });
        if (!rl.success) {
          throw new Error('Too many login attempts. Try again in 15 minutes.');
        }

        await connectDB();
        const user = await User.findOne({ email });

        // Generic error — no user enumeration
        if (!user) throw new Error('Invalid credentials');

        const valid = await bcryptjs.compare(password, user.passwordHash);
        if (!valid) throw new Error('Invalid credentials');

        return {
          id:    user._id.toString(),
          email: user.email,
          name:  user.name,
          role:  user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id   = user.id;
        token.role = (user as any).role;
        token.name = user.name;
      }
      // Re-fetch name from DB on session update
      if (trigger === 'update') {
        try {
          await connectDB();
          const dbUser = await User.findById(token.id).select('name');
          if (dbUser) token.name = dbUser.name;
        } catch {}
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id   = token.id;
        (session.user as any).role = token.role;
        session.user.name          = token.name as string;
      }
      return session;
    },
  },
  pages:   { signIn: '/login' },
  session: { strategy: 'jwt', maxAge: 24 * 60 * 60 }, // 24 hours (was 30 days)
  cookies: {
    sessionToken: {
      options: {
        httpOnly: true,   // XSS protection
        sameSite: 'lax',  // CSRF protection
        secure:   process.env.NODE_ENV === 'production',
        path:     '/',
      },
    },
  },
});