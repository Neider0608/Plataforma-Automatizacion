import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/hooks/use-theme"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Plataforma de Automatización Inteligente",
  description: "Software SaaS de automatización sin código con IA",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className="dark">
      <body className={`${inter.className} font-sans antialiased`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
