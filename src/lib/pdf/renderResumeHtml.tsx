import { renderToStaticMarkup } from "react-dom/server"
import type { Resume } from "@/lib/resume/resume.types"
import { ResumeRenderer } from "@/components/resume/ResumeRenderer"

export function renderResumeHtml(data: Resume): string {
  const body = renderToStaticMarkup(
    <ResumeRenderer data={data} />
  )

  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Resume</title>

    <style>
      body {
        font-family: Arial, Helvetica, sans-serif;
        color: #000;
        background: #fff;
        margin: 40px;
        font-size: 12px;
        line-height: 1.5;
      }

      h1 {
        font-size: 20px;
        margin-bottom: 4px;
      }

      h2 {
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-top: 16px;
        margin-bottom: 4px;
      }

      ul {
        padding-left: 18px;
      }

      li {
        margin-bottom: 4px;
      }

      p {
        margin: 0;
      }
    </style>
  </head>

  <body>
    ${body}
  </body>
</html>
`
}
