"use client"

import { UseFormReturn } from "react-hook-form"
import { 
  User, 
  Briefcase, 
  Layers, 
  Award, 
  Zap, 
  RotateCcw, // Added Reset Icon
} from "lucide-react" 
import type { Resume } from "@/lib/resume/resume.types"

import { CertificationsSection } from "./CertificationsSection"
import { ExperienceSection } from "./ExperienceSection"
import { ProjectsSection } from "./ProjectsSection"
import { SkillsSection } from './SkillsSection'

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button" // Ensure Button is imported
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export function ResumeForm({ form }: { form: UseFormReturn<Resume> }) {

  // --- HANDLE RESET LOGIC ---
  const handleReset = () => {
    if (confirm("Are you sure you want to clear the entire resume? This cannot be undone.")) {
      form.reset({
        basics: {
          name: "",
          email: "",
          summary: "", 
          // Add phone/location/url here if they exist in your schema
        },
        experience: [],
        projects: [],
        skills: [],
        certifications: [],
        education: [], // Including this just in case your type requires it
      } as unknown as Resume)
    }
  }

  return (
    <div className="space-y-6">
      
      {/* --- TOP HEADER WITH RESET BUTTON --- */}
      <div className="flex items-center justify-between border-b pb-2">
        <h2 className="text-lg font-semibold tracking-tight">Editor</h2>
        <Button 
          type="button" 
          variant="destructive" 
          size="sm" 
          onClick={handleReset}
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset Resume
        </Button>
      </div>

      {/* --- ACCORDION SECTIONS --- */}
      <Accordion type="single" collapsible defaultValue="basics" className="w-full">

        {/* SKILLS */}
        <AccordionItem value="skills">
          <AccordionTrigger>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              <span>Skills</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-1 pt-2">
            <SkillsSection form={form} />
          </AccordionContent>
        </AccordionItem>

        {/* CERTIFICATIONS */}
        <AccordionItem value="certifications">
          <AccordionTrigger>
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              <span>Certifications</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-1 pt-2">
            <CertificationsSection form={form} />
          </AccordionContent>
        </AccordionItem>
        
        {/* BASICS */}
        <AccordionItem value="basics">
          <AccordionTrigger>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>Personal Information</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 px-1 pt-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input {...form.register("basics.name")} placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input {...form.register("basics.email")} placeholder="john@example.com" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Professional Summary</Label>
              <Textarea 
                className="min-h-[120px] resize-none" 
                placeholder="Briefly describe your professional background..."
                {...form.register("summary")} 
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* EXPERIENCE */}
        <AccordionItem value="experience">
          <AccordionTrigger>
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              <span>Experience</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-1 pt-2">
            <ExperienceSection form={form} />
          </AccordionContent>
        </AccordionItem>

        {/* PROJECTS */}
        <AccordionItem value="projects">
          <AccordionTrigger>
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4" />
              <span>Projects</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-1 pt-2">
            <ProjectsSection form={form} />
          </AccordionContent>
        </AccordionItem>

      </Accordion>
    </div>
  )
}