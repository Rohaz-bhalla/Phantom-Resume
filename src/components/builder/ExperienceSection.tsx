"use client"

import { UseFormReturn, useFieldArray } from "react-hook-form"
import { Resume } from "@/lib/resume/resume.types" // Adjust path if needed
import { ExperienceItem } from "./ExperienceItem" // Imports your renamed file
import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export function ExperienceSection({ form }: { form: UseFormReturn<Resume> }) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "experience",
  })

  return (
    <div className="space-y-4">
      <Accordion type="single" collapsible className="w-full space-y-2">
        {fields.map((field, index) => {
           // Get data for the title
           const company = form.watch(`experience.${index}.company`)
           const role = form.watch(`experience.${index}.role`)
           
           return (
            <AccordionItem key={field.id} value={field.id} className="border rounded-md px-2">
              <div className="flex justify-between items-center">
                <AccordionTrigger className="hover:no-underline text-sm font-semibold">
                   {company || role ? `${company} - ${role}` : `Experience ${index + 1}`}
                </AccordionTrigger>
                <Button variant="ghost" size="sm" onClick={() => remove(index)}>
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
              <AccordionContent className="p-2">
                <ExperienceItem form={form} index={index} onRemove={() => remove(index)} />
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
            company: "",
            role: "",
            startDate: "",
            endDate: "",
            bullets: [],
          })
        }
      >
        <Plus className="mr-2 h-4 w-4" /> Add Experience
      </Button>
    </div>
  )
}