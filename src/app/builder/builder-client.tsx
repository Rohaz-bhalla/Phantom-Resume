/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState, useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Download, FileText, CheckCircle } from "lucide-react"

import type { Resume } from "@/lib/resume/resume.types"
import { ResumeDraftSchema } from "@/lib/resume/resume.schema"
import { updateResume } from "@/app/actions/resume"

import { ResumeForm } from "@/components/builder/ResumeForm"
import { ResumePreview } from "@/components/resume/ResumePreview"
import { AtsScorePanel } from "@/components/ats/AtsScorePanel"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function BuilderClient({ resume }: { resume: any }) {
  const [isSaving, setIsSaving] = useState(false);
  
  const form = useForm<Resume>({
    resolver: zodResolver(ResumeDraftSchema as any),
    defaultValues: resume.data,
  })

  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // AUTOSAVE WITH VISUAL INDICATOR
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
      {/* --- HEADER --- */}
      <header className="flex h-14 items-center justify-between border-b px-6">
        <div className="flex items-center gap-2 font-semibold">
          <FileText className="h-5 w-5" />
          <span>Phantom Builder</span>
        </div>

        <div className="flex items-center gap-4">
          {/* Save Status Indicator */}
          <div className="text-sm text-muted-foreground">
            {isSaving ? (
              <span className="flex items-center gap-1"><Loader2 className="h-3 w-3 animate-spin"/> Saving...</span>
            ) : (
              <span className="flex items-center gap-1"><CheckCircle className="h-3 w-3 text-green-500"/> Saved</span>
            )}
          </div>

          <Button
            onClick={() => window.open("/api/resume/download", "_blank")}
            size="sm"
            variant="default"
          >
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* LEFT PANEL: EDITOR & TOOLS */}
        <aside className="w-full max-w-xl overflow-y-auto border-r bg-background p-6 md:w-1/2 lg:w-[500px]">
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
            {/* Centered Resume Container with Shadow */}
            <div className="mx-auto max-w-[210mm] shadow-2xl rounded-sm overflow-hidden bg-white dark:bg-white dark:text-black transition-all">
               {/* Note: We force light mode colors (bg-white text-black) on the preview wrapper 
                  so the resume looks like paper even in dark mode app usage.
               */}
               <ResumePreview data={form.watch()} />
            </div>
        </main>
      </div>
    </div>
  )
}