import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function AuthCard({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <h1 className="text-xl font-semibold text-center">
            {title}
          </h1>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </div>
  )
}
