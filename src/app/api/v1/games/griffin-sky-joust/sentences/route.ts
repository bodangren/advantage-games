import { NextResponse } from "next/server";
import { SAMPLE_SENTENCES } from "@/lib/games/sampleSentences";
import { getDifficultySettings } from "@/lib/games/griffinSkyJoustConfig";

export const dynamic = "force-static";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const difficulty = (searchParams.get("difficulty") as any) || "normal";
  
  const settings = getDifficultySettings(difficulty);
  const wordCount = settings.wordCount;
  
  const filteredSentences = SAMPLE_SENTENCES.filter(s => s.term.split(" ").length >= wordCount);
  
  return NextResponse.json({
    sentences: filteredSentences.length > 0 ? filteredSentences : SAMPLE_SENTENCES,
  });
}
