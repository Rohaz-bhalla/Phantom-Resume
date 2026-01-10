/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import puppeteer from "puppeteer"

export async function GET() {
  try {
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

    // 1. Launch Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox", 
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage" // often fixes memory crashes
      ],
    })
    
    const page = await browser.newPage()

    // 2. HTML Content
    // (Using optional chaining ?. to prevent crashes on empty data)
    const data = resume.data as any
    const basics = data.basics || {}
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: sans-serif; padding: 40px; color: #333; line-height: 1.5; }
            h1 { margin-bottom: 5px; text-transform: uppercase; }
            .contact { font-size: 14px; color: #666; margin-bottom: 20px; }
            .section { margin-bottom: 20px; }
            .section-title { font-weight: bold; border-bottom: 1px solid #ccc; margin-bottom: 10px; text-transform: uppercase; }
            .job { margin-bottom: 15px; }
            .job-header { font-weight: bold; display: flex; justify-content: space-between; }
            .job-role { font-style: italic; font-size: 0.9em; margin-bottom: 5px;}
            ul { margin-top: 5px; padding-left: 20px; }
            li { margin-bottom: 2px; }
          </style>
        </head>
        <body>
          <h1>${basics.name || "Your Name"}</h1>
          <div class="contact">
            ${[basics.email, basics.phone, basics.location].filter(Boolean).join(" | ")}
          </div>

          ${data.summary ? `
            <div class="section">
              <div class="section-title">Summary</div>
              <div>${data.summary}</div>
            </div>
          ` : ""}

          <div class="section">
            <div class="section-title">Experience</div>
            ${(data.experience || []).map((exp: any) => `
              <div class="job">
                <div class="job-header">
                  <span>${exp.company || "Company"}</span> 
                  <span>${exp.startDate || ""} - ${exp.endDate || "Present"}</span>
                </div>
                <div class="job-role">${exp.role || "Role"}</div>
                <ul>
                  ${(exp.bullets || []).map((b: string) => `<li>${b}</li>`).join("")}
                </ul>
              </div>
            `).join("")}
          </div>
        </body>
      </html>
    `

    // 3. Generate PDF
    await page.setContent(htmlContent, { waitUntil: "domcontentloaded" })
    const pdfBuffer = await page.pdf({ format: "A4", printBackground: true })

    await browser.close()

    // 4. Return PDF
    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${basics.name || "resume"}.pdf"`,
      },
    })

  } catch (error) {
    console.error("PDF GENERATION ERROR:", error)
    // Return the actual error to the browser so you can see it
    return new NextResponse(
      JSON.stringify({ error: String(error) }), 
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }
}