"use server"

import { db } from "@/lib/db"
import { resumes } from "@/lib/db/schema"
import { auth } from "@clerk/nextjs/server"
import { createEmptyResume } from "@/lib/resume/empty-resume"
import { ResumeSchema } from "@/lib/resume/resume.schema"
import { and, eq } from "drizzle-orm"

/* Get or create active resume */
export async function getOrCreateActiveResume() {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const existing = await db.query.resumes.findFirst({
    where: (r, { eq, and }) =>
      and(eq(r.userId, userId), eq(r.isActive, true)),
  })

  if (existing) return existing

  const [created] = await db
    .insert(resumes)
    .values({
      userId,
      data: createEmptyResume(),
      isActive: true,
    })
    .returning()

  return created
}

/* Update resume (autosave) */
export async function updateResume(resumeId: string, data: unknown) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const parsed = ResumeSchema.parse(data)

  await db
    .update(resumes)
    .set({
      data: parsed,
      updatedAt: new Date(),
    })
    .where(and(eq(resumes.id, resumeId), eq(resumes.userId, userId)))
}
