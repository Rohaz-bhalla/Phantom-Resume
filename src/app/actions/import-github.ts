"use server"

import { Resume } from "@/lib/resume/resume.types"

// Helper to clean up undefined/null values
const clean = (str: string | undefined | null) => str || ""

export async function importGitHubData(url: string, token?: string): Promise<Partial<Resume>> {
  try {
    const username = url.split("github.com/")[1]?.split("/")[0]
    if (!username) throw new Error("Invalid GitHub URL")

    // Construct Headers (Add Token if provided)
    const headers: HeadersInit = {
      "Accept": "application/vnd.github.v3+json",
      ...(token ? { "Authorization": `token ${token}` } : {})
    }

    // 1. Fetch User Profile
    const profileRes = await fetch(`https://api.github.com/users/${username}`, { headers })
    
    if (profileRes.status === 401) throw new Error("Invalid API Token")
    if (profileRes.status === 403) throw new Error("API Rate Limit Exceeded")
    if (!profileRes.ok) throw new Error("GitHub user not found")
    
    const profile = await profileRes.json()

    // 2. Fetch Repositories
    const reposRes = await fetch(
      `https://api.github.com/users/${username}/repos?sort=pushed&per_page=10&type=all`, 
      { headers }
    )
    const repos = await reposRes.json()

    // 3. Map to Resume Schema
    const importedData: Partial<Resume> = {
      // FIXED: 'summary' is now at the root level, NOT inside basics
      summary: clean(profile.bio),
      
      basics: {
        name: clean(profile.name),
        email: clean(profile.email), // Only works if public
        location: clean(profile.location),
        links: {
          github: profile.html_url,
          linkedin: profile.blog?.includes("linkedin") ? profile.blog : "",
          twitter: profile.twitter_username 
            ? `https://twitter.com/${profile.twitter_username}` 
            : "",
        },
        // If they have a website that isn't LinkedIn, add it as a custom field
        customFields: !profile.blog?.includes("linkedin") && profile.blog 
          ? [{ id: "website", label: "Portfolio", value: profile.blog }] 
          : [],
      },
      
      projects: Array.isArray(repos) 
        ? repos
            .filter((repo: any) => !repo.fork) // Skip forks
            .slice(0, 6) // Take top 6
            .map((repo: any) => ({
              title: repo.name,
              bullets: [
                repo.description || "Project source code.",
                repo.private ? "Private Repository (Access Granted)" : "Open Source Project"
              ],
              tech: repo.language ? [repo.language] : [],
              github: repo.html_url,
              website: repo.homepage || "",
            }))
        : [],
        
      skills: Array.isArray(repos)
        ? Array.from(new Set(repos.map((r: any) => r.language).filter(Boolean))) as string[]
        : [],
    }

    return importedData
  } catch (error: any) {
    console.error("GitHub Import Error:", error)
    throw new Error(error.message || "Failed to import GitHub data")
  }
}