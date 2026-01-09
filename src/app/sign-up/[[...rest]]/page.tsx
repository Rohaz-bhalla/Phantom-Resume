import { SignUp } from "@clerk/nextjs"
import { AuthCard } from "@/components/auth/AuthCard"

export default function SignUpPage() {
  return (
    <AuthCard title="Create your account">
      <SignUp
        routing="path"
        path="/sign-up"
        signInUrl="/sign-in"
        afterSignUpUrl="/builder"
      />
    </AuthCard>
  )
}
