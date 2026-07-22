// app/api/process/remove-background/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { rateLimit, limits } from '@/lib/rate-limit';
import { isValidBase64Image, getClientIP } from '@/lib/validation';

export async function POST(req: NextRequest) {
  try {
    // ── Auth check ───────────────────────────────────────────────────────
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // ── Rate limit: 10 removals/hour per user ────────────────────────────
    const userId = (session.user as any).id;
    const rl = rateLimit(`removebg:${userId}`, limits.removeBg);
    if (!rl.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait before trying again.' },
        { status: 429 }
      );
    }

    const { image } = await req.json();
    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    // ── Validate image type and size ─────────────────────────────────────
    const imgCheck = isValidBase64Image(image);
    if (!imgCheck.valid) {
      return NextResponse.json(
        { error: 'Invalid image. Please upload a JPG, PNG, or WEBP file under 10MB.' },
        { status: 400 }
      );
    }

    const apiKey = process.env.PICWISH_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Service not configured' }, { status: 500 });
    }

    // Strip data URL prefix
    const base64Clean = image.includes(',') ? image.split(',')[1] : image;

    const params = new URLSearchParams();
    params.append('image_file_b64', base64Clean);
    params.append('size', 'auto');
    params.append('format', 'png');

    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': apiKey,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Remove.bg error:', response.status);
      return NextResponse.json({ error: `Background removal failed: ${response.status}` }, { status: 400 });
    }

    const resultBuffer = await response.arrayBuffer();
    const resultBase64 = Buffer.from(resultBuffer).toString('base64');

    return NextResponse.json({
      success: true,
      imageWithoutBg: `data:image/png;base64,${resultBase64}`,
    });

  } catch (error: any) {
    console.error('Background removal error:', error.message);
    return NextResponse.json({ error: 'Background removal failed' }, { status: 500 });
  }
}