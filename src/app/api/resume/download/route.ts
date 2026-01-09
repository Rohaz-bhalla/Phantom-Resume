import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { resumes } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"
import { ResumeSchema } from "@/lib/resume/resume.schema"

export async function GET() {
  const { userId } = await auth()
  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  const resume = await db.query.resumes.findFirst({
    where: (r, { eq, and }) =>
      and(eq(r.userId, userId), eq(r.isActive, true)),
  })

  if (!resume) {
    return new NextResponse("Resume not found", { status: 404 })
  }

  // ✅ strict validation ONLY here
  const validResume = ResumeSchema.parse(resume.data)

  // TEMP: return JSON (to prove download works)
  return new NextResponse(JSON.stringify(validResume, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="resume.json"`,
    },
  })
}
