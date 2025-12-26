import { NextRequest, NextResponse } from 'next/server';

/**
 * Proxy route for side profile landmark detection
 * Forwards requests to the Railway-hosted InsightFace API
 */

const DETECTION_API_URL = process.env.DETECTION_API_URL || 'http://localhost:8000';

export interface SideLandmarkResponse {
  success: boolean;
  data?: {
    landmarks: Array<{ x: number; y: number }>;
    namedLandmarks: Record<string, { x: number; y: number }>;
    bbox: number[];
    direction: 'left' | 'right';
    rotationAngle: number;
    crop: {
      x: number;
      y: number;
      width: number;
      height: number;
      scale: number;
    };
    center: { x: number; y: number };
    allLandmarks?: Record<string, { x: number; y: number }>;
    landmarkCount: number;
  };
  error?: string;
}

export async function POST(request: NextRequest) {
  try {
    // Handle JSON request with base64 image
    const body = await request.json();

    const response = await fetch(`${DETECTION_API_URL}/api/side-landmarks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Side Landmarks API] Error from detection server:', errorText);
      return NextResponse.json(
        { success: false, message: 'Detection server error' },
        { status: response.status }
      );
    }

    const data: SideLandmarkResponse = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('[Side Landmarks API] Error:', error);

    // Check if it's a connection error (server not running)
    if (error instanceof Error && error.message.includes('fetch failed')) {
      return NextResponse.json(
        {
          success: false,
          message: 'Detection server unavailable. Please try again later.',
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
