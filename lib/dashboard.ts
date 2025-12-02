import api from './api'
import { authService } from './auth'

export interface DashboardData {
  date: string
  profile: {
    id: number
    user: string
    user_id: number
    age: number
    weight: number
    height: number
    sex: string
    imc: number
    created_at: string
    updated_at: string
  }
  medical: {
    id: number
    user: string
    user_id: number
    allergies: string[]
    maladies: string[]
    is_smoker: boolean
    is_alcoholic: boolean
    is_drugging: boolean
    drug_type: string
    created_at: string
    updated_at: string
  }
  eating_day: any | null
  activity_day: any | null
  prediction: any | null
  overall_score: number
}

export interface CreateEatingDayData {
  number_of_meals: number
}

// Health score calculation logic
export const healthScoreCalculator = {
  // Calculate total score from nutrition and activity
  calculateTotalScore(nutritionScore: number | null, activityScore: number | null): number {
    if (nutritionScore === null && activityScore === null) return 50 // Default if no data
    
    if (nutritionScore !== null && activityScore !== null) {
      // Weighted average: Nutrition 60%, Activity 40%
      return Math.round((nutritionScore * 0.6) + (activityScore * 0.4))
    }
    
    // Return whichever score is available
    return Math.round((nutritionScore || activityScore || 50))
  },

  // Get motivational message based on score
  getMotivationalMessage(score: number): { 
    message: string; 
    emoji: string; 
    color: string;
    subtext: string;
    gradient: string;
  } {
    if (score >= 90) return {
      message: "Health Champion! 🏆",
      emoji: "🚀",
      color: "text-emerald-600",
      subtext: "You're crushing it! Keep up the amazing work.",
      gradient: "from-emerald-500 to-green-500"
    }
    if (score >= 80) return {
      message: "Fantastic Progress! ✨",
      emoji: "⭐",
      color: "text-green-600",
      subtext: "You're doing great! Consistency is key.",
      gradient: "from-green-500 to-emerald-500"
    }
    if (score >= 70) return {
      message: "Good Job! 👍",
      emoji: "💪",
      color: "text-lime-600",
      subtext: "Solid effort! Small improvements make big differences.",
      gradient: "from-lime-500 to-green-500"
    }
    if (score >= 60) return {
      message: "Making Progress! 📈",
      emoji: "🔥",
      color: "text-amber-600",
      subtext: "You're on the right track! Keep pushing forward.",
      gradient: "from-amber-500 to-orange-500"
    }
    if (score >= 50) return {
      message: "Getting Started! 🚶",
      emoji: "🎯",
      color: "text-orange-600",
      subtext: "Every journey begins with a single step. You've got this!",
      gradient: "from-orange-500 to-red-500"
    }
    return {
      message: "Time to Boost! ⚡",
      emoji: "💡",
      color: "text-red-600",
      subtext: "Let's build momentum together. Start with one healthy choice.",
      gradient: "from-red-500 to-pink-500"
    }
  },

  // Get health tips based on score
  getHealthTips(score: number, hasNutrition: boolean, hasActivity: boolean): string[] {
    const tips: string[] = []
    
    if (score < 70) {
      if (!hasNutrition) tips.push("Log your meals to improve nutrition tracking")
      if (!hasActivity) tips.push("Track some physical activity to boost your score")
      tips.push("Drink more water throughout the day")
      tips.push("Aim for 7-8 hours of quality sleep")
    } else if (score < 85) {
      tips.push("Great! Try adding some variety to your meals")
      tips.push("Mix cardio and strength training for balanced fitness")
      tips.push("Stay hydrated with 8 glasses of water daily")
    } else {
      tips.push("Maintain your excellent habits! 🎉")
      tips.push("Consider trying a new healthy recipe")
      tips.push("Share your progress to inspire others")
    }
    
    return tips.slice(0, 3)
  },

  // Calculate streak based on consecutive days with data
  calculateStreak(dashboardData: DashboardData | null): number {
    // This is a simplified frontend calculation
    // In production, you'd want to get this from the backend
    if (!dashboardData) return 0
    
    // Mock streak calculation - replace with actual logic
    const today = new Date()
    const createdDate = dashboardData.date ? new Date(dashboardData.date) : today
    const daysDiff = Math.floor((today.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24))
    
    // Simple logic: if user has both nutrition and activity today, streak continues
    const hasTodayData = dashboardData.eating_day || dashboardData.activity_day
    
    if (hasTodayData) {
      return Math.min(7, daysDiff + 1) // Cap at 7 for demo
    }
    
    return Math.max(0, daysDiff)
  },

  // Calculate frontend stats
  calculateStats(dashboardData: DashboardData | null, activityData: any) {
    const stats = {
      caloriesBurned: 0,
      steps: 0,
      waterIntake: 0,
      sleepHours: 0,
      activeMinutes: 0,
      mealsLogged: 0
    }

    if (dashboardData?.eating_day) {
      stats.mealsLogged = dashboardData.eating_day.number_of_meals
      // Calculate approximate calories from meals
      if (dashboardData.eating_day.meals) {
        const totalCalories = dashboardData.eating_day.meals.reduce((sum: number, meal: any) => {
          return sum + (meal.foods?.reduce((mealSum: number, food: any) => 
            mealSum + (food.calories || 0), 0) || 0)
        }, 0)
        // For demo: assume 70% of calories are burned through BMR and activity
        stats.caloriesBurned += Math.round(totalCalories * 0.7)
      }
    }

    if (activityData) {
      // Calculate sleep hours
      if (activityData.sleep_start && activityData.sleep_end) {
        const sleepStart = new Date(`1970-01-01T${activityData.sleep_start}`)
        const sleepEnd = new Date(`1970-01-01T${activityData.sleep_end}`)
        let hours = (sleepEnd.getTime() - sleepStart.getTime()) / (1000 * 60 * 60)
        if (hours < 0) hours += 24 // Handle overnight sleep
        stats.sleepHours = Math.round(hours * 10) / 10
      }

      // Calculate activity stats
      if (activityData.sports) {
        stats.activeMinutes = activityData.sports.reduce((sum: number, sport: any) => 
          sum + (sport.duration_minutes || 0), 0)
        stats.caloriesBurned += activityData.sports.reduce((sum: number, sport: any) => 
          sum + (sport.calories_burned || 0), 0)
      }

      // Estimate steps based on activity score
      if (activityData.activity_score) {
        stats.steps = Math.round(activityData.activity_score * 100)
      }
    }

    // Estimate water intake based on activity
    stats.waterIntake = Math.round((stats.caloriesBurned / 1000) * 0.5 * 8) // Rough estimate

    return stats
  }
}

