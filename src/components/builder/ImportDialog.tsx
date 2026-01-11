"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { 
  Github, 
  Linkedin, // Import Linkedin Icon
  Loader2, 
  DownloadCloud, 
  Lock, 
  Info,
  Upload,
  FileText
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Import Server Actions
import { importGitHubData } from "@/app/actions/import-github"
import { importLinkedInPDF } from "@/app/actions/import-linkedin"

import { UseFormReturn } from "react-hook-form"
import { Resume } from "@/lib/resume/resume.types"
import { toast } from "sonner"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export function ImportDialog({ form }: { form: UseFormReturn<Resume> }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  
  // GitHub State
  const [ghUrl, setGhUrl] = useState("")
  const [ghToken, setGhToken] = useState("")
  
  // LinkedIn State
  const [liFile, setLiFile] = useState<File | null>(null)

  // --- HANDLER: GITHUB ---
  const handleGithubImport = async () => {
    if (!ghUrl.includes("github.com")) {
      toast.error("Please enter a valid GitHub URL")
      return
    }

    setLoading(true)
    try {
      const data = await importGitHubData(ghUrl, ghToken)
      applyImportData(data)
      toast.success("GitHub profile imported!")
      setOpen(false)
    } catch (error: any) {
      toast.error(error.message || "Failed to import GitHub data.")
    } finally {
      setLoading(false)
    }
  }

  // --- HANDLER: LINKEDIN ---
  const handleLinkedinImport = async () => {
    if (!liFile) {
        toast.error("Please select a PDF file")
        return
    }

    setLoading(true)
    try {
        const formData = new FormData()
        formData.append("file", liFile)

        const data = await importLinkedInPDF(formData)
        applyImportData(data)
        
        toast.success("LinkedIn PDF parsed successfully!")
        setOpen(false)
    } catch (error: any) {
        console.error(error)
        toast.error("Failed to parse PDF. Make sure it is a valid LinkedIn export.")
    } finally {
        setLoading(false)
    }
  }

  // --- HELPER: APPLY DATA TO FORM ---
  const applyImportData = (data: Partial<Resume>) => {
    // 1. Basics
    if (data.basics) {
        form.setValue("basics.name", data.basics.name)
        if(data.basics.email) form.setValue("basics.email", data.basics.email)
        if(data.basics.location) form.setValue("basics.location", data.basics.location)
        if(data.basics.links?.github) form.setValue("basics.links.github", data.basics.links.github)
        if(data.basics.links?.linkedin) form.setValue("basics.links.linkedin", data.basics.links.linkedin)
    }
    
    // 2. Summary
    if (data.summary) form.setValue("summary", data.summary)

    // 3. Experience (Append)
    if (data.experience && data.experience.length > 0) {
        const current = form.getValues("experience") || []
        form.setValue("experience", [...current, ...data.experience])
    }

    // 4. Projects (Append)
    if (data.projects && data.projects.length > 0) {
        const current = form.getValues("projects") || []
        form.setValue("projects", [...current, ...data.projects])
    }

    // 5. Skills (Merge Unique)
    if (data.skills && data.skills.length > 0) {
        const current = form.getValues("skills") || []
        const unique = Array.from(new Set([...current, ...data.skills]))
        form.setValue("skills", unique)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 border-dashed">
           <DownloadCloud className="h-4 w-4" />
           Import Data
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Import Profile</DialogTitle>
          <DialogDescription>
            Auto-fill your resume from GitHub or LinkedIn.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="github" className="w-full mt-2">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="github" className="flex gap-2">
                    <Github className="h-4 w-4" /> GitHub
                </TabsTrigger>
                <TabsTrigger value="linkedin" className="flex gap-2">
                    <Linkedin className="h-4 w-4" /> LinkedIn
                </TabsTrigger>
            </TabsList>

            {/* --- TAB: GITHUB --- */}
            <TabsContent value="github" className="space-y-4 py-4">
                <div className="space-y-2">
                    <Label>GitHub Profile URL</Label>
                    <Input 
                        placeholder="https://github.com/username" 
                        value={ghUrl}
                        onChange={(e) => setGhUrl(e.target.value)}
                    />
                </div>
                
                {/* Advanced: Private Repo Access */}
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1" className="border-none">
                        <AccordionTrigger className="text-xs text-muted-foreground py-0 hover:no-underline">
                            Import private repos? (Optional)
                        </AccordionTrigger>
                        <AccordionContent className="pt-2 space-y-2">
                            <div className="space-y-1.5">
                                <Label className="text-xs">Personal Access Token</Label>
                                <Input 
                                    className="h-8 text-xs"
                                    type="password"
                                    placeholder="ghp_..." 
                                    value={ghToken}
                                    onChange={(e) => setGhToken(e.target.value)}
                                />
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>

                <div className="flex justify-end">
                    <Button onClick={handleGithubImport} disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Import from GitHub
                    </Button>
                </div>
            </TabsContent>

            {/* --- TAB: LINKEDIN --- */}
            <TabsContent value="linkedin" className="space-y-4 py-4">
                 <div className="p-4 border-2 border-dashed rounded-lg bg-muted/30 text-center space-y-2">
                    <div className="flex justify-center">
                        <FileText className="h-10 w-10 text-muted-foreground/50" />
                    </div>
                    <div className="text-sm font-medium">Upload LinkedIn PDF</div>
                    <p className="text-xs text-muted-foreground">
                        Go to LinkedIn Profile &gt; More &gt; Save to PDF
                    </p>
                    <Input 
                        type="file" 
                        accept=".pdf"
                        className="cursor-pointer"
                        onChange={(e) => setLiFile(e.target.files?.[0] || null)}
                    />
                 </div>

                 <div className="flex justify-end">
                    <Button onClick={handleLinkedinImport} disabled={loading || !liFile}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Parse PDF
                    </Button>
                </div>
            </TabsContent>
        </Tabs>

      </DialogContent>
    </Dialog>
  )
}