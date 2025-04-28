export const dynamic = "force-dynamic"; // Force dynamic rendering

import { NextResponse } from 'next/server'

console.log("Loading /api/test/route.ts module...")

export async function GET() {
  console.log("API Route /api/test GET handler started")
  return NextResponse.json({ message: 'Test successful' })
} 