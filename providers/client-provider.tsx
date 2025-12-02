"use client"

import { UserProvider } from '@/contexts/user-context'
import { LanguageProvider } from '@/contexts/language-context'

export function ClientProvider({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <LanguageProvider>
        {children}
      </LanguageProvider>
    </UserProvider>
  )
}