"use server"

import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { resumes } from "@/lib/db/schema"
import { and, eq } from "drizzle-orm"
import { createEmptyResume } from "@/lib/resume/empty-resume"
import { ResumeSchema } from "@/lib/resume/resume.schema"

export async function getOrCreateActiveResume() {
  const { userId } = await auth()
  if (!userId) return null

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

export async function updateResume(resumeId: string, data: unknown) {
  const { userId } = await auth()
  if (!userId) return

  const parsed = ResumeSchema.parse(data)

  await db
    .update(resumes)
    .set({
      data: parsed,
      updatedAt: new Date(),
    })
    .where(and(eq(resumes.id, resumeId), eq(resumes.userId, userId)))
}
