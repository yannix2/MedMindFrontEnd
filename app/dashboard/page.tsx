'use client'

import { activityService, ActivityDayData } from '@/lib/activity'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {EnhancedLiveHealthStats} from '@/components/sections/EnhancedLiveHealthStats'
import ActivityTrackingModal from '@/components/sections/ActivityTrackingModal'
import { activityTodayService } from '@/lib/activity-today'
import { ActivityDay } from '@/lib/activity-today'
import { 
  MessageSquare,
  Brain, 
  Heart,
  LogOut, 
  TrendingUp, 
  Calendar, 
  Activity, 
  Apple,
  Dumbbell,
  Droplets,
  Moon,
  Settings,
  User,
  ChevronRight,
  Sparkles,
  Shield,
  Zap,
  Target,
  BarChart3,
  Bell,
  Clock,
  CheckCircle,
  ArrowRight,
  RefreshCw,
  PieChart,
  BrainCircuit,
  AlertTriangle,
  HeartPulse,
  Utensils,
  Coffee,
  Pizza,
  Salad,
  Soup,
  Plus,
  X,
  Check,
  ChevronLeft,
  Info,
  AlarmSmokeIcon,
  Wine,
  Pill,
  Flame,
  Footprints,
  Cloud,
  Battery,
  TrendingDown,
  Award,
  Trophy,
  Target as TargetIcon,
  Zap as ZapIcon,
  TrendingUp as TrendingUpIcon,
  Cpu,
  Database,
  LineChart,
  Wind,
  Waves
} from 'lucide-react'
import { authService } from '@/lib/auth'
import { dashboardService, DashboardData, healthScoreCalculator } from '@/lib/dashboard'
import { profileService } from '@/lib/profile'
import { medicalProfileService } from '@/lib/medical-profile'

