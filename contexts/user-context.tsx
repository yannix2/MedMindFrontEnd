"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { authService, UserProfile, RegisterData } from '@/lib/auth' // Updated import
import { useRouter } from 'next/navigation'

interface UserContextType {
  user: UserProfile | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  register: (data: RegisterData) => Promise<void>
  refreshUser: () => Promise<void>
  error: string | null
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  // Set mounted state to prevent SSR issues
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      checkAuth()
    }
  }, [mounted])

  const checkAuth = async () => {
    setIsLoading(true)
    setError(null)
    try {
      // First check if we have user data in localStorage
      const storedUser = authService.getUserFromStorage()
      
      if (storedUser) {
        // Try to validate by fetching current user from API
        try {
          const userData = await authService.getCurrentUser()
          setUser(userData)
          // Update localStorage with fresh data
          localStorage.setItem('user', JSON.stringify(userData))
        } catch (apiError) {
          // API call failed, but we still have stored user
          console.warn('Failed to fetch current user, using stored data')
          setUser(storedUser)
        }
      } else {
        // No stored user, try API anyway
        try {
          const userData = await authService.getCurrentUser()
          setUser(userData)
          localStorage.setItem('user', JSON.stringify(userData))
        } catch (apiError) {
          // No valid authentication
          setUser(null)
        }
      }
    } catch (err: any) {
      console.error('Auth check failed:', err)
      setError(err.message || 'Authentication check failed')
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    if (!mounted) return
    
    setIsLoading(true)
    setError(null)
    try {
      const response = await authService.login({ email, password })
      
      // Store user data
      localStorage.setItem('user', JSON.stringify(response.user))
      setUser(response.user)
      
      console.log(response.message)
      
    } catch (err: any) {
      setError(err.message || 'Login failed')
      localStorage.removeItem('user')
      setUser(null)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    if (!mounted) return
    
    setIsLoading(true)
    setError(null)
    try {
      await authService.logout()
      setUser(null)
      localStorage.removeItem('user')
      
      router.push('/signin')
    } catch (err: any) {
      setError(err.message || 'Logout failed')
      setUser(null)
      localStorage.removeItem('user')
      router.push('/signin')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (data: RegisterData) => {
    if (!mounted) return
    
    setIsLoading(true)
    setError(null)
    try {
      // Password validation
      if (data.password.length < 6) {
        throw new Error('Password must be at least 6 characters long')
      }
      
      if (data.password !== data.confirmPassword) {
        throw new Error('Passwords do not match')
      }

      const response = await authService.register(data)
      
      console.log(response.message)
      // Registration successful - don't set user, they need to login
      
    } catch (err: any) {
      setError(err.message || 'Registration failed')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const refreshUser = async () => {
    if (!mounted) return
    
    setError(null)
    try {
      const userData = await authService.getCurrentUser()
      setUser(userData)
      localStorage.setItem('user', JSON.stringify(userData))
    } catch (err: any) {
      console.error('Failed to refresh user:', err)
      setError(err.message || 'Failed to refresh user data')
    }
  }

  // Handle storage events
  useEffect(() => {
    if (!mounted) return

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'user') {
        if (e.newValue === null) {
          setUser(null)
        } else {
          try {
            setUser(JSON.parse(e.newValue))
          } catch {
            setUser(null)
          }
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [mounted])

  // Don't render context until mounted
  if (!mounted) {
    return (
      <UserContext.Provider value={{
        user: null,
        isLoading: true,
        login: async () => {},
        logout: async () => {},
        register: async () => {},
        refreshUser: async () => {},
        error: null
      }}>
        {children}
      </UserContext.Provider>
    )
  }

  return (
    <UserContext.Provider value={{ 
      user, 
      isLoading, 
      login, 
      logout, 
      register,
      refreshUser,
      error 
    }}>
      {children}
    </UserContext.Provider>
  )
}

// Custom hook that's safe to use
export function useUser() {
  const context = useContext(UserContext)
  
  // Instead of throwing, return a default context for SSR
  if (!context) {
    return {
      user: null,
      isLoading: true,
      login: async () => {},
      logout: async () => {},
      register: async () => {},
      refreshUser: async () => {},
      error: null
    }
  }
  
  return context
}