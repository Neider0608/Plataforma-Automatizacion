import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/hooks/use-theme"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Facturación Electrónica | Neidsoft",
  description: "Configura la recepción, extracción, consulta y almacenamiento de comprobantes electrónicos.",
  generator: "v0.app",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="bg-background">
      <body className={`${inter.className} font-sans antialiased`}><ThemeProvider>{children}</ThemeProvider></body>
    </html>
  )
}
