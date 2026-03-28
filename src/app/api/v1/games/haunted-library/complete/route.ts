import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const results = await req.json();
    console.log("Haunted Library game results:", results);

    // In a real app, we would save these results to the database
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to save Haunted Library game results:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
