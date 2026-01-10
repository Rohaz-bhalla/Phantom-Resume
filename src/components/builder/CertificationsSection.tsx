"use client"
import { UseFormReturn, useFieldArray } from "react-hook-form"
import type { Resume } from "@/lib/resume/resume.types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Trash2, Plus } from "lucide-react"

export function CertificationsSection({ form }: { form: UseFormReturn<Resume> }) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "certifications",
  })

  return (
    <div className="space-y-4">
      {fields.map((field, index) => (
        <Card key={field.id}>
          {/* CHANGED: Increased pt-6 to pt-10 to prevent Trash button overlap */}
          <CardContent className="pt-10 relative space-y-3">
             <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2 text-muted-foreground hover:text-destructive"
                onClick={() => remove(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>

            {/* CHANGED: grid-cols-2 to grid-cols-1 md:grid-cols-2 for mobile responsiveness */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label>Certification Name</Label>
                <Input {...form.register(`certifications.${index}.name`)} placeholder="AWS Certified Solutions Architect" />
              </div>
              <div>
                <Label>Issuer</Label>
                <Input {...form.register(`certifications.${index}.issuer`)} placeholder="Amazon Web Services" />
              </div>
            </div>
            
            {/* CHANGED: grid-cols-2 to grid-cols-1 md:grid-cols-2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label>Date</Label>
                <Input {...form.register(`certifications.${index}.date`)} placeholder="May 2024" />
              </div>
              <div>
                <Label>URL (Optional)</Label>
                <Input {...form.register(`certifications.${index}.url`)} placeholder="https://..." />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      
      <Button
        type="button"
        variant="outline"
        className="w-full border-dashed"
        // CHANGED: Added url: "" to initialize the field correctly
        onClick={() => append({ name: "", issuer: "", date: "", url: "" })}
      >
        <Plus className="mr-2 h-4 w-4" /> Add Certification
      </Button>
    </div>
  )
}