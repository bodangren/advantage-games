import { NextResponse } from "next/server";
import { SAMPLE_SENTENCES } from "@/lib/games/sampleSentences";

import { getDifficultyConfig } from "@/lib/games/stormCastleTowerConfig";

export const dynamic = "force-static";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get("locale");
  const difficulty = searchParams.get("difficulty") as "easy" | "normal" | "hard" | null;
  
  const config = getDifficultyConfig(difficulty || "normal");
  const wordCount = config.wordCount;
  
  const filteredSentences = SAMPLE_SENTENCES.filter(s => s.term.split(" ").length >= wordCount);
  
  return NextResponse.json({
    sentences: filteredSentences.length > 0 ? filteredSentences : SAMPLE_SENTENCES,
  });
}
