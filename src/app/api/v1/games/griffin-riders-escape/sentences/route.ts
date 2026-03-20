import { NextResponse } from 'next/server'

const sentences = [
  {
    term: 'The knight rides the griffin',
    translation: 'อัศวินขี่กริฟฟิน'
  },
  {
    term: 'Sky is blue and wide',
    translation: 'ท้องฟ้าสีครามและกว้างใหญ่'
  },
  {
    term: 'Fly through the golden gates',
    translation: 'บินผ่านประตูสีทอง'
  },
  {
    term: 'Avoid the dark storm clouds',
    translation: 'หลีกเลี่ยงเมฆพายุที่มืดมิด'
  }
]

export async function GET() {
  return NextResponse.json({ sentences })
}