export const dashboardService = {
  // Get today's dashboard data
  async getTodayDashboard(): Promise<any> {
    try {
      console.log('📊 Fetching today\'s dashboard...')
      const response = await api.get('/lifestyle/dashboard/today/')
      console.log('✅ Today\'s dashboard fetched successfully')
      return response.data
    } catch (error: any) {
      console.error('❌ Dashboard fetch error:', error)
      
      if (error.response?.status === 401 || error.response?.status === 403) {
        authService.clearAuthData()
        throw new Error('Authentication required. Please login again.')
      }
      
      throw new Error(
        error.response?.data?.message || 
        error.response?.data?.detail || 
        'Failed to fetch dashboard data'
      )
    }
  },

  // Create eating day
  async createEatingDay(data: CreateEatingDayData) {
    try {
      console.log('🍽️ Creating eating day...', data)
      
      const response = await api.post('/lifestyle/eating-days/', data)
      console.log('✅ Eating day created successfully:', response.data)
      return response.data
    } catch (error: any) {
      console.error('❌ Eating day creation error:', error)
      
      if (error.response?.status === 401 || error.response?.status === 403) {
        authService.clearAuthData()
        throw new Error('Authentication required. Please login again.')
      }
      
      throw new Error(
        error.response?.data?.message || 
        error.response?.data?.detail || 
        'Failed to create eating day'
      )
    }
  },

  // Get profile status
  async checkProfileStatus() {
    try {
      const [profileRes, medicalRes] = await Promise.allSettled([
        api.get('/lifestyle/user-profiles/me'),
        api.get('/lifestyle/medical-profiles/me')
      ])

      const hasProfile = profileRes.status === 'fulfilled'
      const hasMedicalProfile = medicalRes.status === 'fulfilled'
      
      return {
        hasProfile,
        hasMedicalProfile,
        profile: hasProfile ? profileRes.value.data : null,
        medicalProfile: hasMedicalProfile ? medicalRes.value.data : null
      }
    } catch (error) {
      console.error('Profile status check error:', error)
      return {
        hasProfile: false,
        hasMedicalProfile: false,
        profile: null,
        medicalProfile: null
      }
    }
  },

  // Helper for health calculations
  healthScoreCalculator
}