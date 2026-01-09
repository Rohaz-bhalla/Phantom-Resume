"use client"

import { Button } from "@base-ui/react"

export function DownloadButton() {
  const handleDownload = async () => {
    const res = await fetch("/api/resume/download")

    if (!res.ok) {
      alert("Download failed")
      return
    }

    const blob = await res.blob()
    const url = window.URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = "resume.json"
    document.body.appendChild(a)
    a.click()
    a.remove()

    URL.revokeObjectURL(url)
  }

  return (
    <Button
      onClick={handleDownload}
      className="px-4 py-2 rounded border"
    >
      Download Resume
    </Button>
  )
}
