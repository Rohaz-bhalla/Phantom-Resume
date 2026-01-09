import type { Resume } from "@/lib/resume/resume.types"
import { ResumeRenderer } from "./ResumeRenderer"

export function ResumePreview({ data }: { data: Resume }) {
  return (
    <div className="h-full overflow-y-auto bg-background p-4">
      <div className="mx-auto max-w-200">
        <ResumeRenderer data={data} />
      </div>
    </div>
  )
}
