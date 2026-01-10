import type { Resume } from "@/lib/resume/resume.types"

type Props = {
  data: Resume
}

export function ResumeRenderer({ data }: Props) {
  return (
    <article className="font-sans text-sm leading-relaxed text-foreground space-y-6">

      {/* --- HEADER (Updated) --- */}
      <header className="space-y-1 border-b pb-4">
        <h1 className="text-2xl font-bold tracking-tight">
          {data.basics.name || "Your Name"}
        </h1>

        <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-muted-foreground">
          
          {/* 1. Email: Blue & Clickable */}
          {data.basics.email && (
            <a 
              href={`mailto:${data.basics.email}`}
              className="text-blue-600 hover:underline"
            >
              {data.basics.email}
            </a>
          )}

          {/* 2. Phone: Clickable (Optional, kept neutral or blue if preferred) */}
          {data.basics.phone && (
            <a 
              href={`tel:${data.basics.phone}`}
              className="hover:text-blue-600 hover:underline"
            >
              {data.basics.phone}
            </a>
          )}

          {/* 3. Location: Text only */}
          {data.basics.location && (
            <span>{data.basics.location}</span>
          )}

          {/* 4. Social Links: Blue & Clickable */}
          {data.basics.links?.linkedin && (
            <span>
              <span className="text-foreground">LinkedIn: </span>
              <a 
                href={data.basics.links.linkedin} 
                target="_blank" 
                rel="noreferrer"
                className="text-blue-600 hover:underline"
              >
                {data.basics.links.linkedin}
              </a>
            </span>
          )}
          {data.basics.links?.github && (
            <span>
              <span className="text-foreground">GitHub: </span>
              <a 
                href={data.basics.links.github} 
                target="_blank" 
                rel="noreferrer"
                className="text-blue-600 hover:underline"
              >
                {data.basics.links.github}
              </a>
            </span>
          )}
          {data.basics.links?.twitter && (
            <span>
              <span className="text-foreground">X: </span>
              <a 
                href={data.basics.links.twitter} 
                target="_blank" 
                rel="noreferrer"
                className="text-blue-600 hover:underline"
              >
                {data.basics.links.twitter}
              </a>
            </span>
          )}

          {/* 5. Custom Fields (Portfolio, Website, etc): Blue & Clickable */}
          {data.basics.customFields?.map((field) => (
            <span key={field.id}>
              <span className="text-foreground">{field.label}: </span>
              <a 
                href={field.value}
                target="_blank" 
                rel="noreferrer"
                className="text-blue-600 hover:underline"
              >
                {field.value}
              </a>
            </span>
          ))}
        </div>
      </header>

      {/* ... (Rest of the resume sections: Summary, Skills, Experience, etc. remain unchanged) ... */}
      
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

      {/* PROJECTS (Updated from previous step) */}
      {data.projects && data.projects.length > 0 && (
        <section>
          <h2 className="text-sm font-bold uppercase tracking-wider mb-2 border-b pb-1">
            Projects
          </h2>

          <ul className="space-y-4">
            {data.projects.map((proj, i) => (
              <li key={i}>
                <div className="flex justify-between items-baseline">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-base">{proj.title}</span>
                    
                    <div className="flex gap-2 text-xs">
                        {proj.github && (
                            <a 
                                href={proj.github} 
                                target="_blank" 
                                rel="noreferrer"
                                className="text-blue-600 hover:underline border border-blue-200 px-1.5 py-0.5 rounded"
                            >
                                GitHub
                            </a>
                        )}
                        {proj.website && (
                            <a 
                                href={proj.website} 
                                target="_blank" 
                                rel="noreferrer"
                                className="text-blue-600 hover:underline border border-blue-200 px-1.5 py-0.5 rounded"
                            >
                                Live Demo
                            </a>
                        )}
                    </div>
                  </div>
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

      {/* CERTIFICATIONS (Updated from previous step) */}
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
                  
                  {cert.url && (
                    <>
                      <span className="mx-1 text-muted-foreground">|</span>
                      <a 
                        href={cert.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:underline ml-1"
                      >
                        Link
                      </a>
                    </>
                  )}
                </div>
                <span className="text-muted-foreground whitespace-nowrap text-xs">
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