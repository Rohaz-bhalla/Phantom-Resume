"use server"

import { Resume } from "@/lib/resume/resume.types"
import pdfParse from "pdf-parse"

export async function importLinkedInPDF(formData: FormData): Promise<Partial<Resume>> {
  const file = formData.get("file") as File
  if (!file) throw new Error("No file provided")

  // 1. Convert File to Buffer
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  // 2. Parse PDF
  const data = await pdfParse(buffer)
  const text = data.text

  // 3. Identify Section Positions
  // We find the indices of common LinkedIn headers to slice the text correctly
  const indices = {
    summary: text.indexOf("Summary"),
    experience: text.indexOf("Experience"),
    education: text.indexOf("Education"),
    skills: text.indexOf("Skills") !== -1 ? text.indexOf("Skills") : text.indexOf("Top Skills"),
    languages: text.indexOf("Languages"),
    certifications: text.indexOf("Certifications"),
  }

  // Helper to extract text between a start section and the nearest next section
  const extractSection = (startIdx: number, allIndices: Record<string, number>) => {
    if (startIdx === -1) return ""
    // Find all indices that appear AFTER the current startIdx
    const nextIndices = Object.values(allIndices)
      .filter((idx) => idx > startIdx)
      .sort((a, b) => a - b)
    
    const endIdx = nextIndices.length > 0 ? nextIndices[0] : text.length
    return text.slice(startIdx, endIdx).trim()
  }

  // --- EXTRACT SUMMARY ---
  let summary = ""
  if (indices.summary !== -1) {
    const rawSummary = extractSection(indices.summary, indices)
    // Remove the word "Summary" from the start
    summary = rawSummary.replace(/^Summary\s*/i, "").trim()
  }

  // --- EXTRACT SKILLS ---
  let extractedSkills: string[] = []
  if (indices.skills !== -1) {
    const rawSkills = extractSection(indices.skills, indices)
    // Clean up header
    const cleanSkillsText = rawSkills.replace(/^(Top )?Skills\s*/i, "")
    // LinkedIn skills are usually separated by newlines or bullets (•)
    extractedSkills = cleanSkillsText
      .split(/\n|•/)
      .map(s => s.trim())
      .filter(s => s.length > 2) // Filter out noise
  }

  // --- EXTRACT EDUCATION ---
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const educationItems: any[] = []
  if (indices.education !== -1) {
    const rawEdu = extractSection(indices.education, indices)
    const cleanEdu = rawEdu.replace(/^Education\s*/i, "")
    
    // Split by double newline which often separates entries
    const entries = cleanEdu.split("\n\n").filter(e => e.trim().length > 5)
    
    entries.forEach(entry => {
      const lines = entry.split("\n").map(l => l.trim()).filter(Boolean)
      if (lines.length >= 2) {
        educationItems.push({
          institute: lines[0],
          degree: lines[1], // Heuristic: 2nd line is degree
          year: lines.find(l => /\d{4}/.test(l)) || "" // Look for year line
        })
      }
    })
  }

  // --- EXTRACT EXPERIENCE (Advanced) ---
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const experienceItems: any[] = []
  if (indices.experience !== -1) {
    const rawExp = extractSection(indices.experience, indices)
    // Regex for: "Jan 2020 - Present" or "Jan 2019 - Feb 2021"
    const dateRangeRegex = /((Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4})\s+-\s+(Present|(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4})/g
    
    // We split the block by dates to find the "seams" between jobs
    const parts = rawExp.split(dateRangeRegex)
    // The matches iterator helps us find the actual date strings which split removed
    const matches = [...rawExp.matchAll(dateRangeRegex)]

    // Logic: The text BEFORE a date match usually contains the Role and Company
    // The text AFTER a date match contains the description
    
    // "Experience" header is at the very top, so we ignore parts[0] usually or check it for the first job's title
    
    matches.forEach((match, i) => {
       // 1. Find the Role and Company
       // We look at the text segment immediately preceding this date match
       // If it's the first match, we look at the start of the section.
       // Otherwise, we look after the previous description.
       
       // Note: pdf-parse often outputs:
       // Role Name
       // Company Name
       // Date - Date
       
       const prevMatchEnd = i === 0 ? 0 : (matches[i-1].index! + matches[i-1][0].length)
       const headerText = rawExp.slice(prevMatchEnd, match.index).trim()
       
       const headerLines = headerText
         .split("\n")
         .map(l => l.trim())
         .filter(l => l && l !== "Experience") // Filter out section header
       
       // Heuristic: Last two lines before the date are likely Company and Role
       const role = headerLines.length > 0 ? headerLines[headerLines.length - 2] || headerLines[headerLines.length - 1] : "Role"
       const company = headerLines.length > 1 ? headerLines[headerLines.length - 1] : "Company"

       // 2. Find the Description
       // Text from end of this date match to start of next date match
       const nextMatchStart = matches[i+1] ? matches[i+1].index : rawExp.length
       const descText = rawExp.slice(match.index! + match[0].length, nextMatchStart).trim()
       
       // Clean bullets
       const bullets = descText
         .split("\n")
         .map(l => l.trim())
         .filter(l => l.length > 5 && !l.includes("·")) // Remove short noise and LinkedIn separators
         .slice(0, 5) // Limit to 5 bullets per job

       experienceItems.push({
         company: company,
         role: role,
         startDate: match[1],
         endDate: match[3],
         bullets: bullets
       })
    })
  }

  // --- BASIC INFO ---
  const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi
  const linkedinUrlRegex = /(www\.linkedin\.com\/in\/[a-zA-Z0-9-]+)/gi
  
  const emails = text.match(emailRegex)
  const linkedinUrls = text.match(linkedinUrlRegex)
  
  // Name heuristic: First non-empty line of the whole file
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lines = text.split("\n").map((l: any) => l.trim()).filter(Boolean)
  const likelyName = lines[0]

  return {
    summary: summary || "Professional summary imported from LinkedIn.",
    
    basics: {
      name: likelyName || "",
      email: emails ? emails[0] : "",
      location: "", 
      links: {
        linkedin: linkedinUrls ? `https://${linkedinUrls[0]}` : "",
      }
    },
    
    skills: extractedSkills,
    experience: experienceItems,
    education: educationItems,
  }
}