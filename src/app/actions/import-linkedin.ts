"use server"

import { Resume } from "@/lib/resume/resume.types"
import pdfParse from "pdf-parse"

export async function importLinkedInPDF(formData: FormData): Promise<Partial<Resume>> {
  const file = formData.get("file") as File
  if (!file) throw new Error("No file provided")

  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  
  // 1. Parse PDF
  const data = await pdfParse(buffer)
  let text = data.text

  // 2. Clean Text
  text = text
    .replace(/\r\n/g, "\n")
    .replace(/[–—]/g, "-") // Normalize dashes
    .replace(/\u00A0/g, " ") // Remove non-breaking spaces
    .replace(/Page \d+ of \d+/g, "") // Remove footer "Page 1 of 3"
    .replace(/^\s*[\r\n]/gm, "") // Remove empty lines

  // 3. Define Regex Patterns
  const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi
  const linkedinUrlRegex = /(www\.linkedin\.com\/in\/[a-zA-Z0-9-]+)/gi
  
  // Robust Date Regex: Matches "Oct 2020 - Present", "August 2022 - 2024", etc.
  const month = "(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?|\\d{1,2}\\/)"
  const year = "\\d{4}"
  // Allow for newlines inside the date string (common in PDFs)
  const dateRangeRegex = new RegExp(`(${month}\\s*${year}|${year})\\s*-\\s*(Present|Current|${month}\\s*${year}|${year})`, "gi")

  // 4. Initialize Containers
  const experienceItems: any[] = []
  const educationItems: any[] = []
  
  // 5. GLOBAL SCAN: Find all items based on Dates
  const matches = [...text.matchAll(dateRangeRegex)]
  
  matches.forEach((match, i) => {
      // Get the text BEFORE this date (Preceding Context)
      const prevEnd = i === 0 ? 0 : (matches[i-1].index! + matches[i-1][0].length)
      const lookbackLimit = Math.max(prevEnd, match.index! - 300)
      const chunk = text.slice(lookbackLimit, match.index).trim()
      
      // Split into lines and CLEAN NOISE
      const lines = chunk.split("\n")
        .map(l => l.trim())
        .filter(l => {
             // Filter out empty lines, short noise, and duration strings like "(1 month)" or "3 years"
             if (l.length < 2) return false;
             if (l.match(/^\(?\d+\s*(years?|yrs?|mos?|months?)\)?/i)) return false; 
             if (l.match(/Page \d+/i)) return false;
             return true;
        });

      // Get the text AFTER this date (Description Context)
      const nextStart = matches[i+1] ? matches[i+1].index : text.length
      const descChunk = text.slice(match.index! + match[0].length, nextStart).trim()
      
      // DECIDE: Is this Education or Experience?
      // Keywords that strongly imply education
      const educationKeywords = ["university", "college", "school", "institute", "academy", "b.tech", "b.sc", "m.sc", "degree", "diploma", "certificate", "student"]
      const combinedContext = lines.join(" ").toLowerCase()
      const isEducation = educationKeywords.some(k => combinedContext.includes(k))

      if (isEducation) {
          // --- PARSE EDUCATION ---
          // Heuristic: First line is School, Second is Degree
          // If only 1 line, split by comma if possible
          let school = "University"
          let degree = ""
          
          if (lines.length > 0) {
              school = lines[0]
              if (lines.length > 1) {
                  degree = lines[1]
              } else if (school.includes(",")) {
                  const parts = school.split(",")
                  school = parts[0]
                  degree = parts.slice(1).join(" ").trim()
              }
          }

          educationItems.push({
              institute: school,
              degree: degree,
              year: match[0] // The date string itself
          })
      } else {
          // --- PARSE EXPERIENCE ---
          let role = "Role"
          let company = "Company"
          
          if (lines.length > 0) {
              // PATTERN A: Company -> Role -> Date (Your PDF seems to follow this mostly)
              // The line CLOSEST to the date is usually the Role
              role = lines[lines.length - 1] 
              
              if (lines.length > 1) {
                  company = lines[lines.length - 2]
              } else {
                  // If only 1 line exists, it might be "Company - Role" or just Company
                  if (role.includes("-")) {
                      const parts = role.split("-")
                      company = parts[0].trim()
                      role = parts[1].trim()
                  } else if (role.includes(" at ")) {
                      const parts = role.split(" at ")
                      role = parts[0].trim()
                      company = parts[1].trim()
                  } else {
                      // Fallback: assume it's the Company Name if no other info
                      company = role
                      role = "" 
                  }
              }
          }

          // Clean Description Bullets
          const bullets = descChunk.split("\n")
              .map(l => l.trim())
              .filter(l => 
                  l.length > 10 && 
                  !l.includes("·") && 
                  !l.toLowerCase().includes("see less") &&
                  !l.toLowerCase().includes("page of")
              )
              .slice(0, 6)

          experienceItems.push({
              company,
              role,
              startDate: match[1],
              endDate: match[2],
              bullets
          })
      }
  })

  // 6. Extract SKILLS (Specific Block Search)
  let extractedSkills: string[] = []
  const skillsHeaderRegex = /(Top Skills|Skills|Skills & Endorsements)\s*\n/i
  const skillsMatch = text.match(skillsHeaderRegex)
  
  if (skillsMatch && skillsMatch.index !== undefined) {
      const start = skillsMatch.index + skillsMatch[0].length
      const potentialSkills = text.slice(start, start + 600)
      const endMatch = potentialSkills.match(/(Experience|Education|Summary|Languages|Certifications)/)
      const cutOff = endMatch ? endMatch.index : potentialSkills.length
      
      const cleanSkillsBlock = potentialSkills.slice(0, cutOff)
      
      extractedSkills = cleanSkillsBlock
          .split(/,|\n|•|·/) 
          .map(s => s.trim())
          .filter(s => s.length > 2 && s.length < 50) 
          .slice(0, 20)
  }

  // 7. Extract Summary
  let summary = ""
  const summaryMatch = text.match(/Summary\s*\n/i)
  if (summaryMatch && summaryMatch.index !== undefined) {
      const start = summaryMatch.index + summaryMatch[0].length
      const potentialSummary = text.slice(start, start + 1000)
      const nextSection = potentialSummary.match(/(Experience|Education|Skills|Top Skills)/)
      const end = nextSection ? nextSection.index : potentialSummary.length
      
      summary = potentialSummary.slice(0, end).replace(/\n/g, " ").trim()
  }

  // 8. Basic Info
  const emails = text.match(emailRegex)
  const links = text.match(linkedinUrlRegex)
  const name = text.split("\n").find(l => l.trim().length > 3 && !l.includes("@")) || "Your Name"

  return {
    basics: {
      name: name,
      email: emails ? emails[0] : "",
      location: "", 
      links: {
        linkedin: links ? `https://${links[0]}` : "",
      }
    },
    summary: summary || "Imported from LinkedIn.",
    skills: extractedSkills,
    experience: experienceItems,
    education: educationItems,
  }
}