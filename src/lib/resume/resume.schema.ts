import { z } from "zod"

export const ResumeSchema = z.object({
  basics: z.object({
    name: z.string().min(2),
    email: z.email(),
    phone: z.string().optional(),
    location: z.string().optional(),
    links: z.object({
      linkedin: z.url().optional(),
      github: z.url().optional(),
      twitter: z.url().optional(),
    }).optional(),
  }),
  summary: z.string(),
  skills: z.array(z.string()),
  experience: z.array(
    z.object({
      company: z.string(),
      role: z.string(),
      startDate: z.string(),
      endDate: z.string().optional(),
      bullets: z.array(z.string()),
    })
  ),
  projects: z.array(
    z.object({
      title: z.string(),
      bullets: z.array(z.string()),
      tech: z.array(z.string()),
    })
  ),
  education: z.array(
    z.object({
      institute: z.string(),
      degree: z.string(),
      year: z.string(),
    })
  ),
})
