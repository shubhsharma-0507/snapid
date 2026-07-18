// lib/auth.ts
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { connectDB } from './db';
import User from '@/models/User';
import bcryptjs from 'bcryptjs';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email:    { label: 'Email',    type: 'email'    },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const email    = (credentials?.email    as string || '').toLowerCase().trim();
        const password = credentials?.password  as string || '';

        if (!email || !password) throw new Error('Missing credentials');

        await connectDB();
        const user = await User.findOne({ email });

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
      // Re-fetch name from DB only on explicit update() call
      if (trigger === 'update') {
        try {
          await connectDB();
          const dbUser = await User.findById(token.id).select('name role');
          if (dbUser) {
            token.name = dbUser.name;
            token.role = dbUser.role;
          }
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
  trustHost: true,
  session: {
    strategy:  'jwt',
    maxAge:    30 * 24 * 60 * 60,  // 30 days
    updateAge: 24 * 60 * 60,       // refresh token every 24h
  },
});