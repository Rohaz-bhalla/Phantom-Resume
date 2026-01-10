/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { UseFormReturn, useFieldArray } from "react-hook-form"
import { Resume } from "@/lib/resume/resume.types"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

// Helper component to handle the details of one project
function ProjectItem({ 
  form, 
  index 
}: { 
  form: UseFormReturn<Resume>, 
  index: number 
}) {
  const { fields: bulletFields, append: appendBullet, remove: removeBullet } = useFieldArray({
    control: form.control,
    name: `projects.${index}.bullets` as any,
  })

  const { fields: techFields, append: appendTech, remove: removeTech } = useFieldArray({
    control: form.control,
    name: `projects.${index}.tech` as any,
  })

  return (
    <div className="space-y-4 pt-2">
      <div className="grid gap-2">
        <Label>Project Title</Label>
        <Input 
            {...form.register(`projects.${index}.title` as any)} 
            placeholder="e.g. E-Commerce Dashboard"
        />
      </div>

      {/* --- NEW: LINKS SECTION --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
           <Label>GitHub URL</Label>
           <Input 
             {...form.register(`projects.${index}.github` as any)} 
             placeholder="https://github.com/..."
           />
        </div>
        <div>
           <Label>Deployed Link (Website)</Label>
           <Input 
             {...form.register(`projects.${index}.website` as any)} 
             placeholder="https://my-app.vercel.app"
           />
        </div>
      </div>

      {/* Tech Stack Section */}
      <div className="space-y-2">
        <Label>Technologies</Label>
        <div className="flex flex-wrap gap-2">
            {techFields.map((field, tIndex) => (
                <div key={field.id} className="flex items-center gap-1">
                    <Input 
                        className="h-8 w-32 text-xs"
                        {...form.register(`projects.${index}.tech.${tIndex}` as any)} 
                        placeholder="Tech"
                    />
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => removeTech(tIndex)}
                    >
                        <X className="h-3 w-3" />
                    </Button>
                </div>
            ))}
            <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 text-xs"
                onClick={() => appendTech("New Tech" as any)}
            >
                + Tech
            </Button>
        </div>
      </div>

      {/* Bullets / Description Section */}
      <div className="space-y-2">
        <Label>Description / Bullets</Label>
        {bulletFields.map((field, bIndex) => (
          <div key={field.id} className="flex gap-2 items-start">
            <Textarea
              className="min-h-15 text-sm resize-none"
              {...form.register(`projects.${index}.bullets.${bIndex}` as any)}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="mt-1"
              onClick={() => removeBullet(bIndex)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-xs"
          onClick={() => appendBullet("" as any)}
        >
          + Add Description Bullet
        </Button>
      </div>
    </div>
  )
}

export function ProjectsSection({ form }: { form: UseFormReturn<Resume> }) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "projects",
  })

  return (
    <div className="space-y-4">
      <Accordion type="single" collapsible className="w-full space-y-2">
        {fields.map((field, index) => {
           const title = form.watch(`projects.${index}.title` as any) as string
           
           return (
            <AccordionItem key={field.id} value={field.id} className="border rounded-md px-2">
              <div className="flex justify-between items-center">
                <AccordionTrigger className="hover:no-underline text-sm font-semibold">
                   {title || `Project ${index + 1}`}
                </AccordionTrigger>
                
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-destructive hover:text-destructive"
                    onClick={(e) => {
                        e.stopPropagation()
                        remove(index)
                    }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              
              <AccordionContent className="p-2">
                 <ProjectItem form={form} index={index} />
              </AccordionContent>
            </AccordionItem>
          )
        })}
      </Accordion>

      <Button
        type="button"
        variant="outline"
        className="w-full border-dashed"
        onClick={() => 
            append({ 
                title: "", 
                bullets: [], 
                tech: [],
                // Initialize new fields
                github: "",
                website: "" 
            } as any)
        }
      >
        <Plus className="mr-2 h-4 w-4" /> Add Project
      </Button>
    </div>
  )
}