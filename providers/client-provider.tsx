"use client"

import { UserProvider } from '@/contexts/user-context'


export function ClientProvider({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>

      {children}
    </UserProvider>
  )
}