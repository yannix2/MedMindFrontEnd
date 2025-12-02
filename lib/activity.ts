// lib/activity.ts
import api from './api'
import { authService } from './auth'

export interface SportData {
  id?: number
  sport_type: string
  duration_minutes: number
  calories_burned: number
  created_at?: string
  updated_at?: string
}

export interface ActivityDayData {
  id: number
  date: string
  sleep_start: string | null
  sleep_end: string | null
  active_general: boolean
  activity_score: number
  sports: SportData[]
  created_at: string
  updated_at: string
}

export interface CreateActivityDayData {
  sleep_start?: string
  sleep_end?: string
  active_general?: boolean
}

export interface CreateSportData {
  sport_type: string
  duration_minutes: number
  calories_burned?: number
}

export interface SportSuggestion {
  name: string
  icon: string
  color: string
  defaultDuration: number
  defaultCalories: number
}

export const activityService = {
  // Get all activity days
  async getAllActivityDays(): Promise<ActivityDayData[]> {
    try {
      console.log('🏃 Fetching all activity days...')
      const response = await api.get('/lifestyle/activity-days/')
      console.log('✅ Activity days fetched successfully')
      return response.data
    } catch (error: any) {
      console.error('❌ Activity days fetch error:', error)
      
      if (error.response?.status === 401 || error.response?.status === 403) {
        authService.clearAuthData()
        throw new Error('Authentication required. Please login again.')
      }
      
      throw new Error(
        error.response?.data?.message || 
        error.response?.data?.detail || 
        'Failed to fetch activity days'
      )
    }
  },

  // Get today's activity day
  async getTodayActivityDay(): Promise<ActivityDayData | null> {
    try {
      console.log('🏃 Fetching today\'s activity...')
      const response = await api.get('/lifestyle/activity-days/')
      const today = new Date().toISOString().split('T')[0]
      const todayActivity = response.data.find((day: ActivityDayData) => day.date === today)
      console.log('✅ Today\'s activity fetched successfully')
      return todayActivity || null
    } catch (error: any) {
      console.error('❌ Today activity fetch error:', error)
      
      if (error.response?.status === 401 || error.response?.status === 403) {
        authService.clearAuthData()
        throw new Error('Authentication required. Please login again.')
      }
      
      throw new Error(
        error.response?.data?.message || 
        error.response?.data?.detail || 
        'Failed to fetch today\'s activity'
      )
    }
  },

  // Create activity day
  async createActivityDay(data: CreateActivityDayData): Promise<ActivityDayData> {
    try {
      console.log('🏃 Creating activity day...', data)
      const response = await api.post('/lifestyle/activity-days/', data)
      console.log('✅ Activity day created successfully:', response.data)
      return response.data
    } catch (error: any) {
      console.error('❌ Activity day creation error:', error)
      
      if (error.response?.status === 401 || error.response?.status === 403) {
        authService.clearAuthData()
        throw new Error('Authentication required. Please login again.')
      }
      
      throw new Error(
        error.response?.data?.message || 
        error.response?.data?.detail || 
        'Failed to create activity day'
      )
    }
  },

  // Update activity day
  async updateActivityDay(id: number, data: Partial<CreateActivityDayData>): Promise<ActivityDayData> {
    try {
      console.log('🏃 Updating activity day...', data)
      const response = await api.patch(`/lifestyle/activity-days/${id}/`, data)
      console.log('✅ Activity day updated successfully:', response.data)
      return response.data
    } catch (error: any) {
      console.error('❌ Activity day update error:', error)
      
      if (error.response?.status === 401 || error.response?.status === 403) {
        authService.clearAuthData()
        throw new Error('Authentication required. Please login again.')
      }
      
      throw new Error(
        error.response?.data?.message || 
        error.response?.data?.detail || 
        'Failed to update activity day'
      )
    }
  },

  // Delete activity day
  async deleteActivityDay(id: number): Promise<void> {
    try {
      console.log('🏃 Deleting activity day...', id)
      await api.delete(`/lifestyle/activity-days/${id}/`)
      console.log('✅ Activity day deleted successfully')
    } catch (error: any) {
      console.error('❌ Activity day deletion error:', error)
      
      if (error.response?.status === 401 || error.response?.status === 403) {
        authService.clearAuthData()
        throw new Error('Authentication required. Please login again.')
      }
      
      throw new Error(
        error.response?.data?.message || 
        error.response?.data?.detail || 
        'Failed to delete activity day'
      )
    }
  },

  // Create sport
  async createSport(data: CreateSportData): Promise<SportData> {
    try {
      console.log('⚽ Creating sport...', data)
      const response = await api.post('/lifestyle/sports/', data)
      console.log('✅ Sport created successfully:', response.data)
      return response.data
    } catch (error: any) {
      console.error('❌ Sport creation error:', error)
      
      if (error.response?.status === 401 || error.response?.status === 403) {
        authService.clearAuthData()
        throw new Error('Authentication required. Please login again.')
      }
      
      throw new Error(
        error.response?.data?.message || 
        error.response?.data?.detail || 
        'Failed to create sport'
      )
    }
  },

  // Update sport
  async updateSport(id: number, data: Partial<CreateSportData>): Promise<SportData> {
    try {
      console.log('⚽ Updating sport...', data)
      const response = await api.patch(`/lifestyle/sports/${id}/`, data)
      console.log('✅ Sport updated successfully:', response.data)
      return response.data
    } catch (error: any) {
      console.error('❌ Sport update error:', error)
      
      if (error.response?.status === 401 || error.response?.status === 403) {
        authService.clearAuthData()
        throw new Error('Authentication required. Please login again.')
      }
      
      throw new Error(
        error.response?.data?.message || 
        error.response?.data?.detail || 
        'Failed to update sport'
      )
    }
  },

  // Delete sport
  async deleteSport(id: number): Promise<void> {
    try {
      console.log('⚽ Deleting sport...', id)
      await api.delete(`/lifestyle/sports/${id}/`)
      console.log('✅ Sport deleted successfully')
    } catch (error: any) {
      console.error('❌ Sport deletion error:', error)
      
      if (error.response?.status === 401 || error.response?.status === 403) {
        authService.clearAuthData()
        throw new Error('Authentication required. Please login again.')
      }
      
      throw new Error(
        error.response?.data?.message || 
        error.response?.data?.detail || 
        'Failed to delete sport'
      )
    }
  },

  // Get sport suggestions
  getSportSuggestions(): SportSuggestion[] {
    return [
      { name: 'Running', icon: '🏃', color: 'from-green-500 to-emerald-500', defaultDuration: 30, defaultCalories: 300 },
      { name: 'Cycling', icon: '🚴', color: 'from-blue-500 to-cyan-500', defaultDuration: 45, defaultCalories: 400 },
      { name: 'Swimming', icon: '🏊', color: 'from-cyan-500 to-blue-500', defaultDuration: 30, defaultCalories: 250 },
      { name: 'Yoga', icon: '🧘', color: 'from-purple-500 to-pink-500', defaultDuration: 60, defaultCalories: 180 },
      { name: 'Weight Training', icon: '🏋️', color: 'from-red-500 to-orange-500', defaultDuration: 45, defaultCalories: 220 },
      { name: 'Walking', icon: '🚶', color: 'from-gray-500 to-gray-700', defaultDuration: 60, defaultCalories: 200 },
      { name: 'Basketball', icon: '🏀', color: 'from-orange-500 to-red-500', defaultDuration: 60, defaultCalories: 500 },
      { name: 'Football', icon: '⚽', color: 'from-yellow-500 to-green-500', defaultDuration: 90, defaultCalories: 600 },
    ]
  },

  // Calculate sleep duration in hours
  calculateSleepDuration(sleepStart: string, sleepEnd: string): number {
    const start = new Date(`1970-01-01T${sleepStart}`)
    const end = new Date(`1970-01-01T${sleepEnd}`)
    
    let diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60) // hours
    
    // Handle overnight sleep
    if (diff < 0) {
      diff += 24
    }
    
    return Math.round(diff * 10) / 10
  },

  // Format time for display
  formatTime(time: string): string {
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  },

  // Get activity status based on score
  getActivityStatus(score: number): 'excellent' | 'good' | 'fair' | 'poor' {
    if (score >= 80) return 'excellent'
    if (score >= 60) return 'good'
    if (score >= 40) return 'fair'
    return 'poor'
  },

  // Get status color
  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      excellent: 'from-emerald-500 to-green-500',
      good: 'from-green-500 to-lime-500',
      fair: 'from-yellow-500 to-amber-500',
      poor: 'from-orange-500 to-red-500'
    }
    return colors[status] || 'from-gray-500 to-gray-600'
  },

  // Get status text
  getStatusText(status: string): string {
    const texts: Record<string, string> = {
      excellent: 'Excellent',
      good: 'Good',
      fair: 'Fair',
      poor: 'Need Improvement'
    }
    return texts[status] || status
  },

  // Get status icon
  getStatusIcon(status: string): string {
    const icons: Record<string, string> = {
      excellent: '🏆',
      good: '✅',
      fair: '⚠️',
      poor: '❌'
    }
    return icons[status] || '🏃'
  }
}