import { NextResponse } from "next/server";

export const dynamic = "force-static";

export async function GET() {
  return NextResponse.json({
    rankings: {
      easy: [],
      normal: [],
      hard: [],
      extreme: [],
    },
  });
}
