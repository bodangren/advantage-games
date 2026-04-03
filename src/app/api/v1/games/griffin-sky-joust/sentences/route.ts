import { NextResponse } from "next/server";
import { SAMPLE_SENTENCES } from "@/lib/games/sampleSentences";

export const dynamic = "force-static";

export async function GET() {
  return NextResponse.json({
    sentences: SAMPLE_SENTENCES,
  });
}
