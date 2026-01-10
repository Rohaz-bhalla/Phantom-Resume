import type { Resume } from "@/lib/resume/resume.types"
import { ResumeRenderer } from "./ResumeRenderer"

export function ResumePreview({ data }: { data: Resume }) {
  return (
    // REMOVED: "h-full overflow-y-auto" to fix double scrollbars
    <div className="bg-background p-4 min-h-full">
      <div className="mx-auto max-w-200">
        <ResumeRenderer data={data} />
      </div>
    </div>
  )
}