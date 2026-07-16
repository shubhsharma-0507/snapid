// app/api/user/change-password/route.ts
import { auth } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import bcryptjs from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';
import { validatePassword, rateLimit } from '@/lib/validation';

export async function PUT(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Rate limit: 5 password changes per hour
    const userId = (session.user as any).id;
    const rl = rateLimit(`changepw:${userId}`, { limit: 5, windowMs: 60 * 60 * 1000 });
    if (!rl.success) return NextResponse.json({ error: 'Too many attempts. Try later.' }, { status: 429 });

    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Both fields are required' }, { status: 400 });
    }

    // Validate new password strength
    const pwCheck = validatePassword(newPassword);
    if (!pwCheck.valid) {
      return NextResponse.json({ error: pwCheck.message }, { status: 400 });
    }

    // Prevent same password reuse
    if (currentPassword === newPassword) {
      return NextResponse.json({ error: 'New password must be different from current' }, { status: 400 });
    }

    await connectDB();
    const user = await User.findById(userId);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const valid = await bcryptjs.compare(currentPassword, user.passwordHash);
    // Generic error — no timing attack info
    if (!valid) return NextResponse.json({ error: 'Incorrect current password' }, { status: 400 });

    user.passwordHash = await bcryptjs.hash(newPassword, 12);
    await user.save();

    return NextResponse.json({ success: true, message: 'Password updated successfully' });
  } catch (err: any) {
    console.error('Change password error:', err.message);
    return NextResponse.json({ error: 'Password change failed' }, { status: 500 });
  }
}