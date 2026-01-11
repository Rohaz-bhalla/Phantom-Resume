import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { SignInButton, SignUpButton } from "@clerk/nextjs"
import { ArrowRight, Terminal, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

export default async function LandingPage() {
  const { userId } = await auth()

  // 1. If user is logged in, send them straight to the Builder
  if (userId) {
    redirect("/builder")
  }

  // 2. If not logged in, render the Landing Page
  return (
    <div className="min-h-screen flex flex-col bg-black text-white selection:bg-white selection:text-black font-sans">
      
      {/* Background Grid */}
      <div 
        className="fixed inset-0 z-0 opacity-20 pointer-events-none" 
        style={{ backgroundImage: 'radial-gradient(#333 1px, transparent 1px)', backgroundSize: '30px 30px' }}
      />

      {/* Navbar */}
      <header className="relative z-10 w-full p-6 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tighter">
          <div className="bg-white text-black p-1">
            <Terminal size={16} />
          </div>
          <span className="tracking-widest">PHANTOM</span>
        </div>

        <nav className="flex gap-4">
          <SignInButton mode="modal">
            <Button variant="ghost" className="text-zinc-400 hover:text-white font-mono text-xs uppercase tracking-wider">
              Log In
            </Button>
          </SignInButton>
        </nav>
      </header>

      {/* Hero Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4">
        
        <div className="mb-8 inline-flex items-center gap-2 border border-zinc-800 bg-zinc-900/50 px-3 py-1 text-xs text-zinc-400 font-mono tracking-widest">
          <span className="relative flex h-2 w-2">
            <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          SYSTEM_ONLINE v2.0
        </div>

        <h1 className="max-w-4xl text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
          BUILD YOUR LEGACY <br />
          <span className="text-zinc-600">IN PURE CODE.</span>
        </h1>

        <p className="max-w-xl text-lg text-zinc-500 mb-10 leading-relaxed">
          The minimal, ATS-optimized resume builder for developers. 
          No drag-and-drop nightmares. Just data.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <SignUpButton mode="modal">
              <Button size="lg" className="h-14 px-8 text-base bg-white text-black hover:bg-zinc-200 rounded-none font-mono tracking-wide">
                INITIALIZE_BUILD <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </SignUpButton>
          
            <SignInButton mode="modal">
              <Button size="lg" variant="outline" className="h-14 px-8 text-base border-zinc-800 bg-black text-white hover:bg-zinc-900 rounded-none font-mono tracking-wide">
                ACCESS_TERMINAL
              </Button>
            </SignInButton>
        </div>

        {/* Features Footer */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 text-left border-t border-zinc-900 pt-8 w-full max-w-4xl">
           <Feature title="ATS OPTIMIZED" desc="Clean semantic output that passes every bot." />
           <Feature title="MARKDOWN EXPORT" desc="Your data belongs to you, not our servers." />
           <Feature title="REAL-TIME PREVIEW" desc="Instant feedback loop as you type." />
        </div>
      </main>
    </div>
  )
}

function Feature({ title, desc }: { title: string, desc: string }) {
  return (
    <div className="space-y-2">
      <h3 className="flex items-center gap-2 text-white font-mono text-sm tracking-wider">
        <Check className="w-4 h-4 text-zinc-600" /> {title}
      </h3>
      <p className="text-zinc-500 text-xs pl-6">{desc}</p>
    </div>
  )
}