import { NextResponse } from "next/server";

export const dynamic = "force-static";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    return NextResponse.json({
      success: true,
      xpEarned: body.xpEarned || 0,
    });
  } catch (e) {
    return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 });
  }
}
