// app/api/admin/users/route.ts
import { auth } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import PassportPhoto from '@/models/PassportPhoto';
import { NextRequest, NextResponse } from 'next/server';

function adminOnly(session: any) {
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if ((session.user as any).role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  return null;
}

// GET — list users with pagination
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const err = adminOnly(session); if (err) return err;

    const { searchParams } = new URL(req.url);
    const page   = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit  = Math.min(50, parseInt(searchParams.get('limit') || '20'));
    const search = searchParams.get('search') || '';
    const skip   = (page - 1) * limit;

    await connectDB();

    const query = search
      ? { $or: [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }] }
      : {};

    const [users, total] = await Promise.all([
      User.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).select('-passwordHash'),
      User.countDocuments(query),
    ]);

    // Get photo count per user
    const userIds = users.map(u => u._id);
    const photoCounts = await PassportPhoto.aggregate([
      { $match: { userId: { $in: userIds } } },
      { $group: { _id: '$userId', count: { $sum: 1 } } },
    ]);
    const photoMap = Object.fromEntries(photoCounts.map(p => [p._id.toString(), p.count]));

    const usersWithStats = users.map(u => ({
      ...u.toObject(),
      photoCount: photoMap[u._id.toString()] || 0,
    }));

    return NextResponse.json({ success: true, users: usersWithStats, total, page, pages: Math.ceil(total / limit) });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to load users' }, { status: 500 });
  }
}

// PATCH — update user role
export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    const err = adminOnly(session); if (err) return err;

    const { userId, role } = await req.json();
    if (!userId || !['user','admin'].includes(role)) return NextResponse.json({ error: 'Invalid request' }, { status: 400 });

    // Prevent self-demotion
    if (userId === (session!.user as any).id && role !== 'admin') {
      return NextResponse.json({ error: 'Cannot change your own role' }, { status: 400 });
    }

    await connectDB();
    const user = await User.findByIdAndUpdate(userId, { role }, { new: true }).select('-passwordHash');
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    return NextResponse.json({ success: true, user });
  } catch (err: any) {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}

// DELETE — delete user and all their photos
export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    const err = adminOnly(session); if (err) return err;

    const { userId } = await req.json();
    if (!userId) return NextResponse.json({ error: 'User ID required' }, { status: 400 });

    if (userId === (session!.user as any).id) {
      return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 });
    }

    await connectDB();
    await Promise.all([
      User.findByIdAndDelete(userId),
      PassportPhoto.deleteMany({ userId }),
    ]);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}