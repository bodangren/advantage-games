import { createSentencesRoute } from "@/lib/games/api";
export const dynamic = "force-static";

const { GET } = createSentencesRoute([
  { id: "1", sentence: "The knight rescued the prisoner from the cell.", translation: "อัศวินช่วยเหลือนักโทษออกจากห้องขัง" },
  { id: "2", sentence: "They escaped the dark dungeon together.", translation: "พวกเขาหลบหนีออกจากคุกใต้ดินที่มืดมิดไปด้วยกัน" },
  { id: "3", sentence: "A line of followers followed the hero.", translation: "แถวของผู้ติดตามเดินตามผู้กล้าไป" },
]);

export { GET };
