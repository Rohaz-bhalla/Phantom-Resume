"use client"

import { UseFormReturn } from "react-hook-form"
import { 
  User, Briefcase, Layers, Award, Zap, RotateCcw, 
  PenTool 
} from "lucide-react" 
import type { Resume } from "@/lib/resume/resume.types"

// Section Components
import { CertificationsSection } from "./CertificationsSection"
import { ExperienceSection } from "./ExperienceSection"
import { ProjectsSection } from "./ProjectsSection"
import { SkillsSection } from './SkillsSection'
import { CustomSectionManager } from "./CustomSectionManager"
import { CustomFieldsSection } from "./CustomFieldsSection"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button" 
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export function ResumeForm({ form }: { form: UseFormReturn<Resume> }) {

  const handleReset = () => {
    if (confirm("Resetting will clear all data. Continue?")) {
      form.reset({
        basics: { name: "", email: "", summary: "", customFields: [] },
        experience: [],
        projects: [],
        skills: [],
        certifications: [],
        education: [],
        customSections: [],
      } as unknown as Resume)
    }
  }

  return (
    <div className="space-y-6">
      
      {/* HEADER */}
      <div className="flex items-center justify-between border-b pb-2">
        <h2 className="text-lg font-semibold tracking-tight">Editor</h2>
        <Button type="button" variant="destructive" size="sm" onClick={handleReset}>
          <RotateCcw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>

      {/* SECTIONS */}
      <Accordion type="single" collapsible defaultValue="basics" className="w-full">

        {/* 1. SKILLS */}
        <AccordionItem value="skills">
          <AccordionTrigger>
             <div className="flex items-center gap-2"> <Zap className="h-4 w-4" /> <span>Skills</span> </div>
          </AccordionTrigger>
          <AccordionContent className="px-1 pt-2"> <SkillsSection form={form} /> </AccordionContent>
        </AccordionItem>

        {/* 2. CERTIFICATIONS */}
        <AccordionItem value="certifications">
          <AccordionTrigger>
             <div className="flex items-center gap-2"> <Award className="h-4 w-4" /> <span>Certifications</span> </div>
          </AccordionTrigger>
          <AccordionContent className="px-1 pt-2"> <CertificationsSection form={form} /> </AccordionContent>
        </AccordionItem>
        
        {/* 3. BASICS (Fixed Spacing) */}
        <AccordionItem value="basics">
          <AccordionTrigger>
             <div className="flex items-center gap-2"> <User className="h-4 w-4" /> <span>Personal Information</span> </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-6 px-1 pt-4">
            
            {/* CHANGED: grid-cols-1 for full width, gap-6 for more space between fields */}
            <div className="grid grid-cols-1 gap-6">
              
              {/* Added space-y-3 (12px) between Label and Input */}
              <div className="space-y-3"> 
                <Label className="text-base">Full Name</Label> 
                <Input {...form.register("basics.name")} className="h-10" placeholder="e.g. John Doe" /> 
              </div>
              
              <div className="space-y-3"> 
                <Label className="text-base">Email</Label> 
                <Input {...form.register("basics.email")} className="h-10" placeholder="john@example.com" /> 
              </div>
            </div>
            
            <div className="space-y-3"> 
                <Label className="text-base">Summary</Label> 
                <Textarea className="min-h-[140px] resize-y text-base" {...form.register("summary")} placeholder="Brief professional summary..." /> 
            </div>

            <div className="pt-4 border-t mt-6">
               <CustomFieldsSection form={form} />
            </div>

          </AccordionContent>
        </AccordionItem>

        {/* 4. EXPERIENCE */}
        <AccordionItem value="experience">
          <AccordionTrigger>
             <div className="flex items-center gap-2"> <Briefcase className="h-4 w-4" /> <span>Experience</span> </div>
          </AccordionTrigger>
          <AccordionContent className="px-1 pt-2"> <ExperienceSection form={form} /> </AccordionContent>
        </AccordionItem>

        {/* 5. CUSTOM SECTIONS */}
        <AccordionItem value="custom-sections">
          <AccordionTrigger>
             <div className="flex items-center gap-2"> 
                <PenTool className="h-4 w-4" /> 
                <span>Custom Sections</span> 
             </div>
          </AccordionTrigger>
          <AccordionContent className="px-1 pt-2"> 
             <CustomSectionManager form={form} /> 
          </AccordionContent>
        </AccordionItem>

        {/* 6. PROJECTS */}
        <AccordionItem value="projects">
          <AccordionTrigger>
             <div className="flex items-center gap-2"> <Layers className="h-4 w-4" /> <span>Projects</span> </div>
          </AccordionTrigger>
          <AccordionContent className="px-1 pt-2"> <ProjectsSection form={form} /> </AccordionContent>
        </AccordionItem>

      </Accordion>
    </div>
  )
}