import { NextResponse } from "next/server";
import { VocabularyItem } from "@/store/useGameStore";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const vocabPath = path.join(process.cwd(), "public/vocab/default.json");
    const fileContents = fs.readFileSync(vocabPath, "utf8");
    const allSentences: VocabularyItem[] = JSON.parse(fileContents);

    // For Haunted Library, we want sentences with 3-10 words
    const sentences = allSentences.filter(s => {
      const wordCount = s.term.split(' ').length;
      return wordCount >= 3 && wordCount <= 10;
    });

    if (sentences.length === 0) {
      return NextResponse.json({ warning: "NO_SENTENCES" });
    }

    if (sentences.length < 3) {
      return NextResponse.json({ 
        warning: "INSUFFICIENT_SENTENCES",
        requiredCount: 3,
        currentCount: sentences.length
      });
    }

    // Shuffle and take 5
    const shuffled = sentences.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 5);

    return NextResponse.json({ sentences: selected });
  } catch (error) {
    console.error("Failed to load sentences:", error);
    return NextResponse.json({ warning: "NO_SENTENCES" }, { status: 500 });
  }
}
