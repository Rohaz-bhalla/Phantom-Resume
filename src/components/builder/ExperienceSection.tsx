"use client"

import { UseFormReturn, useFieldArray } from "react-hook-form"
import type { Resume } from "@/lib/resume/resume.types"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ExperienceItem } from "./ExperienceItem"

export function ExperienceSection({
  form,
}: {
  form: UseFormReturn<Resume>
}) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "experience",
  })

  return (
    <section className="space-y-4">
      <h2 className="text-xs uppercase tracking-wide text-muted-foreground">
        Experience
      </h2>
      <Separator />

      {fields.map((field, index) => (
        <ExperienceItem
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
            company: "",
            role: "",
            startDate: "",
            endDate: "",
            bullets: [],
          })
        }
      >
        + Add Experience
      </Button>
    </section>
  )
}
