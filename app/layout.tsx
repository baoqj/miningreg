import type { Metadata } from 'next'
import { LanguageProvider } from '@/components/providers/language-provider'
import { SessionProvider } from '@/components/providers/session-provider'
import './globals.css'

export const metadata: Metadata = {
  title: 'Canadian Mining Regulatory AI Legal Assistant',
  description: 'AI-powered legal compliance assistant for Canadian mining industry',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
