"use client"

import { UseFormReturn } from "react-hook-form"
import type { Resume } from "@/lib/resume/resume.types"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

import { ExperienceSection } from "./ExperienceSection"
import { ProjectsSection } from "./ProjectsSection"

export function ResumeForm({ form }: { form: UseFormReturn<Resume> }) {
  return (
    <div className="space-y-8">

      {/* BASICS */}
      <section>
        <h2 className="text-xs uppercase tracking-wide text-muted-foreground">
          Basics
        </h2>
        <Separator className="my-2" />

        <div className="space-y-3">
          <div>
            <Label>Name</Label>
            <Input {...form.register("basics.name")} />
          </div>

          <div>
            <Label>Email</Label>
            <Input {...form.register("basics.email")} />
          </div>
        </div>
      </section>

      {/* SUMMARY */}
      <section>
        <h2 className="text-xs uppercase tracking-wide text-muted-foreground">
          Summary
        </h2>
        <Separator className="my-2" />

        <Textarea
          className="min-h-30"
          {...form.register("summary")}
        />
      </section>

      <ExperienceSection form={form} />
      <ProjectsSection form={form} />

    </div>
  )
}
