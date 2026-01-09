import type { Resume } from "@/lib/resume/resume.types"
import { ACTION_VERBS } from "./actionVerbs"

type AtsResult = {
  score: number
  breakdown: {
    label: string
    points: number
    max: number
    message: string
  }[]
}

export function calculateAtsScore(resume: Resume): AtsResult {
  const breakdown: AtsResult["breakdown"] = []
  let score = 0

  /* BASICS */
  const basicsFields = [
    resume.basics.name,
    resume.basics.email,
    resume.basics.phone,
    resume.basics.location,
  ].filter(Boolean).length

  const basicsPoints = Math.min(basicsFields * 4, 15)
  score += basicsPoints
  breakdown.push({
    label: "Basics",
    points: basicsPoints,
    max: 15,
    message:
      basicsPoints === 15
        ? "All basic details present"
        : "Add phone or location for better ATS parsing",
  })

  /* SUMMARY */
  const summaryLength = resume.summary.trim().length
  const summaryPoints =
    summaryLength >= 200 ? 10 : summaryLength >= 100 ? 6 : 0

  score += summaryPoints
  breakdown.push({
    label: "Summary",
    points: summaryPoints,
    max: 10,
    message:
      summaryPoints === 10
        ? "Summary length is optimal"
        : "Summary should be at least 100–200 characters",
  })

  /* SKILLS */
  const skillCount = resume.skills.length
  const skillsPoints =
    skillCount >= 12 ? 20 : skillCount >= 8 ? 14 : skillCount >= 5 ? 8 : 0

  score += skillsPoints
  breakdown.push({
    label: "Skills",
    points: skillsPoints,
    max: 20,
    message:
      skillCount >= 8
        ? "Good number of skills listed"
        : "Add more relevant skills (8+ recommended)",
  })

  /* EXPERIENCE */
  const expBullets = resume.experience.flatMap(e => e.bullets)
  const expPoints =
    expBullets.length >= 10 ? 25 : expBullets.length >= 5 ? 15 : 5

  score += expPoints
  breakdown.push({
    label: "Experience",
    points: expPoints,
    max: 25,
    message:
      expBullets.length >= 5
        ? "Experience section looks strong"
        : "Add more quantified experience bullets",
  })

  /* PROJECTS */
  const projectPoints =
    resume.projects.length >= 3 ? 10 : resume.projects.length >= 1 ? 5 : 0

  score += projectPoints
  breakdown.push({
    label: "Projects",
    points: projectPoints,
    max: 10,
    message:
      resume.projects.length > 0
        ? "Projects add value"
        : "Projects help ATS ranking for freshers",
  })

  /* LENGTH SANITY */
  const totalText =
    resume.summary +
    resume.experience.map(e => e.bullets.join(" ")).join(" ") +
    resume.projects.map(p => p.bullets.join(" ")).join(" ")

  const wordCount = totalText.split(/\s+/).length
  const lengthPoints =
    wordCount >= 300 && wordCount <= 800 ? 10 : 5

  score += lengthPoints
  breakdown.push({
    label: "Length",
    points: lengthPoints,
    max: 10,
    message:
      lengthPoints === 10
        ? "Resume length is ATS-friendly"
        : "Ideal resume length is 300–800 words",
  })

  /* ACTION VERBS */
  const verbCount = ACTION_VERBS.filter(v =>
    totalText.toLowerCase().includes(v)
  ).length

  const verbPoints = verbCount >= 6 ? 10 : verbCount >= 3 ? 5 : 0
  score += verbPoints

  breakdown.push({
    label: "Action Verbs",
    points: verbPoints,
    max: 10,
    message:
      verbPoints === 10
        ? "Strong action verbs detected"
        : "Use more action verbs (built, optimized, led)",
  })

  return {
    score: Math.min(score, 100),
    breakdown,
  }
}
