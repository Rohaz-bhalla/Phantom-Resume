import type { Resume } from "./resume.types"

export function createEmptyResume(): Resume {
  return {
    basics: {
      name: "",
      email: "",
      phone: "",
      location: "",
      links: {},
    },
    summary: "",
    skills: [],
    experience: [],
    projects: [],
    education: [],
  }
}
