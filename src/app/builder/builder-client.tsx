/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState, useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import type { Resume } from "@/lib/resume/resume.types"
import { ResumeDraftSchema } from "@/lib/resume/resume.schema"
import { updateResume } from "@/app/actions/resume"

import { Navbar } from "@/components/Navbar" // Import the Unified Navbar
import { ResumeForm } from "@/components/builder/ResumeForm"
import { ResumePreview } from "@/components/resume/ResumePreview"
import { AtsScorePanel } from "@/components/ats/AtsScorePanel"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function BuilderClient({ resume }: { resume: any }) {
  const [isSaving, setIsSaving] = useState(false);
  
  const form = useForm<Resume>({
    resolver: zodResolver(ResumeDraftSchema as any),
    defaultValues: resume.data,
  })

  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // AUTOSAVE LOGIC
  useEffect(() => {
    const sub = form.watch((value) => {
      setIsSaving(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      
      timeoutRef.current = setTimeout(async () => {
        await updateResume(resume.id, value)
        setIsSaving(false);
      }, 1000)
    })

    return () => {
      sub.unsubscribe()
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [form, resume.id])

  return (
    <div className="flex h-screen flex-col bg-background">
      
      {/* --- UNIFIED NAVBAR --- */}
      <Navbar 
        isBuilder={true} 
        isSaving={isSaving} 
        onDownload={() => window.open("/api/resume/download", "_blank")} 
      />

      {/* --- MAIN CONTENT --- */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* LEFT PANEL: EDITOR & TOOLS */}
        <aside className="w-full max-w-xl overflow-y-auto border-r bg-background p-6 md:w-1/2 lg:w-125">
          <Tabs defaultValue="editor" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="editor">Editor</TabsTrigger>
              <TabsTrigger value="ats">ATS Score</TabsTrigger>
            </TabsList>
            
            <TabsContent value="editor" className="space-y-6">
              <ResumeForm form={form} />
            </TabsContent>
            
            <TabsContent value="ats">
              <AtsScorePanel resume={form.watch()} />
            </TabsContent>
          </Tabs>
        </aside>

        {/* RIGHT PANEL: PREVIEW */}
        <main className="flex-1 bg-muted/30 p-8 overflow-y-auto">
            <div className="mx-auto max-w-[210mm] shadow-2xl rounded-sm overflow-hidden bg-white dark:bg-white dark:text-black transition-all">
               <ResumePreview data={form.watch()} />
            </div>
        </main>
      </div>
    </div>
  )
}