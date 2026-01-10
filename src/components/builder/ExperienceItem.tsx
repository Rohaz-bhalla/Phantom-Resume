/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import {
  UseFormReturn,
  useFieldArray,
} from "react-hook-form"
import type { Resume } from "@/lib/resume/resume.types"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Plus, X } from "lucide-react" // Suggested: Use Lucide icons for consistency

export function ExperienceItem({
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
    name: `experience.${index}.bullets`,
  })

  return (
    <div className="space-y-3 rounded-md border border-border p-3">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div>
          <Label>Company</Label>
          <Input {...form.register(`experience.${index}.company`)} />
        </div>

        <div>
          <Label>Role</Label>
          <Input {...form.register(`experience.${index}.role`)} />
        </div>
      </div>

      {/* CHANGED: Added responsive grid for dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <Label>Start Date</Label>
          <Input {...form.register(`experience.${index}.startDate`)} />
        </div>

        <div>
          <Label>End Date</Label>
          <Input {...form.register(`experience.${index}.endDate`)} />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Responsibilities</Label>

        {fields.map((field, bIndex) => (
          // CHANGED: items-start aligns button to top. key={field.id} is correct.
          <div key={field.id} className="flex gap-2 items-start">
            <Textarea
              // CHANGED: min-h-15 is invalid. Used min-h-[60px] or min-h-16
              className="min-h-[60px] resize-none" 
              {...form.register(
                `experience.${index}.bullets.${bIndex}`
              )}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="mt-1 shrink-0" // Add margin-top to align with text
              onClick={() => remove(bIndex)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          size="sm" // Smaller button for bullet points
          onClick={() => append("")}
        >
          <Plus className="mr-2 h-4 w-4" /> Add Bullet
        </Button>
      </div>

      <Button
        type="button"
        variant="destructive"
        className="w-full mt-2" // Full width for better mobile touch target
        onClick={onRemove}
      >
        Remove Experience
      </Button>
    </div>
  )
}