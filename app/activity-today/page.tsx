'use client'

import { useEffect, useState, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion'
import {
  Activity, Dumbbell, Moon, Clock, TrendingUp,
  Plus, Trash2, ChevronLeft, RefreshCw, CheckCircle,
  AlertCircle, Zap, Target, Flame, ArrowRight, X,
  ChevronDown, Brain, HeartPulse, Shield, Star,
  Award, TrendingDown, Eye, Info, Calculator,
  BarChart3, PieChart, Lightbulb, TargetIcon,
  Calendar, History, Sparkles, Rocket, ShieldCheck,
  BatteryCharging, Users, Trophy, Timer, Coffee,
  BrainCircuit, Waves, Sun, Moon as MoonIcon
} from 'lucide-react'

import {
  activityTodayService,
  type ActivityDay,
  type Sport,
  type NewSportData,
  type SleepData,
  type ActivityScoreBreakdown
} from '@/lib/activity-today'

const SPORT_TYPES = [
  { value: 'Running', icon: '🏃‍♂️', caloriesPerMin: 12 },
  { value: 'Walking', icon: '🚶‍♂️', caloriesPerMin: 5 },
  { value: 'Cycling', icon: '🚴‍♂️', caloriesPerMin: 10 },
  { value: 'Swimming', icon: '🏊‍♂️', caloriesPerMin: 11 },
  { value: 'Weight Training', icon: '🏋️‍♂️', caloriesPerMin: 8 },
  { value: 'Yoga', icon: '🧘‍♂️', caloriesPerMin: 4 },
  { value: 'Pilates', icon: '🤸‍♂️', caloriesPerMin: 5 },
  { value: 'HIIT', icon: '⚡', caloriesPerMin: 15 },
  { value: 'Boxing', icon: '🥊', caloriesPerMin: 13 },
  { value: 'Martial Arts', icon: '🥋', caloriesPerMin: 10 },
  { value: 'Dancing', icon: '💃', caloriesPerMin: 8 },
  { value: 'Basketball', icon: '🏀', caloriesPerMin: 10 },
  { value: 'Football', icon: '⚽', caloriesPerMin: 11 },
  { value: 'Tennis', icon: '🎾', caloriesPerMin: 9 },
  { value: 'Badminton', icon: '🏸', caloriesPerMin: 7 },
  { value: 'Golf', icon: '🏌️‍♂️', caloriesPerMin: 5 },
  { value: 'Hiking', icon: '🥾', caloriesPerMin: 9 },
  { value: 'Climbing', icon: '🧗‍♂️', caloriesPerMin: 12 },
  { value: 'Skiing', icon: '⛷️', caloriesPerMin: 11 },
  { value: 'Snowboarding', icon: '🏂', caloriesPerMin: 10 },
  { value: 'Skating', icon: '⛸️', caloriesPerMin: 8 },
  { value: 'Rowing', icon: '🚣‍♂️', caloriesPerMin: 12 },
  { value: 'CrossFit', icon: '💪', caloriesPerMin: 14 },
  { value: 'Zumba', icon: '🎵', caloriesPerMin: 9 },
  { value: 'Aerobics', icon: '👯‍♀️', caloriesPerMin: 7 },
  { value: 'Stretching', icon: '🤸‍♀️', caloriesPerMin: 3 },
  { value: 'Meditation', icon: '🧠', caloriesPerMin: 2 },
  { value: 'Other', icon: '🎯', caloriesPerMin: 6 }
]

const INTENSITY_LEVELS = [
  {
    value: 'low',
    label: 'Low',
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    bgColor: 'from-blue-400 to-cyan-400',
    icon: '🐢',
    multiplier: 0.7,
    description: 'Light activity, easy pace'
  },
  {
    value: 'moderate',
    label: 'Moderate',
    color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    bgColor: 'from-green-400 to-emerald-400',
    icon: '🚶‍♂️',
    multiplier: 1.0,
    description: 'Moderate effort, steady pace'
  },
  {
    value: 'high',
    label: 'High',
    color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
    bgColor: 'from-yellow-400 to-orange-400',
    icon: '🏃‍♂️',
    multiplier: 1.3,
    description: 'Vigorous activity, challenging pace'
  },
  {
    value: 'very_high',
    label: 'Very High',
    color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
    bgColor: 'from-red-400 to-pink-400',
    icon: '⚡',
    multiplier: 1.6,
    description: 'Maximum effort, intense pace'
  }
]

const SCORE_RANGES = {
  excellent: { min: 85, color: 'from-emerald-850 to-green-500', text: 'text-emerald-600 dark:text-emerald-400', label: 'Excellent', icon: '🏆' },
  good: { min: 65, color: 'from-green-800 to-lime-400', text: 'text-green-800 dark:text-green-400', label: 'Good', icon: '⭐' },
  average: { min: 45, color: 'from-orange-500 to-amber-500', text: 'text-yellow-600 dark:text-yellow-400', label: 'Average', icon: '📊' },
  poor: { min: 30, color: 'from-orange-900 to-red-500', text: 'text-orange-600 dark:text-orange-400', label: 'Needs Improvement', icon: '📉' },
  veryPoor: { min: 0, color: 'from-red-500 to-pink-500', text: 'text-red-600 dark:text-red-400', label: 'Very Poor', icon: '⚠️' }
}

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

export default function EnhancedActivityTodayPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [activityDay, setActivityDay] = useState<ActivityDay | null>(null)
  const [showAddSportModal, setShowAddSportModal] = useState(false)
  const [showEditSleepModal, setShowEditSleepModal] = useState(false)
  const [showScoreBreakdown, setShowScoreBreakdown] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [scoreBreakdown, setScoreBreakdown] = useState<ActivityScoreBreakdown | null>(null)

  const scoreX = useMotionValue(0)
  const springX = useSpring(scoreX, {
    stiffness: 100,
    damping: 30,
    mass: 0.5
  })

  const [newSport, setNewSport] = useState<NewSportData>({
    sport_type: '',
    duration_minutes: 30,
    intensity_level: 'moderate',
    calories_burned: 0,
    notes: ''
  })

  const [sleepForm, setSleepForm] = useState<SleepData>({
    sleep_start: '',
    sleep_end: '',
    active_general: true
  })

  // Calculate intelligent activity score
  const calculateIntelligentScore = useCallback((data: ActivityDay): ActivityScoreBreakdown => {
    let exerciseScore = 0
    let sleepScore = 0
    let consistencyScore = 0
    let recoveryScore = 0

    // 1. Exercise Score (40%)
    if (data.sports.length > 0) {
      const totalCalories = data.sports.reduce((sum, sport) => sum + sport.calories_burned, 0)
      const totalDuration = data.sports.reduce((sum, sport) => sum + sport.duration_minutes, 0)
      const avgIntensity = data.sports.reduce((sum, sport) => {
        const intensityValue = INTENSITY_LEVELS.find(l => l.value === sport.intensity_level)?.multiplier || 1
        return sum + intensityValue
      }, 0) / data.sports.length

      // Base score from calories (max 600 cal = 20 points)
      const calorieScore = Math.min(totalCalories / 600 * 20, 20)
      
      // Duration score (max 60 min = 10 points)
      const durationScore = Math.min(totalDuration / 60 * 10, 10)
      
      // Intensity score (max 10 points)
      const intensityScore = Math.min(avgIntensity * 5, 10)
      
      exerciseScore = calorieScore + durationScore + intensityScore
    }

    // 2. Sleep Score (30%)
    if (data.sleep_start && data.sleep_end) {
      const sleepHours = activityTodayService.calculateSleepDuration(data.sleep_start, data.sleep_end)
      
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

    // 3. Consistency Score (20%) - Based on historical patterns
    // For now, using a base score that improves with activity count
    consistencyScore = Math.min(data.sports.length * 5, 20)

    // 4. Recovery Score (10%)
    recoveryScore = data.active_general ? 
      Math.min(5 + (data.sports.length > 0 ? 5 : 0), 10) : 10

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
  }, [])

  const getScoreRange = useCallback((score: number) => {
    if (score >= SCORE_RANGES.excellent.min) return SCORE_RANGES.excellent
    if (score >= SCORE_RANGES.good.min) return SCORE_RANGES.good
    if (score >= SCORE_RANGES.average.min) return SCORE_RANGES.average
    if (score >= SCORE_RANGES.poor.min) return SCORE_RANGES.poor
    return SCORE_RANGES.veryPoor
  }, [])

  const getInsightForScore = useCallback((category: keyof typeof INSIGHT_TIPS, score: number) => {
    const tips = INSIGHT_TIPS[category]
    for (const tip of tips) {
      if (score >= tip.score) {
        return tip
      }
    }
    return tips[tips.length - 1]
  }, [])

  useEffect(() => {
    loadActivityData()
  }, [])

  useEffect(() => {
    if (activityDay) {
      const breakdown = calculateIntelligentScore(activityDay)
      setScoreBreakdown(breakdown)
      scoreX.set(breakdown.total)
    }
  }, [activityDay, calculateIntelligentScore, scoreX])

  const loadActivityData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const data = await activityTodayService.getTodayActivity()
      setActivityDay(data)
      
      setSleepForm({
        sleep_start: data.sleep_start || '',
        sleep_end: data.sleep_end || '',
        active_general: data.active_general
      })
      
    } catch (err: any) {
      if (err.message === 'No authentication token found') {
        router.push('/signin')
        return
      }
      
      if (err.message.includes('404')) {
        await createActivityDay()
        return
      }
      
      setError(err.message || 'Failed to load activity data')
      console.error('Error loading activity data:', err)
    } finally {
      setLoading(false)
    }
  }

  const createActivityDay = async () => {
    try {
      const data = await activityTodayService.createActivityDay()
      setActivityDay(data)
      
      setSleepForm({
        sleep_start: data.sleep_start || '',
        sleep_end: data.sleep_end || '',
        active_general: data.active_general
      })
      
    } catch (err: any) {
      setError(err.message || 'Failed to create activity day')
    }
  }

  const handleAddSport = async () => {
    if (!activityDay || !newSport.sport_type || newSport.duration_minutes <= 0) {
      setError('Please fill in all required fields')
      return
    }

    try {
      setSaving(true)
      setError(null)

      const sportType = SPORT_TYPES.find(t => t.value === newSport.sport_type)
      const intensity = INTENSITY_LEVELS.find(l => l.value === newSport.intensity_level)

      const sportData = {
        ...newSport,
        calories_burned: newSport.calories_burned || Math.round(
          (sportType?.caloriesPerMin || 8) * 
          newSport.duration_minutes * 
          (intensity?.multiplier || 1)
        )
      }

      const newSportData = await activityTodayService.addSport(sportData, activityDay.id)
      
      setActivityDay(prev => prev ? {
        ...prev,
        sports: [...prev.sports, newSportData]
      } : null)

      setNewSport({
        sport_type: '',
        duration_minutes: 30,
        intensity_level: 'moderate',
        calories_burned: 0,
        notes: ''
      })
      
      setShowAddSportModal(false)
      showNotification('Sport activity added successfully! 🎉', 'success')
      
    } catch (err: any) {
      setError(err.message || 'Failed to add sport')
    } finally {
      setSaving(false)
    }
  }

  const handleUpdateSleep = async () => {
    if (!activityDay) return

    try {
      setSaving(true)
      setError(null)

      const updatedData = await activityTodayService.updateSleep(activityDay.id, sleepForm)
      setActivityDay(updatedData)
      
      setShowEditSleepModal(false)
      showNotification('Sleep data updated successfully! 😴', 'success')
      
    } catch (err: any) {
      setError(err.message || 'Failed to update sleep data')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteSport = async (sportId: number) => {
    if (!confirm('Are you sure you want to delete this sport activity?')) return

    try {
      setError(null)
      await activityTodayService.deleteSport(sportId)

      setActivityDay(prev => prev ? {
        ...prev,
        sports: prev.sports.filter(sport => sport.id !== sportId)
      } : null)

      showNotification('Sport activity deleted successfully!', 'success')
      
    } catch (err: any) {
      setError(err.message || 'Failed to delete sport')
    }
  }

  const showNotification = (message: string, type: 'success' | 'error') => {
    if (type === 'success') {
      setSuccess(message)
    } else {
      setError(message)
    }
    setTimeout(() => {
      if (type === 'success') setSuccess(null)
      else setError(null)
    }, 3000)
  }

  const calculateTotalCalories = () => {
    if (!activityDay) return 0
    return activityDay.sports.reduce((total, sport) => total + sport.calories_burned, 0)
  }

  const calculateTotalDuration = () => {
    if (!activityDay) return 0
    return activityDay.sports.reduce((total, sport) => total + sport.duration_minutes, 0)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-950">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              <div className="h-20 w-20 border-4 border-gray-200 dark:border-gray-700 rounded-full">
                <div className="absolute inset-0 border-4 border-transparent border-t-blue-500 border-r-purple-500 border-b-green-500 border-l-pink-500 rounded-full animate-spin" />
              </div>
            </motion.div>
            <div className="text-center space-y-4">
              <div className="space-y-2">
                <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse mx-auto"></div>
                <div className="h-3 w-32 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse mx-auto"></div>
              </div>
              <div className="space-y-3 pt-4">
                {[1, 2, 3].map(i => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="h-16 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse"
                  ></motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const currentScoreRange = scoreBreakdown ? getScoreRange(scoreBreakdown.total) : SCORE_RANGES.average

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-950 overflow-x-hidden">
      {/* Animated Background Particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: Math.random() * 0.5 + 0.5
            }}
            animate={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            transition={{
              duration: Math.random() * 20 + 10,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute w-1 h-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-sm"
          />
        ))}
      </div>

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
              >
                <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </motion.button>
              <div>
                <motion.h1 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-2xl font-bold text-gray-900 dark:text-white"
                >
                  Smart Activity Tracker
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="text-gray-600 dark:text-gray-400 text-sm"
                >
                  AI-powered fitness insights • {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </motion.p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowScoreBreakdown(!showScoreBreakdown)}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium text-sm hover:shadow-lg transition-all flex items-center gap-2"
              >
                <Brain className="h-4 w-4" />
                {showScoreBreakdown ? 'Hide Analysis' : 'Show Analysis'}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={loadActivityData}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
              >
                <RefreshCw className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Success/Error Messages */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md"
          >
            <div className="bg-gradient-to-r from-emerald-500 to-green-500 text-white px-6 py-4 rounded-2xl shadow-2xl mx-4 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <CheckCircle className="h-5 w-5" />
                </motion.div>
                <span className="font-medium">{success}</span>
              </div>
            </div>
          </motion.div>
        )}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md"
          >
            <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-4 rounded-2xl shadow-2xl mx-4 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5" />
                <span className="font-medium">{error}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 py-8 relative">
        {/* Main Score Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="mb-8"
        >
          <div className={`bg-gradient-to-br ${currentScoreRange.color} rounded-3xl p-8 text-white shadow-2xl transform hover:scale-[1.005] transition-transform duration-300`}>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
              <div>
                <h2 className="text-2xl font-bold mb-2">Intelligence Activity Score</h2>
                <p className="text-white/80">Multi-factor analysis of your daily performance</p>
              </div>
              <div className="flex items-center gap-30">
                <div className="flex items-center gap-2">
                  <div className="text-3xl  text-white">Overall Score</div>
                  <motion.div 
                    className="text-6xl  font-bold tracking-tight"
                    style={{ x: springX }}
                  >
                    {scoreBreakdown?.total.toFixed(1) || '0.0'}
                  </motion.div>
                </div>
                <div className="h-16 w-px bg-white/30"></div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{currentScoreRange.icon}</span>
                    <span className="font-semibold">{currentScoreRange.label}</span>
                  </div>
                  <div className="text-sm text-white/80">Performance Range</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span>Multi-factor Analysis</span>
                <span>{scoreBreakdown?.total.toFixed(1)} / 100</span>
              </div>
              <div className="h-8 bg-white rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${scoreBreakdown?.total || 0}%` }}
                  transition={{ duration: 1.5, type: "spring", bounce: 0.3 }}
                  className={`h-full bg-gradient-to-r ${currentScoreRange.color} rounded-full`}
                />
              </div>
              <div className="flex justify-between text-xs text-white">
                <span>0</span>
                <span>Very Poor</span>
                <span>Poor</span>
                <span>Average</span>
                <span>Good</span>
                <span>Excellent</span>
                <span>100</span>
              </div>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8 pt-8 border-t border-white/30"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{calculateTotalCalories()}</div>
                  <div className="text-sm text-white/80">Calories</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{calculateTotalDuration()}</div>
                  <div className="text-sm text-white/80">Minutes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{activityDay?.sports.length || 0}</div>
                  <div className="text-sm text-white/80">Activities</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {activityDay?.sleep_start && activityDay?.sleep_end 
                      ? activityTodayService.calculateSleepDuration(activityDay.sleep_start, activityDay.sleep_end).toFixed(1)
                      : '0.0'}h
                  </div>
                  <div className="text-sm text-white/80">Sleep</div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Score Breakdown Modal */}
        <AnimatePresence>
          {showScoreBreakdown && scoreBreakdown && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8 overflow-hidden"
            >
              <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-8 border border-gray-200 dark:border-gray-800">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                      <Brain className="h-6 w-6 text-purple-500" />
                      Score Breakdown Analysis
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      How each factor contributes to your total score
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowScoreBreakdown(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl"
                  >
                    <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  </motion.button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {/* Score Components */}
                  {[
                    {
                      label: 'Exercise',
                      score: scoreBreakdown.breakdown.exercise,
                      weight: scoreBreakdown.weights.exercise,
                      icon: '💪',
                      color: 'from-blue-500 to-cyan-500',
                      insight: getInsightForScore('exercise', scoreBreakdown.breakdown.exercise)
                    },
                    {
                      label: 'Sleep',
                      score: scoreBreakdown.breakdown.sleep,
                      weight: scoreBreakdown.weights.sleep,
                      icon: '😴',
                      color: 'from-purple-500 to-pink-500',
                      insight: getInsightForScore('sleep', scoreBreakdown.breakdown.sleep)
                    },
                    {
                      label: 'Consistency',
                      score: scoreBreakdown.breakdown.consistency,
                      weight: scoreBreakdown.weights.consistency,
                      icon: '📅',
                      color: 'from-green-500 to-emerald-500',
                      insight: getInsightForScore('consistency', scoreBreakdown.breakdown.consistency)
                    },
                    {
                      label: 'Recovery',
                      score: scoreBreakdown.breakdown.recovery,
                      weight: scoreBreakdown.weights.recovery,
                      icon: '⚖️',
                      color: 'from-amber-500 to-orange-500',
                      insight: getInsightForScore('recovery', scoreBreakdown.breakdown.recovery)
                    }
                  ].map((component, index) => (
                    <motion.div
                      key={component.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -5 }}
                      className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800/50 dark:to-gray-900/50 rounded-2xl p-6 border border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{component.icon}</span>
                          <div>
                            <div className="font-semibold text-gray-900 dark:text-white">
                              {component.label}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              Weight: {component.weight}%
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-900 dark:text-white">
                            {component.score.toFixed(1)}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            / {component.weight}.0
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(component.score / component.weight) * 100}%` }}
                            transition={{ duration: 1, delay: index * 0.1 }}
                            className={`h-full bg-gradient-to-r ${component.color} rounded-full`}
                          />
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 pt-3 border-t border-gray-200 dark:border-gray-700">
                          <Lightbulb className="h-4 w-4 text-amber-500" />
                          <span>{component.insight.tip}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Improvement Tips */}
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl p-6">
                  <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-blue-500" />
                    Personalized Improvement Tips
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { 
                        title: 'Boost Exercise Score',
                        tips: ['Add 15 minutes of cardio', 'Increase workout intensity', 'Try new sports'],
                        icon: '⚡'
                      },
                      { 
                        title: 'Improve Sleep Quality',
                        tips: ['Maintain consistent bedtime', 'Avoid screens before sleep', 'Dark, cool room'],
                        icon: '🌙'
                      },
                      { 
                        title: 'Enhance Consistency',
                        tips: ['Schedule workouts', 'Set daily reminders', 'Track streaks'],
                        icon: '🔥'
                      },
                      { 
                        title: 'Optimize Recovery',
                        tips: ['Add active rest days', 'Stay hydrated', 'Proper nutrition'],
                        icon: '⚖️'
                      }
                    ].map((tip, index) => (
                      <motion.div
                        key={tip.title}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white/50 dark:bg-gray-900/50 rounded-xl p-4"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-xl">{tip.icon}</span>
                          <div className="font-semibold text-gray-900 dark:text-white">
                            {tip.title}
                          </div>
                        </div>
                        <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                          {tip.tips.map((t, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                              {t}
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Sleep & Activities */}
          <div className="lg:col-span-2 space-y-8">
            {/* Sleep Tracking Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-8 border border-gray-200 dark:border-gray-800"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <motion.div 
                    whileHover={{ rotate: 15, scale: 1.1 }}
                    className="p-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl"
                  >
                    <Moon className="h-6 w-6 text-white" />
                  </motion.div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Sleep Intelligence</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Track and optimize your sleep patterns</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowEditSleepModal(true)}
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                >
                  {activityDay?.sleep_start ? 'Optimize Sleep' : 'Start Tracking'}
                </motion.button>
              </div>

              {activityDay?.sleep_start && activityDay?.sleep_end ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {[
                      { 
                        label: 'Sleep Start', 
                        value: activityTodayService.formatTime(activityDay.sleep_start), 
                        icon: '🌙',
                        score: scoreBreakdown?.breakdown.sleep || 0
                      },
                      { 
                        label: 'Sleep End', 
                        value: activityTodayService.formatTime(activityDay.sleep_end), 
                        icon: '☀️',
                        score: scoreBreakdown?.breakdown.sleep || 0
                      },
                      { 
                        label: 'Sleep Quality', 
                        value: `${scoreBreakdown?.breakdown.sleep ? (scoreBreakdown.breakdown.sleep / 30 * 100).toFixed(0) : '0'}%`,
                        icon: '⭐',
                        score: scoreBreakdown?.breakdown.sleep || 0
                      }
                    ].map((item, index) => (
                      <motion.div
                        key={item.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                        whileHover={{ scale: 1.02 }}
                        className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl p-5"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="text-2xl">{item.icon}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">{item.label}</div>
                          </div>
                          <div className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                            +{Math.round(item.score)} pts
                          </div>
                        </div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">{item.value}</div>
                      </motion.div>
                    ))}
                  </div>
                  
                  <div className="pt-6 border-t border-gray-200 dark:border-gray-800">
                    <div className="flex items-center justify-between">
                      <div className="text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Sleep Impact: </span>
                        <span className="font-medium text-blue-600 dark:text-blue-400">
                          {scoreBreakdown?.breakdown.sleep ? (scoreBreakdown.breakdown.sleep / 30 * 100).toFixed(0) : '0'}% of total score
                        </span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Recommendation: </span>
                        <span className="font-medium text-emerald-600 dark:text-emerald-400">
                          {getInsightForScore('sleep', scoreBreakdown?.breakdown.sleep || 0).tip}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-10"
                >
                  <div className="mb-6">
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="h-20 w-20 mx-auto rounded-full bg-gradient-to-br from-blue-500/10 to-cyan-500/10 flex items-center justify-center"
                    >
                      <Moon className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                    </motion.div>
                  </div>
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Track Your Sleep Patterns
                  </h4>
                  <p className="text-gray-500 dark:text-gray-400 text-sm max-w-md mx-auto mb-8">
                    Sleep contributes 30% to your activity score. Track your sleep to improve recovery and performance.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowEditSleepModal(true)}
                    className="px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                  >
                    Start Sleep Tracking
                  </motion.button>
                </motion.div>
              )}
            </motion.div>

            {/* Sports Activities Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-8 border border-gray-200 dark:border-gray-800"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <motion.div 
                    whileHover={{ rotate: 15, scale: 1.1 }}
                    className="p-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl"
                  >
                    <Dumbbell className="h-6 w-6 text-white" />
                  </motion.div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Smart Workouts</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">AI-optimized activity tracking</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAddSportModal(true)}
                  className="px-5 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Smart Activity
                </motion.button>
              </div>

              {activityDay?.sports && activityDay.sports.length > 0 ? (
                <div className="space-y-4">
                  {activityDay.sports.map((sport, index) => {
                    const sportInfo = SPORT_TYPES.find(s => s.value === sport.sport_type)
                    const intensityInfo = INTENSITY_LEVELS.find(l => l.value === sport.intensity_level)
                    return (
                      <motion.div
                        key={sport.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 * index }}
                        whileHover={{ x: 5, backgroundColor: 'rgba(0,0,0,0.02)' }}
                        className="group bg-gradient-to-r from-gray-50 to-white dark:from-gray-800/50 dark:to-gray-900/50 rounded-2xl p-6 hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-5">
                            <motion.div 
                              whileHover={{ scale: 1.1, rotate: 10 }}
                              className="h-16 w-16 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 flex items-center justify-center group-hover:from-purple-500/20 group-hover:to-pink-500/20 transition-all"
                            >
                              <span className="text-3xl">{sportInfo?.icon || '🎯'}</span>
                            </motion.div>
                            <div>
                              <div className="font-semibold text-gray-900 dark:text-white text-lg">
                                {sport.sport_type}
                              </div>
                              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mt-2">
                                <span className="flex items-center gap-1.5">
                                  <Clock className="h-3.5 w-3.5" />
                                  {sport.duration_minutes} min
                                </span>
                                <span className={`px-3 py-1 rounded-full ${intensityInfo?.color}`}>
                                  {intensityInfo?.icon} {intensityInfo?.label}
                                </span>
                                <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                                  <Flame className="h-3.5 w-3.5" />
                                  {sport.calories_burned} cal
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-xs font-medium px-2 py-1 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 mb-2">
                              +{Math.round(sport.duration_minutes * (intensityInfo?.multiplier || 1) * 0.1)} pts
                            </div>
                            <div className="flex items-center gap-3">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleDeleteSport(sport.id)}
                                className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                              </motion.button>
                            </div>
                          </div>
                        </div>
                        
                        {sport.notes && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
                          >
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              💭 {sport.notes}
                            </p>
                          </motion.div>
                        )}
                      </motion.div>
                    )
                  })}
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <div className="mb-6">
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="h-20 w-20 mx-auto rounded-full bg-gradient-to-br from-purple-500/10 to-pink-500/10 flex items-center justify-center"
                    >
                      <Dumbbell className="h-10 w-10 text-purple-600 dark:text-purple-400" />
                    </motion.div>
                  </div>
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Start Your Fitness Journey
                  </h4>
                  <p className="text-gray-500 dark:text-gray-400 text-sm max-w-md mx-auto mb-8">
                    Exercise contributes 40% to your activity score. Add your first activity to begin tracking.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowAddSportModal(true)}
                    className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                  >
                    Add Your First Activity
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Right Column: Stats & Actions */}
          <div className="space-y-8">
            {/* Performance Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-8 border border-gray-200 dark:border-gray-800"
            >
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-500" />
                Performance Analytics
              </h3>
              
              <div className="space-y-6">
                {[
                  { 
                    icon: <Flame className="h-5 w-5 text-orange-500" />,
                    label: 'Calories Burned',
                    value: `${calculateTotalCalories()} cal`,
                    target: 500,
                    color: 'from-orange-500 to-red-500',
                    impact: 'Exercise Score'
                  },
                  { 
                    icon: <Clock className="h-5 w-5 text-blue-500" />,
                    label: 'Active Minutes',
                    value: `${calculateTotalDuration()} min`,
                    target: 60,
                    color: 'from-blue-500 to-cyan-500',
                    impact: 'Consistency Score'
                  },
                  { 
                    icon: <Target className="h-5 w-5 text-purple-500" />,
                    label: 'Activity Variety',
                    value: `${new Set(activityDay?.sports.map(s => s.sport_type) || []).size} types`,
                    target: 3,
                    color: 'from-purple-500 to-pink-500',
                    impact: 'Recovery Score'
                  },
                  { 
                    icon: <TrendingUp className="h-5 w-5 text-emerald-500" />,
                    label: 'Daily Progress',
                    value: `${scoreBreakdown?.total ? (scoreBreakdown.total / 100 * 100).toFixed(0) : '0'}%`,
                    target: 70,
                    color: 'from-emerald-500 to-green-500',
                    impact: 'Overall Score'
                  },
                ].map((stat, index) => {
                  const progress = Math.min(100, (parseInt(stat.value) / stat.target) * 100)
                  return (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-xl bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900">
                            {stat.icon}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">{stat.label}</div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">{stat.impact}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-gray-900 dark:text-white">{stat.value}</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">Target: {stat.target}</div>
                        </div>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 1, delay: 0.2 + (index * 0.1) }}
                          className={`h-full bg-gradient-to-r ${stat.color} rounded-full`}
                        />
                      </div>
                    </motion.div>
                  )
                })}
              </div>
              
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Score Impact Analysis</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {scoreBreakdown?.total ? Math.round(scoreBreakdown.total) : 0} points
                  </span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${scoreBreakdown?.total || 0}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-emerald-500 via-green-500 to-lime-500 rounded-full"
                  />
                </div>
              </motion.div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-8 border border-gray-200 dark:border-gray-800"
            >
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <Zap className="h-5 w-5 text-amber-500" />
                Smart Actions
              </h3>
              
              <div className="space-y-4">
                {[
                  { 
                    label: 'AI Activity Suggestion', 
                    icon: <BrainCircuit className="h-5 w-5" />,
                    color: 'from-blue-500 to-purple-500',
                    action: () => router.push('/MyAiDashboard')
                  },
                  { 
                    label: 'Optimize Sleep Schedule', 
                    icon: <MoonIcon className="h-5 w-5" />,
                    color: 'from-cyan-500 to-blue-500',
                    action: () => setShowEditSleepModal(true)
                  },
                  { 
                    label: 'Score Analysis', 
                    icon: <PieChart className="h-5 w-5" />,
                    color: 'from-green-500 to-emerald-500',
                    action: () => setShowScoreBreakdown(true)
                  },
                  { 
                    label: 'Weekly Report', 
                    icon: <Calendar className="h-5 w-5" />,
                    color: 'from-orange-500 to-amber-500',
                    action: () => router.push('/MyAiDashboard')
                  },
                ].map((action, index) => (
                  <motion.button
                    key={action.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={action.action}
                    className="w-full flex items-center justify-between p-4 bg-gradient-to-r hover:scale-[1.02] transition-all duration-300 rounded-2xl group"
                    style={{ background: `linear-gradient(135deg, var(--tw-gradient-stops))` }}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${action.color} text-white`}>
                        {action.icon}
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white">{action.label}</span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </motion.button>
                ))}
              </div>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800"
              >
                <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800/50 dark:to-gray-900/50 rounded-2xl">
                  <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl">
                    <TargetIcon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">Daily Goal</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {scoreBreakdown?.total && scoreBreakdown.total >= 70 ? '🎯 Goal achieved!' : 'Keep going!'}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Add Sport Modal */}
      <AnimatePresence>
        {showAddSportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="p-8 border-b border-gray-200 dark:border-gray-800 sticky top-0 bg-white dark:bg-gray-900 z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl">
                      <Dumbbell className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Add Smart Activity
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        AI-powered activity tracking with calorie estimation
                      </p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowAddSportModal(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl"
                  >
                    <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  </motion.button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Left Column - Form */}
                  <div className="space-y-6">
                    {/* Sport Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Sport Type *
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {SPORT_TYPES.slice(0, 8).map((type) => {
                          const isSelected = newSport.sport_type === type.value
                          return (
                            <motion.button
                              key={type.value}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              type="button"
                              onClick={() => {
                                setNewSport({ 
                                  ...newSport, 
                                  sport_type: type.value,
                                  calories_burned: type.caloriesPerMin * newSport.duration_minutes
                                })
                              }}
                              className={`p-4 rounded-2xl border-2 transition-all text-left ${
                                isSelected 
                                  ? 'border-purple-500 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20' 
                                  : 'border-gray-300 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-2xl">{type.icon}</span>
                                <div>
                                  <div className="font-semibold text-gray-900 dark:text-white">{type.value}</div>
                                  <div className="text-xs text-gray-600 dark:text-gray-400">
                                    ~{type.caloriesPerMin} cal/min
                                  </div>
                                </div>
                              </div>
                            </motion.button>
                          )
                        })}
                      </div>
                      <div className="mt-4 relative">
                        <select
                          value={newSport.sport_type}
                          onChange={(e) => {
                            const type = SPORT_TYPES.find(t => t.value === e.target.value)
                            setNewSport({ 
                              ...newSport, 
                              sport_type: e.target.value,
                              calories_burned: type ? type.caloriesPerMin * newSport.duration_minutes : 0
                            })
                          }}
                          className="w-full px-5 py-4 border-2 border-gray-300 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none"
                        >
                          <option value="">More sports...</option>
                          {SPORT_TYPES.slice(8).map((type) => (
                            <option key={type.value} value={type.value}>
                              {type.value} (~{type.caloriesPerMin} cal/min)
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                      </div>
                    </div>

                    {/* Duration & Intensity */}
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                          Duration (min)
                        </label>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              type="button"
                              onClick={() => setNewSport({ ...newSport, duration_minutes: Math.max(1, newSport.duration_minutes - 5) })}
                              className="p-3 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700"
                            >
                              -
                            </motion.button>
                            <div className="flex-1 text-center">
                              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                                {newSport.duration_minutes}
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">minutes</div>
                            </div>
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              type="button"
                              onClick={() => setNewSport({ ...newSport, duration_minutes: newSport.duration_minutes + 5 })}
                              className="p-3 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700"
                            >
                              +
                            </motion.button>
                          </div>
                          <input
                            type="range"
                            min="1"
                            max="180"
                            value={newSport.duration_minutes}
                            onChange={(e) => setNewSport({ ...newSport, duration_minutes: parseInt(e.target.value) })}
                            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-purple-500 [&::-webkit-slider-thumb]:to-pink-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                          Intensity
                        </label>
                        <div className="space-y-3">
                          {INTENSITY_LEVELS.map((level) => (
                            <motion.button
                              key={level.value}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              type="button"
                              onClick={() => {
                                setNewSport({ 
                                  ...newSport, 
                                  intensity_level: level.value as any,
                                  calories_burned: Math.round(
                                    (SPORT_TYPES.find(t => t.value === newSport.sport_type)?.caloriesPerMin || 8) * 
                                    newSport.duration_minutes * 
                                    level.multiplier
                                  )
                                })
                              }}
                              className={`w-full p-3 rounded-2xl border-2 transition-all ${
                                newSport.intensity_level === level.value 
                                  ? 'border-purple-500' 
                                  : 'border-gray-300 dark:border-gray-700'
                              } ${level.color}`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <span className="text-xl">{level.icon}</span>
                                  <span className="font-medium">{level.label}</span>
                                </div>
                                <div className="text-sm opacity-75">{level.multiplier}x</div>
                              </div>
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Preview & Notes */}
                  <div className="space-y-6">
                    {/* Calories Preview */}
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">Calorie Estimation</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            AI-powered calculation
                          </p>
                        </div>
                        <div className="text-2xl">🔥</div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Base Rate</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {SPORT_TYPES.find(t => t.value === newSport.sport_type)?.caloriesPerMin || 8} cal/min
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Intensity Multiplier</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {INTENSITY_LEVELS.find(l => l.value === newSport.intensity_level)?.multiplier || 1}x
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Duration</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {newSport.duration_minutes} min
                          </span>
                        </div>
                        <div className="pt-4 border-t border-gray-300 dark:border-gray-700">
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-bold text-gray-900 dark:text-white">Total Calories</span>
                            <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                              {newSport.calories_burned || 
                                Math.round(
                                  (SPORT_TYPES.find(t => t.value === newSport.sport_type)?.caloriesPerMin || 8) * 
                                  newSport.duration_minutes * 
                                  (INTENSITY_LEVELS.find(l => l.value === newSport.intensity_level)?.multiplier || 1)
                                )
                              } cal
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Notes */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Notes & Feelings
                      </label>
                      <textarea
                        value={newSport.notes}
                        onChange={(e) => setNewSport({ ...newSport, notes: e.target.value })}
                        rows={4}
                        placeholder="How did you feel? Any specific achievements or challenges?"
                        className="w-full px-5 py-4 border-2 border-gray-300 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                      />
                    </div>

                    {/* Score Impact Preview */}
                    {newSport.sport_type && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 text-white"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <p className="font-semibold">Score Impact</p>
                            <p className="text-purple-100/80 text-sm">
                              Estimated contribution to activity score
                            </p>
                          </div>
                          <Calculator className="h-6 w-6" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Exercise Points</span>
                            <span className="font-bold">+{
                              Math.round(
                                newSport.duration_minutes * 
                                (INTENSITY_LEVELS.find(l => l.value === newSport.intensity_level)?.multiplier || 1) * 
                                0.2
                              )
                            }</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Consistency Bonus</span>
                            <span className="font-bold">+{activityDay?.sports.length === 0 ? 5 : 2}</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-8 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 sticky bottom-0">
                <div className="flex gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowAddSportModal(false)}
                    className="flex-1 px-6 py-4 border-2 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-2xl font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    disabled={saving}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddSport}
                    disabled={saving || !newSport.sport_type || newSport.duration_minutes <= 0}
                    className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-medium hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg"
                  >
                    {saving ? (
                      <div className="flex items-center justify-center gap-3">
                        <RefreshCw className="h-5 w-5 animate-spin" />
                        <span>Saving...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-3">
                        <Plus className="h-5 w-5" />
                        <span>Add Activity</span>
                      </div>
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Sleep Modal */}
      <AnimatePresence>
        {showEditSleepModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-md"
            >
              {/* Modal Header */}
              <div className="p-8 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl">
                    <Moon className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Sleep Optimization
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Track sleep for better recovery (30% of score)
                    </p>
                  </div>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-8">
                <div className="space-y-6">
                  {/* Sleep Times */}
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Sleep Start
                      </label>
                      <input
                        type="time"
                        value={sleepForm.sleep_start || ''}
                        onChange={(e) => setSleepForm({ ...sleepForm, sleep_start: e.target.value })}
                        className="w-full px-5 py-4 border-2 border-gray-300 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Wake Up Time
                      </label>
                      <input
                        type="time"
                        value={sleepForm.sleep_end || ''}
                        onChange={(e) => setSleepForm({ ...sleepForm, sleep_end: e.target.value })}
                        className="w-full px-5 py-4 border-2 border-gray-300 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

             
                  {/* Active Day Toggle */}
                  <div className="flex items-center justify-between p-5 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                        <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">Active Day</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Affects recovery score (10%)
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setSleepForm({ ...sleepForm, active_general: !sleepForm.active_general })}
                      className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors ${
                        sleepForm.active_general ? 'bg-gradient-to-r from-blue-500 to-cyan-500' : 'bg-gray-300 dark:bg-gray-700'
                      }`}
                    >
                      <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                        sleepForm.active_general ? 'translate-x-8' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>

                  {/* Duration Preview */}
                  {sleepForm.sleep_start && sleepForm.sleep_end && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl p-6 text-white"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold">Sleep Analysis</p>
                          <p className="text-blue-100/80 text-sm">
                            Based on your sleep patterns
                          </p>
                        </div>
                        <div className="text-3xl font-bold">
                          {activityTodayService.calculateSleepDuration(sleepForm.sleep_start, sleepForm.sleep_end).toFixed(1)}h
                        </div>
                      </div>
                      <div className="mt-4 text-sm">
                        <div className="flex items-center justify-between">
                          <span>Sleep Score Impact:</span>
                          <span className="font-bold">+{
                            (() => {
                              const hours = activityTodayService.calculateSleepDuration(sleepForm.sleep_start, sleepForm.sleep_end)
                              if (hours >= 7 && hours <= 9) return 30
                              if (hours >= 6 && hours < 7) return 20 + (hours - 6) * 10
                              if (hours > 9 && hours <= 10) return 30 - (hours - 9) * 10
                              return Math.max(0, 10 - Math.abs(hours - 7.5) * 4)
                            })().toFixed(1)
                          } points</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-8 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
                <div className="flex gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowEditSleepModal(false)}
                    className="flex-1 px-6 py-4 border-2 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-2xl font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    disabled={saving}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleUpdateSleep}
                    disabled={saving}
                    className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-2xl font-medium hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg"
                  >
                    {saving ? (
                      <div className="flex items-center justify-center gap-3">
                        <RefreshCw className="h-5 w-5 animate-spin" />
                        <span>Saving...</span>
                      </div>
                    ) : (
                      'Save Sleep Data'
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}