import { NextResponse } from "next/server";
import { SAMPLE_VOCABULARY } from "@/lib/games/sampleVocabulary";

export const dynamic = "force-static";

export async function GET() {
  return NextResponse.json({
    vocabulary: SAMPLE_VOCABULARY,
  });
}
