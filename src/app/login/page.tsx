import { LoginForm } from "@/components/login-form"
import { ToastifyContainer } from "@/components/ToastifyContainer"

export const dynamic = 'force-dynamic'

export default async function LoginPage() {
  return (
    <>
    <ToastifyContainer />
      <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm md:max-w-3xl">
          <LoginForm />
        </div>
      </div>
    </>
  )
}
