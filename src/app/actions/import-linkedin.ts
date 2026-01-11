"use server"

import { Resume } from "@/lib/resume/resume.types"
import { createRequire } from "module"

export async function importLinkedInPDF(formData: FormData): Promise<Partial<Resume>> {
  const file = formData.get("file") as File
  if (!file) throw new Error("No file provided")

  // 1. Convert File to Buffer
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  // 2. NATIVE REQUIRE FIX
  // This bypasses Next.js/Turbopack bundling completely to load the legacy CJS library
  const nativeRequire = createRequire(import.meta.url)
  
  // Load the library
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let pdfParse: any = nativeRequire("pdf-parse")

  // 3. Unwrap Default Exports (Robust Check)
  // Sometimes native require still gets a wrapped object in certain envs
  if (typeof pdfParse !== "function") {
      if (typeof pdfParse.default === "function") {
          pdfParse = pdfParse.default
      } else if (typeof pdfParse.default?.default === "function") {
          pdfParse = pdfParse.default.default
      }
  }

  // Debugging: If it's STILL not a function, log what we got to the server console
  if (typeof pdfParse !== "function") {
      console.error("CRITICAL: pdf-parse import failed. Resolved value:", pdfParse)
      throw new Error("Server Error: pdf-parse library could not be loaded as a function.")
  }

  // 4. Parse PDF
  const data = await pdfParse(buffer)
  const text = data.text

  // 5. Helper Regex Patterns
  const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi
  const linkedinUrlRegex = /(www\.linkedin\.com\/in\/[a-zA-Z0-9-]+)/gi
  // LinkedIn Date Pattern
  const dateRangeRegex = /((Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4})\s+-\s+(Present|(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4})/g

  // 6. Extract Basic Info
  const emails = text.match(emailRegex)
  const linkedinUrls = text.match(linkedinUrlRegex)
  
  // Name heuristic: First non-empty line
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lines = text.split("\n").map((l: any) => l.trim()).filter(Boolean)
  const likelyName = lines[0] 

  // 7. Smart Section Extraction
  const expIndex = text.indexOf("Experience")
  const eduIndex = text.indexOf("Education")
  
  // Extract Experience Block
  let experienceText = ""
  if (expIndex !== -1) {
    const end = eduIndex !== -1 ? eduIndex : text.length
    experienceText = text.slice(expIndex, end)
  }

  // Parse Experience Items
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const experienceItems: any[] = []
  
  const matches = [...experienceText.matchAll(dateRangeRegex)]
  
  matches.forEach((m, i) => {
    const nextMatch = matches[i + 1]
    const contentEnd = nextMatch ? nextMatch.index : experienceText.length
    
    const rawBlock = experienceText.slice(m.index, contentEnd)
    
    const cleanBlock = rawBlock
        .replace(dateRangeRegex, "") 
        .split("\n")
        .map(l => l.trim())
        .filter(l => l.length > 3)

    experienceItems.push({
        company: "Imported Company", 
        role: cleanBlock[0] || "Imported Role",
        startDate: m[1],
        endDate: m[3],
        bullets: cleanBlock.slice(1).slice(0, 4) 
    })
  })

  // 8. Map to Resume Schema
  return {
    summary: "Imported from LinkedIn Profile.",

    basics: {
      name: likelyName || "",
      email: emails ? emails[0] : "",
      location: "", 
      links: {
        linkedin: linkedinUrls ? `https://${linkedinUrls[0]}` : "",
      }
    },
    experience: experienceItems.length > 0 ? experienceItems : [],
  }
}