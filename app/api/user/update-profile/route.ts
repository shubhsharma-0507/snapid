// app/api/user/update-profile/route.ts
import { auth } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import { NextRequest, NextResponse } from 'next/server';
import { sanitizeName, rateLimit, limits } from '@/lib/validation';

export async function PUT(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Rate limit: 10 profile updates per hour
    const userId = (session.user as any).id;
    const rl = rateLimit(`profile:${userId}`, { limit: 10, windowMs: 60 * 60 * 1000 });
    if (!rl.success) return NextResponse.json({ error: 'Too many updates. Try later.' }, { status: 429 });

    const { name } = await req.json();
    const cleanName = sanitizeName(name || '');

    if (cleanName.length < 2) {
      return NextResponse.json({ error: 'Name must be at least 2 characters' }, { status: 400 });
    }

    await connectDB();
    const user = await User.findByIdAndUpdate(
      userId,
      { name: cleanName },
      { new: true }
    );

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    return NextResponse.json({ success: true, name: user.name });
  } catch (err: any) {
    console.error('Update profile error:', err.message);
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}