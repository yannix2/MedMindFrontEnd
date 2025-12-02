// lib/profile.ts - UPDATED VERSION
import api from './api'
import { authService, cookieHelper } from './auth'

export interface UserProfileData {
  id?: number
  user_id?: number
  age: number
  weight: number
  height: number
  sex: 'M' | 'F' | 'O'
  imc?: number
  created_at?: string
  updated_at?: string
}

export interface ProfileFormData {
  age: number
  weight: number
  height: number
  sex: 'M' | 'F' | 'O'
}

// Enhanced debug helper
const debugRequest = (method: string, url: string, data?: any) => {
  console.log(`📤 ${method} ${url}`, data || '')
  console.log('Axios withCredentials:', api.defaults.withCredentials)
  
  if (typeof document !== 'undefined') {
    // Debug cookies before request
    cookieHelper.debugCookies()
    
    // Check if we're on correct domain
    const currentHost = window.location.hostname
    if (currentHost === 'localhost') {
      console.warn('⚠️ DOMAIN WARNING: Running on localhost, cookie may not be sent')
      console.warn('   Cookie is set for 127.0.0.1, access via http://127.0.0.1:3000')
    }
  }
}

export const profileService = {
async getProfile(): Promise<UserProfileData | null> {
  try {
    // Use the /me endpoint which gets profile for current authenticated user
    const url = '/lifestyle/user-profiles/me'
    debugRequest('GET', url)
    
    // Don't pass userId in URL, let backend determine user from JWT
    const response = await api.get(url)
    console.log('✅ Profile fetch successful:', response.data)
    return response.data
  } catch (error: any) {
    console.error('❌ Profile fetch error:', {
      url: '/lifestyle/user-profiles/me/',
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    })
    
    // If 404, profile doesn't exist - this is OK
    if (error.response?.status === 404) {
      console.log('Profile not found (404) - returning null')
      return null
    }
    
    // If 401/403, authentication issue
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.log('🔒 Authentication error detected in profile fetch')
      
      // Clear auth data
      authService.clearAuthData()
      throw new Error('Authentication required. Please login again.')
    }
    
    // For other errors, throw with descriptive message
    const errorMsg = error.response?.data?.message || 
                    error.response?.data?.detail || 
                    error.message ||
                    'Profile not found or cannot be accessed'
    
    throw new Error(errorMsg)
  }},   
  // Create or update profile
  async saveProfile(data: ProfileFormData): Promise<UserProfileData> {
    try {
      debugRequest('POST', '/lifestyle/user-profiles/', data)
      
      // First verify authentication
      const isAuth = await authService.isAuthenticated()
      if (!isAuth) {
        throw new Error('Not authenticated. Please login first.')
      }
      
      const response = await api.post('/lifestyle/user-profiles/', data)
      console.log('✅ Profile saved successfully:', response.data)
      return response.data
    } catch (error: any) {
      console.error('❌ Profile save error:', error)
      
      // Handle authentication errors
      if (error.response?.status === 401 || error.response?.status === 403) {
        console.log('🔒 Authentication error during profile save')
        
        // Detailed debug
        cookieHelper.debugCookies()
        
        // Clear auth data
        authService.clearAuthData()
        
        // Provide helpful error message
        if (!cookieHelper.hasJwtCookie()) {
          throw new Error('Session expired (no cookie). Please login again.')
        } else {
          throw new Error('Session expired (invalid cookie). Please login again.')
        }
      }
      
      // Handle validation errors
      if (error.response?.status === 400) {
        const errorData = error.response.data
        if (typeof errorData === 'object') {
          // Extract field errors
          const fieldErrors = Object.entries(errorData)
            .map(([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`)
            .join('\n')
          
          throw new Error(`Validation failed:\n${fieldErrors}`)
        }
      }
      
      throw new Error(
        error.response?.data?.message || 
        error.response?.data?.detail || 
        error.response?.data?.error || 
        error.message || 
        'Failed to save profile'
      )
    }
  },

  // Update existing profile
  async updateProfile(profileId: number, data: ProfileFormData): Promise<UserProfileData> {
    try {
      debugRequest('PATCH', `/lifestyle/user-profiles/${profileId}/`, data)
      
      const response = await api.patch(`/lifestyle/user-profiles/${profileId}/`, data)
      return response.data
    } catch (error: any) {
      console.error('Profile update error:', error)
      
      // Handle authentication errors
      if (error.response?.status === 401 || error.response?.status === 403) {
        authService.clearAuthData()
        throw new Error('Authentication required. Please login again.')
      }
      
      throw new Error(
        error.response?.data?.message || 
        error.response?.data?.error || 
        error.message || 
        'Failed to update profile'
      )
    }
  },


  // Calculate BMI
  calculateBMI(weight: number, height: number): number {
    const heightInMeters = height / 100
    const bmi = weight / (heightInMeters * heightInMeters)
    return Math.round(bmi * 10) / 10 // Round to 1 decimal
  },

  // Get BMI category
  getBMICategory(bmi: number): { category: string; color: string; description: string } {
    if (bmi < 18.5) return { 
      category: 'Underweight', 
      color: 'text-blue-500',
      description: 'Consider gaining weight for better health'
    }
    if (bmi < 25) return { 
      category: 'Normal weight', 
      color: 'text-green-500',
      description: 'Healthy weight range'
    }
    if (bmi < 30) return { 
      category: 'Overweight', 
      color: 'text-yellow-500',
      description: 'Consider moderate weight loss'
    }
    return { 
      category: 'Obese', 
      color: 'text-red-500',
      description: 'Consider consulting a healthcare provider'
    }
  },

  // Get BMI advice
  getBMIAdvice(bmi: number, age: number, sex: string): string {
    if (bmi < 18.5) {
      return 'Consider increasing calorie intake with nutritious foods.'
    } else if (bmi < 25) {
      return 'Maintain your current healthy lifestyle.'
    } else if (bmi < 30) {
      return 'Moderate weight loss through diet and exercise is recommended.'
    } else {
      return 'Consult a healthcare provider for personalized advice.'
    }
  }
}