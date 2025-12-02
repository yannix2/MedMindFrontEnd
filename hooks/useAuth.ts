// hooks/useAuth.ts
import { useState, useEffect, useCallback } from 'react'
import { authService, UserProfile } from '@/lib/auth'

export function useAuth() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load initial user data
  useEffect(() => {
    const initAuth = async () => {
      try {
        setLoading(true)
        
        // First check localStorage for quick UI rendering
        const storedUser = authService.getUserFromStorage()
        if (storedUser) {
          setUser(storedUser)
        }
        
        // Then verify with backend if we have user data
        if (storedUser) {
          const isValid = await authService.validateSession()
          if (!isValid) {
            setUser(null)
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    initAuth()
  }, [])

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await authService.login(credentials)
      setUser(response.user)
      
      return response
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    await authService.logout()
    setUser(null)
    setError(null)
  }, [])

  const register = useCallback(async (data: RegisterData) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await authService.register(data)
      
      // Auto-login after registration if your backend supports it
      if (response.user) {
        setUser(response.user)
      }
      
      return response
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const refreshUser = useCallback(async () => {
    try {
      const currentUser = await authService.getCurrentUser()
      setUser(currentUser)
      return currentUser
    } catch (err) {
      setUser(null)
      return null
    }
  }, [])

  return {
    user,
    loading,
    error,
    login,
    logout,
    register,
    refreshUser,
    isAuthenticated: !!user,
    setError
  }
}