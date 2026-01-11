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
import { ImportDialog } from "./ImportDialog" // <--- IMPORT THIS

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
      
      {/* HEADER with Import Button */}
      <div className="flex items-center justify-between border-b pb-4">
        <h2 className="text-lg font-semibold tracking-tight">Editor</h2>
        
        <div className="flex gap-2">
            {/* --- NEW IMPORT BUTTON --- */}
            <ImportDialog form={form} />
            
            <Button type="button" variant="destructive" size="sm" onClick={handleReset}>
                <RotateCcw className="mr-2 h-4 w-4" /> Reset
            </Button>
        </div>
      </div>

      {/* SECTIONS */}
      <Accordion type="single" collapsible defaultValue="basics" className="w-full">

        {/* 1. BASICS */}
        <AccordionItem value="basics">
          <AccordionTrigger>
             <div className="flex items-center gap-2"> <User className="h-4 w-4" /> <span>Personal Information</span> </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 px-1 pt-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"> <Label>Full Name</Label> <Input {...form.register("basics.name")} /> </div>
              <div className="space-y-2"> <Label>Email</Label> <Input {...form.register("basics.email")} /> </div>
            </div>
            
            {/* Note: Summary is often root level, but we can edit it here or in a separate section if you prefer */}
            <div className="space-y-2"> 
                <Label>Summary</Label> 
                <Textarea className="min-h-[100px]" {...form.register("summary")} /> 
            </div>

            <div className="pt-2 border-t mt-4">
               <CustomFieldsSection form={form} />
            </div>
          </AccordionContent>
        </AccordionItem>
        
        {/* 2. SKILLS */}
        <AccordionItem value="skills">
          <AccordionTrigger>
             <div className="flex items-center gap-2"> <Zap className="h-4 w-4" /> <span>Skills</span> </div>
          </AccordionTrigger>
          <AccordionContent className="px-1 pt-2"> <SkillsSection form={form} /> </AccordionContent>
        </AccordionItem>

        {/* 3. EXPERIENCE */}
        <AccordionItem value="experience">
          <AccordionTrigger>
             <div className="flex items-center gap-2"> <Briefcase className="h-4 w-4" /> <span>Experience</span> </div>
          </AccordionTrigger>
          <AccordionContent className="px-1 pt-2"> <ExperienceSection form={form} /> </AccordionContent>
        </AccordionItem>

        {/* 4. PROJECTS */}
        <AccordionItem value="projects">
          <AccordionTrigger>
             <div className="flex items-center gap-2"> <Layers className="h-4 w-4" /> <span>Projects</span> </div>
          </AccordionTrigger>
          <AccordionContent className="px-1 pt-2"> <ProjectsSection form={form} /> </AccordionContent>
        </AccordionItem>

        {/* 5. EDUCATION (If you have a component for it, otherwise omit or add placeholder) */}
        {/* <AccordionItem value="education">...</AccordionItem> */}

        {/* 6. CERTIFICATIONS */}
        <AccordionItem value="certifications">
          <AccordionTrigger>
             <div className="flex items-center gap-2"> <Award className="h-4 w-4" /> <span>Certifications</span> </div>
          </AccordionTrigger>
          <AccordionContent className="px-1 pt-2"> <CertificationsSection form={form} /> </AccordionContent>
        </AccordionItem>

        {/* 7. CUSTOM SECTIONS */}
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

      </Accordion>
    </div>
  )
}