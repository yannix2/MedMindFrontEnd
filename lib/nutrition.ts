import api from './api'
import { authService } from './auth'

export interface MealData {
  id: number
  eating_day: number
  eating_day_id: number
  meal_type: string
  foods: FoodIntakeData[]
  created_at: string
  updated_at: string
}
// Add these interfaces and methods to your existing nutrition service

export interface EatingDayData {
  id: number
  user: string
  user_id: number
  date: string
  number_of_meals: number
  meals: MealData[]
  nutrition_score: number
  created_at: string
  updated_at: string
}

export interface DailyNutritionSummary {
  date: string
  eating_day: EatingDayData | null
  total_meals: number
  total_foods: number
  total_calories: number
  nutrition_score: number
  status: 'excellent' | 'good' | 'fair' | 'poor' | 'incomplete' | 'skipped'
  has_data: boolean
}
export interface FoodIntakeData {
  id?: number
  user?: number
  meal?: number
  date?: string
  name: string
  meal_type: string
  portion: number
  calories: number
  proteins: number
  carbs: number
  fibres: number
  fats: number
  sugars: number
  created_at?: string
  updated_at?: string
}

export interface FoodSuggestion {
  name: string
  icon: string
  color: string
  defaultPortion: number
  defaultCalories: number
  nutrients: {
    proteins: number
    carbs: number
    fibres: number
    fats: number
    sugars: number
  }
}

