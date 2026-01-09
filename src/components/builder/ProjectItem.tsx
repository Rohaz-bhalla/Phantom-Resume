/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { UseFormReturn, useFieldArray } from "react-hook-form"
import type { Resume } from "@/lib/resume/resume.types"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export function ProjectItem({
  form,
  index,
  onRemove,
}: {
  form: UseFormReturn<Resume>
  index: number
  onRemove: () => void
}) {
  const { fields, append, remove } = useFieldArray({
    control: form.control as any,
    name: `projects.${index}.bullets`,
  })

  return (
    <div className="space-y-3 rounded-md border border-border p-3">
      <div>
        <Label>Project Title</Label>
        <Input {...form.register(`projects.${index}.title`)} />
      </div>

      <div className="space-y-2">
        <Label>Description</Label>

        {fields.map((field, bIndex) => (
          <div key={field.id} className="flex gap-2">
            <Textarea
              className="min-h-15"
              {...form.register(
                `projects.${index}.bullets.${bIndex}`
              )}
            />
            <Button
              type="button"
              variant="ghost"
              onClick={() => remove(bIndex)}
            >
              ✕
            </Button>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={() => append("")}
        >
          + Add Bullet
        </Button>
      </div>

      <Button
        type="button"
        variant="destructive"
        onClick={onRemove}
      >
        Remove Project
      </Button>
    </div>
  )
}
