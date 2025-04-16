import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { LanguageProvider } from "@/lib/LanguageContext"
import { AuthProvider } from "@/lib/AuthContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Vikasini - Her Growth Journey Starts Here",
  description: "AI Upskilling Platform for Underprivileged Women",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <LanguageProvider>
          <AuthProvider>
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
              {children}
              <Toaster />
            </ThemeProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}


import './globals.css'