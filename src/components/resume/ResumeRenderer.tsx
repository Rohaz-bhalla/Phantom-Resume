import type { Resume } from "@/lib/resume/resume.types"

type Props = {
  data: Resume
}

export function ResumeRenderer({ data }: Props) {
  return (
    <article className="font-sans text-sm leading-relaxed text-foreground space-y-6">

      {/* HEADER */}
      <header className="space-y-1">
        <h1 className="text-xl font-semibold">
          {data.basics.name || "Your Name"}
        </h1>

        <p className="text-muted-foreground">
          {[
            data.basics.email,
            data.basics.phone,
            data.basics.location,
          ]
            .filter(Boolean)
            .join(" · ")}
        </p>
      </header>

      {/* SUMMARY */}
      {data.summary && (
        <section>
          <h2 className="text-xs uppercase tracking-wide text-muted-foreground">
            Summary
          </h2>
          <p>{data.summary}</p>
        </section>
      )}

      {/* SKILLS */}
      {data.skills.length > 0 && (
        <section>
          <h2 className="text-xs uppercase tracking-wide text-muted-foreground">
            Skills
          </h2>
          <p>{data.skills.join(", ")}</p>
        </section>
      )}

      {/* EXPERIENCE */}
      {data.experience.length > 0 && (
        <section>
          <h2 className="text-xs uppercase tracking-wide text-muted-foreground">
            Experience
          </h2>

          <ul className="space-y-4">
            {data.experience.map((exp, i) => (
              <li key={i}>
                <div className="flex justify-between text-sm font-medium">
                  <span>{exp.role} — {exp.company}</span>
                  <span className="text-muted-foreground">
                    {exp.startDate}
                    {exp.endDate ? ` – ${exp.endDate}` : ""}
                  </span>
                </div>

                {exp.bullets.length > 0 && (
                  <ul className="mt-2 list-disc pl-5 space-y-1">
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
      {data.projects.length > 0 && (
        <section>
          <h2 className="text-xs uppercase tracking-wide text-muted-foreground">
            Projects
          </h2>

          <ul className="space-y-4">
            {data.projects.map((proj, i) => (
              <li key={i}>
                <p className="font-medium">{proj.title}</p>

                {proj.bullets.length > 0 && (
                  <ul className="mt-1 list-disc pl-5 space-y-1">
                    {proj.bullets.map((b, j) => (
                      <li key={j}>{b}</li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* EDUCATION */}
      {data.education.length > 0 && (
        <section>
          <h2 className="text-xs uppercase tracking-wide text-muted-foreground">
            Education
          </h2>

          <ul className="space-y-2">
            {data.education.map((edu, i) => (
              <li key={i}>
                <p className="font-medium">
                  {edu.degree} — {edu.institute}
                </p>
                <p className="text-muted-foreground text-sm">
                  {edu.year}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}

    </article>
  )
}
