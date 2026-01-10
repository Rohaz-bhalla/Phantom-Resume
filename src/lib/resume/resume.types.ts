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
    }
    // New Custom Fields
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
  }[]

  education: {
    institute: string
    degree: string
    year: string
  }[]
  
  // New Certifications
  certifications: {
    name: string
    issuer: string
    date: string
    url?: string
  }[]
}