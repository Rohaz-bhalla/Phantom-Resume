import { z } from "zod"
import { emptyStringToUndefined } from "@/lib/utils/zod"

// --- SUB-SCHEMAS (Strict) ---
// We define these separately so we can reuse them or make them partial later

const LinkSchema = z.object({
  linkedin: emptyStringToUndefined(z.string()).optional(),
  github: emptyStringToUndefined(z.string()).optional(),
  twitter: emptyStringToUndefined(z.string()).optional(),
})

// 1. NEW: Custom Field Schema (for extra links/info in Header like Portfolio, Blog)
const CustomFieldSchema = z.object({
  id: z.string(),
  label: z.string(),
  value: z.string(),
})

const BasicsSchema = z.object({
  name: emptyStringToUndefined(
    z.string().min(2, "Name must be at least 2 characters")
  ),
  email: emptyStringToUndefined(
    z.string().email("Invalid email address")
  ),
  phone: emptyStringToUndefined(z.string()).optional(),
  location: emptyStringToUndefined(z.string()).optional(),
  links: LinkSchema.optional(),
  // 2. Added customFields to Basics
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
})

const EducationSchema = z.object({
  institute: emptyStringToUndefined(z.string()),
  degree: emptyStringToUndefined(z.string()),
  year: emptyStringToUndefined(z.string()),
})

// 3. NEW: Certification Schema
const CertificationSchema = z.object({
  name: emptyStringToUndefined(z.string()),
  issuer: emptyStringToUndefined(z.string()),
  date: emptyStringToUndefined(z.string()),
  url: emptyStringToUndefined(z.string()).optional(),
})

// --- MAIN SCHEMA (Strict - for Download/Export) ---
export const ResumeSchema = z.object({
  basics: BasicsSchema,
  summary: emptyStringToUndefined(z.string()).optional(),
  skills: z.array(z.string()),
  experience: z.array(ExperienceSchema),
  projects: z.array(ProjectSchema),
  education: z.array(EducationSchema),
  // 4. Added certifications array
  certifications: z.array(CertificationSchema),
})

// --- DRAFT SCHEMA (Loose - for Autosave) ---
// This allows empty strings, partial objects, and invalid emails during editing.

export const ResumeDraftSchema = z.object({
  basics: z.object({
    name: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
    location: z.string().optional(),
    links: z.object({
      linkedin: z.string().optional(),
      github: z.string().optional(),
      twitter: z.string().optional(),
    }).optional(),
    // Loose validation for custom fields
    customFields: z.array(z.object({
      id: z.string(), 
      label: z.string(), 
      value: z.string()
    })).optional(),
  }).optional(),

  summary: z.string().optional(),
  skills: z.array(z.string()).optional(),
  
  // We use z.any() for arrays here to prevent validation errors 
  // if a user has a "half-filled" item.
  experience: z.array(z.any()).optional(),
  projects: z.array(z.any()).optional(),
  education: z.array(z.any()).optional(),
  // Loose validation for certifications
  certifications: z.array(z.any()).optional(),
})