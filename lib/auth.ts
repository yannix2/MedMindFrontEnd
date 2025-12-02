// lib/auth.ts - UPDATED VERSION
import api from '@/lib/api'

export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginResponse {
  message: string
  user: {
    id: number
    email: string
    name: string
    last_name: string
  }
}

export interface UserProfile {
  id: number
  email: string
  name: string
  last_name: string
}

export interface RegisterData {
  name: string
  last_name: string
  email: string
  cin: string
  phone_number?: string
  address?: string
  password: string
  confirmPassword?: string
}

export interface RegisterResponse {
  message: string
  user: {
    id: number
    name: string
    last_name: string
    email: string
    cin: string
    phone_number?: string
    address?: string
    is_active: boolean
  }
}

// Check if running in browser
const isBrowser = typeof window !== 'undefined'

// Enhanced debug function
const log = (message: string, data?: any) => {
  if (isBrowser) {
    console.log(`🔐 ${message}`, data || '')
  }
}

// Cookie helper functions
export const cookieHelper = {
  // Get all cookies
  getAllCookies(): Record<string, string> {
    if (!isBrowser) return {}
    
    const cookies: Record<string, string> = {}
    document.cookie.split('; ').forEach(cookie => {
      const [name, ...valueParts] = cookie.split('=')
      const value = valueParts.join('=')
      if (name && value) {
        cookies[name] = value
      }
    })
    return cookies
  },
  
  // Get specific cookie
  getCookie(name: string): string | null {
    if (!isBrowser) return null
    return this.getAllCookies()[name] || null
  },
  
  // Check if JWT cookie exists
  hasJwtCookie(): boolean {
    if (!isBrowser) return false
    
    // Check for JWT cookie with any domain prefix
    const cookies = document.cookie
    return cookies.includes('jwt=') || 
           cookies.includes(' jwt=') || 
           cookies.includes(';jwt=')
  },
  
  // Debug cookie details
  debugCookies(): void {
    if (!isBrowser) return
    
    console.log('🍪 === COOKIE DEBUG ===')
    console.log('Full cookie string:', document.cookie)
    
    const cookies = this.getAllCookies()
    console.log('Parsed cookies:', cookies)
    
    // Check JWT specifically
    const jwt = this.getCookie('jwt')
    console.log('JWT cookie:', jwt ? `FOUND (${jwt.length} chars)` : 'NOT FOUND')
    if (jwt) {
      console.log('JWT starts with:', jwt.substring(0, 30) + '...')
    }
    
    // Check domain issue
    const currentHost = window.location.hostname
    console.log(`Current hostname: ${currentHost}`)
    console.log(`On correct domain (127.0.0.1): ${currentHost === '127.0.0.1'}`)
    
    console.log('🍪 ====================')
  },
  
  // Fix domain issue by redirecting
  fixDomainIssue(): void {
    if (!isBrowser) return
    
    const currentHost = window.location.hostname
    if (currentHost === 'localhost') {
      console.warn('⚠️ DOMAIN MISMATCH: Frontend on localhost, cookie may be set for 127.0.0.1')
      console.warn('   Access via http://127.0.0.1:3000 for cookies to work')
      
      // Option to redirect automatically
      const shouldRedirect = confirm(
        'Cookie domain mismatch detected.\n' +
        'Redirect to http://127.0.0.1:3000 for cookies to work?\n\n' +
        'Current: ' + window.location.href + '\n' +
        'Suggested: ' + window.location.href.replace('localhost', '127.0.0.1')
      )
      
      if (shouldRedirect) {
        window.location.href = window.location.href.replace('localhost', '127.0.0.1')
      }
    }
  }
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      log('Sending login request...', { email: credentials.email })
      
      // Debug before login
      cookieHelper.debugCookies()
      
      const response = await api.post('/accounts/login', credentials)
      
      log('Login API response received', response.status)
      
      const { user, message } = response.data
      
      if (!user) {
        throw new Error('No user data received from server')
      }
      
      // Store user data in localStorage
      if (isBrowser) {
        localStorage.setItem('user', JSON.stringify(user))
        localStorage.setItem('last_login', new Date().toISOString())
        log('User data stored in localStorage')
      }
      
      // Debug cookies after login
      setTimeout(() => {
        cookieHelper.debugCookies()
        
        // Check if cookie was actually set
        if (!cookieHelper.hasJwtCookie()) {
          console.warn('⚠️ JWT cookie may not have been set by backend')
          console.warn('   Check Django response headers for Set-Cookie')
          cookieHelper.fixDomainIssue()
        }
      }, 200)
      
      return {
        message,
        user
      }
    } catch (error: any) {
      console.error('❌ Login failed:', error)
      
      // Clear any stale data
      this.clearAuthData()
      
      throw new Error(
        error.response?.data?.message || 
        error.response?.data?.error || 
        error.message || 
        'Login failed'
      )
    }
  },

  async logout(): Promise<void> {
    try {
      log('Calling logout endpoint...')
      
      // Debug before logout
      cookieHelper.debugCookies()
      
      await api.post('/accounts/logout')
      log('Backend logout completed')
    } catch (error) {
      console.error('Logout API error:', error)
    } finally {
      
      this.clearAuthData()
      log('Client-side auth data cleared')
    }
  },

  async register(data: RegisterData): Promise<RegisterResponse> {
    try {
      // Remove confirmPassword before sending
      const { confirmPassword, ...apiData } = data
      
      log('Registering new user...', { email: apiData.email })
      const response = await api.post('/accounts/register', apiData)
      log('Registration successful')
      
      return response.data
    } catch (error: any) {
      console.error('❌ Registration failed:', error)
      throw new Error(
        error.response?.data?.message || 
        error.response?.data?.error || 
        error.message || 
        'Registration failed'
      )
    }
  },

  async getCurrentUser(): Promise<UserProfile | null> {
    try {
      log('Fetching current user from /accounts/me')
      
      // Debug before request
      cookieHelper.debugCookies()
      
      // This endpoint should verify JWT cookie and return user data
      const response = await api.get('/accounts/me')
      const userData = response.data
      
      log('User data received:', userData)
      
      // Update localStorage with fresh user data
      if (isBrowser) {
        localStorage.setItem('user', JSON.stringify(userData))
        localStorage.setItem('last_auth_check', new Date().toISOString())
      }
      
      return userData
    } catch (error: any) {
      log('Failed to fetch current user', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      })
      
      // If it's an auth error (401/403), clear data
      if (error.response?.status === 401 || error.response?.status === 403) {
        console.warn('🔒 Authentication failed, clearing local data')
        this.clearAuthData()
        
        // Check if it's a cookie domain issue
        if (isBrowser && !cookieHelper.hasJwtCookie()) {
          console.warn('⚠️ No JWT cookie found - could be domain issue')
          cookieHelper.fixDomainIssue()
        }
      }
      
      return null
    }
  },

  // Check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    try {
      // First check if we have a JWT cookie
      if (isBrowser && !cookieHelper.hasJwtCookie()) {
        log('No JWT cookie found in browser')
        return false
      }
      
      // Then try to fetch current user - if successful, JWT cookie is valid
      const user = await this.getCurrentUser()
      return !!user
    } catch (error) {
      return false
    }
  },

  // Quick check without API call (for UI rendering)
  hasUserData(): boolean {
    if (!isBrowser) return false
    return !!localStorage.getItem('user')
  },

  getUserFromStorage(): UserProfile | null {
    if (!isBrowser) return null
    
    const userStr = localStorage.getItem('user')
    if (userStr) {
      try {
        return JSON.parse(userStr)
      } catch {
        return null
      }
    }
    return null
  },

  getTokenFromCookie(): string | null {
    return cookieHelper.getCookie('jwt')
  },

  clearAuthData(): void {
    if (!isBrowser) return
    
    // Clear localStorage
    localStorage.removeItem('user')
    localStorage.removeItem('last_login')
    localStorage.removeItem('last_auth_check')
    
    // Try to clear JWT cookie (may not work if HTTP-only)
    document.cookie = 'jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    document.cookie = 'jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=localhost;'
    document.cookie = 'jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=127.0.0.1;'
    
    log('Client-side auth data cleared')
  },

  // Test if cookies are working
  async testAuth(): Promise<{
    hasLocalCookie: boolean
    backendReceivesCookie: boolean
    userData: UserProfile | null
  }> {
    const result = {
      hasLocalCookie: false,
      backendReceivesCookie: false,
      userData: null as UserProfile | null
    }
    
    try {
      // Check local cookie
      result.hasLocalCookie = cookieHelper.hasJwtCookie()
      log('Local JWT cookie:', result.hasLocalCookie ? 'FOUND' : 'NOT FOUND')
      
      // Test with debug endpoint
      const debugResponse = await api.get('/debug/cookies/')
      result.backendReceivesCookie = debugResponse.data.has_jwt_cookie
      log('Backend receives cookie:', result.backendReceivesCookie)
      
      // Try to get user data
      result.userData = await this.getCurrentUser()
      
    } catch (error) {
      console.error('Auth test failed:', error)
    }
    
    return result
  },

  // Debug helper
  debugAuthStatus(): void {
    if (!isBrowser) return
    
    console.log('=== AUTH STATUS ===')
    console.log('LocalStorage user:', this.getUserFromStorage())
    cookieHelper.debugCookies()
    
    const lastLogin = localStorage.getItem('last_login')
    const lastCheck = localStorage.getItem('last_auth_check')
    console.log('Last login:', lastLogin ? new Date(lastLogin).toLocaleString() : 'Never')
    console.log('Last auth check:', lastCheck ? new Date(lastCheck).toLocaleString() : 'Never')
    
    console.log('===================')
  }
}

export default authService