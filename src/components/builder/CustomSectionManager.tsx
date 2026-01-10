"use client"

import { UseFormReturn, useFieldArray } from "react-hook-form"
import { Resume } from "@/lib/resume/resume.types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Plus, Trash2, GripVertical, FolderPlus } from "lucide-react"

// Inner component to handle items INSIDE a custom section
function CustomSectionItems({ 
  form, 
  sectionIndex 
}: { 
  form: UseFormReturn<Resume>, 
  sectionIndex: number 
}) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: `customSections.${sectionIndex}.items` as any,
  })

  return (
    <div className="space-y-3 mt-2">
      {fields.map((item, itemIndex) => (
        <div key={item.id} className="grid gap-3 rounded-md border p-3 bg-muted/20">
          <div className="flex items-start justify-between gap-2">
            <div className="grid flex-1 gap-2">
              <div className="space-y-1">
                 <Label className="text-xs text-muted-foreground">Heading / Name</Label>
                 <Input 
                   {...form.register(`customSections.${sectionIndex}.items.${itemIndex}.name` as any)} 
                   placeholder="e.g. Project Title, Role, or Link Name" 
                 />
              </div>
              <div className="space-y-1">
                 <Label className="text-xs text-muted-foreground">Content / Description / URL</Label>
                 <Textarea 
                   {...form.register(`customSections.${sectionIndex}.items.${itemIndex}.description` as any)} 
                   placeholder="Description..."
                   className="min-h-[60px]"
                 />
              </div>
            </div>
            
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-destructive mt-6"
              onClick={() => remove(itemIndex)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}

      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="w-full border-dashed border"
        onClick={() => append({ id: crypto.randomUUID(), name: "", description: "" } as any)}
      >
        <Plus className="mr-2 h-3 w-3" /> Add Item
      </Button>
    </div>
  )
}

// Main Component
export function CustomSectionManager({ form }: { form: UseFormReturn<Resume> }) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "customSections",
  })

  return (
    <div className="space-y-6">
       {/* List of Custom Sections */}
       {fields.map((field, index) => (
          <div key={field.id} className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="flex flex-col space-y-1.5 p-4 pb-2">
               <div className="flex items-center gap-2">
                 <GripVertical className="h-4 w-4 text-muted-foreground/50" />
                 <div className="grid flex-1 gap-1">
                    <Label className="text-xs font-semibold text-muted-foreground">Section Title</Label>
                    <Input 
                        {...form.register(`customSections.${index}.title` as any)} 
                        placeholder="e.g. Volunteering, Publications, Portfolio"
                        className="font-medium"
                    />
                 </div>
                 <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:bg-destructive/10"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                 </Button>
               </div>
            </div>
            
            <div className="p-4 pt-0">
               <CustomSectionItems form={form} sectionIndex={index} />
            </div>
          </div>
       ))}

       {/* Add New Section Button */}
       <Button
        type="button"
        variant="outline"
        className="w-full py-6 border-dashed"
        onClick={() => append({ 
            id: crypto.randomUUID(), 
            title: "", 
            items: [] 
        } as any)}
      >
        <FolderPlus className="mr-2 h-5 w-5" /> 
        Create New Custom Section
      </Button>
    </div>
  )
}