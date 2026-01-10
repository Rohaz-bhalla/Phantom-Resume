import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/theme-provider"
// REMOVE: import { Navbar } from "@/components/Navbar"; 

const inter = Inter({subsets:['latin'],variable:'--font-sans'});
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Phantom Resume",
  description: "AI Powered Resume Builder",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
     <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} flex min-h-screen flex-col bg-background antialiased`}>
           <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            
            {/* REMOVED NAVBAR FROM HERE so we can control it per page */}
            
            <main className="flex-1 w-full">
              {children}
            </main>

          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}