export default function DashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [checkingStatus, setCheckingStatus] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [profileStatus, setProfileStatus] = useState({
    hasProfile: false,
    hasMedicalProfile: false
  })
  const [todaysActivity, setTodaysActivity] = useState<ActivityDayData | null>(null)
  const [trackingActivity, setTrackingActivity] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Eating day modal
  const [showEatingModal, setShowEatingModal] = useState(false)
  const [selectedMeals, setSelectedMeals] = useState<number>(3)
  const [creatingEatingDay, setCreatingEatingDay] = useState(false)
  const [modalError, setModalError] = useState<string | null>(null)

  // New state for animated messages
  const [scoreMessage, setScoreMessage] = useState<{
    message: string;
    emoji: string;
    color: string;
    subtext: string;
    gradient: string;
  } | null>(null)
  const [healthTips, setHealthTips] = useState<string[]>([])
  const [currentTipIndex, setCurrentTipIndex] = useState(0)
  const [showMotivation, setShowMotivation] = useState(false)

  // AI Data & Analytics
  const [aiInsights, setAiInsights] = useState({
    dailyTip: '',
    weeklyTrend: '',
    healthPredictions: [] as string[],
    improvementAreas: [] as string[]
  })

  // Calculate health stats
  const calculatedStats = healthScoreCalculator.calculateStats(dashboardData, todaysActivity)
  const totalScore = healthScoreCalculator.calculateTotalScore(
    dashboardData?.eating_day?.nutrition_score || null,
    todaysActivity?.activity_score || null
  )
  const streak = healthScoreCalculator.calculateStreak(dashboardData)

  const gradientOrbs = [
    { x: 5, y: 15, color: 'from-blue-500/15 to-purple-500/15', size: 120, duration: 25 },
    { x: 90, y: 60, color: 'from-emerald-500/10 to-cyan-500/10', size: 160, duration: 30, delay: 3 },
    { x: 15, y: 80, color: 'from-purple-500/10 to-pink-500/10', size: 100, duration: 20, delay: 1 },
    { x: 85, y: 20, color: 'from-amber-500/10 to-orange-500/10', size: 140, duration: 35, delay: 2 },
  ]

  // Floating animated elements
  const floatingElements = [
    { icon: BrainCircuit, x: 10, y: 20, delay: 0, size: 24 },
    { icon: HeartPulse, x: 85, y: 30, delay: 1, size: 28 },
    { icon: Cpu, x: 20, y: 70, delay: 2, size: 22 },
    { icon: Database, x: 75, y: 65, delay: 3, size: 26 },
    { icon: LineChart, x: 40, y: 85, delay: 4, size: 24 },
  ]

  useEffect(() => {
    checkAuthAndLoadDashboard()
  }, [])

  useEffect(() => {
    if (dashboardData || todaysActivity) {
      const nutritionScore = dashboardData?.eating_day?.nutrition_score || null
      const activityScore = todaysActivity?.activity_score || null
      const calculatedScore = healthScoreCalculator.calculateTotalScore(nutritionScore, activityScore)
      
      const message = healthScoreCalculator.getMotivationalMessage(calculatedScore)
      setScoreMessage(message)
      
      const tips = healthScoreCalculator.getHealthTips(
        calculatedScore,
        !!dashboardData?.eating_day,
        !!todaysActivity
      )
      setHealthTips(tips)
      
      // Generate AI insights
      generateAIInsights()
      
      // Show motivation animation
      setShowMotivation(true)
      setTimeout(() => setShowMotivation(false), 6000)
      
      // Rotate tips every 5 seconds
      const tipInterval = setInterval(() => {
        setCurrentTipIndex((prev) => (prev + 1) % tips.length)
      }, 5000)
      
      return () => clearInterval(tipInterval)
    }
  }, [dashboardData, todaysActivity])

  const generateAIInsights = () => {
    const nutritionScore = dashboardData?.eating_day?.nutrition_score || 0
    const activityScore = todaysActivity?.activity_score || 0
    const bmi = calculateBMI()
    
    // Generate daily AI tip
    const dailyTips = [
      "AI Tip: Based on your recent activity, incorporating 30 minutes of brisk walking daily could improve your cardiovascular health by 15%.",
      "AI Insight: Your hydration levels are optimal! Maintaining this can boost cognitive function by up to 20%.",
      "Health Prediction: With consistent activity tracking, you're projected to reach your fitness goals 2 weeks ahead of schedule.",
      "Nutrition Analysis: Your current meal patterns suggest adding more leafy greens could improve digestion and energy levels.",
      "Sleep Optimization: Based on your sleep data, moving bedtime 30 minutes earlier could increase REM sleep by 25%."
    ]
    
    // Generate weekly trend
    const weeklyTrends = [
      "Weekly Trend: Your activity consistency has improved by 18% compared to last week. Keep it up!",
      "Trend Analysis: Nutrition scores are trending upward. This correlates with improved energy levels.",
      "Performance Insight: Your recovery time between workouts has decreased by 22%, indicating better fitness adaptation.",
      "Health Trend: Sleep quality shows positive correlation with daily activity scores.",
      "Progress Update: Your metabolic health indicators show steady improvement over the last 7 days."
    ]
    
    // Health predictions
    const healthPredictions = [
      "In 2 weeks: Improved endurance for cardio activities",
      "In 1 month: Better sleep quality and recovery",
      "In 3 months: Weight management improvements",
      "In 6 months: Enhanced metabolic health markers",
      "In 1 year: Reduced risk of lifestyle-related conditions"
    ]
    
    // Improvement areas
    const improvementAreas = [
      "Focus on post-workout nutrition for better recovery",
      "Consider adding strength training 2x weekly",
      "Monitor sodium intake for optimal blood pressure",
      "Increase daily fiber intake by 5-10g",
      "Aim for consistent bedtime within 30-minute window"
    ]
    
    setAiInsights({
      dailyTip: dailyTips[Math.floor(Math.random() * dailyTips.length)],
      weeklyTrend: weeklyTrends[Math.floor(Math.random() * weeklyTrends.length)],
      healthPredictions: healthPredictions.slice(0, 3),
      improvementAreas: improvementAreas.slice(0, 2)
    })
  }

  const checkAuthAndLoadDashboard = async () => {
    try {
      setLoading(true)
      setCheckingStatus(true)

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
      setUser(currentUser)
      
      // Check profile status first
      const status = await dashboardService.checkProfileStatus()
      setProfileStatus({
        hasProfile: status.hasProfile,
        hasMedicalProfile: status.hasMedicalProfile
      })

      // Redirect if missing profiles
      if (!status.hasProfile) {
        router.push('/myhealthProfile')
        return
      }
      if (!status.hasMedicalProfile) {
        router.push('/mymedicalProfile')
        return
      }

      // Load dashboard data
      try {
        const dashboard = await dashboardService.getTodayDashboard()
        setDashboardData(dashboard)
        
        // Load activity data
        await loadActivityData()
        
        // Show eating modal if no eating day
        if (!dashboard.eating_day) {
          setTimeout(() => {
            setShowEatingModal(true)
          }, 1000) // Increased delay for better UX
        }
      } catch (error) {
        console.error('Error loading dashboard:', error)
      }
      
    } catch (error) {
      console.error('Dashboard error:', error)
      router.push('/signin')
    } finally {
      setLoading(false)
      setCheckingStatus(false)
    }
  }

  const loadActivityData = async () => {
    try {
      const activity = await activityService.getTodayActivityDay()
      setTodaysActivity(activity)
    } catch (error) {
      console.error('Error loading activity data:', error)
    }
  }
  
  const handleLogout = async () => {
    if (confirm('Are you sure you want to logout?')) {
      try {
        await authService.logout()
        window.location.href = '/signin'
      } catch (error) {
        console.error('Logout error:', error)
        window.location.href = '/signin'
      }
    }
  }

  const handleMealSelect = (meals: number) => {
    setSelectedMeals(meals)
  }

  const handleCreateEatingDay = async () => {
    setCreatingEatingDay(true)
    setModalError(null)

    try {
      await dashboardService.createEatingDay({
        number_of_meals: selectedMeals
      })
      
      setShowEatingModal(false)
      
      // Refresh dashboard data
      const updatedDashboard = await dashboardService.getTodayDashboard()
      setDashboardData(updatedDashboard)
      
      // Redirect to nutrition page
      router.push('/today-nutrition')
      
    } catch (err: any) {
      setModalError(err.message || 'Failed to create eating day')
      console.error('Failed to create eating day:', err)
    } finally {
      setCreatingEatingDay(false)
    }
  }



  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: 'Underweight', color: 'text-blue-500', bgColor: 'bg-blue-100' }
    if (bmi < 25) return { category: 'Normal weight', color: 'text-green-500', bgColor: 'bg-green-100' }
    if (bmi < 30) return { category: 'Overweight', color: 'text-yellow-500', bgColor: 'bg-yellow-100' }
    return { category: 'Obese', color: 'text-red-500', bgColor: 'bg-red-100' }
  }

  const calculateBMI = () => {
    if (!dashboardData?.profile) return 0
    return profileService.calculateBMI(dashboardData.profile.weight, dashboardData.profile.height)
  }

  const getMealIcons = (mealType: string) => {
    switch (mealType) {
      case 'breakfast': return <Coffee className="h-4 w-4" />
      case 'lunch': return <Utensils className="h-4 w-4" />
      case 'dinner': return <Pizza className="h-4 w-4" />
      case 'snack': return <Salad className="h-4 w-4" />
      default: return <Soup className="h-4 w-4" />
    }
  }

  const getSportIcon = (sportType: string) => {
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

  const mealOptions = [
    { value: 0, label: 'Skipped all meals', icon: <X className="h-5 w-5" />, color: 'from-gray-500 to-gray-600' },
    { value: 1, label: '1 meal', icon: <Coffee className="h-5 w-5" />, color: 'from-blue-500 to-cyan-500' },
    { value: 2, label: '2 meals', icon: <Utensils className="h-5 w-5" />, color: 'from-green-500 to-emerald-500' },
    { value: 3, label: '3 meals', icon: <Pizza className="h-5 w-5" />, color: 'from-amber-500 to-orange-500' },
    { value: 4, label: '4+ meals', icon: <Salad className="h-5 w-5" />, color: 'from-purple-500 to-pink-500' },
  ]
if (!todaysActivity) {
  // Handle the "no activity" case
  return <p>No activity data for today.</p>
}

const normalizedActivityDay: ActivityDay = {
  ...todaysActivity,
  id: todaysActivity.id ?? 0,
  date: todaysActivity.date ?? new Date().toISOString().split('T')[0],
  sleep_start: todaysActivity.sleep_start ?? null,
  sleep_end: todaysActivity.sleep_end ?? null,
  active_general: todaysActivity.active_general ?? false,
  activity_score: todaysActivity.activity_score ?? 0,
  created_at: todaysActivity.created_at ?? new Date().toISOString(),
  updated_at: todaysActivity.updated_at ?? new Date().toISOString(),
  sports: todaysActivity.sports.map((s, index) => ({
    id: s.id ?? index,
    sport_type: s.sport_type,
    duration_minutes: s.duration_minutes,
    calories_burned: s.calories_burned ?? 0,
    created_at: s.created_at ?? new Date().toISOString(),
    updated_at: s.updated_at ?? new Date().toISOString(),
  }))
}

  if (loading || checkingStatus) {
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
                <div className="absolute inset-0 border-4 border-transparent border-t-blue-500 border-r-purple-500 rounded-full animate-spin" />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-3"
            >
              <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                Preparing Your Dashboard
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md">
                Checking your profiles and loading health insights...
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    )
  }

  // Redirecting states
  if (!user || !profileStatus.hasProfile || !profileStatus.hasMedicalProfile) {
    return null
  }

  return (
    <>
      {/* Success/Error Messages */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-3 rounded-xl shadow-lg">
              {success}
            </div>
          </motion.div>
        )}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-3 rounded-xl shadow-lg">
              {error}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Eating Day Modal */}
      <AnimatePresence>
        {showEatingModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
                    <Utensils className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      Today's Meals
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      How many times have you eaten today?
                    </p>
                  </div>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                {modalError && (
                  <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-sm text-red-600 dark:text-red-400">{modalError}</p>
                  </div>
                )}

                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-3">
                    {mealOptions.map((option) => (
                      <motion.button
                        key={option.value}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleMealSelect(option.value)}
                        className={`p-4 rounded-xl border-2 transition-all duration-300 flex items-center justify-between ${
                          selectedMeals === option.value
                            ? `border-transparent bg-gradient-to-r ${option.color} text-white`
                            : 'border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${
                            selectedMeals === option.value
                              ? 'bg-white/20'
                              : 'bg-white dark:bg-gray-700'
                          }`}>
                            {option.icon}
                          </div>
                          <span className="font-medium">{option.label}</span>
                        </div>
                        {selectedMeals === option.value && (
                          <CheckCircle className="h-5 w-5" />
                        )}
                      </motion.button>
                    ))}
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          Why track meals?
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          This helps us provide personalized nutrition recommendations and track your eating patterns.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowEatingModal(false)}
                    className="flex-1 px-4 py-3 border-2 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    disabled={creatingEatingDay}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateEatingDay}
                    disabled={creatingEatingDay}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    {creatingEatingDay ? (
                      <div className="flex items-center justify-center gap-2">
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span>Creating...</span>
                      </div>
                    ) : (
                      'Continue to Nutrition'
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Dashboard */}
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
                x: [0, Math.sin(index) * 60, 0],
                y: [0, Math.cos(index) * 60, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: orb.duration,
                repeat: Infinity,
                delay: orb.delay || 0,
                ease: "easeInOut"
              }}
            />
          ))}

          {/* Floating AI Elements */}
          {floatingElements.map((element, index) => {
            const Icon = element.icon
            return (
              <motion.div
                key={index}
                className="absolute text-gray-400/5 dark:text-gray-600/10"
                style={{
                  left: `${element.x}%`,
                  top: `${element.y}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  rotate: [0, 5, 0, -5, 0],
                }}
                transition={{
                  duration: 6 + index,
                  repeat: Infinity,
                  delay: element.delay,
                  ease: "easeInOut"
                }}
              >
                <Icon size={element.size} />
              </motion.div>
            )
          })}
        </div>

        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000002_1px,transparent_1px),linear-gradient(to_bottom,#00000002_1px,transparent_1px)] bg-[size:40px_40px] opacity-30" />

        {/* Neural Network Background */}
        <svg className="absolute inset-0 w-full h-full opacity-5">
          <defs>
            <linearGradient id="neural-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.path
              key={i}
              d={`M ${Math.random() * 100} ${Math.random() * 100} 
                  C ${Math.random() * 100} ${Math.random() * 100},
                    ${Math.random() * 100} ${Math.random() * 100},
                    ${Math.random() * 100} ${Math.random() * 100}`}
              fill="none"
              stroke="url(#neural-gradient)"
              strokeWidth="0.5"
              strokeDasharray="5,5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{
                duration: 10 + Math.random() * 10,
                repeat: Infinity,
                delay: Math.random() * 5
              }}
            />
          ))}
        </svg>

        <div className="container relative mx-auto px-4 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <motion.div 
                  className="flex items-center gap-3 mb-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="relative">
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur"
                    />
                    <motion.div
                      whileHover={{ rotate: 12, scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="relative p-2.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"
                    >
                      <Brain className="h-6 w-6 text-white" />
                    </motion.div>
                  </div>
                  <div>
                    <motion.h1 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-3xl font-bold text-gray-900 dark:text-white"
                    >
                      Welcome back, <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">{user?.name || user?.email?.split('@')[0]}</span>
                    </motion.h1>
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="text-gray-600 dark:text-gray-400"
                    >
                      {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </motion.p>
                  </div>
                </motion.div>
              </div>
              
              <motion.div 
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push('/myhealthProfile')}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                >
                  Edit Profile
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push('/mymedicalProfile')}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                >
                  Medical Profile
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="group relative px-4 py-2.5 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all hover:scale-[1.02] flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </motion.button>
              </motion.div>
            </div>
          </motion.div>

          {/* AI Insights Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mb-6"
          >
          <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl p-6 border border-blue-200/50 dark:border-blue-800/50 relative overflow-hidden">
  {/* Animated background effect */}
  <div className="absolute inset-0 opacity-10">
    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 animate-pulse" />
  </div>
  
  <div className="relative z-10">
    <div className="flex items-start gap-4 mb-4">
      <motion.div
        animate={{ rotate: [0, 10, 0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl shadow-lg"
      >
        <BrainCircuit className="h-6 w-6 text-white" />
      </motion.div>
      
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
            AI Health Assistant
          </span>
          <motion.div
            animate={{ scale: [0.9, 1,0.9] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            className="flex items-center gap-1.5"
          >
            <div className="h-2 w-2 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full" />
            <span className="px-2.5 py-0.5 text-xs bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-700 dark:text-emerald-300 rounded-full font-medium">
              LIVE AI
            </span>
          </motion.div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-50/30 to-purple-50/30 dark:from-gray-800/30 dark:to-purple-900/10 rounded-xl p-4 mb-4 border border-blue-100/50 dark:border-purple-800/30">
          <div className="flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-blue-500 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-gray-800 dark:text-gray-100 font-medium mb-1">Today's AI Insight</p>
              <p className="text-gray-700 dark:text-gray-300 text-sm">{aiInsights.dailyTip}</p>
            </div>
          </div>
        </div>
        
        {/* Action Buttons Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* AI Dashboard Button */}
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push('/MyAiDashboard')}
            className="group relative overflow-hidden px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2.5"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            <LineChart className="h-4.5 w-4.5" />
            <span className="text-sm">AI Dashboard</span>
            <ChevronRight className="h-3.5 w-3.5 opacity-70 group-hover:translate-x-1 transition-transform" />
          </motion.button>
          
          {/* MedMind Chatbot Button */}
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push('/MedMindChatbotAI')}
            className="group relative overflow-hidden px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2.5"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            <MessageSquare className="h-4.5 w-4.5" />
            <span className="text-sm">AI Chat Assistant</span>
            <motion.div
              animate={{ x: [0, 2, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="ml-1"
            >
              <ChevronRight className="h-3.5 w-3.5 opacity-70" />
            </motion.div>
          </motion.button>
        </div>
        
        {/* Quick Stats */}
        <div className="mt-4 pt-4 border-t border-blue-100/50 dark:border-purple-800/30">
          <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <Cpu className="h-3.5 w-3.5 text-blue-500" />
                <span>Quantum AI</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-emerald-500" />
                <span>Secure</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-amber-500" />
              <span>Real-time</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
          </motion.div>

          {/* Animated Motivation Message */}
          <AnimatePresence>
            {showMotivation && scoreMessage && (
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                className="mb-6"
              >
                <div className={`bg-gradient-to-r ${scoreMessage.gradient} p-6 rounded-2xl shadow-lg overflow-hidden`}>
                  {/* Animated background particles */}
                  <div className="absolute inset-0">
                    {[...Array(10)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-white/20 rounded-full"
                        initial={{ x: Math.random() * 100 + '%', y: Math.random() * 100 + '%', scale: 0 }}
                        animate={{
                          x: [null, Math.random() * 100 + '%'],
                          y: [null, Math.random() * 100 + '%'],
                          scale: [0, 1, 0]
                        }}
                        transition={{
                          duration: 3 + Math.random() * 2,
                          repeat: Infinity,
                          delay: Math.random() * 2
                        }}
                      />
                    ))}
                  </div>
                  
                  <div className="relative z-10 flex items-center gap-4">
                    <motion.div
                      animate={{ rotate: [0, 10, 0, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-3xl"
                    >
                      {scoreMessage.emoji}
                    </motion.div>
                    <div className="flex-1">
                      <motion.h2 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-2xl font-bold text-white"
                      >
                        {scoreMessage.message}
                      </motion.h2>
                      <motion.p 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-white/90"
                      >
                        {scoreMessage.subtext}
                      </motion.p>
                    </div>
                    <motion.div 
                      key={totalScore}
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring" }}
                      className="text-4xl font-bold text-white/20"
                    >
                      {totalScore}
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Health Score & Today's Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
          >
            {/* Health Score Card */}
            <div className="lg:col-span-2 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-lg p-6 relative overflow-hidden">
              {/* Animated border */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
              
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Today's Health Score</h2>
                  <p className="text-gray-600 dark:text-gray-400">Combined nutrition & activity performance</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <motion.div
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-2 h-2 bg-green-500 rounded-full"
                    />
                    <span>Updated just now</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="h-50 w-50">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="8"
                        strokeLinecap="round"
                      />
                      <motion.circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="url(#health-gradient)"
                        strokeWidth="8"
                        strokeLinecap="round"
                        initial={{ strokeDashoffset: 251.2 }}
                        animate={{ strokeDashoffset: 251.2 - (251.2 * totalScore) / 100 }}
                        transition={{ duration: 2, ease: "easeOut" }}
                        strokeDasharray="251.2"
                        transform="rotate(-90 50 50)"
                      />
                      <defs>
                        <linearGradient id="health-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#3b82f6" />
                          <stop offset="100%" stopColor="#8b5cf6" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <motion.span 
                        key={totalScore}
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                      >
                        {totalScore}
                      </motion.span>
                      <span className="text-sm text-white dark:text-white">out of 100</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Nutrition Score</span>
                      <span className="text-sm font-bold text-green-600">
                        {dashboardData?.eating_day?.nutrition_score?.toFixed(1) || 'N/A'}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${dashboardData?.eating_day?.nutrition_score || 0}%` }}
                        transition={{ duration: 1.5, delay: 0.3 }}
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Activity Score</span>
                      <span className="text-sm font-bold text-blue-600">
                        {todaysActivity?.activity_score?.toFixed(1) || 'N/A'}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${todaysActivity?.activity_score || 0}%` }}
                        transition={{ duration: 1.5, delay: 0.4 }}
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Consistency Streak</span>
                      <span className="text-sm font-bold text-amber-600 flex items-center gap-1">
                        <Flame className="h-4 w-4" />
                        {streak} days
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(streak * 10, 100)}%` }}
                        transition={{ duration: 1.5, delay: 0.5 }}
                        className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Today's Quick Stats */}
            <div className="space-y-6">
              <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl p-6 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">BMI Status</p>
                    <motion.p 
                      key={calculateBMI().toFixed(1)}
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      className="text-2xl font-bold text-gray-900 dark:text-white"
                    >
                      {calculateBMI().toFixed(1)}
                    </motion.p>
                  </div>
                  <motion.div 
                    whileHover={{ rotate: 12 }}
                    className={`p-3 rounded-xl ${getBMICategory(calculateBMI()).bgColor}`}
                  >
                    <Activity className={`h-6 w-6 ${getBMICategory(calculateBMI()).color}`} />
                  </motion.div>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 relative z-10">
                  {getBMICategory(calculateBMI()).category}
                </div>
              </div>

              <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl p-6 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="flex items-center justify-between relative z-10">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Today's Meals</p>
                    <motion.p 
                      key={dashboardData?.eating_day?.number_of_meals || 0}
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      className="text-2xl font-bold text-gray-900 dark:text-white"
                    >
                      {dashboardData?.eating_day?.number_of_meals || 0}
                    </motion.p>
                  </div>
                  <motion.div 
                    whileHover={{ rotate: 12 }}
                    className="p-3 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl"
                  >
                    <Utensils className="h-6 w-6 text-white" />
                  </motion.div>
                </div>
                {!dashboardData?.eating_day && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowEatingModal(true)}
                    className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg text-sm font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
                  >
                    Log Today's Meals
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>

          {/* AI Health Predictions */}
          {aiInsights.healthPredictions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="mb-8"
            >
              <div className="bg-gradient-to-r from-emerald-500/5 via-green-500/5 to-teal-500/5 rounded-2xl p-6 border border-emerald-200/50 dark:border-emerald-800/50">
                <div className="flex items-center gap-3 mb-4">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="p-2.5 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg"
                  >
                    <TrendingUp className="h-5 w-5 text-white" />
                  </motion.div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      AI Health Projections
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Based on your current progress
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {aiInsights.healthPredictions.map((prediction, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-4"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                        <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                          {prediction.split(':')[0]}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {prediction.split(':')[1]}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
      {todaysActivity && <EnhancedLiveHealthStats activityDay={normalizedActivityDay} />}
         

          {/* Health Tips Carousel */}
          {healthTips.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="mb-8"
            >
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6 relative overflow-hidden">
                {/* Animated background */}
                <div className="absolute inset-0">
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-blue-400/20 rounded-full"
                      initial={{ x: Math.random() * 100 + '%', y: Math.random() * 100 + '%', scale: 0 }}
                      animate={{
                        x: [null, Math.random() * 100 + '%'],
                        y: [null, Math.random() * 100 + '%'],
                        scale: [0, 1, 0]
                      }}
                      transition={{
                        duration: 4 + Math.random() * 2,
                        repeat: Infinity,
                        delay: Math.random() * 3
                      }}
                    />
                  ))}
                </div>
                
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <Sparkles className="h-5 w-5 text-blue-500" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Personalized Health Tips
                    </h3>
                  </div>
                  
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentTipIndex}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.5 }}
                      className="flex items-center gap-4"
                    >
                      <div className="flex-1">
                        <p className="text-gray-700 dark:text-gray-300">
                          {healthTips[currentTipIndex]}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        {healthTips.map((_, index) => (
                          <motion.button
                            key={index}
                            whileHover={{ scale: 1.2 }}
                            onClick={() => setCurrentTipIndex(index)}
                            className={`w-2 h-2 rounded-full transition-all ${
                              index === currentTipIndex
                                ? 'bg-blue-500 w-4'
                                : 'bg-gray-300 dark:bg-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}

          {/* Profile & Medical Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.1 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
          >
            {/* Health Profile Card */}
            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-lg p-6 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="flex items-center justify-between mb-6 relative z-10">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-500" />
                  Health Profile
                </h3>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push('/myhealthProfile')}
                  className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  Edit
                </motion.button>
              </div>
              
              {dashboardData?.profile && (
                <div className="space-y-4 relative z-10">
                  <div className="grid grid-cols-2 gap-4">
                    <motion.div
                      whileHover={{ y: -2 }}
                      className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
                    >
                      <p className="text-xs text-gray-600 dark:text-gray-400">Age</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{dashboardData.profile.age} years</p>
                    </motion.div>
                    <motion.div
                      whileHover={{ y: -2 }}
                      className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg"
                    >
                      <p className="text-xs text-gray-600 dark:text-gray-400">Weight</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{dashboardData.profile.weight} kg</p>
                    </motion.div>
                    <motion.div
                      whileHover={{ y: -2 }}
                      className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg"
                    >
                      <p className="text-xs text-gray-600 dark:text-gray-400">Height</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{dashboardData.profile.height} cm</p>
                    </motion.div>
                    <motion.div
                      whileHover={{ y: -2 }}
                      className="p-3 bg-pink-50 dark:bg-pink-900/20 rounded-lg"
                    >
                      <p className="text-xs text-gray-600 dark:text-gray-400">Gender</p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {dashboardData.profile.sex === 'M' ? 'Male' : dashboardData.profile.sex === 'F' ? 'Female' : 'Other'}
                      </p>
                    </motion.div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Last updated</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {new Date(dashboardData.profile.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Medical Profile Card */}
            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-lg p-6 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-rose-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="flex items-center justify-between mb-6 relative z-10">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <HeartPulse className="h-5 w-5 text-red-500" />
                  Medical Profile
                </h3>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push('/mymedicalProfile')}
                  className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  Edit
                </motion.button>
              </div>
              
              {dashboardData?.medical && (
                <div className="space-y-4 relative z-10">
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Allergies</p>
                      <div className="flex flex-wrap gap-2">
                        {dashboardData.medical.allergies.slice(0, 3).map((allergy, index) => (
                          <motion.span 
                            key={index}
                            whileHover={{ scale: 1.05 }}
                            className="px-2 py-1 text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded"
                          >
                            {allergy}
                          </motion.span>
                        ))}
                        {dashboardData.medical.allergies.length > 3 && (
                          <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded">
                            +{dashboardData.medical.allergies.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Conditions</p>
                      <div className="flex flex-wrap gap-2">
                        {dashboardData.medical.maladies.map((malady, index) => (
                          <motion.span 
                            key={index}
                            whileHover={{ scale: 1.05 }}
                            className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded"
                          >
                            {malady}
                          </motion.span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
                    <div className="text-center">
                      <motion.div 
                        whileHover={{ scale: 1.1 }}
                        className={`inline-flex items-center justify-center w-8 h-8 rounded-full mb-1 ${
                          dashboardData.medical.is_smoker ? 'bg-red-100 dark:bg-red-900/30' : 'bg-green-100 dark:bg-green-900/30'
                        }`}
                      >
                        <AlarmSmokeIcon className={`h-4 w-4 ${
                          dashboardData.medical.is_smoker ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'
                        }`} />
                      </motion.div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Smoker</p>
                    </div>
                    <div className="text-center">
                      <motion.div 
                        whileHover={{ scale: 1.1 }}
                        className={`inline-flex items-center justify-center w-8 h-8 rounded-full mb-1 ${
                          dashboardData.medical.is_alcoholic ? 'bg-amber-100 dark:bg-amber-900/30' : 'bg-green-100 dark:bg-green-900/30'
                        }`}
                      >
                        <Wine className={`h-4 w-4 ${
                          dashboardData.medical.is_alcoholic ? 'text-amber-600 dark:text-amber-400' : 'text-green-600 dark:text-green-400'
                        }`} />
                      </motion.div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Alcohol</p>
                    </div>
                    <div className="text-center">
                      <motion.div 
                        whileHover={{ scale: 1.1 }}
                        className={`inline-flex items-center justify-center w-8 h-8 rounded-full mb-1 ${
                          dashboardData.medical.is_drugging ? 'bg-purple-100 dark:bg-purple-900/30' : 'bg-green-100 dark:bg-green-900/30'
                        }`}
                      >
                        <Pill className={`h-4 w-4 ${
                          dashboardData.medical.is_drugging ? 'text-purple-600 dark:text-purple-400' : 'text-green-600 dark:text-green-400'
                        }`} />
                      </motion.div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Drugs</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Quick Actions & Nutrition */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Today's Actions
              </h2>
              {dashboardData?.eating_day && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push('/my-nutritionState')}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg text-sm font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
                >
                  View Nutrition History
                </motion.button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { 
                  icon: Apple, 
                  title: 'Nutrition', 
                  desc: dashboardData?.eating_day ? `Tracked ${dashboardData.eating_day.number_of_meals} meals` : 'Log your meals', 
                  color: 'from-emerald-500 to-green-500',
                  action: dashboardData?.eating_day 
                    ? () => router.push('/today-nutrition')
                    : () => setShowEatingModal(true),
                  status: dashboardData?.eating_day ? 'complete' : 'pending'
                },
                { 
                  icon: Dumbbell, 
                  title: 'Activity', 
                  desc: dashboardData?.activity_day ? 'Activity logged' : 'Log your workout', 
                  color: 'from-blue-500 to-cyan-500',
                  action: () => router.push('/activity-today'),
                  status: dashboardData?.activity_day ? 'complete' : 'pending'
                },
                { 
                  icon: Droplets, 
                  title: 'Hydration', 
                  desc: 'Track water intake', 
                  color: 'from-cyan-500 to-blue-500',
                  action: () => router.push('/today-nutrition'),
                 status: dashboardData?.eating_day ? 'complete' : 'pending'
                },
                { 
                  icon: Moon, 
                  title: 'Sleep', 
                  desc: 'Log sleep quality', 
                  color: 'from-purple-500 to-pink-500',
                  action: () => router.push('/activity-today'),
                  status: dashboardData?.activity_day ? 'complete' : 'pending'
                },
              ].map((item, index) => (
                <motion.button
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  onClick={item.action}
                  className="group relative overflow-hidden rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-6 text-left hover:shadow-2xl transition-all duration-300"
                >
                  {/* Hover gradient effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Animated border */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <motion.div
                        whileHover={{ rotate: 12, scale: 1.1 }}
                        className={`p-3 bg-gradient-to-br ${item.color} rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300`}
                      >
                        <item.icon className="h-6 w-6 text-white" />
                      </motion.div>
                      <div className={`px-2 py-1 text-xs rounded-full ${
                        item.status === 'complete' 
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                      }`}>
                        {item.status === 'complete' ? '✓ Done' : '→ Pending'}
                      </div>
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{item.desc}</p>
                    <div className="flex items-center text-sm font-medium text-blue-600 dark:text-blue-400">
                      <span>{item.status === 'complete' ? 'View details' : 'Get started'}</span>
                      <motion.div
                        animate={{ x: [0, 2, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="ml-1"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </motion.div>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* AI Improvement Areas */}
          {aiInsights.improvementAreas.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.3 }}
              className="mb-8"
            >
              <div className="bg-gradient-to-r from-amber-500/5 to-orange-500/5 rounded-2xl p-6 border border-amber-200/50 dark:border-amber-800/50">
                <div className="flex items-center gap-3 mb-4">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="p-2.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg"
                  >
                    <Target className="h-5 w-5 text-white" />
                  </motion.div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      AI-Suggested Improvements
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Areas to focus on for optimal health
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {aiInsights.improvementAreas.map((area, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="flex items-center gap-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-xl"
                    >
                      <div className="w-2 h-2 bg-amber-500 rounded-full" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{area}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Today's Eating Day Status */}
          {dashboardData?.eating_day && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.4 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Today's Meals ({dashboardData.eating_day.number_of_meals})
              </h2>
              <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {dashboardData.eating_day.meals.map((meal: any) => (
                    <motion.div
                      key={meal.id}
                      whileHover={{ y: -5 }}
                      className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <motion.div
                          whileHover={{ rotate: 12 }}
                          className="p-2 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg"
                        >
                          {getMealIcons(meal.meal_type)}
                        </motion.div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white capitalize">
                            {meal.meal_type}
                          </h4>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {meal.foods.length} foods logged
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {meal.foods.length > 0 ? (
                          meal.foods.slice(0, 2).map((food: any, index: number) => (
                            <div key={index} className="flex items-center justify-between text-sm">
                              <span className="text-gray-700 dark:text-gray-300 truncate">{food.name}</span>
                              <span className="text-gray-600 dark:text-gray-400">{food.calories} cal</span>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                            No foods logged yet
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => router.push(`/today-nutrition?meal=${meal.meal_type}`)}
                        className="w-full mt-4 px-3 py-2 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                      >
                        {meal.foods.length > 0 ? 'Edit foods' : 'Add foods'}
                      </button>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Nutrition Score</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {dashboardData.eating_day.nutrition_score.toFixed(1)}
                      </p>
                    </div>
                    <button
                      onClick={() => router.push('/today-nutrition')}
                      className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
                    >
                      Complete Nutrition Log
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Activity Tracking Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.5 }}
            className="mb-8"
          >
            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur"
                    />
                    <div className="relative p-2.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full">
                      <Activity className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Daily Activity</h2>
                    <p className="text-gray-600 dark:text-gray-400">Track your sleep and physical activity</p>
                  </div>
                </div>
                
                {todaysActivity ? (
                  <div className="flex items-center gap-3">
                    <div className={`px-4 py-2 rounded-full text-sm font-medium ${todaysActivity.active_general ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'}`}>
                      {todaysActivity.active_general ? 'Active Day' : 'Rest Day'}
                    </div>
                    <button
                      onClick={() => router.push('/activity-today')}
                      className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all"
                    >
                      View Details
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setTrackingActivity(true)}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all"
                  >
                    Track Today's Activity
                  </button>
                )}
              </div>

              {todaysActivity ? (
                <div className="space-y-6">
                  {/* Sleep Tracking */}
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <Moon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      Sleep Tracking
                    </h3>
                    {todaysActivity.sleep_start && todaysActivity.sleep_end ? (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
                          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Sleep Start</div>
                          <div className="text-xl font-bold text-gray-900 dark:text-white">
                            {activityService.formatTime(todaysActivity.sleep_start)}
                          </div>
                        </div>
                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
                          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Sleep End</div>
                          <div className="text-xl font-bold text-gray-900 dark:text-white">
                            {activityService.formatTime(todaysActivity.sleep_end)}
                          </div>
                        </div>
                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
                          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Sleep Duration</div>
                          <div className="text-xl font-bold text-gray-900 dark:text-white">
                            {activityService.calculateSleepDuration(todaysActivity.sleep_start, todaysActivity.sleep_end)}h
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                        <p className="text-gray-600 dark:text-gray-400">No sleep data recorded yet</p>
                      </div>
                    )}
                  </div>

                  {/* Sports Activities */}
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <Dumbbell className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      Sports Activities
                    </h3>
                    {todaysActivity.sports && todaysActivity.sports.length > 0 ? (
                      <div className="space-y-3">
                        {todaysActivity.sports.map((sport, index) => (
                          <motion.div
                            key={sport.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <motion.div
                                  whileHover={{ rotate: 12 }}
                                  className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500/10 to-blue-500/10 flex items-center justify-center"
                                >
                                  <span className="text-xl" >{getSportIcon(sport.sport_type)} </span>
                                </motion.div>
                                <div>
                                  <div className="font-medium text-gray-900 dark:text-white">{sport.sport_type}</div>
                                  <div className="text-sm text-gray-500 dark:text-gray-400">
                                    {sport.duration_minutes} minutes • {sport.calories_burned} calories burned
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                        <p className="text-gray-600 dark:text-gray-400">No sports activities recorded yet</p>
                      </div>
                    )}
                  </div>

                  {/* Activity Score */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900 dark:text-white">Activity Score</h3>
                      <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {todaysActivity.activity_score.toFixed(1)}
                      </span>
                    </div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${todaysActivity.activity_score >= 80 ? 'bg-gradient-to-r from-emerald-500 to-green-500' :
                          todaysActivity.activity_score >= 60 ? 'bg-gradient-to-r from-green-500 to-lime-500' :
                          todaysActivity.activity_score >= 40 ? 'bg-gradient-to-r from-yellow-500 to-amber-500' :
                          'bg-gradient-to-r from-orange-500 to-red-500'}`}
                        style={{ width: `${todaysActivity.activity_score}%` }}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="mb-4">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="h-16 w-16 mx-auto rounded-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center"
                    >
                      <Activity className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    </motion.div>
                  </div>
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Track Your Daily Activity
                  </h4>
                  <p className="text-gray-500 dark:text-gray-400 text-sm max-w-md mx-auto mb-6">
                    Monitor your sleep patterns and physical activities to maintain a healthy lifestyle.
                  </p>
                  <button
                    onClick={() => setTrackingActivity(true)}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all"
                  >
                    Start Tracking
                  </button>
                </div>
              )}
            </div>
          </motion.div>

          {/* Activity Tracking Modal */}
          <AnimatePresence>
            {trackingActivity && (
              <ActivityTrackingModal
                onClose={() => setTrackingActivity(false)}
                onSave={async (data) => {
                  try {
                    const activity = await activityService.createActivityDay(data)
                    setTodaysActivity(activity)
                    setTrackingActivity(false)
                    setSuccess('Activity tracked successfully!')
                    setTimeout(() => setSuccess(null), 3000)
                  } catch (error: any) {
                    setError(error.message || 'Failed to track activity')
                    setTimeout(() => setError(null), 3000)
                  }
                }}
              />
            )}
          </AnimatePresence>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.6 }}
            className="text-center pt-8 border-t border-gray-200/50 dark:border-gray-800/50"
          >
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2"
              >
                <Shield className="h-3 w-3" />
                <span>HIPAA Compliant</span>
              </motion.div>
              <div className="h-4 w-px bg-gray-300 dark:bg-gray-700" />
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2"
              >
                <BrainCircuit className="h-3 w-3" />
                <span>AI-Powered Insights</span>
              </motion.div>
              <div className="h-4 w-px bg-gray-300 dark:bg-gray-700" />
              <div>Last updated: Just now</div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  )
}