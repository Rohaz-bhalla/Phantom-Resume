import { NextResponse } from "next/server"
import puppeteer from "puppeteer"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { resumes } from "@/lib/db/schema"
import { and, eq } from "drizzle-orm"
import { renderResumeHtml } from "@/lib/pdf/renderResumeHtml"

export const runtime = "nodejs"

export async function GET() {
  const { userId } = await auth()
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  const resume = await db.query.resumes.findFirst({
    where: (r, { eq, and }) =>
      and(eq(r.userId, userId), eq(r.isActive, true)),
  })

  if (!resume) {
    return new NextResponse("Resume not found", { status: 404 })
  }

  const html = renderResumeHtml(resume.data)

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  })

  const page = await browser.newPage()
  await page.setContent(html, { waitUntil: "networkidle0" })

  const pdf = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: {
      top: "20mm",
      bottom: "20mm",
      left: "20mm",
      right: "20mm",
    },
  })

  await browser.close()

  return new NextResponse(Buffer.from(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="resume.pdf"',
    },
  })
}
