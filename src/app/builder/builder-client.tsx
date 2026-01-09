/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import type { Resume } from "@/lib/resume/resume.types"
import { ResumeSchema } from "@/lib/resume/resume.schema"
import { updateResume } from "@/app/actions/resume"

import { ResumeForm } from "@/components/builder/ResumeForm"
import { ResumePreview } from "@/components/resume/ResumePreview"
import { Button } from "@/components/ui/button"

export default function BuilderClient({ resume }: { resume: any }) {
  const form = useForm<Resume>({
    resolver: zodResolver(ResumeSchema as any),
    defaultValues: resume.data,
  })

  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // AUTOSAVE
  useEffect(() => {
    const sub = form.watch((value) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => {
        updateResume(resume.id, value)
      }, 1000)
    })

    return () => {
      sub.unsubscribe()
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [form, resume.id])

  return (
    <div className="grid min-h-screen md:grid-cols-2">
      <div className="p-4 border-r border-border space-y-4">
        <Button
          onClick={() => window.open("/api/pdf", "_blank")}
          variant="outline"
        >
          Download PDF
        </Button>

        <ResumeForm form={form} />
      </div>

      <div className="p-4 bg-muted/30">
        <ResumePreview data={form.watch()} />
      </div>
    </div>
  )
}
