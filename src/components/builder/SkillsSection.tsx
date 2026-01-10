/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { UseFormReturn, useFieldArray } from "react-hook-form"
import { Resume } from "@/lib/resume/resume.types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, X } from "lucide-react"

export function SkillsSection({ form }: { form: UseFormReturn<Resume> }) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "skills" as any, // Cast to any to bypass strict path checking if needed
  })

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {fields.map((field, index) => (
          <div key={field.id} className="flex gap-2 items-center">
            {/* We register "skills.0", "skills.1" directly.
               We cast to 'any' here because TypeScript sometimes struggles 
               inferring paths for simple string arrays in React Hook Form.
            */}
            <Input
              {...form.register(`skills.${index}` as any)} 
              defaultValue={field as unknown as string} 
              placeholder="e.g. React"
            />
            
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => remove(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        // We append a simple string "" instead of an object {name: ""}
        onClick={() => append("" as any)} 
      >
        <Plus className="mr-2 h-4 w-4" /> Add Skill
      </Button>
    </div>
  )
}