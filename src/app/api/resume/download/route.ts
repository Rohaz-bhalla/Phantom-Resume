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
      args: [
        "--no-sandbox", 
        "--disable-setuid-sandbox", 
        "--disable-dev-shm-usage"
      ],
    })
    
    const page = await browser.newPage()

    const data = resume.data as any
    const basics = data.basics || {}

    const renderLink = (url: string, label: string) => 
      url ? `<a href="${url}" target="_blank">${label}</a>` : ""

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            @page { margin: 15mm 15mm 15mm 15mm; size: A4; }
            
            body { 
              font-family: Arial, Helvetica, sans-serif; 
              color: #111; 
              line-height: 1.5; 
              font-size: 11px; 
            }
            
            a { color: #222; text-decoration: none; }
            
            /* HEADER: Centered & Strong */
            .header { text-align: center; margin-bottom: 24px; }
            h1 { 
              margin: 0 0 8px 0; 
              font-size: 26px; 
              font-weight: 700; 
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            
            .meta { 
              font-size: 11px; 
              color: #444; 
              font-weight: 500;
              margin-bottom: 6px;
            }
            .meta span { display: inline-block; margin: 0 8px; }
            
            /* SECTIONS: Bold divider */
            .section { margin-top: 22px; }
            
            h2 { 
              font-size: 12px; 
              font-weight: 700; 
              text-transform: uppercase; 
              letter-spacing: 1px;
              color: #000;
              border-bottom: 2px solid #000; /* Stronger divider */
              padding-bottom: 4px; 
              margin-bottom: 14px; 
              margin-top: 0;
            }
            
            /* JOB ITEMS */
            .item { 
              margin-bottom: 14px; 
              page-break-inside: avoid; 
            }
            
            .row { 
              display: flex; 
              justify-content: space-between; 
              align-items: baseline; 
              margin-bottom: 2px;
            }
            
            .role { font-weight: 700; font-size: 12px; color: #000; }
            .date { font-weight: 500; font-size: 11px; color: #444; text-align: right; }
            .company { font-weight: 600; font-style: italic; color: #333; margin-bottom: 4px; }
            
            /* BULLETS */
            ul { margin: 4px 0 0 0; padding-left: 18px; }
            li { margin-bottom: 3px; color: #222; }

            /* TECH STACK */
            .stack { 
              font-weight: 500;
              font-size: 10px; 
              color: #444; 
              margin-bottom: 4px;
            }
          </style>
        </head>
        <body>
          
          <div class="header">
            <h1>${basics.name || "Your Name"}</h1>
            
            <div class="meta">
              ${[basics.email, basics.phone, basics.location].filter(Boolean).map(t => `<span>${t}</span>`).join("")}
            </div>
            
            <div class="meta">
              ${[
                 basics.links?.linkedin ? renderLink(basics.links.linkedin, "LinkedIn") : null,
                 basics.links?.github ? renderLink(basics.links.github, "GitHub") : null,
                 basics.links?.portfolio ? renderLink(basics.links.portfolio, "Portfolio") : null
              ].filter(Boolean).join("<span>•</span>")}
            </div>
          </div>

          ${data.summary ? `
            <div class="section">
              <h2>Professional Summary</h2>
              <div style="text-align: justify; color: #222;">${data.summary}</div>
            </div>
          ` : ""}

          ${data.skills && data.skills.length > 0 ? `
            <div class="section">
              <h2>Technical Skills</h2>
              <div style="font-weight: 500;">${data.skills.join("  •  ")}</div>
            </div>
          ` : ""}

          ${data.experience && data.experience.length > 0 ? `
            <div class="section">
              <h2>Experience</h2>
              ${data.experience.map((exp: any) => `
                <div class="item">
                  <div class="row">
                    <span class="role">${exp.role || "Role"}</span>
                    <span class="date">${exp.startDate || ""} ${exp.endDate ? `– ${exp.endDate}` : ""}</span>
                  </div>
                  <div class="company">${exp.company || "Company"}</div>
                  <ul>
                    ${(exp.bullets || []).map((b: string) => `<li>${b}</li>`).join("")}
                  </ul>
                </div>
              `).join("")}
            </div>
          ` : ""}

          ${data.projects && data.projects.length > 0 ? `
            <div class="section">
              <h2>Key Projects</h2>
              ${data.projects.map((proj: any) => `
                <div class="item">
                  <div class="row">
                    <span class="role">
                      ${proj.title} 
                      ${(proj.github || proj.website) ? 
                        `<span style="font-weight:normal; font-size:10px; margin-left:8px; color:#555;">
                            | ${[
                              proj.github ? renderLink(proj.github, "Code") : null,
                              proj.website ? renderLink(proj.website, "Live") : null
                            ].filter(Boolean).join(" • ")}
                         </span>` : ""
                      }
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
                    <span class="role">${edu.institute}</span>
                    <span class="date">${edu.year}</span>
                  </div>
                  <div class="company">${edu.degree}</div>
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
                    <span class="role">${cert.name}</span>
                    <span class="date">${cert.date}</span>
                  </div>
                  <div class="company">
                    ${cert.issuer}
                    ${cert.url ? ` | ${renderLink(cert.url, "View")}` : ""}
                  </div>
                </div>
              `).join("")}
            </div>
          ` : ""}

          ${data.customSections && data.customSections.map((sec: any) => `
             <div class="section">
                <h2>${sec.title}</h2>
                ${sec.items.map((item: any) => `
                    <div class="item">
                        <div class="role" style="margin-bottom: 2px;">${item.name}</div>
                        <div style="white-space: pre-wrap;">${item.description}</div>
                    </div>
                `).join("")}
             </div>
          `).join("")}

        </body>
      </html>
    `

    await page.setContent(htmlContent, { waitUntil: "domcontentloaded" })
    
    const pdfBuffer = await page.pdf({ 
      format: "A4", 
      printBackground: true,
      margin: { top: "15mm", bottom: "15mm", left: "15mm", right: "15mm" }
    })

    await browser.close()

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${(basics.name || "resume").replace(/\s+/g, '_')}_Modern.pdf"`,
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