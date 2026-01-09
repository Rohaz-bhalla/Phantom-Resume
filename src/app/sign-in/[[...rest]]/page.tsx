import { SignIn } from "@clerk/nextjs"
import { AuthCard } from "@/components/auth/AuthCard"

export default function SignInPage() {
  return (
    <AuthCard title="Hey User...!">
      <SignIn
        routing="path"
        path="/sign-in"
        signUpUrl="/sign-up"
        afterSignInUrl="/builder"
      />
    </AuthCard>
  )
}
