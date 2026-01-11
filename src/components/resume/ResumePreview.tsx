"use client"

import { useState, useEffect, useRef } from "react"
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
  const containerRef = useRef<HTMLDivElement>(null)

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

  // Height definitions for markers
  const A4_HEIGHT_MM = 297
  const LETTER_HEIGHT_MM = 279.4
  const pageHeightMm = pageSize === "a4" ? A4_HEIGHT_MM : LETTER_HEIGHT_MM

  return (
    <div className="relative flex flex-col h-full bg-zinc-100 dark:bg-zinc-950/50 dark:bg-[radial-gradient(#3f3f46_1px,transparent_1px)] bg-size-[16px_16px]">
      
      {/* --- PRINT STYLES --- */}
      <style suppressHydrationWarning>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #resume-paper, #resume-paper * {
            visibility: visible;
          }
          #resume-paper {
            position: absolute;
            left: 0;
            top: 0;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            height: 100% !important;
            box-shadow: none !important;
            background: white !important;
            color: black !important;
          }
          /* Hide the page break markers when printing */
          .page-break-marker {
            display: none !important;
          }
          @page {
            size: ${pageSize} portrait;
            margin: 0; 
          }
        }
      `}</style>

      {/* --- TOOLBAR --- */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 print:hidden">
        <div className="flex items-center gap-2 px-3 py-2 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl shadow-xl transition-all">
            
            {/* Font Controls */}
            <div className="flex items-center gap-1 pr-3 border-r border-zinc-200 dark:border-zinc-800">
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 rounded-full text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800" 
                    onClick={() => adjustFontSize("down")}
                    disabled={fontSize === "sm"}
                >
                    <Minus className="h-4 w-4" />
                </Button>
                
                <span className="text-xs font-mono font-medium w-8 text-center text-zinc-900 dark:text-zinc-200 select-none">
                    {fontSize.toUpperCase()}
                </span>
                
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 rounded-full text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800" 
                    onClick={() => adjustFontSize("up")}
                    disabled={fontSize === "lg"}
                >
                    <Plus className="h-4 w-4" />
                </Button>
            </div>

            {/* Page Size */}
            <Select value={pageSize} onValueChange={(v) => setPageSize(v as PageSize)}>
                <SelectTrigger className="h-8 border-0 bg-transparent focus:ring-0 gap-2 text-xs font-medium text-zinc-700 dark:text-zinc-200 w-27.5">
                    <FileText className="h-4 w-4" />
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="a4" className="text-xs">A4 (Intl)</SelectItem>
                    <SelectItem value="letter" className="text-xs">Letter (US)</SelectItem>
                </SelectContent>
            </Select>

            {/* Print Button */}
            {/* <div className="pl-1 border-l border-zinc-200 dark:border-zinc-800">
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 rounded-full text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10"
                    onClick={handlePrint}
                    title="Print to PDF"
                >
                    <Printer className="h-4 w-4" />
                </Button>
            </div> */}
        </div>
      </div>

      {/* --- PREVIEW CANVAS --- */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden pt-24 pb-20 flex justify-center scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-700">
        
        <div 
            id="resume-paper"
            ref={containerRef}
            className={cn(
                "relative bg-white transition-all duration-300 ease-in-out origin-top",
                "shadow-2xl dark:shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)]", 
                "print:shadow-none"
            )}
            style={{
                width: pageSize === "a4" ? "210mm" : "215.9mm",
                // Initial height is 1 page, but it grows with content
                minHeight: pageSize === "a4" ? "297mm" : "279.4mm",
                padding: "0" 
            }}
        >
            {/* PAGE BREAK MARKER (Page 1 End) */}
            <div 
              className="page-break-marker absolute left-0 w-full flex items-center pointer-events-none z-10"
              style={{ top: `${pageHeightMm}mm` }}
            >
               <div className="h-px bg-red-400 w-full border-t border-dashed border-red-400 opacity-60"></div>
               <span className="absolute right-0 -top-3 bg-red-100 text-red-600 text-[9px] font-mono px-1 py-0.5 rounded-l border border-r-0 border-red-200 uppercase tracking-widest">
                 Page Break
               </span>
            </div>

            {/* PAGE BREAK MARKER (Page 2 End - if content gets really long) */}
            <div 
              className="page-break-marker absolute left-0 w-full flex items-center pointer-events-none z-10"
              style={{ top: `${pageHeightMm * 2}mm` }}
            >
               <div className="h-px bg-red-400 w-full border-t border-dashed border-red-400 opacity-60"></div>
               <span className="absolute right-0 -top-3 bg-red-100 text-red-600 text-[9px] font-mono px-1 py-0.5 rounded-l border border-r-0 border-red-200 uppercase tracking-widest">
                 Page 2 Limit
               </span>
            </div>

            {/* RENDERER */}
            <div style={{ padding: "12.7mm", height: "100%" }}>
                <ResumeRenderer 
                    data={data} 
                    settings={{ fontSize }} 
                />
            </div>
        </div>

      </div>
      
      {/* Footer Status */}
      <div className="absolute bottom-4 right-4 text-[10px] text-zinc-400 dark:text-zinc-600 font-mono opacity-50 select-none print:hidden">
         {pageSize.toUpperCase()} • {fontSize.toUpperCase()}
      </div>
    </div>
  )
}