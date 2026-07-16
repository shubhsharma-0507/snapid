// app/api/photos/list/route.ts
import { auth } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import PassportPhoto from '@/models/PassportPhoto';
import { NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rate-limit';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const userId = (session.user as any).id;

    // Rate limit: 60 list requests per hour
    const rl = rateLimit(`list:${userId}`, { limit: 60, windowMs: 60 * 60 * 1000 });
    if (!rl.success) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });

    await connectDB();

    // Always filter by userId — IDOR prevention
    const photos = await PassportPhoto
      .find({ userId })
      .sort({ createdAt: -1 })
      .limit(50)
      .select('-__v'); // Don't expose internal fields

    return NextResponse.json({ success: true, photos });

  } catch (err: any) {
    console.error('List error:', err.message);
    return NextResponse.json({ error: 'Failed to load photos' }, { status: 500 });
  }
}