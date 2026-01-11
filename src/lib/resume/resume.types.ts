export type Resume = {
  basics: {
    name: string
    email: string
    phone?: string
    location?: string
    links?: {
      linkedin?: string
      github?: string
      twitter?: string
      portfolio?: string
    }
    // Simple custom fields (like Portfolio URL) inside "Personal Info"
    customFields?: {
      id: string
      label: string
      value: string
    }[]
  }

  summary: string

  skills: string[]

  experience: {
    company: string
    role: string
    startDate: string
    endDate?: string
    bullets: string[]
  }[]

  projects: {
    title: string
    bullets: string[]
    tech: string[]
    github?: string
    website?: string
  }[]

  education: {
    institute: string
    degree: string
    year: string
  }[]
  
  certifications: {
    name: string
    issuer: string
    date: string
    url?: string
  }[]

  // --- NEW: Dynamic Custom Sections (e.g. "Volunteering", "Publications") ---
  customSections: {
    id: string
    title: string // The Section Header
    items: {
      id: string
      name: string // Item Title (e.g. "Soup Kitchen Volunteer")
      description: string // Details or URL
    }[]
  }[]
}