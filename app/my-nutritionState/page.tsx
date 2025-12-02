'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  Calendar,
  X,
  PieChartIcon,
  DropletsIcon,
  ChevronRight,
  ChevronDown,
  Filter,
  Search,
  Download,
  TrendingUp,
  TrendingDown,
  Minus,
  MoreVertical,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Trophy,
  Activity,
  Utensils,
  Flame,
  Target,
  BarChart3,
  Droplets,
  Shield,
  TrendingUp as TrendingUpIcon,
  CalendarDays,
  Clock3,
  History,
  ChartNoAxesCombined,
  Sparkles,
  Star,
  Zap,
  Brain,
  LineChart,
  PieChart,
  CalendarRange,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  SortAsc,
  SortDesc,
  Filter as FilterIcon,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  Hash,
  Apple,
  Drumstick,
  Leaf,
  Fish,
  Egg,
  Milk,
  Sandwich,
  Coffee,
  Beef,
  Pizza,
  Salad,
  Soup,
  ClockIcon,
  Edit,
  Share2,
  Calendar as CalendarIcon,
  Info
} from 'lucide-react'

import { authService } from '@/lib/auth'
import { nutritionService, DailyNutritionSummary, EatingDayData } from '@/lib/nutrition'

export default function MyNutritionStatePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [summaries, setSummaries] = useState<DailyNutritionSummary[]>([])
  const [selectedDay, setSelectedDay] = useState<DailyNutritionSummary | null>(null)
  const [expandedView, setExpandedView] = useState(false)
  const [filter, setFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'date' | 'score' | 'calories'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [stats, setStats] = useState({
    totalDays: 0,
    trackedDays: 0,
    averageScore: 0,
    bestScore: 0,
    totalCalories: 0,
    streak: 0,
    bestDay: '',
    worstDay: '',
    dateRange: '',
    earliestDate: '',
    latestDate: ''
  })
  const [showDateRangePicker, setShowDateRangePicker] = useState(false)
  const [customStartDate, setCustomStartDate] = useState<string>('')
  const [customEndDate, setCustomEndDate] = useState<string>('')

  const gradientOrbs = [
    { x: 5, y: 10, color: 'from-purple-500/10 via-indigo-500/10 to-blue-500/10', size: 200, duration: 25 },
    { x: 90, y: 20, color: 'from-emerald-500/10 via-teal-500/10 to-cyan-500/10', size: 180, duration: 30, delay: 2 },
    { x: 15, y: 80, color: 'from-pink-500/10 via-rose-500/10 to-red-500/10', size: 160, duration: 35, delay: 1 },
  ]

const [selectedEatingDay, setSelectedEatingDay] = useState<EatingDayData | null>(null)
const [loadingDetails, setLoadingDetails] = useState(false)
const [sidebarError, setSidebarError] = useState<string | null>(null)

// Add this function to handle day click with sidebar
const handleDayDetailsClick = async (summary: DailyNutritionSummary) => {
  if (!summary.has_data || !summary.eating_day) {
    // If no data, just show basic info
    setSelectedEatingDay(null)
    setSelectedDay(summary)
    setExpandedView(true)
    return
  }
  
  try {
    setLoadingDetails(true)
    setSidebarError(null)
    
    // Fetch detailed eating day data
    const eatingDayDetails = await nutritionService.getEatingDayById(summary.eating_day.id)
    
    // Update the summary with detailed data
    const updatedSummary: DailyNutritionSummary = {
      ...summary,
      eating_day: eatingDayDetails
    }
    
    setSelectedDay(updatedSummary)
    setSelectedEatingDay(eatingDayDetails)
    setExpandedView(true)
    
  } catch (error: any) {
    console.error('Error loading eating day details:', error)
    setSidebarError(error.message || 'Failed to load day details')
    
    // Fallback to existing data
    setSelectedDay(summary)
    setSelectedEatingDay(summary.eating_day)
    setExpandedView(true)
  } finally {
    setLoadingDetails(false)
  }
}

// Add this function to close the sidebar
const handleCloseSidebar = () => {
  setExpandedView(false)
  setSelectedDay(null)
  setSelectedEatingDay(null)
  setSidebarError(null)
}

  useEffect(() => {
    checkAuthAndLoadData()
  }, [])

  const checkAuthAndLoadData = async () => {
    try {
      setLoading(true)
      
      const isAuth = authService.isAuthenticated()
      if (!isAuth) {
        router.push('/signin')
        return
      }

      // Load all eating days
      const eatingDays = await nutritionService.getAllEatingDays()
      
      // Determine date range
      let dateRange: string[]
      let earliestDate = ''
      let latestDate = ''
      
      if (eatingDays.length > 0) {
        // Get earliest and latest dates from eating days
        const dates = eatingDays.map(day => day.date).sort()
        earliestDate = dates[0]
        latestDate = dates[dates.length - 1]
        
        // Generate date range from earliest eating day to today
        dateRange = nutritionService.generateDateRange(earliestDate)
      } else {
        // No eating days yet, show last 30 days
        earliestDate = new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0]
        latestDate = new Date().toISOString().split('T')[0]
        dateRange = nutritionService.generateDateRange(earliestDate)
      }
      
      // Create summaries for each day
      const summariesList: DailyNutritionSummary[] = dateRange.map(date => {
        const eatingDay = eatingDays.find(day => day.date === date)
        
        if (eatingDay) {
          const totals = nutritionService.calculateDayTotals(eatingDay.meals)
          const totalFoods = eatingDay.meals.reduce((acc, meal) => acc + meal.foods.length, 0)
          const status = nutritionService.getNutritionStatus(eatingDay.nutrition_score, true, totalFoods)
          
          return {
            date,
            eating_day: eatingDay,
            total_meals: eatingDay.number_of_meals,
            total_foods: totalFoods,
            total_calories: totals.calories,
            nutrition_score: eatingDay.nutrition_score,
            status,
            has_data: true
          }
        } else {
          return {
            date,
            eating_day: null,
            total_meals: 0,
            total_foods: 0,
            total_calories: 0,
            nutrition_score: 0,
            status: 'skipped',
            has_data: false
          }
        }
      })

      // Calculate statistics
      const trackedDays = summariesList.filter(s => s.has_data && s.total_foods > 0)
      const scoredDays = summariesList.filter(s => s.nutrition_score > 0)
      const averageScore = scoredDays.length > 0 
        ? scoredDays.reduce((sum, day) => sum + day.nutrition_score, 0) / scoredDays.length 
        : 0
      
      let bestScore = 0
      let bestDay = ''
      let worstScore = 100
      let worstDay = ''
      
      trackedDays.forEach(day => {
        if (day.nutrition_score > bestScore) {
          bestScore = day.nutrition_score
          bestDay = day.date
        }
        if (day.nutrition_score < worstScore && day.nutrition_score > 0) {
          worstScore = day.nutrition_score
          worstDay = day.date
        }
      })
      
      const totalCalories = summariesList.reduce((sum, day) => sum + day.total_calories, 0)
      
      // Calculate streak (consecutive days with data)
      let streak = 0
      let currentStreak = 0
      for (const summary of summariesList) {
        if (summary.has_data && summary.total_foods > 0) {
          currentStreak++
          streak = Math.max(streak, currentStreak)
        } else {
          currentStreak = 0
        }
      }

      // Format date range for display
      const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric',
          year: 'numeric'
        })
      }

      setStats({
        totalDays: summariesList.length,
        trackedDays: trackedDays.length,
        averageScore,
        bestScore,
        totalCalories,
        streak,
        bestDay,
        worstDay,
        dateRange: `${formatDate(earliestDate)} - ${formatDate(latestDate)}`,
        earliestDate,
        latestDate
      })

      setSummaries(summariesList)
      
    } catch (error) {
      console.error('Error loading nutrition state:', error)
      router.push('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  const handleCustomDateRange = () => {
    if (!customStartDate || !customEndDate) {
      alert('Please select both start and end dates')
      return
    }
    
    const startDate = new Date(customStartDate)
    const endDate = new Date(customEndDate)
    
    if (startDate > endDate) {
      alert('Start date must be before end date')
      return
    }
    
    const dateRange = generateCustomDateRange(customStartDate, customEndDate)
    const filteredSummaries = summaries.filter(s => 
      dateRange.includes(s.date)
    )
    
    // Recalculate stats for custom range
    const trackedDays = filteredSummaries.filter(s => s.has_data && s.total_foods > 0)
    const scoredDays = filteredSummaries.filter(s => s.nutrition_score > 0)
    const averageScore = scoredDays.length > 0 
      ? scoredDays.reduce((sum, day) => sum + day.nutrition_score, 0) / scoredDays.length 
      : 0
    
    setStats(prev => ({
      ...prev,
      totalDays: filteredSummaries.length,
      trackedDays: trackedDays.length,
      averageScore,
      dateRange: `${formatDateForDisplay(customStartDate)} - ${formatDateForDisplay(customEndDate)}`
    }))
    
    // You might want to store the filtered summaries in a separate state
    // For now, we'll just update the main summaries with filtered ones
    // In a real app, you'd want to handle this differently
    alert(`Showing data from ${formatDateForDisplay(customStartDate)} to ${formatDateForDisplay(customEndDate)}`)
    setShowDateRangePicker(false)
  }

  const generateCustomDateRange = (start: string, end: string): string[] => {
    const startDate = new Date(start)
    const endDate = new Date(end)
    const dates: string[] = []
    
    const current = new Date(startDate)
    current.setHours(0, 0, 0, 0)
    
    while (current <= endDate) {
      dates.push(current.toISOString().split('T')[0])
      current.setDate(current.getDate() + 1)
    }
    
    return dates.reverse()
  }

  const formatDateForDisplay = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    })
  }

  const filteredAndSortedSummaries = summaries
    .filter(summary => {
      if (filter === 'all') return true
      if (filter === 'tracked') return summary.has_data && summary.total_foods > 0
      if (filter === 'skipped') return !summary.has_data || summary.total_foods === 0
      if (filter === 'excellent') return summary.status === 'excellent'
      if (filter === 'good') return summary.status === 'good'
      if (filter === 'fair') return summary.status === 'fair'
      if (filter === 'poor') return summary.status === 'poor'
      if (filter === 'incomplete') return summary.status === 'incomplete'
      return true
    })
    .filter(summary => 
      searchQuery === '' || 
      summary.date.includes(searchQuery) ||
      summary.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (summary.eating_day?.meals.some(meal => 
        meal.foods.some(food => 
          food.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      ) || false)
    )
    .sort((a, b) => {
      let valueA, valueB
      
      if (sortBy === 'date') {
        valueA = new Date(a.date).getTime()
        valueB = new Date(b.date).getTime()
      } else if (sortBy === 'score') {
        valueA = a.nutrition_score
        valueB = b.nutrition_score
      } else {
        valueA = a.total_calories
        valueB = b.total_calories
      }
      
      return sortOrder === 'desc' ? valueB - valueA : valueA - valueB
    })

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedSummaries.length / itemsPerPage)
  const paginatedSummaries = filteredAndSortedSummaries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600 dark:text-emerald-400'
    if (score >= 60) return 'text-green-600 dark:text-green-400'
    if (score >= 40) return 'text-yellow-600 dark:text-yellow-400'
    if (score > 0) return 'text-orange-600 dark:text-orange-400'
    return 'text-gray-400 dark:text-gray-500'
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-500/10 border-emerald-500/20'
    if (score >= 60) return 'bg-green-500/10 border-green-500/20'
    if (score >= 40) return 'bg-yellow-500/10 border-yellow-500/20'
    if (score > 0) return 'bg-orange-500/10 border-orange-500/20'
    return 'bg-gray-500/10 border-gray-500/20'
  }

  const getDayName = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { weekday: 'short' })
  }

  const getMonthName = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short' })
  }

  const handleDayClick = (summary: DailyNutritionSummary) => {
    setSelectedDay(summary)
    setExpandedView(true)
  }

  const getFoodIcon = (foodName: string) => {
    const icons: Record<string, any> = {
      'chicken': Drumstick,
      'egg': Egg,
      'fish': Fish,
      'vegetable': Leaf,
      'salad': Salad,
      'fruit': Apple,
      'milk': Milk,
      'bread': Sandwich,
      'coffee': Coffee,
      'beef': Beef,
      'pizza': Pizza,
      'soup': Soup,
      'juice': Coffee,
      'cereal': Sandwich,
      'banana': Apple,
      'orange': Apple,
      'cereal': Sandwich,
    }
    
    const lowerName = foodName.toLowerCase()
    for (const [key, icon] of Object.entries(icons)) {
      if (lowerName.includes(key)) {
        return icon
      }
    }
    return Utensils
  }

  const handleExportData = () => {
    const headers = ['Date', 'Day', 'Meals', 'Foods', 'Calories', 'Protein (g)', 'Carbs (g)', 'Fats (g)', 'Nutrition Score', 'Status']
    const csv = [
      headers.join(','),
      ...filteredAndSortedSummaries.map(s => {
        const totals = s.eating_day ? nutritionService.calculateDayTotals(s.eating_day.meals) : { proteins: 0, carbs: 0, fats: 0 }
        return [
          s.date,
          getDayName(s.date),
          s.total_meals,
          s.total_foods,
          s.total_calories,
          totals.proteins.toFixed(1),
          totals.carbs.toFixed(1),
          totals.fats.toFixed(1),
          s.nutrition_score.toFixed(2),
          nutritionService.getStatusText(s.status)
        ].join(',')
      })
    ].join('\n')
    
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `nutrition-history-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  // Set today as default end date and 30 days ago as default start date for date picker
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    const thirtyDaysAgo = new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0]
    setCustomEndDate(today)
    setCustomStartDate(thirtyDaysAgo)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-24">
          <div className="flex flex-col items-center justify-center min-h-[70vh] gap-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              <div className="h-20 w-20 border-4 border-gray-200/50 dark:border-gray-700/50 rounded-full">
                <div className="absolute inset-0 border-4 border-transparent border-t-purple-500 border-r-indigo-500 rounded-full animate-spin" />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-3"
            >
              <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                Loading Nutrition History
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md">
                Analyzing your nutritional journey...
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden relative">
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
              x: [0, Math.sin(index) * 30, 0],
              y: [0, Math.cos(index) * 30, 0],
              scale: [1, 1.05, 1],
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
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000002_1px,transparent_1px),linear-gradient(to_bottom,#00000002_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.03]" />

      <div className="container relative mx-auto px-4 py-8 max-w-7xl">
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
                className="group flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all mb-4"
              >
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                <span className="group-hover:underline">Back to Dashboard</span>
              </button>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-indigo-500/20 to-blue-500/20 rounded-2xl blur-xl" />
                  <div className="relative p-3 bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm border border-white/10 rounded-2xl shadow-lg">
                    <ChartNoAxesCombined className="h-8 w-8 text-green-700 dark:text-green-400" />
                  </div>
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                    Nutrition History
                  </h1>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-lg">
                    <CalendarIcon className="h-5 w-5" />
                    <span>{stats.dateRange}</span>
                    <button
                      onClick={() => setShowDateRangePicker(!showDateRangePicker)}
                      className="ml-2 text-sm text-purple-600 dark:text-purple-400 hover:underline"
                    >
                      Change range
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm border border-white/10 text-gray-700 dark:text-gray-300 rounded-xl text-sm">
              <Info className="h-3 w-3" />
              <span>{summaries.length} days analyzed</span>
            </div>
          </div>
        </motion.div>

        {/* Date Range Picker */}
        <AnimatePresence>
          {showDateRangePicker && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 overflow-hidden"
            >
              <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Custom Date Range</h3>
                  <button
                    onClick={() => setShowDateRangePicker(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <XCircle className="h-5 w-5" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={customStartDate}
                      onChange={(e) => setCustomStartDate(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white/50 dark:bg-gray-800/50 border border-gray-300/50 dark:border-gray-600/50 rounded-xl focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/50 outline-none"
                      max={customEndDate || new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={customEndDate}
                      onChange={(e) => setCustomEndDate(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white/50 dark:bg-gray-800/50 border border-gray-300/50 dark:border-gray-600/50 rounded-xl focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/50 outline-none"
                      max={new Date().toISOString().split('T')[0]}
                      min={customStartDate}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowDateRangePicker(false)}
                    className="px-4 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCustomDateRange}
                    className="px-4 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl hover:shadow-lg transition-all"
                  >
                    Apply Range
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Statistics Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <div className="bg-white/60 dark:bg-gray-900/40 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-gray-200/50 dark:border-gray-700/50">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              {/* Tracked Days */}
              <div className="lg:col-span-2 p-4 bg-gradient-to-br from-white/40 to-white/20 dark:from-gray-800/40 dark:to-gray-900/40 backdrop-blur-sm rounded-xl border border-gray-200/30 dark:border-gray-700/30">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                      <CalendarDays className="h-4 w-4" />
                      Tracked Days
                    </div>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                      {stats.trackedDays}
                      <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">/{stats.totalDays}</span>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      {stats.totalDays > 0 ? Math.round((stats.trackedDays / stats.totalDays) * 100) : 0}% consistency
                    </div>
                  </div>
                  <div className="relative">
                    <div className="h-16 w-16 rounded-full border-4 border-gray-200/50 dark:border-gray-700/50" />
                    <div 
                      className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-500 border-r-indigo-500"
                      style={{ transform: `rotate(${stats.totalDays > 0 ? (stats.trackedDays / stats.totalDays) * 360 : 0}deg)` }}
                    />
                  </div>
                </div>
              </div>

              {/* Average Score */}
              <div className="p-4 bg-gradient-to-br from-white/40 to-white/20 dark:from-gray-800/40 dark:to-gray-900/40 backdrop-blur-sm rounded-xl border border-gray-200/30 dark:border-gray-700/30">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                      <TrendingUpIcon className="h-4 w-4" />
                      Avg. Score
                    </div>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                      {stats.averageScore.toFixed(1)}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      {stats.averageScore >= 60 ? 'Great work!' : 'Keep improving!'}
                    </div>
                  </div>
                  <div className={`h-12 w-12 rounded-xl ${getScoreBgColor(stats.averageScore)} flex items-center justify-center border`}>
                    <Star className={`h-6 w-6 ${getScoreColor(stats.averageScore)}`} />
                  </div>
                </div>
              </div>

              {/* Best Score */}
              <div className="p-4 bg-gradient-to-br from-white/40 to-white/20 dark:from-gray-800/40 dark:to-gray-900/40 backdrop-blur-sm rounded-xl border border-gray-200/30 dark:border-gray-700/30">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                      <Trophy className="h-4 w-4" />
                      Best Score
                    </div>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                      {stats.bestScore.toFixed(1)}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 truncate">
                      {stats.bestDay ? formatDateForDisplay(stats.bestDay) : 'N/A'}
                    </div>
                  </div>
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-yellow-500/20 to-amber-500/20 border border-yellow-500/20 flex items-center justify-center">
                    <Zap className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                </div>
              </div>

              {/* Current Streak */}
              <div className="p-4 bg-gradient-to-br from-white/40 to-white/20 dark:from-gray-800/40 dark:to-gray-900/40 backdrop-blur-sm rounded-xl border border-gray-200/30 dark:border-gray-700/30">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                      <Flame className="h-4 w-4" />
                      Current Streak
                    </div>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                      {stats.streak}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      {stats.streak > 0 ? 'Keep it up!' : 'Start tracking!'}
                    </div>
                  </div>
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/20 flex items-center justify-center">
                    <Activity className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  </div>
                </div>
              </div>

              {/* Total Calories */}
              <div className="p-4 bg-gradient-to-br from-white/40 to-white/20 dark:from-gray-800/40 dark:to-gray-900/40 backdrop-blur-sm rounded-xl border border-gray-200/30 dark:border-gray-700/30">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                      <Utensils className="h-4 w-4" />
                      Total Calories
                    </div>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                      {Math.round(stats.totalCalories / 1000)}K
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      {stats.totalCalories.toLocaleString()} kcal
                    </div>
                  </div>
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-pink-500/20 to-rose-500/20 border border-pink-500/20 flex items-center justify-center">
                    <Target className="h-6 w-6 text-pink-600 dark:text-pink-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-6"
        >
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:flex-none">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by date, food, or status..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full md:w-64 pl-10 pr-4 py-2.5 bg-white/80 dark:bg-gray-900/60 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/50 outline-none transition-all"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <select
                  value={filter}
                  onChange={(e) => {
                    setFilter(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="px-3 py-2.5 bg-white/80 dark:bg-gray-900/60 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/50 outline-none transition-all"
                >
                  <option value="all">All Days</option>
                  <option value="tracked">Tracked Only</option>
                  <option value="skipped">Skipped Days</option>
                  <option value="excellent">Excellent</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                  <option value="poor">Need Improvement</option>
                  <option value="incomplete">Incomplete</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto justify-end">
              <div className="flex items-center gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value as any)
                    setCurrentPage(1)
                  }}
                  className="px-3 py-2.5 bg-white/80 dark:bg-gray-900/60 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/50 outline-none transition-all"
                >
                  <option value="date">Sort by Date</option>
                  <option value="score">Sort by Score</option>
                  <option value="calories">Sort by Calories</option>
                </select>
                <button
                  onClick={() => {
                    setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')
                    setCurrentPage(1)
                  }}
                  className="p-2.5 bg-white/80 dark:bg-gray-900/60 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl hover:bg-white dark:hover:bg-gray-800 transition-colors"
                >
                  {sortOrder === 'desc' ? <SortDesc className="h-4 w-4" /> : <SortAsc className="h-4 w-4" />}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportData}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 hover:from-purple-500/20 hover:to-indigo-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/20 rounded-xl hover:shadow-lg transition-all"
                >
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">Export</span>
                </button>

                <button
                  onClick={checkAuthAndLoadData}
                  className="p-2.5 bg-white/80 dark:bg-gray-900/60 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl hover:bg-white dark:hover:bg-gray-800 transition-colors"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Content - Full Width Table */}
        <div className="w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="w-full"
          >
            <div className="bg-white/60 dark:bg-gray-900/40 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden border border-gray-200/50 dark:border-gray-700/50">
              {/* Table Header */}
              <div className="px-6 py-4 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-white/80 to-white/40 dark:from-gray-900/80 dark:to-gray-900/40">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                      Daily Nutrition Records
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Showing {paginatedSummaries.length} of {filteredAndSortedSummaries.length} days
                      {filter !== 'all' && ` (${nutritionService.getStatusText(filter)})`}
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 px-2 py-1 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 rounded-lg">
                        <div className="h-2 w-2 rounded-full bg-emerald-500" />
                        <span className="text-xs font-medium">Excellent</span>
                      </div>
                      <div className="flex items-center gap-1 px-2 py-1 bg-gray-500/10 text-gray-700 dark:text-gray-300 rounded-lg">
                        <div className="h-2 w-2 rounded-full bg-gray-400" />
                        <span className="text-xs font-medium">Skipped</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <select
                        value={itemsPerPage}
                        onChange={(e) => {
                          setItemsPerPage(Number(e.target.value))
                          setCurrentPage(1)
                        }}
                        className="px-2 py-1.5 text-sm bg-white/50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 rounded-lg focus:ring-1 focus:ring-purple-500/30 outline-none"
                      >
                        <option value="5">5 per page</option>
                        <option value="10">10 per page</option>
                        <option value="20">20 per page</option>
                        <option value="50">50 per page</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Table Container */}
              <div className="overflow-x-auto">
                <table className="w-full min-w-full">
                  <thead>
                    <tr className="border-b border-gray-200/30 dark:border-gray-700/30 bg-gradient-to-r from-white/60 to-white/30 dark:from-gray-900/60 dark:to-gray-900/30">
                      <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Date
                        </div>
                      </th>
                      <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Hash className="h-4 w-4" />
                          Meals & Foods
                        </div>
                      </th>
                      <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Flame className="h-4 w-4" />
                          Calories
                        </div>
                      </th>
                      <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <BarChart3 className="h-4 w-4" />
                          Nutrition Score
                        </div>
                      </th>
                      <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Activity className="h-4 w-4" />
                          Status
                        </div>
                      </th>
                      <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Eye className="h-4 w-4" />
                          Actions
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200/20 dark:divide-gray-700/20">
                    {paginatedSummaries.map((summary, index) => (
                      <motion.tr
                        key={summary.date}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.03 }}
                        className={`group hover:bg-white/50 dark:hover:bg-gray-800/30 transition-all duration-300 ${
                          !summary.has_data ? 'opacity-75' : ''
                        }`}
                      >
                        {/* Date Column */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-4">
                            <div className={`relative h-14 w-14 rounded-xl flex flex-col items-center justify-center shadow-sm border ${
                              summary.has_data 
                                ? 'bg-gradient-to-br from-purple-500/5 to-indigo-500/5 border-purple-500/10' 
                                : 'bg-gray-500/5 border-gray-500/10'
                            }`}>
                              <div className="text-lg font-bold text-gray-900 dark:text-white">
                                {new Date(summary.date).getDate()}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {getMonthName(summary.date)}
                              </div>
                              <div className="absolute -top-1 -right-1 text-xs font-medium px-1.5 py-0.5 rounded bg-gray-500/10 text-gray-600 dark:text-gray-400">
                                {getDayName(summary.date)}
                              </div>
                            </div>
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white">
                                {formatDateForDisplay(summary.date)}
                              </div>
                              <div className={`text-sm ${summary.has_data ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                                {summary.has_data ? '✓ Tracked' : '⏸️ No Data'}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Meals & Foods Column */}
                        <td className="py-4 px-6">
                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-1.5">
                                <Utensils className="h-4 w-4 text-gray-400" />
                                <span className="font-medium text-gray-900 dark:text-white">{summary.total_meals}</span>
                                <span className="text-sm text-gray-500 dark:text-gray-400">meals</span>
                              </div>
                              <div className="h-4 w-px bg-gray-300 dark:bg-gray-700" />
                              <div className="flex items-center gap-1.5">
                                <div className="h-4 w-4 rounded-full bg-blue-500/10 flex items-center justify-center">
                                  <Hash className="h-2.5 w-2.5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <span className="font-medium text-gray-900 dark:text-white">{summary.total_foods}</span>
                                <span className="text-sm text-gray-500 dark:text-gray-400">foods</span>
                              </div>
                            </div>
                            
                            {summary.has_data && summary.eating_day && summary.total_foods > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {summary.eating_day.meals.flatMap(meal => 
                                  meal.foods.slice(0, 3).map(food => {
                                    const FoodIcon = getFoodIcon(food.name)
                                    return (
                                      <div key={food.id} className="flex items-center gap-1 px-2 py-1 bg-gray-500/5 rounded-lg">
                                        <FoodIcon className="h-3 w-3 text-gray-500" />
                                        <span className="text-xs text-gray-600 dark:text-gray-400 truncate max-w-[60px]">
                                          {food.name.split(' ')[0]}
                                        </span>
                                      </div>
                                    )
                                  })
                                )}
                                {summary.total_foods > 3 && (
                                  <div className="px-2 py-1 bg-gray-500/10 rounded-lg text-xs text-gray-500">
                                    +{summary.total_foods - 3} more
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Calories Column */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                                summary.has_data 
                                  ? 'bg-gradient-to-br from-orange-500/10 to-red-500/10' 
                                  : 'bg-gray-500/10'
                              }`}>
                                <Flame className={`h-6 w-6 ${
                                  summary.has_data 
                                    ? 'text-orange-600 dark:text-orange-400' 
                                    : 'text-gray-400'
                                }`} />
                              </div>
                              {summary.has_data && summary.total_meals > 0 && (
                                <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-orange-500 flex items-center justify-center">
                                  <span className="text-xs font-bold text-white">{summary.total_meals}</span>
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="text-xl font-bold text-gray-900 dark:text-white">
                                {summary.total_calories.toLocaleString()}
                                <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-1">kcal</span>
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {summary.has_data ? 'Total intake' : 'No data recorded'}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Nutrition Score Column */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-4">
                            <div className={`relative h-14 w-14 rounded-xl ${getScoreBgColor(summary.nutrition_score)} flex items-center justify-center border`}>
                              <span className={`text-xl font-bold ${getScoreColor(summary.nutrition_score)}`}>
                                {summary.nutrition_score > 0 ? summary.nutrition_score.toFixed(1) : '—'}
                              </span>
                            </div>
                            <div className="flex-1">
                              <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Quality Score</div>
                              <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full rounded-full ${getScoreColor(summary.nutrition_score).replace('text-', 'bg-')}`}
                                  style={{ width: `${Math.min(summary.nutrition_score, 100)}%` }}
                                />
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {summary.nutrition_score > 0 ? 'Based on balance & variety' : 'No score available'}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Status Column */}
                        <td className="py-4 px-6">
                          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 border ${
                            summary.has_data 
                              ? `bg-gradient-to-r ${nutritionService.getStatusColor(summary.status)} text-white shadow-md border-transparent` 
                              : 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20'
                          }`}>
                            <span className="text-lg">{nutritionService.getStatusIcon(summary.status)}</span>
                            <div>
                              <div className="font-semibold text-sm">{nutritionService.getStatusText(summary.status)}</div>
                              {summary.has_data && summary.nutrition_score > 0 && (
                                <div className="text-xs opacity-90">
                                  {summary.status === 'excellent' ? 'Perfect!' : 
                                   summary.status === 'good' ? 'Well done!' :
                                   summary.status === 'fair' ? 'Keep going!' :
                                   summary.status === 'poor' ? 'Needs work' : ''}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Actions Column */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                           <button
  onClick={() => handleDayDetailsClick(summary)}
  disabled={!summary.has_data || summary.total_foods === 0 || loadingDetails}
  className={`group relative px-4 py-2.5 rounded-xl transition-all duration-300 flex items-center gap-2 ${
    summary.has_data && summary.total_foods > 0 && !loadingDetails
      ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:shadow-lg hover:scale-[1.02]' 
      : 'bg-gray-500/10 text-gray-400 dark:text-gray-500 cursor-not-allowed'
  }`}
>
  {loadingDetails && summary.date === selectedDay?.date ? (
    <>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="h-4 w-4"
      >
        <RefreshCw className="h-4 w-4" />
      </motion.div>
      <span>Loading...</span>
    </>
  ) : (
    <>
      <Eye className="h-4 w-4" />
      <span>Details</span>
      {summary.has_data && summary.total_foods > 0 && !loadingDetails && (
        <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
      )}
    </>
  )}
</button>

                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>

                {paginatedSummaries.length === 0 && (
                  <div className="text-center py-16">
                    <div className="mb-4">
                      <div className="h-20 w-20 mx-auto rounded-2xl bg-gradient-to-br from-gray-500/5 to-gray-500/10 border border-gray-500/10 flex items-center justify-center">
                        <Search className="h-10 w-10 text-gray-400 dark:text-gray-500" />
                      </div>
                    </div>
                    <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2 text-lg">
                      No records found
                    </h4>
                    <p className="text-gray-500 dark:text-gray-400 text-sm max-w-md mx-auto mb-6">
                      {filter !== 'all' 
                        ? `No days match the "${nutritionService.getStatusText(filter)}" filter. Try changing your filters.`
                        : searchQuery 
                          ? `No days match "${searchQuery}". Try a different search term.`
                          : 'Start tracking your nutrition to see your history here.'}
                    </p>
                    {filter !== 'all' && (
                      <button
                        onClick={() => setFilter('all')}
                        className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl hover:shadow-lg transition-all"
                      >
                        Show All Days
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-white/60 to-white/30 dark:from-gray-900/60 dark:to-gray-900/30">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Page {currentPage} of {totalPages}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg border border-gray-200/50 dark:border-gray-700/50 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white dark:hover:bg-gray-800"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum
                        if (totalPages <= 5) {
                          pageNum = i + 1
                        } else if (currentPage <= 3) {
                          pageNum = i + 1
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i
                        } else {
                          pageNum = currentPage - 2 + i
                        }
                        
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`h-9 w-9 rounded-lg font-medium transition-all ${
                              currentPage === pageNum
                                ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md'
                                : 'hover:bg-white dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                            }`}
                          >
                            {pageNum}
                          </button>
                        )
                      })}
                      
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg border border-gray-200/50 dark:border-gray-700/50 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white dark:hover:bg-gray-800"
                      >
                        <ChevronRightIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
          
        </div>
      </div>
      <AnimatePresence>
  {expandedView && (
    <>
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleCloseSidebar}
        className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-40"
      />
      
      {/* Sidebar */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="fixed inset-y-0 right-0 w-full sm:w-96 lg:w-1/3 xl:w-1/4 z-50"
      >
        <div className="h-full bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 shadow-2xl border-l border-gray-200/50 dark:border-gray-800/50 overflow-y-auto">
          {/* Sidebar Header */}
          <div className="sticky top-0 z-10 bg-gradient-to-b from-white to-white/95 dark:from-gray-900 dark:to-gray-900/95 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-800/50 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  Day Details
                </h2>
                {selectedDay && (
                  <p className="text-gray-600 dark:text-gray-400">
                    {new Date(selectedDay.date).toLocaleDateString('en-US', { 
                      weekday: 'long',
                      month: 'long', 
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCloseSidebar}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>
            </div>
            
            {sidebarError && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-lg">
                <div className="flex items-center gap-2 text-red-700 dark:text-red-400 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  {sidebarError}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Content */}
          <div className="p-6 space-y-6">
            {loadingDetails ? (
              <div className="flex flex-col items-center justify-center py-12">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  className="mb-4"
                >
                  <div className="h-12 w-12 border-3 border-gray-300 dark:border-gray-700 border-t-purple-500 rounded-full" />
                </motion.div>
                <p className="text-gray-600 dark:text-gray-400">Loading day details...</p>
              </div>
            ) : selectedDay && selectedEatingDay ? (
              <>
                {/* Status Card */}
                <div className={`p-5 rounded-2xl bg-gradient-to-r ${nutritionService.getStatusColor(selectedDay.status)} shadow-lg`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-4xl mb-3">{nutritionService.getStatusIcon(selectedDay.status)}</div>
                      <div className="text-white text-xl font-bold">
                        {nutritionService.getStatusText(selectedDay.status)}
                      </div>
                      <div className="text-white/90 text-sm">
                        Nutrition Score: {selectedDay.nutrition_score.toFixed(1)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-4xl font-bold text-white">{selectedDay.nutrition_score.toFixed(1)}</div>
                      <div className="text-white/80 text-sm">out of 100</div>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-white/50 to-white/20 dark:from-gray-800/50 dark:to-gray-900/50 backdrop-blur-sm rounded-xl p-4 border border-gray-200/30 dark:border-gray-700/30">
                    <div className="flex items-center gap-2 mb-2">
                      <Utensils className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Meals</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{selectedDay.total_meals}</div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-white/50 to-white/20 dark:from-gray-800/50 dark:to-gray-900/50 backdrop-blur-sm rounded-xl p-4 border border-gray-200/30 dark:border-gray-700/30">
                    <div className="flex items-center gap-2 mb-2">
                      <Hash className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Foods</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{selectedDay.total_foods}</div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-white/50 to-white/20 dark:from-gray-800/50 dark:to-gray-900/50 backdrop-blur-sm rounded-xl p-4 border border-gray-200/30 dark:border-gray-700/30">
                    <div className="flex items-center gap-2 mb-2">
                      <Flame className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Calories</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {selectedDay.total_calories.toLocaleString()}
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-white/50 to-white/20 dark:from-gray-800/50 dark:to-gray-900/50 backdrop-blur-sm rounded-xl p-4 border border-gray-200/30 dark:border-gray-700/30">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Score</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {selectedDay.nutrition_score.toFixed(1)}
                    </div>
                  </div>
                </div>

                {/* Nutrition Breakdown */}
                {selectedEatingDay && (
                  <div className="space-y-6">
                    {/* Macronutrients */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <PieChartIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        Macronutrient Breakdown
                      </h3>
                      <div className="space-y-3">
                        {(() => {
                          const totals = nutritionService.calculateDayTotals(selectedEatingDay.meals)
                          const totalGrams = totals.proteins + totals.carbs + totals.fats
                          
                          const nutrients = [
                            { name: 'Protein', value: totals.proteins, color: 'from-blue-500 to-cyan-500', icon: Target },
                            { name: 'Carbs', value: totals.carbs, color: 'from-green-500 to-emerald-500', icon: BarChart3 },
                            { name: 'Fats', value: totals.fats, color: 'from-yellow-500 to-amber-500', icon: DropletsIcon },
                          ]
                          
                          return nutrients.map(nutrient => {
                            const percentage = totalGrams > 0 ? (nutrient.value / totalGrams) * 100 : 0
                            return (
                              <div key={nutrient.name} className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <nutrient.icon className={`h-4 w-4 bg-gradient-to-br ${nutrient.color} bg-clip-text text-transparent`} />
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                      {nutrient.name}
                                    </span>
                                  </div>
                                  <div className="text-sm text-gray-600 dark:text-gray-400">
                                    {nutrient.value.toFixed(1)}g ({percentage.toFixed(1)}%)
                                  </div>
                                </div>
                                <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full bg-gradient-to-r ${nutrient.color} rounded-full`}
                                    style={{ width: `${percentage}%` }}
                                  />
                                </div>
                              </div>
                            )
                          })
                        })()}
                      </div>
                    </div>

                    {/* Meal Breakdown */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <ClockIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        Meal Breakdown
                      </h3>
                      <div className="space-y-4">
                        {selectedEatingDay.meals.map((meal) => (
                          <div key={meal.id} className="bg-gradient-to-br from-white/40 to-white/20 dark:from-gray-800/40 dark:to-gray-900/40 backdrop-blur-sm rounded-xl p-4 border border-gray-200/30 dark:border-gray-700/30">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${nutritionService.getMealColor(meal.meal_type)} flex items-center justify-center`}>
                                  <span className="text-lg">{nutritionService.getMealIcon(meal.meal_type)}</span>
                                </div>
                                <div>
                                  <div className="font-semibold text-gray-900 dark:text-white">
                                    {nutritionService.getMealDisplayName(meal.meal_type)}
                                  </div>
                                  <div className="text-sm text-gray-500 dark:text-gray-400">
                                    {meal.foods.length} food{meal.foods.length !== 1 ? 's' : ''}
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-bold text-gray-900 dark:text-white">
                                  {meal.foods.reduce((sum, food) => sum + food.calories, 0).toLocaleString()} kcal
                                </div>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              {meal.foods.map((food) => {
                                const FoodIcon = getFoodIcon(food.name)
                                return (
                                  <div key={food.id} className="flex items-center justify-between p-2 hover:bg-white/30 dark:hover:bg-gray-800/30 rounded-lg transition-colors">
                                    <div className="flex items-center gap-3">
                                      <div className="h-8 w-8 rounded-lg bg-gray-500/5 flex items-center justify-center">
                                        <FoodIcon className="h-4 w-4 text-gray-500" />
                                      </div>
                                      <div>
                                        <div className="font-medium text-gray-900 dark:text-white">{food.name}</div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                          {food.portion || '100'}g
                                        </div>
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <div className="font-medium text-gray-900 dark:text-white">{food.calories} kcal</div>
                                      <div className="text-xs text-gray-500 dark:text-gray-400">
                                        P: {food.proteins}g • C: {food.carbs}g • F: {food.fats}g
                                      </div>
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Additional Nutrition Info */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <Brain className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        Additional Nutrients
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-gradient-to-br from-white/40 to-white/20 dark:from-gray-800/40 dark:to-gray-900/40 backdrop-blur-sm rounded-xl p-3 border border-gray-200/30 dark:border-gray-700/30">
                          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Fibre</div>
                          <div className="text-lg font-bold text-gray-900 dark:text-white">
                            {(() => {
                              const totals = nutritionService.calculateDayTotals(selectedEatingDay.meals)
                              return totals.fibres.toFixed(1)
                            })()}g
                          </div>
                        </div>
                        <div className="bg-gradient-to-br from-white/40 to-white/20 dark:from-gray-800/40 dark:to-gray-900/40 backdrop-blur-sm rounded-xl p-3 border border-gray-200/30 dark:border-gray-700/30">
                          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Sugars</div>
                          <div className="text-lg font-bold text-gray-900 dark:text-white">
                            {(() => {
                              const totals = nutritionService.calculateDayTotals(selectedEatingDay.meals)
                              return totals.sugars.toFixed(1)
                            })()}g
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-4 border-t border-gray-200/30 dark:border-gray-700/30">
                      <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          onClick={() => {
                            // Share functionality
                            navigator.clipboard.writeText(
                              `Nutrition for ${selectedDay.date}: ${selectedDay.nutrition_score.toFixed(1)} score, ${selectedDay.total_calories} calories`
                            )
                            alert('Day details copied to clipboard!')
                          }}
                          className="flex-1 px-4 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
                        >
                          <Share2 className="h-4 w-4" />
                          Share
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : selectedDay && !selectedDay.has_data ? (
              <div className="text-center py-12">
                <div className="mb-4">
                  <div className="h-20 w-20 mx-auto rounded-2xl bg-gradient-to-br from-gray-500/5 to-gray-500/10 border border-gray-500/10 flex items-center justify-center">
                    <Clock className="h-10 w-10 text-gray-400 dark:text-gray-500" />
                  </div>
                </div>
                <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2 text-lg">
                  No Data Recorded
                </h4>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                  You didn't track your nutrition for this day.
                </p>
                <button
                  onClick={() => router.push('/today-nutrition')}
                  className="w-full px-4 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:shadow-lg transition-all"
                >
                  Track Today's Nutrition
                </button>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="mb-4">
                  <div className="h-20 w-20 mx-auto rounded-2xl bg-gradient-to-br from-gray-500/5 to-gray-500/10 border border-gray-500/10 flex items-center justify-center">
                    <AlertCircle className="h-10 w-10 text-gray-400 dark:text-gray-500" />
                  </div>
                </div>
                <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2 text-lg">
                  No Data Available
                </h4>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                  Could not load day details. Please try again.
                </p>
                <button
                  onClick={handleCloseSidebar}
                  className="w-full px-4 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:shadow-lg transition-all"
                >
                  Close
                </button>
              </div>
            )}
          </div>

          {/* Sidebar Footer */}
          {selectedEatingDay && (
            <div className="sticky bottom-0 bg-gradient-to-t from-white to-white/95 dark:from-gray-900 dark:to-gray-900/95 backdrop-blur-sm border-t border-gray-200/50 dark:border-gray-800/50 p-6">
              <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                Last updated: {new Date(selectedEatingDay.updated_at).toLocaleString()}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </>
  )}
</AnimatePresence>
    </div>
  )
}