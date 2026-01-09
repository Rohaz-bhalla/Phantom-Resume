"use client"

import { UseFormReturn, useFieldArray } from "react-hook-form"
import type { Resume } from "@/lib/resume/resume.types"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ProjectItem } from "./ProjectItem"

export function ProjectsSection({
  form,
}: {
  form: UseFormReturn<Resume>
}) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "projects",
  })

  return (
    <section className="space-y-4">
      <h2 className="text-xs uppercase tracking-wide text-muted-foreground">
        Projects
      </h2>
      <Separator />

      {fields.map((field, index) => (
        <ProjectItem
          key={field.id}
          form={form}
          index={index}
          onRemove={() => remove(index)}
        />
      ))}

      <Button
        type="button"
        onClick={() =>
          append({
            title: "",
            bullets: [],
            tech: [],
          })
        }
      >
        + Add Project
      </Button>
    </section>
  )
}
