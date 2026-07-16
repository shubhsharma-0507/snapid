// app/api/auth/register/route.ts
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import bcryptjs from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, limits } from '@/lib/rate-limit';
import { isValidEmail, validatePassword, sanitizeName, getClientIP } from '@/lib/validation';

export async function POST(req: NextRequest) {
  try {
    // ── Rate limit: 3 registrations per hour per IP ──────────────────────
    const ip = getClientIP(req);
    const rl = rateLimit(`register:${ip}`, limits.register);
    if (!rl.success) {
      return NextResponse.json(
        { error: 'Too many registration attempts. Try again later.' },
        { status: 429, headers: { 'Retry-After': String(Math.ceil((rl.resetAt - Date.now()) / 1000)) } }
      );
    }

    const { email, password, name } = await req.json();

    // ── Input validation ─────────────────────────────────────────────────
    if (!email || !password || !name) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    const pwCheck = validatePassword(password);
    if (!pwCheck.valid) {
      return NextResponse.json({ error: pwCheck.message }, { status: 400 });
    }

    const cleanName = sanitizeName(name);
    if (cleanName.length < 2) {
      return NextResponse.json({ error: 'Name must be at least 2 characters' }, { status: 400 });
    }

    await connectDB();

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      // ── No user enumeration — generic message ────────────────────────
      return NextResponse.json(
        { error: 'Registration failed. Please try again or sign in.' },
        { status: 400 }
      );
    }

    const passwordHash = await bcryptjs.hash(password, 12);
    const user = await User.create({
      email:  email.toLowerCase().trim(),
      name:   cleanName,
      passwordHash,
      role:   'user',
    });

    return NextResponse.json(
      { success: true, data: { id: user._id, email: user.email, name: user.name } },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('Register error:', error.message);
    // Never expose internal error details
    return NextResponse.json({ error: 'Registration failed. Please try again.' }, { status: 500 });
  }
}