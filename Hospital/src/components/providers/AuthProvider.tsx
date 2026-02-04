'use client'

import React from 'react'
import { SessionProvider } from 'next-auth/react'
import { AuthProvider as AuthContextProvider } from '@/contexts/AuthContext'

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  return (
    <SessionProvider>
      <AuthContextProvider>
        {children}
      </AuthContextProvider>
    </SessionProvider>
  )
}
