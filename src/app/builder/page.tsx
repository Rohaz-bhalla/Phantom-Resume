import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { getOrCreateActiveResume } from "@/app/actions/resume"
import BuilderClient from "./builder-client"

export default async function BuilderPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  const resume = await getOrCreateActiveResume()

  return <BuilderClient resume={resume} />
}
