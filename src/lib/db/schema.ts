import { pgTable, text, jsonb, timestamp, uuid, boolean } from "drizzle-orm/pg-core"
import type { Resume } from "@/lib/resume/resume.types"

export const resumes = pgTable("resumes", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull(),

  data: jsonb("data").$type<Resume>().notNull(),

  isActive: boolean("is_active").default(true),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})
