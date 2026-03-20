import { createSentencesRoute } from "@/lib/games/api";
export const dynamic = "force-static";

// Use a simple sample for now, the route helper will try to fetch from DB if available
const { GET } = createSentencesRoute([
  { id: "1", sentence: "The brave gryphon flies over the high mountains.", translation: "กริฟฟอนผู้กล้าหาญบินข้ามภูเขาสูง" },
  { id: "2", sentence: "Watch out for the dangerous dragons in the sky.", translation: "ระวังมังกรที่อันตรายในท้องฟ้า" },
  { id: "3", sentence: "Collect all the magic orbs to win the game.", translation: "สะสมลูกแก้วเวทมนตร์ทั้งหมดเพื่อชนะเกม" },
]);

export { GET };
