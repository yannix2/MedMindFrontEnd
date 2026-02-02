import Cookies from 'js-cookie'

const API_BASE_URL = 'http://127.0.0.1:8000/api'

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
  intensity_level?: 'low' | 'moderate' | 'high' | 'very_high'
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

// New interfaces for intelligent scoring
interface ActivityScoreBreakdown {
  total: number
  breakdown: {
    exercise: number
    sleep: number
    consistency: number
    recovery: number
  }
  weights: {
    exercise: number
    sleep: number
    consistency: number
    recovery: number
  }
}

interface IntensityInfo {
  value: 'low' | 'moderate' | 'high' | 'very_high'
  label: string
  color: string
  bgColor: string
  icon: string
  multiplier: number
  description: string
}

const INTENSITY_MULTIPLIERS = {
  low: 0.7,
  moderate: 1.0,
  high: 1.3,
  very_high: 1.6
}

const SPORT_CALORIES_BY_TYPE: Record<string, number> = {
  'Running': 12,
  'Walking': 5,
  'Cycling': 10,
  'Swimming': 11,
  'Weight Training': 8,
  'Yoga': 4,
  'Pilates': 5,
  'HIIT': 15,
  'Boxing': 13,
  'Martial Arts': 10,
  'Dancing': 8,
  'Basketball': 10,
  'Football': 11,
  'Tennis': 9,
  'Badminton': 7,
  'Golf': 5,
  'Hiking': 9,
  'Climbing': 12,
  'Skiing': 11,
  'Snowboarding': 10,
  'Skating': 8,
  'Rowing': 12,
  'CrossFit': 14,
  'Zumba': 9,
  'Aerobics': 7,
  'Stretching': 3,
  'Meditation': 2,
  'Other': 6
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
    const data = await response.json()
    
    // Calculate intelligent score and update it
    const intelligentScore = this.calculateIntelligentScore(data)
    data.activity_score = intelligentScore.total
    
    return data
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
    const data = await response.json()
    
    // Recalculate score after sleep update
    const intelligentScore = this.calculateIntelligentScore(data)
    data.activity_score = intelligentScore.total
    
    // Optionally update the activity score on the backend
    await this.updateActivityScore(activityDayId, intelligentScore.total)
    
    return data
  }

  async deleteSport(sportId: number): Promise<void> {
    await this.fetchWithAuth(`${API_BASE_URL}/lifestyle/sports/${sportId}/`, {
      method: 'DELETE'
    })
  }

  private async updateActivityScore(activityDayId: number, score: number): Promise<void> {
    try {
      await this.fetchWithAuth(`${API_BASE_URL}/lifestyle/activity-days/${activityDayId}/`, {
        method: 'PUT',
        body: JSON.stringify({ activity_score: score })
      })
    } catch (error) {
      console.warn('Failed to update activity score on backend:', error)
      // Don't throw error - frontend will still show correct score
    }
  }

  // Intelligent Activity Score Calculation
  calculateIntelligentScore(activityDay: ActivityDay): ActivityScoreBreakdown {
    let exerciseScore = 0
    let sleepScore = 0
    let consistencyScore = 0
    let recoveryScore = 0

    // 1. Exercise Score (40%)
    if (activityDay.sports && activityDay.sports.length > 0) {
      const totalCalories = activityDay.sports.reduce((sum, sport) => sum + sport.calories_burned, 0)
      const totalDuration = activityDay.sports.reduce((sum, sport) => sum + sport.duration_minutes, 0)
      
      // Calculate average intensity multiplier
      const avgIntensity = activityDay.sports.reduce((sum, sport) => {
        const intensityValue = INTENSITY_MULTIPLIERS[sport.intensity_level || 'moderate']
        return sum + intensityValue
      }, 0) / activityDay.sports.length

      // Base score from calories (max 600 cal = 20 points)
      const calorieScore = Math.min(totalCalories / 600 * 20, 20)
      
      // Duration score (max 60 min = 10 points)
      const durationScore = Math.min(totalDuration / 60 * 10, 10)
      
      // Intensity score (max 10 points)
      const intensityScore = Math.min(avgIntensity * 5, 10)
      
      exerciseScore = calorieScore + durationScore + intensityScore
    }

    // 2. Sleep Score (30%)
    if (activityDay.sleep_start && activityDay.sleep_end) {
      const sleepHours = this.calculateSleepDuration(activityDay.sleep_start, activityDay.sleep_end)
      
      // Optimal sleep: 7-9 hours (max 30 points)
      if (sleepHours >= 7 && sleepHours <= 9) {
        sleepScore = 30
      } else if (sleepHours >= 6 && sleepHours < 7) {
        sleepScore = 20 + (sleepHours - 6) * 10
      } else if (sleepHours > 9 && sleepHours <= 10) {
        sleepScore = 30 - (sleepHours - 9) * 10
      } else if (sleepHours >= 5 && sleepHours < 6) {
        sleepScore = 10 + (sleepHours - 5) * 10
      } else {
        sleepScore = Math.max(0, 10 - Math.abs(sleepHours - 7.5) * 4)
      }
    }

    // 3. Consistency Score (20%) - Based on activity count
    consistencyScore = Math.min((activityDay.sports?.length || 0) * 5, 20)

    // 4. Recovery Score (10%)
    recoveryScore = activityDay.active_general ? 
      Math.min(5 + ((activityDay.sports?.length || 0) > 0 ? 5 : 0), 10) : 10

    const totalScore = Math.round((exerciseScore + sleepScore + consistencyScore + recoveryScore) * 10) / 10

    return {
      total: totalScore,
      breakdown: {
        exercise: Math.round(exerciseScore * 100) / 100,
        sleep: Math.round(sleepScore * 100) / 100,
        consistency: Math.round(consistencyScore * 100) / 100,
        recovery: Math.round(recoveryScore * 100) / 100
      },
      weights: {
        exercise: 40,
        sleep: 30,
        consistency: 20,
        recovery: 10
      }
    }
  }

  // Calculate score breakdown for a specific activity day
  getActivityScoreBreakdown(activityDay: ActivityDay): ActivityScoreBreakdown {
    return this.calculateIntelligentScore(activityDay)
  }

  calculateEstimatedCalories(duration: number, intensity: 'low' | 'moderate' | 'high' | 'very_high', sportType?: string): number {
    const baseCalories = sportType ? (SPORT_CALORIES_BY_TYPE[sportType] || 8) : 8
    const multiplier = INTENSITY_MULTIPLIERS[intensity]
    return Math.round(duration * baseCalories * multiplier)
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

  getIntensityInfo(intensity: 'low' | 'moderate' | 'high' | 'very_high' | string | null | undefined): IntensityInfo {
    const intensityLevel = intensity || 'moderate'
    
    const info: Record<string, IntensityInfo> = {
      low: { 
        value: 'low',
        label: 'Low', 
        color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
        bgColor: 'from-blue-400 to-cyan-400',
        icon: '🐢',
        multiplier: 0.7,
        description: 'Light activity, easy pace'
      },
      moderate: { 
        value: 'moderate',
        label: 'Moderate', 
        color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
        bgColor: 'from-green-400 to-emerald-400',
        icon: '🚶‍♂️',
        multiplier: 1.0,
        description: 'Moderate effort, steady pace'
      },
      high: { 
        value: 'high',
        label: 'High', 
        color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
        bgColor: 'from-yellow-400 to-orange-400',
        icon: '🏃‍♂️',
        multiplier: 1.3,
        description: 'Vigorous activity, challenging pace'
      },
      very_high: { 
        value: 'very_high',
        label: 'Very High', 
        color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
        bgColor: 'from-red-400 to-pink-400',
        icon: '⚡',
        multiplier: 1.6,
        description: 'Maximum effort, intense pace'
      }
    }
    
    return info[intensityLevel as keyof typeof info] || info.moderate
  }

  // Helper method to get score range for display
  getScoreRange(score: number): { 
    min: number; 
    color: string; 
    text: string; 
    label: string; 
    icon: string 
  } {
    const SCORE_RANGES = {
      excellent: { min: 85, color: 'from-emerald-500 to-green-500', text: 'text-emerald-600 dark:text-emerald-400', label: 'Excellent', icon: '🏆' },
      good: { min: 70, color: 'from-green-500 to-lime-500', text: 'text-green-600 dark:text-green-400', label: 'Good', icon: '⭐' },
      average: { min: 50, color: 'from-yellow-500 to-amber-500', text: 'text-yellow-600 dark:text-yellow-400', label: 'Average', icon: '📊' },
      poor: { min: 30, color: 'from-orange-500 to-red-500', text: 'text-orange-600 dark:text-orange-400', label: 'Needs Improvement', icon: '📉' },
      veryPoor: { min: 0, color: 'from-red-500 to-pink-500', text: 'text-red-600 dark:text-red-400', label: 'Very Poor', icon: '⚠️' }
    }

    if (score >= SCORE_RANGES.excellent.min) return SCORE_RANGES.excellent
    if (score >= SCORE_RANGES.good.min) return SCORE_RANGES.good
    if (score >= SCORE_RANGES.average.min) return SCORE_RANGES.average
    if (score >= SCORE_RANGES.poor.min) return SCORE_RANGES.poor
    return SCORE_RANGES.veryPoor
  }

  // Get insights based on score category
  getInsightForScore(category: 'exercise' | 'sleep' | 'consistency' | 'recovery', score: number): { 
    score: number; 
    tip: string; 
    icon: string 
  } {
    const INSIGHT_TIPS = {
      exercise: [
        { score: 80, tip: "Great job! You're exceeding exercise recommendations.", icon: "🏆" },
        { score: 60, tip: "Good effort! Consider adding variety to your workouts.", icon: "💪" },
        { score: 40, tip: "Try to increase duration or intensity gradually.", icon: "📈" },
        { score: 20, tip: "Start with light activities and build consistency.", icon: "🚶‍♂️" }
      ],
      sleep: [
        { score: 80, tip: "Excellent sleep patterns! Keep up the good routine.", icon: "😴" },
        { score: 60, tip: "Good sleep duration. Focus on sleep quality.", icon: "🌙" },
        { score: 40, tip: "Aim for 7-9 hours of sleep for better recovery.", icon: "⏰" },
        { score: 20, tip: "Prioritize consistent sleep schedule.", icon: "📅" }
      ],
      consistency: [
        { score: 80, tip: "Super consistent! You're building great habits.", icon: "🔥" },
        { score: 60, tip: "Good consistency. Try to maintain 4+ days per week.", icon: "📊" },
        { score: 40, tip: "Work on establishing a regular routine.", icon: "🔄" },
        { score: 20, tip: "Start with 2-3 consistent days per week.", icon: "🎯" }
      ],
      recovery: [
        { score: 80, tip: "Excellent recovery balance! You're listening to your body.", icon: "🧘‍♂️" },
        { score: 60, tip: "Good recovery. Ensure proper rest between intense sessions.", icon: "💤" },
        { score: 40, tip: "Balance active days with proper rest days.", icon: "⚖️" },
        { score: 20, tip: "Prioritize rest and recovery for better performance.", icon: "🛌" }
      ]
    }

    const tips = INSIGHT_TIPS[category]
    for (const tip of tips) {
      if (score >= tip.score) {
        return tip
      }
    }
    return tips[tips.length - 1]
  }

  // Get sport data with calories per minute
  getSportTypeWithCalories(sportType: string): { value: string; icon: string; caloriesPerMin: number } {
    const sportInfo = {
      value: sportType,
      icon: this.getSportIcon(sportType),
      caloriesPerMin: SPORT_CALORIES_BY_TYPE[sportType] || 6
    }
    return sportInfo
  }

  // Get all sport types with their metadata
  getAllSportTypes(): Array<{ value: string; icon: string; caloriesPerMin: number }> {
    return Object.keys(SPORT_CALORIES_BY_TYPE).map(type => ({
      value: type,
      icon: this.getSportIcon(type),
      caloriesPerMin: SPORT_CALORIES_BY_TYPE[type]
    }))
  }
}

export const activityTodayService = new ActivityTodayService()
export type { 
  ActivityDay, 
  Sport, 
  NewSportData, 
  SleepData,
  ActivityScoreBreakdown,
  IntensityInfo 
}