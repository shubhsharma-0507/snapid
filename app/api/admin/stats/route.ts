// app/api/admin/stats/route.ts
import { auth } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import PassportPhoto from '@/models/PassportPhoto';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if ((session.user as any).role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    await connectDB();

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart  = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalUsers, totalPhotos, totalCopies,
      usersToday, usersThisWeek, usersThisMonth,
      photosToday, photosThisWeek, photosThisMonth,
      countryStats, recentUsers, recentPhotos,
    ] = await Promise.all([
      User.countDocuments(),
      PassportPhoto.countDocuments(),
      PassportPhoto.aggregate([{ $group: { _id: null, total: { $sum: '$copies' } } }]),
      User.countDocuments({ createdAt: { $gte: todayStart } }),
      User.countDocuments({ createdAt: { $gte: weekStart } }),
      User.countDocuments({ createdAt: { $gte: monthStart } }),
      PassportPhoto.countDocuments({ createdAt: { $gte: todayStart } }),
      PassportPhoto.countDocuments({ createdAt: { $gte: weekStart } }),
      PassportPhoto.countDocuments({ createdAt: { $gte: monthStart } }),
      PassportPhoto.aggregate([{ $group: { _id: '$country', count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $limit: 6 }]),
      User.find().sort({ createdAt: -1 }).limit(5).select('name email role createdAt'),
      PassportPhoto.find().sort({ createdAt: -1 }).limit(5).populate('userId', 'name email').select('country copies backgroundColor createdAt userId'),
    ]);

    return NextResponse.json({
      success: true,
      stats: {
        users:  { total: totalUsers,  today: usersToday,  week: usersThisWeek,  month: usersThisMonth  },
        photos: { total: totalPhotos, today: photosToday, week: photosThisWeek, month: photosThisMonth },
        copies: totalCopies[0]?.total || 0,
        countryStats,
        recentUsers,
        recentPhotos,
      },
    });
  } catch (err: any) {
    console.error('Admin stats error:', err.message);
    return NextResponse.json({ error: 'Failed to load stats' }, { status: 500 });
  }
}