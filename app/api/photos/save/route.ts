// app/api/photos/save/route.ts
import { auth } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import PassportPhoto from '@/models/PassportPhoto';
import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { rateLimit, limits } from '@/lib/rate-limit';
import { isValidBase64Image, sanitizeString } from '@/lib/validation';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const ALLOWED_COUNTRIES = ['india','usa','uk','canada','australia','schengen','custom'];

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Rate limit: 30 saves per hour
    const userId = (session.user as any).id;
    const rl = rateLimit(`save:${userId}`, limits.save);
    if (!rl.success) return NextResponse.json({ error: 'Too many saves. Try later.' }, { status: 429 });

    const { processedImage, backgroundColor, country, copies } = await req.json();

    if (!processedImage) return NextResponse.json({ error: 'No image provided' }, { status: 400 });

    // Validate image
    const imgCheck = isValidBase64Image(processedImage);
    if (!imgCheck.valid) return NextResponse.json({ error: 'Invalid image format' }, { status: 400 });

    // Validate country (whitelist)
    const safeCountry = ALLOWED_COUNTRIES.includes(country) ? country : 'india';

    // Validate copies (1-20 only)
    const safeCopies = Math.min(20, Math.max(1, Number(copies) || 4));

    // Validate bg color (hex only)
    const safeBgColor = /^#[0-9A-Fa-f]{6}$/.test(backgroundColor) ? backgroundColor : '#FFFFFF';

    await connectDB();

    let processedUrl = '';
    try {
      const res = await cloudinary.uploader.upload(processedImage, {
        folder: 'snapid/processed',
        resource_type: 'image',
        transformation: [{ width: 600, crop: 'limit', quality: 90 }],
      });
      processedUrl = res.secure_url;
    } catch (e: any) {
      console.error('Cloudinary upload failed:', e.message);
      return NextResponse.json({ error: 'Image upload failed' }, { status: 500 });
    }

    const photo = await PassportPhoto.create({
      userId:          userId,
      originalUrl:     processedUrl,
      processedUrl,
      sheetUrl:        processedUrl,
      country:         safeCountry,
      backgroundColor: safeBgColor,
      copies:          safeCopies,
    });

    return NextResponse.json({ success: true, photoId: photo._id });

  } catch (err: any) {
    console.error('Save photo error:', err.message);
    return NextResponse.json({ error: 'Save failed' }, { status: 500 });
  }
}