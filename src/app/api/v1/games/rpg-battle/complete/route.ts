import { NextResponse, type NextRequest } from "next/server";

export const dynamic = "force-static";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { correctAnswers, totalAttempts } = body;

  const accuracy = totalAttempts > 0 ? correctAnswers / totalAttempts : 0;
  const xpEarned = Math.floor(correctAnswers * accuracy);

  return NextResponse.json({
    success: true,
    xpEarned,
    message: "Game completed successfully",
  });
}
