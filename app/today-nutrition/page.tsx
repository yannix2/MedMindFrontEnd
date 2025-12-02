'use client'
import Cookies from 'js-cookie'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  Plus,
  X,
  Check,
  Edit2,
  Trash2,
  Save,
  Loader2,
  ChevronRight,
  ChevronLeft,
  Utensils,
  Coffee,
  Pizza,
  Salad,
  Soup,
  BarChart3,
  Target,
  Heart,
  Shield,
  Sparkles,
  TrendingUp,
  Droplets,
  Flame,
  PlusCircle,
  ChefHat,
  MoreVertical,
  Clock,
  Calendar,
  Settings,
  RefreshCw,
  AlertCircle,
  CheckCircle
} from 'lucide-react'
import { authService } from '@/lib/auth'
import { nutritionService, MealData, FoodIntakeData, FoodSuggestion } from '@/lib/nutrition'
import { dashboardService } from '@/lib/dashboard'

export default function TodayNutritionPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [meals, setMeals] = useState<MealData[]>([])
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [activeMeal, setActiveMeal] = useState<string | null>(null)
  const [selectedFood, setSelectedFood] = useState<FoodIntakeData | null>(null)
  const [customFood, setCustomFood] = useState<Partial<FoodIntakeData>>({
    name: '',
    meal_type: '',
    portion: 100,
    calories: 0,
    proteins: 0,
    carbs: 0,
    fibres: 0,
    fats: 0,
    sugars: 0
  })
  const [addingFood, setAddingFood] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  
  // New states for adding meals
  const [addingMeal, setAddingMeal] = useState(false)
  const [selectedMealType, setSelectedMealType] = useState<string>('')
  const [availableMealTypes, setAvailableMealTypes] = useState<{ type: string; label: string; icon: string; color: string }[]>([])
  const [addingMealLoading, setAddingMealLoading] = useState(false)

  const gradientOrbs = [
    { x: 10, y: 10, color: 'from-green-500/20 to-emerald-500/20', size: 160, duration: 25 },
    { x: 85, y: 70, color: 'from-amber-500/15 to-orange-500/15', size: 120, duration: 30, delay: 2 },
    { x: 20, y: 85, color: 'from-blue-500/15 to-cyan-500/15', size: 140, duration: 20, delay: 1 },
  ]

  useEffect(() => {
    checkAuthAndLoadData()
  }, [])

  useEffect(() => {
    if (meals.length > 0 && !activeMeal) {
      setActiveMeal(meals[0].meal_type)
    }
    
    // Update available meal types when meals change
    if (meals.length > 0) {
      const available = nutritionService.getAvailableMealTypes(meals)
      setAvailableMealTypes(available)
    }
  }, [meals])

  const checkAuthAndLoadData = async () => {
    try {
      setLoading(true)
      
      const isAuth = authService.isAuthenticated()
      if (!isAuth) {
        router.push('/signin')
        return
      }

      const currentUser = authService.getUserFromStorage()
      if (!currentUser) {
        router.push('/signin')
        return
      }

      // Load dashboard data to get today's info
      const dashboard = await dashboardService.getTodayDashboard()
      setDashboardData(dashboard)

      if (!dashboard.eating_day) {
        router.push('/dashboard')
        return
      }

      // Load today's meals
      const todayMeals = await nutritionService.getTodayMeals()
      setMeals(todayMeals)
      
      // Calculate available meal types
      const available = nutritionService.getAvailableMealTypes(todayMeals)
      setAvailableMealTypes(available)
      
    } catch (error) {
      console.error('Error loading nutrition data:', error)
      router.push('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  // Function to handle adding a new meal
  const handleAddMeal = async (mealType: string) => {
    if (!dashboardData?.eating_day) {
      setError('No eating day found. Please refresh the page.')
      return
    }

    setAddingMealLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const eatingDayId = dashboardData.eating_day.id
      const currentNumberOfMeals = dashboardData.eating_day.number_of_meals || meals.length
      
      // Step 1: Update eating day with new number of meals
      const updatedEatingDay = await nutritionService.updateEatingDay(eatingDayId, {
        number_of_meals: currentNumberOfMeals + 1
      })
      
      // Step 2: Create the new meal
      const newMeal = await nutritionService.createMeal({
        meal_type: mealType,
        eating_day: eatingDayId
      })
      
      // Step 3: Update local state
      setMeals(prev => [...prev, newMeal])
      setActiveMeal(mealType)
      
      // Update dashboard data
      setDashboardData(prev => ({
        ...prev,
        eating_day: updatedEatingDay
      }))
      
      // Update available meal types
      const updatedAvailable = nutritionService.getAvailableMealTypes([...meals, newMeal])
      setAvailableMealTypes(updatedAvailable)
      
      setSuccess(`${nutritionService.getMealDisplayName(mealType)} added successfully!`)
      setAddingMeal(false)
      setSelectedMealType('')
      
      // Auto-hide success message
      setTimeout(() => setSuccess(null), 3000)
      
    } catch (err: any) {
      setError(err.message || 'Failed to add new meal')
      console.error('Failed to add meal:', err)
    } finally {
      setAddingMealLoading(false)
    }
  }

  // Function to handle meal type selection
  const handleMealTypeSelect = (mealType: string) => {
    setSelectedMealType(mealType)
    handleAddMeal(mealType)
  }

  const handleSelectFood = (suggestion: FoodSuggestion, mealType: string) => {
    setSelectedFood({
      name: suggestion.name,
      meal_type: mealType,
      portion: suggestion.defaultPortion,
      calories: suggestion.defaultCalories,
      proteins: suggestion.nutrients.proteins,
      carbs: suggestion.nutrients.carbs,
      fibres: suggestion.nutrients.fibres,
      fats: suggestion.nutrients.fats,
      sugars: suggestion.nutrients.sugars
    })
    setCustomFood({
      name: suggestion.name,
      meal_type: mealType,
      portion: suggestion.defaultPortion,
      calories: suggestion.defaultCalories,
      proteins: suggestion.nutrients.proteins,
      carbs: suggestion.nutrients.carbs,
      fibres: suggestion.nutrients.fibres,
      fats: suggestion.nutrients.fats,
      sugars: suggestion.nutrients.sugars
    })
    setAddingFood(true)
  }

  const handleCustomFoodChange = (field: keyof FoodIntakeData, value: any) => {
    setCustomFood(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Auto-calculate calories based on portion if it's a suggested food
    if (field === 'portion' && selectedFood) {
      const portionRatio = value / selectedFood.portion
      setCustomFood(prev => ({
        ...prev,
        calories: Math.round(selectedFood.calories * portionRatio),
        proteins: Math.round(selectedFood.proteins * portionRatio),
        carbs: Math.round(selectedFood.carbs * portionRatio),
        fibres: Math.round(selectedFood.fibres * portionRatio),
        fats: Math.round(selectedFood.fats * portionRatio),
        sugars: Math.round(selectedFood.sugars * portionRatio)
      }))
    }
  }

  const handleAddFood = async () => {
    if (!customFood.name || !customFood.meal_type) {
      setError('Please enter a food name and select a meal type')
      return
    }

    setSaving(true)
    setError(null)
    setSuccess(null)

    try {
      const newFood = await nutritionService.addFoodIntake(customFood as FoodIntakeData)
      
      // Update meals state
      setMeals(prev => prev.map(meal => {
        if (meal.meal_type === customFood.meal_type) {
          return {
            ...meal,
            foods: [...meal.foods, newFood]
          }
        }
        return meal
      }))

      setSuccess(`${customFood.name} added successfully!`)
      setAddingFood(false)
      setSelectedFood(null)
      setCustomFood({
        name: '',
        meal_type: '',
        portion: 100,
        calories: 0,
        proteins: 0,
        carbs: 0,
        fibres: 0,
        fats: 0,
        sugars: 0
      })
      
      // Auto-hide success message after 2 seconds
      setTimeout(() => setSuccess(null), 2000)
      
    } catch (err: any) {
      setError(err.message || 'Failed to add food')
      console.error('Failed to add food:', err)
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteFood = async (foodId: number, mealType: string) => {
    if (!confirm('Are you sure you want to delete this food?')) return

    try {
      await nutritionService.deleteFoodIntake(foodId)
      
      // Update meals state
      setMeals(prev => prev.map(meal => {
        if (meal.meal_type === mealType) {
          return {
            ...meal,
            foods: meal.foods.filter(food => food.id !== foodId)
          }
        }
        return meal
      }))
      
      setSuccess('Food deleted successfully!')
      setTimeout(() => setSuccess(null), 2000)
      
    } catch (err: any) {
      setError(err.message || 'Failed to delete food')
      console.error('Failed to delete food:', err)
    }
  }

  const calculateMealTotals = (mealType: string) => {
    const meal = meals.find(m => m.meal_type === mealType)
    if (!meal) return { calories: 0, proteins: 0, carbs: 0, fibres: 0, fats: 0, sugars: 0 }
    
    return meal.foods.reduce((totals, food) => ({
      calories: totals.calories + (food.calories || 0),
      proteins: totals.proteins + (food.proteins || 0),
      carbs: totals.carbs + (food.carbs || 0),
      fibres: totals.fibres + (food.fibres || 0),
      fats: totals.fats + (food.fats || 0),
      sugars: totals.sugars + (food.sugars || 0)
    }), { calories: 0, proteins: 0, carbs: 0, fibres: 0, fats: 0, sugars: 0 })
  }

  const calculateDayTotals = () => {
    return meals.reduce((totals, meal) => {
      const mealTotals = calculateMealTotals(meal.meal_type)
      return {
        calories: totals.calories + mealTotals.calories,
        proteins: totals.proteins + mealTotals.proteins,
        carbs: totals.carbs + mealTotals.carbs,
        fibres: totals.fibres + mealTotals.fibres,
        fats: totals.fats + mealTotals.fats,
        sugars: totals.sugars + mealTotals.sugars
      }
    }, { calories: 0, proteins: 0, carbs: 0, fibres: 0, fats: 0, sugars: 0 })
  }

  const getDailyTargets = () => {
    if (!dashboardData?.profile) return { calories: 2000, proteins: 50, carbs: 250, fibres: 25, fats: 65, sugars: 50 }
    
    // Calculate BMR using Mifflin-St Jeor Equation
    const weight = dashboardData.profile.weight
    const height = dashboardData.profile.height
    const age = dashboardData.profile.age
    const isMale = dashboardData.profile.sex === 'M'
    
    const bmr = isMale 
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : 10 * weight + 6.25 * height - 5 * age - 161
    
    // Assuming moderate activity level
    const targetCalories = Math.round(bmr * 1.55)
    
    return {
      calories: targetCalories,
      proteins: Math.round(targetCalories * 0.15 / 4), // 15% of calories from protein
      carbs: Math.round(targetCalories * 0.5 / 4),     // 50% of calories from carbs
      fibres: 25,
      fats: Math.round(targetCalories * 0.3 / 9),      // 30% of calories from fat
      sugars: 50
    }
  }

  const getCompletionPercentage = () => {
    const dayTotals = calculateDayTotals()
    const targets = getDailyTargets()
    
    // Simple completion calculation (weighted average)
    const weights = { calories: 0.4, proteins: 0.15, carbs: 0.15, fibres: 0.1, fats: 0.15, sugars: 0.05 }
    
    let totalScore = 0
    let totalWeight = 0
    
    Object.entries(weights).forEach(([nutrient, weight]) => {
      const current = dayTotals[nutrient as keyof typeof dayTotals]
      const target = targets[nutrient as keyof typeof targets]
      
      if (target > 0) {
        const score = Math.min(current / target, 1) * 100
        totalScore += score * weight
        totalWeight += weight
      }
    })
    
    return Math.round(totalScore / totalWeight)
  }

  const handleFinish = () => {
    router.push('/dashboard')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-950">
        <div className="container mx-auto px-4 py-24">
          <div className="flex flex-col items-center justify-center min-h-[70vh] gap-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              <div className="h-20 w-20 border-4 border-gray-200 dark:border-gray-800 rounded-full">
                <div className="absolute inset-0 border-4 border-transparent border-t-green-500 border-r-emerald-500 rounded-full animate-spin" />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-3"
            >
              <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                Loading Today's Nutrition
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md">
                Preparing your meal tracker and food suggestions...
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-950 overflow-hidden relative">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 overflow-hidden">
        {gradientOrbs.map((orb, index) => (
          <motion.div
            key={index}
            className={`absolute rounded-full bg-gradient-to-br ${orb.color} blur-3xl`}
            style={{
              left: `${orb.x}%`,
              top: `${orb.y}%`,
              width: `${orb.size}px`,
              height: `${orb.size}px`,
            }}
            animate={{
              x: [0, Math.sin(index) * 50, 0],
              y: [0, Math.cos(index) * 50, 0],
              scale: [1, 1.15, 1],
            }}
            transition={{
              duration: orb.duration,
              repeat: Infinity,
              delay: orb.delay || 0,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000002_1px,transparent_1px),linear-gradient(to_bottom,#00000002_1px,transparent_1px)] bg-[size:40px_40px] opacity-30" />

      <div className="container relative mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <button
                onClick={() => router.push('/dashboard')}
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-4"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </button>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full blur" />
                  <div className="relative p-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full">
                    <Utensils className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                    Today's Nutrition
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 text-lg">
                    Track what you've eaten today - {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full text-sm">
                <Sparkles className="h-3 w-3" />
                <span>AI-Powered Suggestions</span>
              </div>
              
              {/* Add Meal Button */}
              {availableMealTypes.length > 0 && (
                <button
                  onClick={() => setAddingMeal(true)}
                  disabled={addingMealLoading}
                  className="group relative px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl hover:shadow-lg transition-all hover:scale-[1.02] flex items-center gap-2"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>Add Meal</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl blur opacity-0 group-hover:opacity-50 transition-opacity -z-10" />
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Success/Error Messages */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              className="mb-6 flex items-start gap-3 p-4 bg-gradient-to-r from-red-50 to-red-50/50 dark:from-red-900/20 dark:to-red-900/10 rounded-xl border border-red-200 dark:border-red-800/50"
            >
              <X className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-medium text-red-700 dark:text-red-300">Error</p>
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              className="mb-6 flex items-start gap-3 p-4 bg-gradient-to-r from-emerald-50 to-emerald-50/50 dark:from-emerald-900/20 dark:to-emerald-900/10 rounded-xl border border-emerald-200 dark:border-emerald-800/50"
            >
              <Check className="h-5 w-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-medium text-emerald-700 dark:text-emerald-300">Success!</p>
                <p className="text-sm text-emerald-600 dark:text-emerald-400">{success}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add Meal Modal */}
        <AnimatePresence>
          {addingMeal && (
            <>
              {/* Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => !addingMealLoading && setAddingMeal(false)}
                className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-40"
              />
              
              {/* Modal */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
              >
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden border border-gray-200 dark:border-gray-800">
                  {/* Modal Header */}
                  <div className="p-6 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg">
                          <ChefHat className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                            Add New Meal
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">
                            Choose a meal type to add to today's nutrition
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setAddingMeal(false)}
                        disabled={addingMealLoading}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50"
                      >
                        <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                      </button>
                    </div>
                  </div>

                  {/* Modal Content */}
                  <div className="p-6">
                    {addingMealLoading ? (
                      <div className="py-12 flex flex-col items-center justify-center">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                          className="mb-4"
                        >
                          <div className="h-12 w-12 border-3 border-gray-300 dark:border-gray-700 border-t-purple-500 rounded-full" />
                        </motion.div>
                        <p className="text-gray-600 dark:text-gray-400">Creating meal...</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="text-center mb-6">
                          <p className="text-gray-600 dark:text-gray-400">
                            {meals.length} meal{meals.length !== 1 ? 's' : ''} already tracked today
                          </p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          {availableMealTypes.map((mealType) => (
                            <button
                              key={mealType.type}
                              onClick={() => handleMealTypeSelect(mealType.type)}
                              disabled={addingMealLoading}
                              className={`group relative p-4 rounded-xl border-2 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${
                                selectedMealType === mealType.type
                                  ? `border-purple-500 bg-gradient-to-br ${mealType.color} bg-opacity-10`
                                  : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700'
                              }`}
                            >
                              <div className="flex flex-col items-center gap-3">
                                <div className={`h-12 w-12 rounded-full flex items-center justify-center text-2xl bg-gradient-to-br ${mealType.color}`}>
                                  {mealType.icon}
                                </div>
                                <div className="text-center">
                                  <div className="font-semibold text-gray-900 dark:text-white">{mealType.label}</div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400">
                                    Add to today's meals
                                  </div>
                                </div>
                              </div>
                              <div className={`absolute inset-0 bg-gradient-to-br ${mealType.color} rounded-xl blur opacity-0 group-hover:opacity-10 transition-opacity -z-10`} />
                            </button>
                          ))}
                        </div>

                        {availableMealTypes.length === 0 && (
                          <div className="text-center py-8">
                            <div className="mb-4">
                              <div className="h-16 w-16 mx-auto rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                                <Check className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                              </div>
                            </div>
                            <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                              All Meals Added
                            </h4>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                              You've already added all available meal types for today.
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Modal Footer */}
                  <div className="p-6 border-t border-gray-200 dark:border-gray-800 bg-gradient-to-r from-white/80 to-white/50 dark:from-gray-900/80 dark:to-gray-900/50">
                    <button
                      onClick={() => setAddingMeal(false)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Progress & Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Daily Nutrition Progress</h2>
                <p className="text-gray-600 dark:text-gray-400">Track your food intake against daily targets</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  {getCompletionPercentage()}%
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Daily Completion</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Overall Progress</div>
                <div className="text-sm font-semibold text-green-600 dark:text-green-400">
                  {getCompletionPercentage()}%
                </div>
              </div>
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${getCompletionPercentage()}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                />
              </div>
            </div>

            {/* Nutrition Breakdown */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-6">
              {[
                { key: 'calories', label: 'Calories', icon: Flame, color: 'from-orange-500 to-red-500', unit: 'kcal' },
                { key: 'proteins', label: 'Protein', icon: Target, color: 'from-blue-500 to-cyan-500', unit: 'g' },
                { key: 'carbs', label: 'Carbs', icon: BarChart3, color: 'from-green-500 to-emerald-500', unit: 'g' },
                { key: 'fats', label: 'Fats', icon: Droplets, color: 'from-yellow-500 to-amber-500', unit: 'g' },
                { key: 'fibres', label: 'Fibre', icon: Shield, color: 'from-purple-500 to-pink-500', unit: 'g' },
                { key: 'sugars', label: 'Sugars', icon: TrendingUp, color: 'from-red-500 to-pink-500', unit: 'g' }
              ].map((nutrient) => {
                const current = calculateDayTotals()[nutrient.key as keyof ReturnType<typeof calculateDayTotals>]
                const target = getDailyTargets()[nutrient.key as keyof ReturnType<typeof getDailyTargets>]
                const percentage = target > 0 ? Math.min(Math.round((current / target) * 100), 100) : 0
                
                return (
                  <div key={nutrient.key} className="bg-gray-50/50 dark:bg-gray-800/50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <nutrient.icon className={`h-5 w-5 bg-gradient-to-br ${nutrient.color} bg-clip-text text-transparent`} />
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{percentage}%</span>
                    </div>
                    <div className="space-y-1">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {current}
                        <span className="text-sm font-normal text-gray-500 dark:text-gray-400">/{target}</span>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{nutrient.label}</div>
                    </div>
                    <div className="mt-2 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${nutrient.color} rounded-full`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Meal Selection & Food Suggestions */}
          <div className="lg:col-span-2">
            {/* Meal Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8"
            >
              <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-lg overflow-hidden">
                <div className="border-b border-gray-200 dark:border-gray-800">
                  <div className="flex overflow-x-auto scrollbar-hide">
                    {meals.map((meal, index) => {
                      const mealIcon = nutritionService.getMealIcon(meal.meal_type)
                      const mealColor = nutritionService.getMealColor(meal.meal_type)
                      const isActive = activeMeal === meal.meal_type
                      
                      return (
                        <button
                          key={meal.id}
                          onClick={() => setActiveMeal(meal.meal_type)}
                          className={`flex items-center gap-3 px-6 py-4 whitespace-nowrap transition-all ${
                            isActive 
                              ? `bg-gradient-to-r ${mealColor} text-white` 
                              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800'
                          }`}
                        >
                          <span className="text-xl">{mealIcon}</span>
                          <div className="text-left">
                            <div className="font-semibold">{nutritionService.getMealDisplayName(meal.meal_type)}</div>
                            <div className="text-sm opacity-80">
                              {meal.foods.length} food{meal.foods.length !== 1 ? 's' : ''}
                            </div>
                          </div>
                          {isActive && (
                            <motion.div
                              layoutId="activeMealIndicator"
                              className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/50"
                            />
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Active Meal Content */}
                {activeMeal && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="p-6"
                  >
                    {/* Meal Totals */}
                    <div className="mb-6 p-4 bg-gray-50/50 dark:bg-gray-800/50 rounded-xl">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {nutritionService.getMealDisplayName(activeMeal)} Totals
                        </h3>
                        <span className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm rounded-full">
                          {calculateMealTotals(activeMeal).calories} kcal
                        </span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        <div className="text-center p-3 bg-white/50 dark:bg-gray-800/30 rounded-lg">
                          <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                            {calculateMealTotals(activeMeal).proteins}g
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Protein</div>
                        </div>
                        <div className="text-center p-3 bg-white/50 dark:bg-gray-800/30 rounded-lg">
                          <div className="text-xl font-bold text-green-600 dark:text-green-400">
                            {calculateMealTotals(activeMeal).carbs}g
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Carbs</div>
                        </div>
                        <div className="text-center p-3 bg-white/50 dark:bg-gray-800/30 rounded-lg">
                          <div className="text-xl font-bold text-yellow-600 dark:text-yellow-400">
                            {calculateMealTotals(activeMeal).fats}g
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Fats</div>
                        </div>
                      </div>
                    </div>

                    {/* Food Suggestions */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-900 dark:text-white">Quick Add</h3>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Tap to add with default portions
                        </span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {nutritionService.getFoodSuggestions(activeMeal).map((suggestion, index) => (
                          <motion.button
                            key={suggestion.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            onClick={() => handleSelectFood(suggestion, activeMeal)}
                            className="group relative overflow-hidden rounded-xl bg-white/50 dark:bg-gray-800/30 p-4 hover:bg-white dark:hover:bg-gray-800/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg border border-gray-200 dark:border-gray-700"
                          >
                            <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                            <div className="flex flex-col items-center gap-3">
                              <div className={`h-12 w-12 rounded-full flex items-center justify-center text-2xl bg-gradient-to-br ${suggestion.color}`}>
                                {suggestion.icon}
                              </div>
                              <div className="text-center">
                                <div className="font-medium text-gray-900 dark:text-white">{suggestion.name}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  {suggestion.defaultCalories} kcal
                                </div>
                              </div>
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Current Meal Foods */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          Foods in This Meal ({meals.find(m => m.meal_type === activeMeal)?.foods.length || 0})
                        </h3>
                        <button
                          onClick={() => {
                            setSelectedFood(null)
                            setCustomFood({
                              name: '',
                              meal_type: activeMeal,
                              portion: 100,
                              calories: 0,
                              proteins: 0,
                              carbs: 0,
                              fibres: 0,
                              fats: 0,
                              sugars: 0
                            })
                            setAddingFood(true)
                          }}
                          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:shadow-lg transition-all"
                        >
                          <Plus className="h-4 w-4" />
                          Add Custom Food
                        </button>
                      </div>

                      {meals.find(m => m.meal_type === activeMeal)?.foods.length === 0 ? (
                        <div className="text-center py-12 bg-gray-50/50 dark:bg-gray-800/30 rounded-xl">
                          <div className="mb-4">
                            <div className="h-16 w-16 mx-auto rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                              <Salad className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                            </div>
                          </div>
                          <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                            No foods added yet
                          </h4>
                          <p className="text-gray-500 dark:text-gray-400 text-sm max-w-md mx-auto">
                            Tap on a quick add suggestion above or add a custom food to get started.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {meals.find(m => m.meal_type === activeMeal)?.foods.map((food) => (
                            <motion.div
                              key={food.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="group bg-white/50 dark:bg-gray-800/30 rounded-xl p-4 hover:bg-white dark:hover:bg-gray-800/50 transition-all border border-gray-200 dark:border-gray-700"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 flex items-center justify-center">
                                    <Utensils className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                  </div>
                                  <div>
                                    <div className="font-medium text-gray-900 dark:text-white">{food.name}</div>
                                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                                      <span>{food.portion}g</span>
                                      <span>•</span>
                                      <span>{food.calories} kcal</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="hidden group-hover:flex items-center gap-1">
                                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs rounded">
                                      {food.proteins}g protein
                                    </span>
                                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs rounded">
                                      {food.carbs}g carbs
                                    </span>
                                    <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 text-xs rounded">
                                      {food.fats}g fats
                                    </span>
                                  </div>
                                  <button
                                    onClick={() => handleDeleteFood(food.id!, activeMeal)}
                                    className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Add Food Form & Daily Summary */}
          <div>
            {/* Add Food Form */}
            {addingFood && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="sticky top-8 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-2xl shadow-xl p-6 mb-8 border border-gray-200 dark:border-gray-800"
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {selectedFood ? `Add ${selectedFood.name}` : 'Add Custom Food'}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      For {nutritionService.getMealDisplayName(customFood.meal_type || activeMeal || '')}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setAddingFood(false)
                      setSelectedFood(null)
                      setCustomFood({
                        name: '',
                        meal_type: '',
                        portion: 100,
                        calories: 0,
                        proteins: 0,
                        carbs: 0,
                        fibres: 0,
                        fats: 0,
                        sugars: 0
                      })
                    }}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  </button>
                </div>

                <div className="space-y-4">
                  {!selectedFood && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Food Name
                      </label>
                      <input
                        type="text"
                        value={customFood.name || ''}
                        onChange={(e) => handleCustomFoodChange('name', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                        placeholder="Enter food name"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Portion (grams)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={customFood.portion || 0}
                        onChange={(e) => handleCustomFoodChange('portion', parseInt(e.target.value) || 0)}
                        className="w-full px-4 py-3 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                        min="1"
                        max="1000"
                      />
                      <span className="absolute right-3 top-3 text-gray-500 dark:text-gray-400">g</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Calories
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={customFood.calories || 0}
                        onChange={(e) => handleCustomFoodChange('calories', parseInt(e.target.value) || 0)}
                        className="w-full px-4 py-3 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                        min="0"
                        max="2000"
                      />
                      <span className="absolute right-3 top-3 text-gray-500 dark:text-gray-400">kcal</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Protein (g)
                      </label>
                      <input
                        type="number"
                        value={customFood.proteins || 0}
                        onChange={(e) => handleCustomFoodChange('proteins', parseFloat(e.target.value) || 0)}
                        className="w-full px-4 py-3 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                        step="0.1"
                        min="0"
                        max="100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Carbs (g)
                      </label>
                      <input
                        type="number"
                        value={customFood.carbs || 0}
                        onChange={(e) => handleCustomFoodChange('carbs', parseFloat(e.target.value) || 0)}
                        className="w-full px-4 py-3 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                        step="0.1"
                        min="0"
                        max="100"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Fats (g)
                      </label>
                      <input
                        type="number"
                        value={customFood.fats || 0}
                        onChange={(e) => handleCustomFoodChange('fats', parseFloat(e.target.value) || 0)}
                        className="w-full px-4 py-3 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                        step="0.1"
                        min="0"
                        max="100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Fibre (g)
                      </label>
                      <input
                        type="number"
                        value={customFood.fibres || 0}
                        onChange={(e) => handleCustomFoodChange('fibres', parseFloat(e.target.value) || 0)}
                        className="w-full px-4 py-3 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                        step="0.1"
                        min="0"
                        max="100"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => {
                      setAddingFood(false)
                      setSelectedFood(null)
                      setCustomFood({
                        name: '',
                        meal_type: '',
                        portion: 100,
                        calories: 0,
                        proteins: 0,
                        carbs: 0,
                        fibres: 0,
                        fats: 0,
                        sugars: 0
                      })
                    }}
                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddFood}
                    disabled={saving || !customFood.name || !customFood.meal_type}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4" />
                        Add Food
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Daily Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-800"
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Daily Summary</h3>
              
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Calories</span>
                    <span className="text-lg font-bold text-green-600 dark:text-green-400">
                      {calculateDayTotals().calories}
                      <span className="text-sm font-normal text-gray-500 dark:text-gray-400">/{getDailyTargets().calories}</span>
                    </span>
                  </div>
                  <div className="h-2 bg-green-100 dark:bg-green-900/30 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                      style={{ width: `${Math.min((calculateDayTotals().calories / getDailyTargets().calories) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    { label: 'Protein', value: calculateDayTotals().proteins, target: getDailyTargets().proteins, color: 'blue' },
                    { label: 'Carbs', value: calculateDayTotals().carbs, target: getDailyTargets().carbs, color: 'green' },
                    { label: 'Fats', value: calculateDayTotals().fats, target: getDailyTargets().fats, color: 'yellow' },
                    { label: 'Fibre', value: calculateDayTotals().fibres, target: getDailyTargets().fibres, color: 'purple' },
                    { label: 'Sugars', value: calculateDayTotals().sugars, target: getDailyTargets().sugars, color: 'red' }
                  ].map((item) => {
                    const percentage = Math.min((item.value / item.target) * 100, 100)
                    return (
                      <div key={item.label} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`h-2 w-2 rounded-full bg-${item.color}-500`} />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{item.label}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">{item.value}g</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">/ {item.target}g</span>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {meals.reduce((acc, meal) => acc + meal.foods.length, 0)}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Total Foods</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {meals.length}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Meals</div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleFinish}
                  className="w-full mt-6 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Check className="h-5 w-5" />
                  Finish Logging Today
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}