"use client"

import Link from "next/link"
import { UserButton, SignInButton, SignedIn, SignedOut } from "@clerk/nextjs"
import { 
  FileText, 
  Loader2, 
  CheckCircle, 
  Download, 
  Heart 
} from "lucide-react"

// Import Brand Icons from react-icons/si (Simple Icons)
import { 
  SiGithub, 
  SiLinkedin, 
  SiX, 
  SiBuymeacoffee 
} from "react-icons/si"

import { ModeToggle } from "@/components/ModeToggle"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface NavbarProps {
  isBuilder?: boolean
  isSaving?: boolean
  onDownload?: () => void
}

export function Navbar({ isBuilder = false, isSaving = false, onDownload }: NavbarProps) {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-4 md:px-6 max-w-7xl mx-auto">
        
        {/* --- LEFT: LOGO --- */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl hover:opacity-80 transition-opacity">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <FileText className="h-5 w-5" />
          </div>
          <span>Phantom Resume</span>
        </Link>

        {/* --- RIGHT: ACTIONS --- */}
        <div className="flex items-center gap-4">
          
          {/* BUILDER CONTROLS (Only visible in Builder Mode) */}
          {isBuilder && (
            <>
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

              {onDownload && (
                <Button onClick={onDownload} size="sm" variant="default" className="gap-2">
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">Download PDF</span>
                </Button>
              )}
              
              <div className="h-6 w-px bg-border mx-2" />
            </>
          )}

          {/* --- SOCIALS DROPDOWN --- */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <Heart className="h-5 w-5 text-red-500/80 hover:text-red-600" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link href="https://github.com/Rohaz-bhalla" target="_blank" className="cursor-pointer flex items-center gap-2">
                  <SiGithub className="h-4 w-4" />
                  <span>GitHub</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="https://linkedin.com/in/rohaz-bhalla" target="_blank" className="cursor-pointer flex items-center gap-2">
                  <SiLinkedin className="h-4 w-4 text-[#0A66C2]" />
                  <span>LinkedIn</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="https://x.com/RohazBhalla" target="_blank" className="cursor-pointer flex items-center gap-2">
                  <SiX className="h-3.5 w-3.5" />
                  <span>X (Twitter)</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="https://buymeacoffee.com/rohaz.bhalla" target="_blank" className="cursor-pointer flex items-center gap-2 font-medium hover:bg-orange-50 dark:hover:bg-orange-400">
                  <SiBuymeacoffee className="h-4 w-4 text-[#FFDD00]" />
                  <span className="text-[#FF813F]">Buy me a Coffee</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* GLOBAL CONTROLS */}
          <ModeToggle />

          <div className="flex items-center gap-2">
            <SignedOut>
              <SignInButton mode="modal">
                <Button size="sm">Sign In</Button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
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