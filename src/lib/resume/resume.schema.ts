import { z } from "zod"
import { emptyStringToUndefined } from "@/lib/utils/zod"

export const ResumeSchema = z.object({
  basics: z.object({
    name: emptyStringToUndefined(
      z.string().min(2, "Name must be at least 2 characters")
    ),

    email: emptyStringToUndefined(
      z.string().email("Invalid email address")
    ),

    phone: emptyStringToUndefined(z.string()).optional(),
    location: emptyStringToUndefined(z.string()).optional(),

    links: z
      .object({
        linkedin: emptyStringToUndefined(z.string()).optional(),
        github: emptyStringToUndefined(z.string()).optional(),
        twitter: emptyStringToUndefined(z.string()).optional(),
      })
      .optional(),
  }),

  summary: emptyStringToUndefined(z.string()).optional(),

  skills: z.array(z.string()),

  experience: z.array(
    z.object({
      company: emptyStringToUndefined(z.string()),
      role: emptyStringToUndefined(z.string()),
      startDate: emptyStringToUndefined(z.string()),
      endDate: emptyStringToUndefined(z.string()).optional(),
      bullets: z.array(z.string()),
    })
  ),

  projects: z.array(
    z.object({
      title: emptyStringToUndefined(z.string()),
      bullets: z.array(z.string()),
      tech: z.array(z.string()),
    })
  ),

  education: z.array(
    z.object({
      institute: emptyStringToUndefined(z.string()),
      degree: emptyStringToUndefined(z.string()),
      year: emptyStringToUndefined(z.string()),
    })
  ),
})

/* 🔓 DRAFT (autosave-safe) */
export const ResumeDraftSchema = ResumeSchema.partial()
