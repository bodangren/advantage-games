export const dynamic = "force-static";
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.json()
  console.log('Game completed:', body)
  return NextResponse.json({ success: true })
}
