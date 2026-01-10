import { z } from "zod"
import { emptyStringToUndefined } from "@/lib/utils/zod"

// --- SUB-SCHEMAS ---

const LinkSchema = z.object({
  linkedin: emptyStringToUndefined(z.string()).optional(),
  github: emptyStringToUndefined(z.string()).optional(),
  twitter: emptyStringToUndefined(z.string()).optional(),
})

const CustomFieldSchema = z.object({
  id: z.string(),
  label: z.string(),
  value: z.string(),
})

const BasicsSchema = z.object({
  name: emptyStringToUndefined(z.string().min(2, "Name must be at least 2 characters")),
  email: emptyStringToUndefined(z.string().email("Invalid email address")),
  phone: emptyStringToUndefined(z.string()).optional(),
  location: emptyStringToUndefined(z.string()).optional(),
  links: LinkSchema.optional(),
  customFields: z.array(CustomFieldSchema).optional(),
})

const ExperienceSchema = z.object({
  company: emptyStringToUndefined(z.string()),
  role: emptyStringToUndefined(z.string()),
  startDate: emptyStringToUndefined(z.string()),
  endDate: emptyStringToUndefined(z.string()).optional(),
  bullets: z.array(z.string()),
})

const ProjectSchema = z.object({
  title: emptyStringToUndefined(z.string()),
  bullets: z.array(z.string()),
  tech: z.array(z.string()),
  github: emptyStringToUndefined(z.string()).optional(),
  website: emptyStringToUndefined(z.string()).optional(),
})

const EducationSchema = z.object({
  institute: emptyStringToUndefined(z.string()),
  degree: emptyStringToUndefined(z.string()),
  year: emptyStringToUndefined(z.string()),
})

const CertificationSchema = z.object({
  name: emptyStringToUndefined(z.string()),
  issuer: emptyStringToUndefined(z.string()),
  date: emptyStringToUndefined(z.string()),
  url: emptyStringToUndefined(z.string()).optional(),
})

// --- NEW: Custom Section Schema ---
const CustomSectionItemSchema = z.object({
  id: z.string(),
  name: z.string(), 
  description: z.string(),
})

const CustomSectionSchema = z.object({
  id: z.string(),
  title: z.string(),
  items: z.array(CustomSectionItemSchema),
})

// --- MAIN SCHEMA (Strict) ---
export const ResumeSchema = z.object({
  basics: BasicsSchema,
  summary: emptyStringToUndefined(z.string()).optional(),
  skills: z.array(z.string()),
  experience: z.array(ExperienceSchema),
  projects: z.array(ProjectSchema),
  education: z.array(EducationSchema),
  certifications: z.array(CertificationSchema),
  // Added customSections
  customSections: z.array(CustomSectionSchema).optional(),
})

// --- DRAFT SCHEMA (Loose) ---
export const ResumeDraftSchema = z.object({
  basics: z.any(),
  summary: z.string().optional(),
  skills: z.array(z.string()).optional(),
  experience: z.array(z.any()).optional(),
  projects: z.array(z.any()).optional(),
  education: z.array(z.any()).optional(),
  certifications: z.array(z.any()).optional(),
  
  // Loose validation for autosave
  customSections: z.array(z.object({
    id: z.string(),
    title: z.string(),
    items: z.array(z.object({
      id: z.string(),
      name: z.string(),
      description: z.string(),
    })),
  })).optional(),
})