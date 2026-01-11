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

  // Dynamic style mapping (Using fixed colors for Print Consistency)
  const styles = {
    sm: {
      h1: "text-xl",
      h2: "text-xs border-b border-zinc-300 pb-0.5 mb-1.5",
      h3: "text-sm",
      body: "text-xs",
      meta: "text-[10px]",
      gap: "space-y-4",
      headerGap: "space-y-0.5",
      listGap: "space-y-0.5",
    },
    md: {
      h1: "text-2xl",
      h2: "text-sm border-b border-zinc-300 pb-1 mb-2",
      h3: "text-base",
      body: "text-sm",
      meta: "text-xs",
      gap: "space-y-6",
      headerGap: "space-y-1",
      listGap: "space-y-1",
    },
    lg: {
      h1: "text-3xl",
      h2: "text-base border-b border-zinc-300 pb-1.5 mb-3",
      h3: "text-lg",
      body: "text-base",
      meta: "text-sm",
      gap: "space-y-8",
      headerGap: "space-y-1.5",
      listGap: "space-y-1.5",
    }
  }[size]

  return (
    <article className={cn(
      // FORCE light mode colors: White bg, Dark text
      "bg-white text-zinc-900 font-sans leading-relaxed text-left selection:bg-zinc-200 selection:text-black",
      styles.body, 
      styles.gap
    )}>

      {/* HEADER */}
      <header className={cn("border-b border-zinc-300 pb-4", styles.headerGap)}>
        <h1 className={cn("font-bold tracking-tight text-black", styles.h1)}>
          {data.basics.name || "Your Name"}
        </h1>

        <div className={cn("flex flex-wrap gap-x-3 gap-y-1 text-zinc-500", styles.meta)}>
          {[
            data.basics.email,
            data.basics.phone,
            data.basics.location,
          ]
            .filter(Boolean)
            .map((item, i) => (
              <span key={i} className="text-zinc-600 font-medium">{item}</span>
            ))}

          {/* Social Links */}
          {data.basics.links?.linkedin && (
            <span>
              <span className="text-zinc-400">LinkedIn: </span>
              <a href={data.basics.links.linkedin} target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-800 hover:underline">{data.basics.links.linkedin}</a>
            </span>
          )}
          {data.basics.links?.github && (
             <span>
               <span className="text-zinc-400">GitHub: </span>
               <a href={data.basics.links.github} target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-800 hover:underline">{data.basics.links.github}</a>
             </span>
          )}
           {data.basics.links?.twitter && (
             <span>
               <span className="text-zinc-400">X: </span>
               <a href={data.basics.links.twitter} target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-800 hover:underline">{data.basics.links.twitter}</a>
             </span>
          )}

          {data.basics.customFields?.map((field) => (
            <span key={field.id}>
              <span className="text-zinc-400">{field.label}: </span>
              <a href={field.value} target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-800 hover:underline">{field.value}</a>
            </span>
          ))}
        </div>
      </header>

      {/* SUMMARY */}
      {data.summary && (
        <section>
          <h2 className={cn("font-bold uppercase tracking-wider text-zinc-800", styles.h2)}>
            Summary
          </h2>
          <p className="text-zinc-700">{data.summary}</p>
        </section>
      )}

      {/* SKILLS */}
      {data.skills && data.skills.length > 0 && (
        <section>
          <h2 className={cn("font-bold uppercase tracking-wider text-zinc-800", styles.h2)}>
            Skills
          </h2>
          <p className="text-zinc-700">{data.skills.join(", ")}</p>
        </section>
      )}

      {/* EXPERIENCE */}
      {data.experience && data.experience.length > 0 && (
        <section>
          <h2 className={cn("font-bold uppercase tracking-wider text-zinc-800", styles.h2)}>
            Experience
          </h2>

          <ul className={cn(styles.listGap, "mt-2")}>
            {data.experience.map((exp, i) => (
              <li key={i}>
                <div className={cn("flex justify-between items-baseline font-medium text-zinc-900", styles.h3)}>
                  <span>
                    {exp.role} <span className="text-zinc-400 text-[0.8em] mx-1">—</span> {exp.company}
                  </span>
                  <span className={cn("text-zinc-500 whitespace-nowrap font-normal", styles.meta)}>
                    {exp.startDate}
                    {exp.endDate ? ` – ${exp.endDate}` : ""}
                  </span>
                </div>

                {exp.bullets.length > 0 && (
                  <ul className={cn("list-disc pl-5 text-zinc-700", styles.listGap, "mt-1")}>
                    {exp.bullets.map((b, j) => (
                      <li key={j}>{b}</li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* PROJECTS */}
      {data.projects && data.projects.length > 0 && (
        <section>
          <h2 className={cn("font-bold uppercase tracking-wider text-zinc-800", styles.h2)}>
            Projects
          </h2>

          <ul className={cn(styles.listGap, "mt-2")}>
            {data.projects.map((proj, i) => (
              <li key={i}>
                <div className="flex justify-between items-baseline">
                   <div className="flex items-center gap-2">
                    <span className={cn("font-medium text-zinc-900", styles.h3)}>{proj.title}</span>
                    <div className={cn("flex gap-2", styles.meta)}>
                        {proj.github && (
                            <a href={proj.github} target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-800 hover:underline border border-blue-100 hover:border-blue-300 px-1 py-0.5 rounded transition-colors">GitHub</a>
                        )}
                        {proj.website && (
                            <a href={proj.website} target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-800 hover:underline border border-blue-100 hover:border-blue-300 px-1 py-0.5 rounded transition-colors">Live Demo</a>
                        )}
                    </div>
                  </div>
                </div>

                {proj.bullets.length > 0 && (
                  <ul className={cn("list-disc pl-5 text-zinc-700", styles.listGap, "mt-1")}>
                    {proj.bullets.map((b, j) => (
                      <li key={j}>{b}</li>
                    ))}
                  </ul>
                )}
                
                {proj.tech && proj.tech.length > 0 && (
                   <p className={cn("mt-1 text-zinc-500", styles.meta)}>
                      Stack: {proj.tech.join(", ")}
                   </p>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* EDUCATION */}
      {data.education && data.education.length > 0 && (
        <section>
          <h2 className={cn("font-bold uppercase tracking-wider text-zinc-800", styles.h2)}>
            Education
          </h2>

          <ul className={styles.listGap}>
            {data.education.map((edu, i) => (
              <li key={i} className="flex justify-between items-baseline">
                <div>
                  <div className={cn("font-medium text-zinc-900", styles.h3)}>{edu.institute}</div>
                  <div className="text-zinc-500">{edu.degree}</div>
                </div>
                <div className={cn("text-zinc-500 whitespace-nowrap", styles.meta)}>
                  {edu.year}
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* CERTIFICATIONS */}
      {data.certifications && data.certifications.length > 0 && (
        <section>
          <h2 className={cn("font-bold uppercase tracking-wider text-zinc-800", styles.h2)}>
            Certifications
          </h2>
          <ul className={styles.listGap}>
            {data.certifications.map((cert, i) => (
              <li key={i} className="flex justify-between items-baseline">
                <div>
                  <span className="font-semibold text-zinc-900">{cert.name}</span>
                  <span className="text-zinc-400 mx-1">—</span>
                  <span className="text-zinc-700">{cert.issuer}</span>
                  {cert.url && (
                    <>
                     <span className="text-zinc-300 mx-1">|</span>
                     <a href={cert.url} target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-800 hover:underline">Link</a>
                    </>
                  )}
                </div>
                <span className={cn("text-zinc-500 whitespace-nowrap", styles.meta)}>
                  {cert.date}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* CUSTOM SECTIONS */}
      {data.customSections && data.customSections.map((section) => (
        <section key={section.id}>
           <h2 className={cn("font-bold uppercase tracking-wider text-zinc-800", styles.h2)}>
             {section.title}
           </h2>
           <ul className={styles.listGap}>
             {section.items.map((item) => (
               <li key={item.id}>
                 <div className={cn("font-medium text-zinc-900", styles.h3)}>{item.name}</div>
                 <div className="whitespace-pre-wrap text-zinc-700">
                   {item.description}
                 </div>
               </li>
             ))}
           </ul>
        </section>
      ))}

    </article>
  )
}