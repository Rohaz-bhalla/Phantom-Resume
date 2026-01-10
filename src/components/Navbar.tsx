"use client"

import Link from "next/link"
import { UserButton, SignInButton, SignedIn, SignedOut } from "@clerk/nextjs"
import { FileText, Loader2, CheckCircle, Download } from "lucide-react"
import { ModeToggle } from "@/components/ModeToggle"
import { Button } from "@/components/ui/button"

interface NavbarProps {
  isBuilder?: boolean
  isSaving?: boolean
  onDownload?: () => void
}

export function Navbar({ isBuilder = false, isSaving = false, onDownload }: NavbarProps) {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-4 md:px-6 max-w-7xl mx-auto">
        
        {/* --- LEFT: LOGO --- */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl hover:opacity-80 transition-opacity">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <FileText className="h-5 w-5" />
          </div>
          {/* UPDATED: Always shows "Phantom Resume" now */}
          <span>Phantom Resume</span>
        </Link>

        {/* --- RIGHT: ACTIONS --- */}
        <div className="flex items-center gap-4">
          
          {/* BUILDER SPECIFIC CONTROLS (Only visible if isBuilder is true) */}
          {isBuilder && (
            <>
              {/* Save Status */}
              <div className="hidden md:flex text-sm text-muted-foreground mr-2">
                {isSaving ? (
                  <span className="flex items-center gap-1">
                    <Loader2 className="h-3 w-3 animate-spin" /> Saving...
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3 text-green-500" /> Saved
                  </span>
                )}
              </div>

              {/* Download Button */}
              {onDownload && (
                <Button onClick={onDownload} size="sm" variant="default" className="gap-2">
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">Download PDF</span>
                </Button>
              )}
              
              <div className="h-6 w-px bg-border mx-2" /> {/* Divider */}
            </>
          )}

          {/* GLOBAL CONTROLS */}
          <ModeToggle />

          <div className="flex items-center gap-2">
            <SignedOut>
              <SignInButton mode="modal">
                <Button size="sm">Sign In</Button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              {/* Hide "Dashboard" button if we are already IN the builder to avoid clutter */}
              {!isBuilder && (
                <Link href="/builder">
                  <Button variant="ghost" size="sm">Dashboard</Button>
                </Link>
              )}
              <UserButton appearance={{ elements: { avatarBox: "h-8 w-8" } }} />
            </SignedIn>
          </div>
        </div>
      </div>
    </nav>
  )
}