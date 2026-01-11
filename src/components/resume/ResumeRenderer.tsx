import type { Resume } from "@/lib/resume/resume.types"
import { cn } from "@/lib/utils"

export type FontSize = "sm" | "md" | "lg"

type Props = {
  data: Resume
  settings?: {
    fontSize?: FontSize
  }
}

export function ResumeRenderer({ data, settings }: Props) {
  const size = settings?.fontSize || "md"

  const config = {
    sm: {
      h1: "text-2xl",
      h2: "text-[11px] mt-4 mb-2 pb-1",
      body: "text-[10px]",
      leading: "leading-snug",
    },
    md: {
      h1: "text-3xl",
      h2: "text-[12px] mt-6 mb-3 pb-1",
      body: "text-[11px]",
      leading: "leading-normal",
    },
    lg: {
      h1: "text-4xl",
      h2: "text-[14px] mt-8 mb-4 pb-1.5",
      body: "text-[12px]",
      leading: "leading-relaxed",
    }
  }[size]

  return (
    <article 
      className={cn(
        "bg-white text-zinc-900 font-sans antialiased selection:bg-zinc-100 selection:text-black",
        config.body,
        config.leading
      )}
      style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
    >

      {/* --- HEADER (Centered & Clean) --- */}
      <header className="text-center mb-6">
        <h1 className={cn("font-bold tracking-tight text-black uppercase mb-2", config.h1)}>
          {data.basics.name || "Your Name"}
        </h1>

        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-zinc-600 font-medium text-[0.95em]">
          {[
            data.basics.email,
            data.basics.phone,
            data.basics.location,
          ].filter(Boolean).map((item, i) => (
             <span key={i} className="whitespace-nowrap">
               {item}
             </span>
          ))}
        </div>

        {/* Links Row */}
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-1.5 text-zinc-600 text-[0.95em]">
          {[
             { val: data.basics.links?.linkedin, label: "LinkedIn" },
             { val: data.basics.links?.github, label: "GitHub" },
             { val: data.basics.links?.portfolio, label: "Portfolio" },
             { val: data.basics.links?.twitter, label: "X" }
          ].filter(l => l.val).map((link, i) => (
             <a 
               key={i} 
               href={link.val} 
               target="_blank" 
               rel="noreferrer" 
               className="hover:text-black hover:underline underline-offset-4 decoration-zinc-300 transition-colors"
             >
                {link.label}
             </a>
          ))}
          
          {data.basics.customFields?.map((field) => (
             <a 
               key={field.id} 
               href={field.value} 
               target="_blank" 
               rel="noreferrer" 
               className="hover:text-black hover:underline underline-offset-4 decoration-zinc-300 transition-colors"
             >
                {field.label}
             </a>
          ))}
        </div>
      </header>

      {/* --- SECTIONS --- */}
      
      {/* SUMMARY */}
      {data.summary && (
        <section>
          <h2 className={cn("font-bold uppercase tracking-widest text-black border-b-[1.5px] border-black", config.h2)}>
            Professional Summary
          </h2>
          <p className="text-zinc-800 text-justify">{data.summary}</p>
        </section>
      )}

      {/* SKILLS */}
      {data.skills && data.skills.length > 0 && (
        <section>
          <h2 className={cn("font-bold uppercase tracking-widest text-black border-b-[1.5px] border-black", config.h2)}>
            Technical Skills
          </h2>
          <div className="text-zinc-800 font-medium">
            {data.skills.join("  •  ")}
          </div>
        </section>
      )}

      {/* EXPERIENCE */}
      {data.experience && data.experience.length > 0 && (
        <section>
          <h2 className={cn("font-bold uppercase tracking-widest text-black border-b-[1.5px] border-black", config.h2)}>
            Experience
          </h2>

          <div className="flex flex-col gap-4">
            {data.experience.map((exp, i) => (
              <div key={i}>
                {/* Job Header */}
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-black text-[1.1em]">{exp.role}</span>
                  <span className="font-medium text-zinc-600 whitespace-nowrap text-[0.95em]">
                    {exp.startDate}{exp.endDate ? ` – ${exp.endDate}` : ""}
                  </span>
                </div>
                
                <div className="font-semibold text-zinc-700 italic mb-1.5">
                  {exp.company}
                </div>

                {exp.bullets.length > 0 && (
                  <ul className="list-disc pl-4 space-y-1 text-zinc-800 marker:text-zinc-400">
                    {exp.bullets.map((b, j) => (
                      <li key={j} className="pl-0.5">{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* PROJECTS */}
      {data.projects && data.projects.length > 0 && (
        <section>
          <h2 className={cn("font-bold uppercase tracking-widest text-black border-b-[1.5px] border-black", config.h2)}>
            Key Projects
          </h2>

          <div className="flex flex-col gap-4">
            {data.projects.map((proj, i) => (
              <div key={i}>
                <div className="flex justify-between items-baseline mb-0.5">
                  <div className="flex items-baseline gap-2">
                    <span className="font-bold text-black text-[1.05em]">{proj.title}</span>
                    {(proj.github || proj.website) && (
                        <span className="text-[0.85em] font-medium text-zinc-500">
                           | 
                           {[
                              proj.github ? { l: "Code", v: proj.github } : null,
                              proj.website ? { l: "Live", v: proj.website } : null
                           ].filter(Boolean).map((l, idx) => (
                              <a key={idx} href={l!.v} target="_blank" rel="noreferrer" className="ml-2 hover:text-black hover:underline">
                                {l!.l}
                              </a>
                           ))}
                        </span>
                    )}
                  </div>
                </div>

                {proj.tech && proj.tech.length > 0 && (
                   <div className="text-zinc-600 font-medium text-[0.9em] mb-1.5">
                      Stack: {proj.tech.join(" • ")}
                   </div>
                )}

                {proj.bullets.length > 0 && (
                  <ul className="list-disc pl-4 space-y-1 text-zinc-800 marker:text-zinc-400">
                    {proj.bullets.map((b, j) => (
                      <li key={j} className="pl-0.5">{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* EDUCATION */}
      {data.education && data.education.length > 0 && (
        <section>
          <h2 className={cn("font-bold uppercase tracking-widest text-black border-b-[1.5px] border-black", config.h2)}>
            Education
          </h2>

          <div className="flex flex-col gap-3">
            {data.education.map((edu, i) => (
              <div key={i} className="flex justify-between items-start">
                <div>
                  <div className="font-bold text-black text-[1.05em]">{edu.institute}</div>
                  <div className="text-zinc-700">{edu.degree}</div>
                </div>
                <div className="font-medium text-zinc-600 text-right text-[0.95em]">
                  {edu.year}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CERTIFICATIONS */}
      {data.certifications && data.certifications.length > 0 && (
        <section>
          <h2 className={cn("font-bold uppercase tracking-widest text-black border-b-[1.5px] border-black", config.h2)}>
            Certifications
          </h2>
          <div className="flex flex-col gap-2">
            {data.certifications.map((cert, i) => (
              <div key={i} className="flex justify-between items-baseline">
                 <div className="flex-1">
                   <span className="font-bold text-zinc-900">{cert.name}</span>
                   <span className="text-zinc-400 mx-2">|</span>
                   <span className="text-zinc-700">{cert.issuer}</span>
                 </div>
                 <span className="font-medium text-zinc-600 text-right text-[0.95em] pl-4">{cert.date}</span>
              </div>
            ))}
          </div>
        </section>
      )}

    </article>
  )
}