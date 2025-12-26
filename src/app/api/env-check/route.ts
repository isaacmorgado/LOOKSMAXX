// Diagnostic endpoint to check if environment variables are set
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    apiUrl: process.env.NEXT_PUBLIC_API_URL || 'NOT SET',
    nodeEnv: process.env.NODE_ENV || 'NOT SET',
    vercelEnv: process.env.VERCEL_ENV || 'NOT SET',
  });
}
