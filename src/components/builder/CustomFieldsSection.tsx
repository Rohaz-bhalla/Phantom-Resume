"use client"

import { UseFormReturn, useFieldArray } from "react-hook-form"
import { Resume } from "@/lib/resume/resume.types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, X } from "lucide-react"

export function CustomFieldsSection({ form }: { form: UseFormReturn<Resume> }) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "basics.customFields",
  })

  return (
    <div className="space-y-3 pt-2">
      <Label>Additional Links (Portfolio, Blog, etc)</Label>
      <div className="space-y-2">
        {fields.map((field, index) => (
          <div key={field.id} className="flex gap-2 items-end">
             <div className="grid w-1/3 gap-1.5">
                <Label className="text-xs text-muted-foreground">Label</Label>
                <Input
                  {...form.register(`basics.customFields.${index}.label`)}
                  placeholder="e.g. Portfolio"
                />
             </div>
             <div className="grid flex-1 gap-1.5">
                <Label className="text-xs text-muted-foreground">Link / URL</Label>
                <Input
                  {...form.register(`basics.customFields.${index}.value`)}
                  placeholder="https://..."
                />
             </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="mb-0.5 text-destructive hover:text-destructive/90"
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
        className="w-full border-dashed"
        onClick={() => append({ id: crypto.randomUUID(), label: "", value: "" })}
      >
        <Plus className="mr-2 h-4 w-4" /> Add Link
      </Button>
    </div>
  )
}