export const nutritionService = {
  // Get today's meals
  async getTodayMeals(): Promise<MealData[]> {
    try {
      console.log('🍽️ Fetching today\'s meals...')
      
      const response = await api.get('/lifestyle/meals/today/')
      console.log('✅ Today\'s meals fetched successfully')
      return response.data
    } catch (error: any) {
      console.error('❌ Meals fetch error:', {
        url: '/lifestyle/meals/',
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      })
      
      if (error.response?.status === 401 || error.response?.status === 403) {
        authService.clearAuthData()
        throw new Error('Authentication required. Please login again.')
      }
      
      throw new Error(
        error.response?.data?.message || 
        error.response?.data?.detail || 
        'Failed to fetch meals'
      )
    }
  },

  // Add food intake
  async addFoodIntake(data: FoodIntakeData): Promise<FoodIntakeData> {
    try {
      console.log('🥗 Adding food intake...', data)
      
      const response = await api.post('/lifestyle/food-intakes/', data)
      console.log('✅ Food intake added successfully:', response.data)
      return response.data
    } catch (error: any) {
      console.error('❌ Food intake creation error:', error)
      
      if (error.response?.status === 401 || error.response?.status === 403) {
        authService.clearAuthData()
        throw new Error('Authentication required. Please login again.')
      }
      
      throw new Error(
        error.response?.data?.message || 
        error.response?.data?.detail || 
        'Failed to add food intake'
      )
    }
  },

  // Update food intake
  async updateFoodIntake(id: number, data: Partial<FoodIntakeData>): Promise<FoodIntakeData> {
    try {
      console.log('✏️ Updating food intake...', data)
      
      const response = await api.put(`/lifestyle/food-intakes/${id}/`, data)
      console.log('✅ Food intake updated successfully:', response.data)
      return response.data
    } catch (error: any) {
      console.error('❌ Food intake update error:', error)
      
      if (error.response?.status === 401 || error.response?.status === 403) {
        authService.clearAuthData()
        throw new Error('Authentication required. Please login again.')
      }
      
      throw new Error(
        error.response?.data?.message || 
        error.response?.data?.detail || 
        'Failed to update food intake'
      )
    }
  },

  // Delete food intake
  async deleteFoodIntake(id: number): Promise<void> {
    try {
      console.log('🗑️ Deleting food intake...', id)
      
      await api.delete(`/lifestyle/food-intakes/${id}/`)
      console.log('✅ Food intake deleted successfully')
    } catch (error: any) {
      console.error('❌ Food intake deletion error:', error)
      
      if (error.response?.status === 401 || error.response?.status === 403) {
        authService.clearAuthData()
        throw new Error('Authentication required. Please login again.')
      }
      
      throw new Error(
        error.response?.data?.message || 
        error.response?.data?.detail || 
        'Failed to delete food intake'
      )
    }
  },

  // Get food suggestions by meal type
  getFoodSuggestions(mealType: string): FoodSuggestion[] {
    const suggestions: Record<string, FoodSuggestion[]> = {
      breakfast: [
        { name: 'Milk', icon: '🥛', color: 'from-blue-400 to-blue-600', defaultPortion: 250, defaultCalories: 150, nutrients: { proteins: 8, carbs: 12, fibres: 0, fats: 5, sugars: 12 } },
        { name: 'Eggs', icon: '🥚', color: 'from-amber-400 to-amber-600', defaultPortion: 2, defaultCalories: 140, nutrients: { proteins: 12, carbs: 1, fibres: 0, fats: 10, sugars: 1 } },
        { name: 'Bread', icon: '🍞', color: 'from-yellow-400 to-yellow-600', defaultPortion: 100, defaultCalories: 265, nutrients: { proteins: 9, carbs: 49, fibres: 2, fats: 3, sugars: 5 } },
        { name: 'Oatmeal', icon: '🥣', color: 'from-brown-400 to-brown-600', defaultPortion: 150, defaultCalories: 150, nutrients: { proteins: 5, carbs: 27, fibres: 4, fats: 3, sugars: 1 } },
        { name: 'Yogurt', icon: '🥄', color: 'from-white to-gray-300', defaultPortion: 200, defaultCalories: 150, nutrients: { proteins: 10, carbs: 15, fibres: 0, fats: 4, sugars: 12 } },
        { name: 'Banana', icon: '🍌', color: 'from-yellow-400 to-yellow-600', defaultPortion: 1, defaultCalories: 105, nutrients: { proteins: 1, carbs: 27, fibres: 3, fats: 0, sugars: 14 } },
        { name: 'Orange Juice', icon: '🧃', color: 'from-orange-400 to-orange-600', defaultPortion: 250, defaultCalories: 110, nutrients: { proteins: 2, carbs: 26, fibres: 0, fats: 0, sugars: 22 } },
        { name: 'Cereal', icon: '🥣', color: 'from-gray-400 to-gray-600', defaultPortion: 50, defaultCalories: 190, nutrients: { proteins: 4, carbs: 43, fibres: 3, fats: 1, sugars: 17 } },
      ],
      lunch: [
        { name: 'Chicken Breast', icon: '🍗', color: 'from-pink-400 to-pink-600', defaultPortion: 150, defaultCalories: 195, nutrients: { proteins: 40, carbs: 0, fibres: 0, fats: 4, sugars: 0 } },
        { name: 'Rice', icon: '🍚', color: 'from-white to-gray-300', defaultPortion: 200, defaultCalories: 260, nutrients: { proteins: 5, carbs: 53, fibres: 1, fats: 1, sugars: 0 } },
        { name: 'Salad', icon: '🥗', color: 'from-green-400 to-green-600', defaultPortion: 200, defaultCalories: 50, nutrients: { proteins: 3, carbs: 8, fibres: 4, fats: 1, sugars: 4 } },
        { name: 'Pasta', icon: '🍝', color: 'from-yellow-400 to-yellow-600', defaultPortion: 200, defaultCalories: 300, nutrients: { proteins: 11, carbs: 58, fibres: 3, fats: 2, sugars: 2 } },
        { name: 'Fish', icon: '🐟', color: 'from-blue-400 to-blue-600', defaultPortion: 150, defaultCalories: 180, nutrients: { proteins: 30, carbs: 0, fibres: 0, fats: 6, sugars: 0 } },
        { name: 'Vegetables', icon: '🥦', color: 'from-green-400 to-green-600', defaultPortion: 150, defaultCalories: 75, nutrients: { proteins: 4, carbs: 15, fibres: 6, fats: 1, sugars: 5 } },
        { name: 'Soup', icon: '🍲', color: 'from-orange-400 to-orange-600', defaultPortion: 300, defaultCalories: 120, nutrients: { proteins: 6, carbs: 18, fibres: 4, fats: 3, sugars: 5 } },
        { name: 'Bread', icon: '🍞', color: 'from-yellow-400 to-yellow-600', defaultPortion: 100, defaultCalories: 265, nutrients: { proteins: 9, carbs: 49, fibres: 2, fats: 3, sugars: 5 } },
      ],
      dinner: [
        { name: 'Steak', icon: '🥩', color: 'from-red-400 to-red-600', defaultPortion: 200, defaultCalories: 400, nutrients: { proteins: 50, carbs: 0, fibres: 0, fats: 22, sugars: 0 } },
        { name: 'Potatoes', icon: '🥔', color: 'from-yellow-400 to-yellow-600', defaultPortion: 200, defaultCalories: 164, nutrients: { proteins: 4, carbs: 37, fibres: 4, fats: 0, sugars: 2 } },
        { name: 'Vegetables', icon: '🥕', color: 'from-orange-400 to-orange-600', defaultPortion: 150, defaultCalories: 75, nutrients: { proteins: 2, carbs: 15, fibres: 6, fats: 0, sugars: 8 } },
        { name: 'Fish', icon: '🐟', color: 'from-blue-400 to-blue-600', defaultPortion: 150, defaultCalories: 180, nutrients: { proteins: 30, carbs: 0, fibres: 0, fats: 6, sugars: 0 } },
        { name: 'Salad', icon: '🥗', color: 'from-green-400 to-green-600', defaultPortion: 200, defaultCalories: 50, nutrients: { proteins: 3, carbs: 8, fibres: 4, fats: 1, sugars: 4 } },
        { name: 'Rice', icon: '🍚', color: 'from-white to-gray-300', defaultPortion: 150, defaultCalories: 195, nutrients: { proteins: 4, carbs: 40, fibres: 1, fats: 1, sugars: 0 } },
        { name: 'Beans', icon: '🫘', color: 'from-brown-400 to-brown-600', defaultPortion: 200, defaultCalories: 230, nutrients: { proteins: 15, carbs: 40, fibres: 13, fats: 1, sugars: 2 } },
        { name: 'Yogurt', icon: '🥄', color: 'from-white to-gray-300', defaultPortion: 150, defaultCalories: 112, nutrients: { proteins: 8, carbs: 11, fibres: 0, fats: 3, sugars: 9 } },
      ],
      snack: [
        { name: 'Apple', icon: '🍎', color: 'from-red-400 to-red-600', defaultPortion: 1, defaultCalories: 95, nutrients: { proteins: 0, carbs: 25, fibres: 4, fats: 0, sugars: 19 } },
        { name: 'Nuts', icon: '🥜', color: 'from-brown-400 to-brown-600', defaultPortion: 50, defaultCalories: 300, nutrients: { proteins: 7, carbs: 10, fibres: 3, fats: 26, sugars: 2 } },
        { name: 'Protein Bar', icon: '🍫', color: 'from-brown-400 to-brown-600', defaultPortion: 1, defaultCalories: 200, nutrients: { proteins: 20, carbs: 25, fibres: 2, fats: 8, sugars: 15 } },
        { name: 'Cheese', icon: '🧀', color: 'from-yellow-400 to-yellow-600', defaultPortion: 50, defaultCalories: 200, nutrients: { proteins: 12, carbs: 2, fibres: 0, fats: 16, sugars: 0 } },
        { name: 'Crackers', icon: '🍘', color: 'from-yellow-400 to-yellow-600', defaultPortion: 30, defaultCalories: 130, nutrients: { proteins: 2, carbs: 20, fibres: 1, fats: 5, sugars: 2 } },
        { name: 'Yogurt', icon: '🥄', color: 'from-white to-gray-300', defaultPortion: 150, defaultCalories: 112, nutrients: { proteins: 8, carbs: 11, fibres: 0, fats: 3, sugars: 9 } },
        { name: 'Smoothie', icon: '🥤', color: 'from-purple-400 to-purple-600', defaultPortion: 300, defaultCalories: 180, nutrients: { proteins: 5, carbs: 35, fibres: 4, fats: 3, sugars: 25 } },
        { name: 'Popcorn', icon: '🍿', color: 'from-yellow-400 to-yellow-600', defaultPortion: 30, defaultCalories: 120, nutrients: { proteins: 3, carbs: 22, fibres: 4, fats: 4, sugars: 0 } },
      ]
    }

    return suggestions[mealType] || []
  },

  // Get meal type display name
  getMealDisplayName(mealType: string): string {
    const names: Record<string, string> = {
      breakfast: 'Breakfast',
      lunch: 'Lunch',
      dinner: 'Dinner',
      snack: 'Snack'
    }
    return names[mealType] || mealType
  },

  // Get meal icon
  getMealIcon(mealType: string): string {
    const icons: Record<string, string> = {
      breakfast: '☕',
      lunch: '🍽️',
      dinner: '🍲',
      snack: '🍎'
    }
    return icons[mealType] || '🥗'
  },

  // Get meal color
  getMealColor(mealType: string): string {
    const colors: Record<string, string> = {
      breakfast: 'from-amber-500 to-orange-500',
      lunch: 'from-green-500 to-emerald-500',
      dinner: 'from-purple-500 to-pink-500',
      snack: 'from-blue-500 to-cyan-500'
    }
    return colors[mealType] || 'from-gray-500 to-gray-600'
  },

  // Calculate total nutrients for a meal
  calculateMealTotals(foods: FoodIntakeData[]) {
    return foods.reduce((totals, food) => ({
      calories: totals.calories + (food.calories || 0),
      proteins: totals.proteins + (food.proteins || 0),
      carbs: totals.carbs + (food.carbs || 0),
      fibres: totals.fibres + (food.fibres || 0),
      fats: totals.fats + (food.fats || 0),
      sugars: totals.sugars + (food.sugars || 0)
    }), { calories: 0, proteins: 0, carbs: 0, fibres: 0, fats: 0, sugars: 0 })
  },

// Update the getAllEatingDays method to get the earliest date
async getAllEatingDays(): Promise<EatingDayData[]> {
  try {
    console.log('📅 Fetching all eating days...')
    const response = await api.get('/lifestyle/eating-days/')
    console.log('✅ Eating days fetched successfully')
    return response.data
  } catch (error: any) {
    console.error('❌ Eating days fetch error:', error)
    
    if (error.response?.status === 401 || error.response?.status === 403) {
      authService.clearAuthData()
      throw new Error('Authentication required. Please login again.')
    }
    
    throw new Error(
      error.response?.data?.message || 
      error.response?.data?.detail || 
      'Failed to fetch eating days'
    )
  }
},

// Add method to get earliest eating day date
getEarliestEatingDayDate(eatingDays: EatingDayData[]): string {
  if (eatingDays.length === 0) {
    return new Date().toISOString().split('T')[0] // Today as fallback
  }
  
  // Sort by date ascending and get the earliest
  const sortedDates = eatingDays
    .map(day => day.date)
    .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
  
  return sortedDates[0]
},

// Update generateDateRange to handle missing start date
// Fixed generateDateRange function
generateDateRange(startDate: string, endDate?: string): string[] {
  // Ensure startDate is in YYYY-MM-DD format
  const [year, month, day] = startDate.split('-').map(Number)
  const start = new Date(year, month - 1, day, 0, 0, 0, 0)
  
  let end: Date
  if (endDate) {
    const [endYear, endMonth, endDay] = endDate.split('-').map(Number)
    end = new Date(endYear, endMonth - 1, endDay, 23, 59, 59, 999)
  } else {
    const now = new Date()
    end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999)
  }
  
  const dates: string[] = []
  const current = new Date(start)
  
  while (current <= end) {
    const dateStr = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}-${String(current.getDate()).padStart(2, '0')}`
    dates.push(dateStr)
    current.setDate(current.getDate() + 1)
  }
  
  // Return most recent first
  return dates.reverse()
},
  // Get user profile
  async getUserProfile(): Promise<any> {
    try {
      console.log('👤 Fetching user profile...')
      const response = await api.get('/accounts/me')
      console.log('✅ User profile fetched successfully')
      return response.data
    } catch (error: any) {
      console.error('❌ User profile fetch error:', error)
      
      if (error.response?.status === 401 || error.response?.status === 403) {
        authService.clearAuthData()
        throw new Error('Authentication required. Please login again.')
      }
      
      throw new Error(
        error.response?.data?.message || 
        error.response?.data?.detail || 
        'Failed to fetch user profile'
      )
    }
  },
  // Get nutrition status based on score
  getNutritionStatus(score: number, hasData: boolean): 'excellent' | 'good' | 'fair' | 'poor' | 'incomplete' | 'skipped' {
    if (!hasData) return 'skipped'
    if (score === 0) return 'incomplete'
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
      poor: 'from-orange-500 to-red-500',
      incomplete: 'from-gray-500 to-gray-600',
      skipped: 'from-gray-300 to-gray-400'
    }
    return colors[status] || 'from-gray-500 to-gray-600'
  },

  // Get status text
  getStatusText(status: string): string {
    const texts: Record<string, string> = {
      excellent: 'Excellent',
      good: 'Good',
      fair: 'Fair',
      poor: 'Need Improvement',
      incomplete: 'Incomplete Data',
      skipped: 'No Data'
    }
    return texts[status] || status
  },

  // Get status icon
  getStatusIcon(status: string): string {
    const icons: Record<string, string> = {
      excellent: '',
      good: '',
      fair: '',
      poor: '',
      incomplete: '',
      skipped: '⏸️'
    }
    return icons[status] || ''
  },

  // Calculate totals for a day
  calculateDayTotals(meals: MealData[]) {
    return meals.reduce((totals, meal) => {
      const mealTotals = meal.foods.reduce((foodTotals, food) => ({
        calories: foodTotals.calories + (food.calories || 0),
        proteins: foodTotals.proteins + (food.proteins || 0),
        carbs: foodTotals.carbs + (food.carbs || 0),
        fibres: foodTotals.fibres + (food.fibres || 0),
        fats: foodTotals.fats + (food.fats || 0),
        sugars: foodTotals.sugars + (food.sugars || 0)
      }), { calories: 0, proteins: 0, carbs: 0, fibres: 0, fats: 0, sugars: 0 })
      
      return {
        calories: totals.calories + mealTotals.calories,
        proteins: totals.proteins + mealTotals.proteins,
        carbs: totals.carbs + mealTotals.carbs,
        fibres: totals.fibres + mealTotals.fibres,
        fats: totals.fats + mealTotals.fats,
        sugars: totals.sugars + mealTotals.sugars
      }
    }, { calories: 0, proteins: 0, carbs: 0, fibres: 0, fats: 0, sugars: 0 })
  },

// Get eating day by ID
async getEatingDayById(id: number): Promise<EatingDayData> {
  try {
    console.log(`📅 Fetching eating day ${id}...`)
    const response = await api.get(`/lifestyle/eating-days/${id}/`)
    console.log('✅ Eating day fetched successfully')
    return response.data
  } catch (error: any) {
    console.error('❌ Eating day fetch error:', error)
    
    if (error.response?.status === 401 || error.response?.status === 403) {
      authService.clearAuthData()
      throw new Error('Authentication required. Please login again.')
    }
    
    if (error.response?.status === 404) {
      throw new Error('Eating day not found')
    }
    
    throw new Error(
      error.response?.data?.message || 
      error.response?.data?.detail || 
      'Failed to fetch eating day details'
    )
  }
},


// Add these methods to your existing nutrition service

// Update eating day (PATCH)
async updateEatingDay(id: number, data: Partial<EatingDayData>): Promise<EatingDayData> {
  try {
    console.log(`📝 Updating eating day ${id}...`, data)
    const response = await api.patch(`/lifestyle/eating-days/${id}/`, data)
    console.log('✅ Eating day updated successfully')
    return response.data
  } catch (error: any) {
    console.error('❌ Eating day update error:', error)
    
    if (error.response?.status === 401 || error.response?.status === 403) {
      authService.clearAuthData()
      throw new Error('Authentication required. Please login again.')
    }
    
    throw new Error(
      error.response?.data?.message || 
      error.response?.data?.detail || 
      'Failed to update eating day'
    )
  }
},

// Create new meal (POST)
async createMeal(data: { meal_type: string; eating_day: number }): Promise<MealData> {
  try {
    console.log('🍽️ Creating new meal...', data)
    const response = await api.post('/lifestyle/meals/', data)
    console.log('✅ Meal created successfully:', response.data)
    return response.data
  } catch (error: any) {
    console.error('❌ Meal creation error:', error)
    
    if (error.response?.status === 401 || error.response?.status === 403) {
      authService.clearAuthData()
      throw new Error('Authentication required. Please login again.')
    }
    
    throw new Error(
      error.response?.data?.message || 
      error.response?.data?.detail || 
      'Failed to create meal'
    )
  }
},

// Get available meal types (ones not already used today)
getAvailableMealTypes(existingMeals: MealData[]): { type: string; label: string; icon: string; color: string }[] {
  const allMealTypes = [
    { type: 'breakfast', label: 'Breakfast', icon: '☕', color: 'from-amber-500 to-orange-500' },
    { type: 'lunch', label: 'Lunch', icon: '🍽️', color: 'from-green-500 to-emerald-500' },
    { type: 'dinner', label: 'Dinner', icon: '🍲', color: 'from-purple-500 to-pink-500' },
    { type: 'snack', label: 'Snack', icon: '🍎', color: 'from-blue-500 to-cyan-500' }
  ]
  
  const existingTypes = existingMeals.map(meal => meal.meal_type)
  
  return allMealTypes.filter(mealType => !existingTypes.includes(mealType.type))
},
}

