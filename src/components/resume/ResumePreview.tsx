"use client"

import { useState, useEffect } from "react"
import type { Resume } from "@/lib/resume/resume.types"
import { ResumeRenderer, FontSize } from "./ResumeRenderer"
import { Button } from "@/components/ui/button"
import { 
  Minus, Plus, FileText, Printer, Check 
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

type PageSize = "a4" | "letter"

export function ResumePreview({ data }: { data: Resume }) {
  const [fontSize, setFontSize] = useState<FontSize>("md")
  const [pageSize, setPageSize] = useState<PageSize>("a4")
  const [isMounted, setIsMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const adjustFontSize = (direction: "up" | "down") => {
    const sizes: FontSize[] = ["sm", "md", "lg"]
    const currentIndex = sizes.indexOf(fontSize)
    if (direction === "down" && currentIndex > 0) {
      setFontSize(sizes[currentIndex - 1])
    }
    if (direction === "up" && currentIndex < sizes.length - 1) {
      setFontSize(sizes[currentIndex + 1])
    }
  }

  const handlePrint = () => {
    window.print()
  }

  if (!isMounted) return null

  return (
    <div className="relative flex flex-col h-full bg-zinc-100 dark:bg-zinc-950/90 dark:bg-[radial-gradient(#3f3f46_1px,transparent_1px)] [background-size:16px_16px]">
      
      {/* --- 1. CRITICAL FIX: Inject Dynamic Print CSS --- */}
      <style suppressHydrationWarning>{`
        @media print {
          @page {
            size: ${pageSize} portrait;
            margin: 0;
          }
          body {
            background: white;
          }
          #resume-paper {
            box-shadow: none !important;
            margin: 0 !important;
            width: 100% !important;
            height: 100% !important;
          }
        }
      `}</style>

      {/* --- FLOATING COMMAND BAR --- */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 print:hidden">
        <div className="flex items-center gap-3 px-3 py-2 rounded-full border border-zinc-200 dark:border-white/10 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl shadow-lg transition-all hover:shadow-xl hover:bg-white/90 dark:hover:bg-zinc-900/90">
            
            {/* Font Controls */}
            <div className="flex items-center gap-1 pr-3 border-r border-zinc-200 dark:border-white/10">
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 rounded-full text-zinc-700 dark:text-zinc-200 hover:bg-zinc-200/50 dark:hover:bg-white/10 disabled:opacity-30" 
                    onClick={() => adjustFontSize("down")}
                    disabled={fontSize === "sm"}
                >
                    <Minus className="h-4 w-4" />
                </Button>
                
                <span className="text-xs font-mono font-medium w-8 text-center text-zinc-600 dark:text-zinc-300 select-none">
                    {fontSize.toUpperCase()}
                </span>
                
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 rounded-full text-zinc-700 dark:text-zinc-200 hover:bg-zinc-200/50 dark:hover:bg-white/10 disabled:opacity-30" 
                    onClick={() => adjustFontSize("up")}
                    disabled={fontSize === "lg"}
                >
                    <Plus className="h-4 w-4" />
                </Button>
            </div>

            {/* Page Size Selector */}
            <Select value={pageSize} onValueChange={(v) => setPageSize(v as PageSize)}>
                <SelectTrigger className="h-8 border-0 bg-transparent focus:ring-0 gap-2 text-xs font-medium text-zinc-700 dark:text-zinc-200 hover:text-black dark:hover:text-white transition-colors w-[110px]">
                    <FileText className="h-4 w-4" />
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="a4" className="text-xs">
                        <div className="flex items-center justify-between w-full gap-2">
                            <span>A4 (Intl)</span>
                            {pageSize === 'a4' && <Check className="h-3 w-3" />}
                        </div>
                    </SelectItem>
                    <SelectItem value="letter" className="text-xs">
                         <div className="flex items-center justify-between w-full gap-2">
                            <span>Letter (US)</span>
                            {pageSize === 'letter' && <Check className="h-3 w-3" />}
                        </div>
                    </SelectItem>
                </SelectContent>
            </Select>

            {/* Print Button */}
            <div className="pl-1 border-l border-zinc-200 dark:border-white/10">
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 rounded-full text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-500/20"
                    onClick={handlePrint}
                    title="Print / Save as PDF"
                >
                    <Printer className="h-4 w-4" />
                </Button>
            </div>
        </div>
      </div>

      {/* --- PREVIEW CANVAS --- */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden pt-24 pb-20 flex justify-center scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-700">
        
        {/* Paper Simulation */}
        <div 
            id="resume-paper"
            className={cn(
                "bg-white transition-all duration-500 ease-in-out origin-top",
                "shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] dark:shadow-[0_0_100px_-20px_rgba(255,255,255,0.05)]", 
                "print:shadow-none print:w-full print:h-full print:m-0 print:absolute print:top-0 print:left-0"
            )}
            style={{
                // Explicit sizes in mm ensure 'what you see is what you print'
                width: pageSize === "a4" ? "210mm" : "215.9mm",
                minHeight: pageSize === "a4" ? "297mm" : "279.4mm",
                padding: "20mm" 
            }}
        >
            <ResumeRenderer 
                data={data} 
                settings={{ fontSize }} 
            />
        </div>

      </div>
      
      {/* Footer Info */}
      <div className="absolute bottom-4 right-4 text-[10px] text-zinc-400 font-mono opacity-50 pointer-events-none select-none print:hidden">
         {pageSize.toUpperCase()} • {fontSize.toUpperCase()}
      </div>
    </div>
  )
}