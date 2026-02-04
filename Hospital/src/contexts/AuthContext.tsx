'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { signIn, signOut, useSession } from 'next-auth/react'

interface AuthContextType {
  user: any
  session: any
  isLoading: boolean
  signIn: () => void
  signOut: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { data: session, status } = useSession()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    if (session?.user) {
      setUser({
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
        role: session.user.role || 'user'
      })
    } else {
      setUser(null)
    }
  }, [session])

  const handleSignIn = () => {
    signIn('google')
  }

  const handleSignOut = () => {
    signOut()
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading: status === 'loading',
        signIn: handleSignIn,
        signOut: handleSignOut,
        isAuthenticated: !!session
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
