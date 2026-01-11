"use client"

import { Button } from "@/components/ui/button" // Ensure we use your Shadcn Button
import { Loader2, Download } from "lucide-react"
import { useState } from "react"

export function DownloadButton() {
  const [loading, setLoading] = useState(false)

  const handleDownload = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/resume/download")

      if (!res.ok) {
        alert("Download failed. Please try again.")
        return
      }

      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)

      const a = document.createElement("a")
      a.href = url
      // FIXED: Extension is now .pdf
      a.download = "resume.pdf" 
      document.body.appendChild(a)
      a.click()
      a.remove()

      URL.revokeObjectURL(url)
    } catch (error) {
      console.error(error)
      alert("An error occurred while downloading.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={handleDownload}
      disabled={loading}
      variant="default"
    >
      {loading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Download className="mr-2 h-4 w-4" />
      )}
      Download PDF
    </Button>
  )
}