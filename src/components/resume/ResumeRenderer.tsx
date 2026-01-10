import type { Resume } from "@/lib/resume/resume.types"

type Props = {
  data: Resume
}

export function ResumeRenderer({ data }: Props) {
  return (
    <article className="font-sans text-sm leading-relaxed text-foreground space-y-6">

      {/* HEADER */}
      <header className="space-y-1 border-b pb-4">
        <h1 className="text-2xl font-bold tracking-tight">
          {data.basics.name || "Your Name"}
        </h1>

        <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-muted-foreground">
          {/* Standard Fields */}
          {[
            data.basics.email,
            data.basics.phone,
            data.basics.location,
          ]
            .filter(Boolean)
            .map((item, i) => (
              <span key={i}>{item}</span>
            ))}

          {/* Social Links (Hardcoded) */}
          {data.basics.links?.linkedin && (
            <span>LinkedIn: {data.basics.links.linkedin}</span>
          )}
          {data.basics.links?.github && (
            <span>GitHub: {data.basics.links.github}</span>
          )}
          {data.basics.links?.twitter && (
            <span>X: {data.basics.links.twitter}</span>
          )}

          {/* Dynamic Custom Links (Portfolio, Blog, etc.) */}
          {data.basics.customFields?.map((field) => (
            <span key={field.id}>
              {field.label}: {field.value}
            </span>
          ))}
        </div>
      </header>

      {/* SUMMARY */}
      {data.summary && (
        <section>
          <h2 className="text-sm font-bold uppercase tracking-wider mb-2 border-b pb-1">
            Summary
          </h2>
          <p>{data.summary}</p>
        </section>
      )}

      {/* SKILLS */}
      {data.skills && data.skills.length > 0 && (
        <section>
          <h2 className="text-sm font-bold uppercase tracking-wider mb-2 border-b pb-1">
            Skills
          </h2>
          <p className="text-sm">{data.skills.join(", ")}</p>
        </section>
      )}

      {/* EXPERIENCE */}
      {data.experience && data.experience.length > 0 && (
        <section>
          <h2 className="text-sm font-bold uppercase tracking-wider mb-2 border-b pb-1">
            Experience
          </h2>

          <ul className="space-y-4">
            {data.experience.map((exp, i) => (
              <li key={i}>
                <div className="flex justify-between items-baseline text-sm font-medium">
                  <span className="text-base">
                    {exp.role} <span className="text-muted-foreground">—</span> {exp.company}
                  </span>
                  <span className="text-muted-foreground whitespace-nowrap text-xs">
                    {exp.startDate}
                    {exp.endDate ? ` – ${exp.endDate}` : ""}
                  </span>
                </div>

                {exp.bullets.length > 0 && (
                  <ul className="mt-2 list-disc pl-5 space-y-1 text-sm">
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
          <h2 className="text-sm font-bold uppercase tracking-wider mb-2 border-b pb-1">
            Projects
          </h2>

          <ul className="space-y-4">
            {data.projects.map((proj, i) => (
              <li key={i}>
                <div className="flex justify-between items-baseline">
                  <span className="font-medium text-base">{proj.title}</span>
                </div>

                {proj.bullets.length > 0 && (
                  <ul className="mt-2 list-disc pl-5 space-y-1 text-sm">
                    {proj.bullets.map((b, j) => (
                      <li key={j}>{b}</li>
                    ))}
                  </ul>
                )}
                
                {proj.tech && proj.tech.length > 0 && (
                   <p className="mt-1 text-xs text-muted-foreground">
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
          <h2 className="text-sm font-bold uppercase tracking-wider mb-2 border-b pb-1">
            Education
          </h2>

          <ul className="space-y-3">
            {data.education.map((edu, i) => (
              <li key={i} className="flex justify-between items-baseline text-sm">
                <div>
                  <div className="font-medium">{edu.institute}</div>
                  <div className="text-muted-foreground">{edu.degree}</div>
                </div>
                <div className="text-muted-foreground text-xs whitespace-nowrap">
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
          <h2 className="text-sm font-bold uppercase tracking-wider mb-2 border-b pb-1">
            Certifications
          </h2>
          <ul className="space-y-2">
            {data.certifications.map((cert, i) => (
              <li key={i} className="flex justify-between items-baseline text-sm">
                <div>
                  <span className="font-semibold">{cert.name}</span>
                  <span className="text-muted-foreground mx-1">—</span>
                  <span>{cert.issuer}</span>
                </div>
                <span className="text-muted-foreground whitespace-nowrap text-xs">
                  {cert.date}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* --- NEW: RENDER CUSTOM SECTIONS --- */}
      {data.customSections && data.customSections.map((section) => (
        <section key={section.id}>
           <h2 className="text-sm font-bold uppercase tracking-wider mb-2 border-b pb-1">
             {section.title}
           </h2>
           <ul className="space-y-3">
             {section.items.map((item) => (
               <li key={item.id}>
                 <div className="font-medium text-base">{item.name}</div>
                 <div className="text-sm whitespace-pre-wrap text-muted-foreground">
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