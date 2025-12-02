import Cookies from 'js-cookie'

const API_BASE_URL = 'https://medmind-wkpd.onrender.com/api/'

interface ActivityDay {
  id: number
  date: string
  sleep_start: string | null
  sleep_end: string | null
  active_general: boolean
  activity_score: number
  sports: Sport[]
  created_at: string
  updated_at: string
}

interface Sport {
  id: number
  sport_type: string
  duration_minutes: number
  intensity_level?: 'low' | 'moderate' | 'high' | 'very_high' // Make optional
  calories_burned: number
  notes?: string
  created_at: string
  updated_at: string
}
interface NewSportData {
  sport_type: string
  duration_minutes: number
  intensity_level: 'low' | 'moderate' | 'high' | 'very_high'
  calories_burned: number
  notes?: string
}

interface SleepData {
  sleep_start: string | null
  sleep_end: string | null
  active_general: boolean
}

class ActivityTodayService {
  private getAuthToken(): string {
    const token = Cookies.get('jwt')
    if (!token) {
      throw new Error('No authentication token found')
    }
    return token
  }

  private async fetchWithAuth(url: string, options: RequestInit = {}) {
    const token = this.getAuthToken()
    
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers
    }

    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include'
    })

    if (response.status === 401) {
      Cookies.remove('jwt')
      window.location.href = '/signin'
      throw new Error('Authentication expired')
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.message || `HTTP ${response.status}: ${response.statusText}`)
    }

    return response
  }

  async getTodayActivity(): Promise<ActivityDay> {
    const response = await this.fetchWithAuth(`${API_BASE_URL}/lifestyle/activity-days/me`)
    return response.json()
  }

  async createActivityDay(): Promise<ActivityDay> {
    const response = await this.fetchWithAuth(`${API_BASE_URL}/lifestyle/activity-days/`, {
      method: 'POST',
      body: JSON.stringify({
        date: new Date().toISOString().split('T')[0]
      })
    })
    return response.json()
  }

  async addSport(sportData: NewSportData, activityDayId: number): Promise<Sport> {
    const response = await this.fetchWithAuth(`${API_BASE_URL}/lifestyle/sports/`, {
      method: 'POST',
      body: JSON.stringify({
        ...sportData,
        activity_day: activityDayId
      })
    })
    return response.json()
  }

  async updateSleep(activityDayId: number, sleepData: SleepData): Promise<ActivityDay> {
    const response = await this.fetchWithAuth(`${API_BASE_URL}/lifestyle/activity-days/${activityDayId}/`, {
      method: 'PATCH',
      body: JSON.stringify(sleepData)
    })
    return response.json()
  }

  async deleteSport(sportId: number): Promise<void> {
    await this.fetchWithAuth(`${API_BASE_URL}/lifestyle/sports/${sportId}/`, {
      method: 'DELETE'
    })
  }

  calculateEstimatedCalories(duration: number, intensity: 'low' | 'moderate' | 'high' | 'very_high'): number {
    const multipliers = {
      low: 3,
      moderate: 6,
      high: 9,
      very_high: 12
    }
    return Math.round(duration * multipliers[intensity])
  }

  calculateSleepDuration(start: string | null, end: string | null): number {
    if (!start || !end) return 0
    
    const startTime = new Date(`1970-01-01T${start}Z`)
    const endTime = new Date(`1970-01-01T${end}Z`)
    
    if (endTime < startTime) {
      endTime.setDate(endTime.getDate() + 1)
    }
    
    const diffMs = endTime.getTime() - startTime.getTime()
    return diffMs / (1000 * 60 * 60)
  }

  formatTime(time: string | null): string {
    if (!time) return '--:--'
    return time.slice(0, 5)
  }

  getSportIcon(sportType: string): string {
    const icons: Record<string, string> = {
      'Running': '🏃‍♂️',
      'Walking': '🚶‍♂️',
      'Cycling': '🚴‍♂️',
      'Swimming': '🏊‍♂️',
      'Weight Training': '🏋️‍♂️',
      'Yoga': '🧘‍♂️',
      'Pilates': '💪',
      'HIIT': '⚡',
      'Boxing': '🥊',
      'Martial Arts': '🥋',
      'Dancing': '💃',
      'Basketball': '🏀',
      'Football': '⚽',
      'Tennis': '🎾',
      'Badminton': '🏸',
      'Golf': '⛳',
      'Hiking': '🥾',
      'Climbing': '🧗‍♂️',
      'Skiing': '⛷️',
      'Snowboarding': '🏂',
      'Skating': '⛸️',
      'Rowing': '🚣‍♂️',
      'CrossFit': '🏋️‍♀️',
      'Zumba': '💃',
      'Aerobics': '👯‍♀️',
      'Stretching': '🤸‍♂️',
      'Meditation': '🧘‍♀️',
      'Other': '🏅'
    }
    return icons[sportType] || '⚽'
  }

getIntensityInfo(intensity: 'low' | 'moderate' | 'high' | 'very_high' | string | null | undefined) {
  // Default to moderate if intensity is null/undefined or not found
  const intensityLevel = intensity || 'moderate'
  
  const info = {
    low: { 
      label: 'Low', 
      color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
      icon: '🐢',
      description: 'Light activity, minimal effort'
    },
    moderate: { 
      label: 'Moderate', 
      color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
      icon: '🚶‍♂️',
      description: 'Moderate effort, light sweating'
    },
    high: { 
      label: 'High', 
      color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
      icon: '🏃‍♂️',
      description: 'Vigorous activity, heavy sweating'
    },
    very_high: { 
      label: 'Very High', 
      color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
      icon: '⚡',
      description: 'Maximum effort, exhaustive activity'
    }
  }
  
  // Return the intensity info or default to moderate
  return info[intensityLevel as keyof typeof info] || info.moderate
}
}

export const activityTodayService = new ActivityTodayService()
export type { ActivityDay, Sport, NewSportData, SleepData }