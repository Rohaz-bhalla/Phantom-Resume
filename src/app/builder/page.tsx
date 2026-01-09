import { getOrCreateActiveResume } from "@/app/actions/resume"
import BuilderClient from "./builder-client"
import { ResumeSchema } from "@/lib/resume/resume.schema"

export default async function BuilderPage() {
  const resume = await getOrCreateActiveResume()
  return <BuilderClient resume={{ ...resume, data: ResumeSchema.parse(resume.data) }} />
}
