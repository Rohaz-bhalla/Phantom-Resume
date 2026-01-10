/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState, useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import type { Resume } from "@/lib/resume/resume.types"
import { ResumeDraftSchema } from "@/lib/resume/resume.schema"
import { updateResume } from "@/app/actions/resume"

import { Navbar } from "@/components/Navbar"
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
      
      {/* --- NAVBAR --- */}
      <Navbar 
        isBuilder={true} 
        isSaving={isSaving} 
        onDownload={() => window.open("/api/resume/download", "_blank")} 
      />

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* LEFT PANEL (EDITOR) 
           - h-full: Forces height to fill parent so scrolling works.
           - w-full md:w-1/2 lg:w-[45%] xl:w-[40%]: Responsive width (wider on large screens).
           - pb-32: Bottom padding so you can scroll past the last element easily.
        */}
        <aside className="h-full w-full overflow-y-auto border-r bg-background p-4 md:w-1/2 lg:w-[45%] xl:w-[40%] pb-32">
          
          <Tabs defaultValue="editor" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4 sticky top-0 z-10 bg-background pb-2">
              <TabsTrigger value="editor">Editor</TabsTrigger>
              <TabsTrigger value="ats">ATS Score</TabsTrigger>
            </TabsList>
            
            <TabsContent value="editor" className="space-y-4">
              <ResumeForm form={form} />
            </TabsContent>
            
            <TabsContent value="ats">
              <AtsScorePanel resume={form.watch()} />
            </TabsContent>
          </Tabs>

        </aside>

        {/* RIGHT PANEL (PREVIEW) */}
        <main className="hidden md:block flex-1 bg-muted/30 p-4 md:p-8 overflow-y-auto">
            <div className="mx-auto max-w-[210mm] shadow-2xl rounded-sm overflow-hidden bg-white dark:bg-white dark:text-black transition-all transform origin-top scale-95 xl:scale-100">
               <ResumePreview data={form.watch()} />
            </div>
        </main>
      </div>
    </div>
  )
}