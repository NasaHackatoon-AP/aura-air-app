import { SignupForm } from "@/components/Authentication/SignupForm/SignupForm"
import { Cloud, Wind } from "lucide-react"

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Cloud className="h-10 w-10 text-primary" />
            <Wind className="h-8 w-8 text-secondary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Criar Conta</h1>
          <p className="text-muted-foreground">Comece a monitorar sua saúde respiratória</p>
        </div>
        <SignupForm />
      </div>
    </div>
  )
}
