import { LoginForm } from "@/components/login-form"
import { Logo } from "@/components/logo"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>

      {/* Login card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="glass rounded-2xl p-8 neon-glow">
          <div className="flex flex-col items-center mb-8">
            <Logo className="mb-4" />
            <h1 className="text-2xl font-bold text-foreground text-center">Bienvenido</h1>
            <p className="text-muted-foreground text-center mt-2">Inicia sesión en tu plataforma de automatización</p>
          </div>

          <LoginForm />

          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-center text-sm text-muted-foreground">Desarrollado por Neidsoft</p>
          </div>
        </div>
      </div>
    </div>
  )
}
