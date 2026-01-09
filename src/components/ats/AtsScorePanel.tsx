"use client"

import type { Resume } from "@/lib/resume/resume.types"
import { calculateAtsScore } from "@/lib/ats/atsScore"

import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export function AtsScorePanel({ resume }: { resume: Resume }) {
  const result = calculateAtsScore(resume)

  return (
    <Card className="p-4 space-y-4">
      <div>
        <h2 className="text-lg font-semibold">
          ATS Score: {result.score} / 100
        </h2>
        <p className="text-sm text-muted-foreground">
          How well your resume performs in applicant tracking systems
        </p>
      </div>

      <Separator />

      <ul className="space-y-3">
        {result.breakdown.map(item => (
          <li key={item.label} className="text-sm">
            <div className="flex justify-between font-medium">
              <span>{item.label}</span>
              <span>
                {item.points}/{item.max}
              </span>
            </div>
            <p className="text-muted-foreground text-xs">
              {item.message}
            </p>
          </li>
        ))}
      </ul>
    </Card>
  )
}
