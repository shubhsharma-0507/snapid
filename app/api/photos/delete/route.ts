// app/api/photos/delete/route.ts
import { auth } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import PassportPhoto from '@/models/PassportPhoto';
import { NextRequest, NextResponse } from 'next/server';
import { isValidObjectId, rateLimit } from '@/lib/validation';

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const userId = (session.user as any).id;

    // Rate limit: 30 deletes per hour
    const rl = rateLimit(`delete:${userId}`, { limit: 30, windowMs: 60 * 60 * 1000 });
    if (!rl.success) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });

    const { photoId } = await req.json();

    // Validate ObjectId format — prevents NoSQL injection
    if (!photoId || !isValidObjectId(photoId)) {
      return NextResponse.json({ error: 'Invalid photo ID' }, { status: 400 });
    }

    await connectDB();

    // IDOR fix — always filter by userId too
    const photo = await PassportPhoto.findOneAndDelete({
      _id:    photoId,
      userId: userId,   // User can only delete their OWN photos
    });

    if (!photo) return NextResponse.json({ error: 'Photo not found' }, { status: 404 });

    return NextResponse.json({ success: true });

  } catch (err: any) {
    console.error('Delete error:', err.message);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}