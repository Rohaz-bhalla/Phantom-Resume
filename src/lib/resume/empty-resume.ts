import type { Resume } from "./resume.types"

export function createEmptyResume(): Resume {
  return {
    basics: {
      name: "",
      email: "",
      phone: "",
      location: "",
      links: {},
      customFields: [] // Also often required by strict Resume types, ensuring safety
    },
    summary: "",
    skills: [],
    experience: [],
    projects: [],
    education: [],
    // ✅ Add these missing fields
    certifications: [],
    customSections: [],
  }
}