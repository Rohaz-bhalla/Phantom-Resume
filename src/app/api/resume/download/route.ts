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

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
    })
    
    const page = await browser.newPage()

    const data = resume.data as any
    const basics = data.basics || {}

    // Helper for rendering links safely
    const renderLink = (url: string, label: string) => 
      url ? `<a href="${url}" target="_blank" style="color: #2563eb; text-decoration: none;">${label}</a>` : ""

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            /* 1. COMPACT PAGE SETTINGS 
               - 15mm margins allow more content while staying professional.
               - A4 format standard.
            */
            @page { margin: 15mm; size: A4; }
            
            body { 
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; 
              color: #18181b; 
              line-height: 1.4; /* Tighter line height for better density */
              font-size: 12px;  /* 12px is standard 9-10pt print size */
            }
            
            a { color: #2563eb; text-decoration: none; }
            
            /* Header */
            h1 { margin: 0 0 4px 0; font-size: 22px; text-transform: uppercase; letter-spacing: -0.5px; font-weight: 800; }
            
            .header-meta { 
              font-size: 11px; 
              color: #52525b; 
              display: flex; 
              flex-wrap: wrap; 
              gap: 8px; 
              row-gap: 2px; 
              margin-bottom: 12px;
            }
            .header-meta span:not(:last-child):after { content: "•"; margin-left: 8px; color: #d4d4d8; }
            
            /* Sections */
            .section { margin-top: 16px; }
            
            /* ATS IMPROVEMENT: Use h2 for section titles */
            h2 { 
              font-size: 13px; 
              font-weight: 700; 
              text-transform: uppercase; 
              border-bottom: 2px solid #18181b; /* Thicker, clearer divider */
              padding-bottom: 2px; 
              margin-bottom: 8px; 
              margin-top: 0; /* Reset default browser margin */
              letter-spacing: 0.05em;
              
              /* Keep title with its first item */
              page-break-after: avoid; 
            }
            
            /* Items (Job, Project, etc) */
            .item { 
              margin-bottom: 10px; 
              
              /* CRITICAL: Prevent items from splitting across pages */
              page-break-inside: avoid; 
            }
            
            .row { display: flex; justify-content: space-between; align-items: baseline; }
            .title { font-weight: 700; font-size: 13px; }
            .subtitle { font-style: italic; color: #3f3f46; font-size: 12px; }
            .date { font-size: 11px; color: #52525b; font-family: monospace; font-weight: 500; white-space: nowrap; }
            
            /* Lists */
            ul { margin: 2px 0 0 0; padding-left: 16px; }
            li { margin-bottom: 1px; }

            /* Tech Stack */
            .stack { font-size: 10px; color: #52525b; margin-top: 2px; font-weight: 500; }
          </style>
        </head>
        <body>
          
          <div>
            <h1>${basics.name || "Your Name"}</h1>
            <div class="header-meta">
              ${[basics.email, basics.phone, basics.location].filter(Boolean).map(t => `<span>${t}</span>`).join("")}
              
              ${basics.links?.linkedin ? `<span>LinkedIn: ${renderLink(basics.links.linkedin, "Profile")}</span>` : ""}
              ${basics.links?.github ? `<span>GitHub: ${renderLink(basics.links.github, "Profile")}</span>` : ""}
              ${basics.links?.twitter ? `<span>X: ${renderLink(basics.links.twitter, "Profile")}</span>` : ""}
              
              ${(basics.customFields || []).map((f: any) => 
                  `<span>${f.label}: ${renderLink(f.value, "Link")}</span>`
              ).join("")}
            </div>
          </div>

          ${data.summary ? `
            <div class="section">
              <h2>Summary</h2>
              <div style="text-align: justify;">${data.summary}</div>
            </div>
          ` : ""}

          ${data.skills && data.skills.length > 0 ? `
            <div class="section">
              <h2>Skills</h2>
              <div style="line-height: 1.5;">${data.skills.join(" • ")}</div>
            </div>
          ` : ""}

          ${data.experience && data.experience.length > 0 ? `
            <div class="section">
              <h2>Experience</h2>
              ${data.experience.map((exp: any) => `
                <div class="item">
                  <div class="row">
                    <span class="title">${exp.role || "Role"}</span>
                    <span class="date">${exp.startDate || ""} ${exp.endDate ? `- ${exp.endDate}` : ""}</span>
                  </div>
                  <div class="subtitle">${exp.company || "Company"}</div>
                  <ul>
                    ${(exp.bullets || []).map((b: string) => `<li>${b}</li>`).join("")}
                  </ul>
                </div>
              `).join("")}
            </div>
          ` : ""}

          ${data.projects && data.projects.length > 0 ? `
            <div class="section">
              <h2>Projects</h2>
              ${data.projects.map((proj: any) => `
                <div class="item">
                  <div class="row">
                    <span class="title">
                      ${proj.title}
                      <span style="font-size: 10px; font-weight: normal; margin-left: 6px;">
                         ${proj.github ? `[${renderLink(proj.github, "Code")}]` : ""}
                         ${proj.website ? `[${renderLink(proj.website, "Demo")}]` : ""}
                      </span>
                    </span>
                  </div>
                  ${proj.tech && proj.tech.length > 0 ? `<div class="stack">Stack: ${proj.tech.join(" • ")}</div>` : ""}
                  <ul>
                    ${(proj.bullets || []).map((b: string) => `<li>${b}</li>`).join("")}
                  </ul>
                </div>
              `).join("")}
            </div>
          ` : ""}

          ${data.education && data.education.length > 0 ? `
            <div class="section">
              <h2>Education</h2>
              ${data.education.map((edu: any) => `
                <div class="item">
                  <div class="row">
                    <span class="title">${edu.institute}</span>
                    <span class="date">${edu.year}</span>
                  </div>
                  <div class="subtitle">${edu.degree}</div>
                </div>
              `).join("")}
            </div>
          ` : ""}

          ${data.certifications && data.certifications.length > 0 ? `
            <div class="section">
              <h2>Certifications</h2>
              ${data.certifications.map((cert: any) => `
                <div class="item">
                  <div class="row">
                    <span class="title">
                        ${cert.name}
                        ${cert.url ? `<span style="font-size:10px; margin-left:5px;">[${renderLink(cert.url, "Link")}]</span>` : ""}
                    </span>
                    <span class="date">${cert.date}</span>
                  </div>
                  <div class="subtitle">${cert.issuer}</div>
                </div>
              `).join("")}
            </div>
          ` : ""}

          ${data.customSections && data.customSections.map((sec: any) => `
             <div class="section">
                <h2>${sec.title}</h2>
                ${sec.items.map((item: any) => `
                    <div class="item">
                        <div class="title">${item.name}</div>
                        <div style="white-space: pre-wrap; color: #3f3f46;">${item.description}</div>
                    </div>
                `).join("")}
             </div>
          `).join("")}

        </body>
      </html>
    `

    await page.setContent(htmlContent, { waitUntil: "domcontentloaded" })
    
    // Using standard PDF margins instead of CSS margins for better printer control
    const pdfBuffer = await page.pdf({ 
      format: "A4", 
      printBackground: true,
      margin: { top: "15mm", bottom: "15mm", left: "15mm", right: "15mm" }
    })

    await browser.close()

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${(basics.name || "resume").replace(/\s+/g, '_')}.pdf"`,
      },
    })

  } catch (error) {
    console.error("PDF GENERATION ERROR:", error)
    return new NextResponse(
      JSON.stringify({ error: String(error) }), 
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }
}