import { NextRequest, NextResponse } from 'next/server';
import { successResponse, errorResponse } from '@/lib/api';

export async function POST(req: NextRequest) {
  try {
    const { image } = await req.json();

    if (!image) {
      return NextResponse.json(
        errorResponse('No image provided'),
        { status: 400 }
      );
    }

    // For now, return a mock face detection response
    // In production, this would use MediaPipe or a vision API
    const mockResponse = {
      detected: true,
      coordinates: {
        x: 50,
        y: 40,
        width: 300,
        height: 400,
      },
      confidence: 0.95,
      headTiltAngle: 2,
      landmarks: {
        leftEye: [140, 180],
        rightEye: [310, 180],
        nose: [225, 250],
        mouth: [225, 320],
      },
    };

    return NextResponse.json(
      successResponse(mockResponse, 'Face detected successfully'),
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Face detection error:', error);
    return NextResponse.json(
      errorResponse(error.message || 'Face detection failed'),
      { status: 500 }
    );
  }
}
