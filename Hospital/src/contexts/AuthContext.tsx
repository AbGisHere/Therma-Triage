'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { api } from '@/lib/api'

interface AuthContextType {
  user: any
  session: any
  isLoading: boolean
  signIn: (username: string, password: string) => Promise<void>
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
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing token on mount
    const token = api.getToken()
    if (token) {
      // Verify token by fetching current user
      api.getCurrentUser()
        .then(userData => {
          setUser(userData)
          setIsLoading(false)
        })
        .catch(() => {
          api.clearToken()
          setIsLoading(false)
        })
    } else {
      setIsLoading(false)
    }
  }, [])

  const handleSignIn = async (username: string, password: string) => {
    try {
      const response = await api.login(username, password)
      api.setToken(response.access_token)
      
      // Get user data
      const userData = await api.getCurrentUser()
      setUser(userData)
    } catch (error) {
      throw error
    }
  }

  const handleSignOut = () => {
    api.clearToken()
    setUser(null)
    window.location.href = '/login'
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session: user,
        isLoading,
        signIn: handleSignIn,
        signOut: handleSignOut,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
