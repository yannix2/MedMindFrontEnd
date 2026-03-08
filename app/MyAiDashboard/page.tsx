'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Brain,
  Activity,
  Utensils,
  AlertTriangle,
  Zap,
  ShieldCheckIcon,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Calendar,
  Clock,
  RefreshCw,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Shield,
  Heart,
  Sparkles,
  Target,
  CheckCircle,
  Filter,
  Download,
  Share2,
  Bookmark,
  MessageSquare,
  BrainCircuit,
  Flame,
  HeartPulse,
  Dumbbell,
  PieChart,
  AlertCircle,
  Info,
  Lightbulb,
  ThumbsUp,
  Award,
  Trophy,
  ArrowRight,
  Plus,
  Search,
  X,
  History,
  User,
  Settings,
  LogOut,
  Play,
  Pause,
  RotateCw,
  Cloud,
  CloudRain,
  Sun,
  Moon,
  Battery,
  BatteryCharging,
  Cpu,
  Database,
  LineChart,
  FileText,
  FileSpreadsheet,
  BarChart,
  Map,
  Smile,
  Frown,
  Meh,
  Check,
  XCircle,
  AlertOctagon,
  Star,
  Rocket,
  Wind,
  Waves,
  Snowflake,
  Droplet,
  Thermometer,
  Eye,
  Ear,
  Coffee,
  Pizza,
  Salad,
  Soup,
  Apple,
  Carrot,
  Fish,
  Beef,
  Egg,
  Milk,
  Sandwich,
  Cookie,
  Cake,
  Bike,
  Weight,
  Volleyball,
  Pill,
  Stethoscope,

  Bandage,
  Ambulance,
  Hospital,

  Dna,

  Bug,
  Bird,
  Flower,

} from 'lucide-react'

// Create minimal aliases
const CalendarIcon = Calendar
const ClockIcon = Clock
const CoffeeIcon = Coffee
const MoonIcon = Moon
const SunIcon = Sun
const SnowflakeIcon = Snowflake
const WavesIcon = Waves
const FishIcon = Fish
const AlertCircleIcon = AlertCircle
const ActivityIcon = Activity
const ThermometerIcon = Thermometer
const EyeIcon = Eye
const EarIcon = Ear
const PillIcon = Pill
const HeartIcon = Heart
const BrainIcon = Brain
const DumbbellIcon = Dumbbell
const WindIcon = Wind
const FlameIcon = Flame
const DropletIcon = Droplet

// For missing icons, use existing ones as substitutes
const TargetIcon = Target
const Target2 = Target
const Target3 = Target
const TrendingUpIcon = TrendingUp
const TrendingDownIcon = TrendingDown
const HeartIcon2 = Heart
const BrainIcon2 = Brain
const BasketballIcon = Target
const BoxingIcon = Shield
const MartialArtsIcon = Target
const Tree = Flower
const WhaleIcon = Fish
const TurtleIcon = Fish
const ButterflyIcon = Bird
const BeeIcon = Bug
const SpiderIcon = Bug
const SnailIcon = Bug
const CrabIcon = Bug
const OctopusIcon = Fish
const SharkIcon = Fish

import { authService } from '@/lib/auth'
import { 
  aiService, 
  AIPrediction, 
  TaskType, 
  RiskItem, 
  NutritionTip, 
  ActivityTip, 
  MotivationItem,
  FullAnalysis,
  NutritionAnalysis 
} from '@/lib/ai-service'

export default function MyAiDashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [predictions, setPredictions] = useState<AIPrediction[]>([])
  const [selectedTask, setSelectedTask] = useState<TaskType>('nutrition')
  const [viewMode, setViewMode] = useState<'today' | 'history'>('today')
  const [dateFilter, setDateFilter] = useState<string>(new Date().toISOString().split('T')[0])
  const [dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0]
  })
  const [generatingTask, setGeneratingTask] = useState<TaskType | null>(null)
  const [generatingComplete, setGeneratingComplete] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [aiProcessing, setAiProcessing] = useState(false)
  const [processingProgress, setProcessingProgress] = useState(0)
  const [showCompleteAnalysis, setShowCompleteAnalysis] = useState(false)
  const [pulseAnimation, setPulseAnimation] = useState(false)
  const [autoGenerating, setAutoGenerating] = useState(false)
  const [nextAutoGeneration, setNextAutoGeneration] = useState<string>('')
  const [exportingCSV, setExportingCSV] = useState(false)

  const taskConfig = {
    nutrition: {
      title: 'Nutrition Analysis',
      icon: Utensils,
      color: 'from-emerald-500 to-green-500',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-200 dark:border-emerald-800',
      description: 'AI-powered nutrition insights and meal recommendations',
      emptyMessage: 'No nutrition analysis available. Generate one to get personalized recommendations.'
    },
    activity: {
      title: 'Activity Analysis',
      icon: Activity,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-200 dark:border-blue-800',
      description: 'Workout optimization and activity tracking insights',
      emptyMessage: 'No activity analysis available. Generate one to get workout recommendations.'
    },
    risks: {
      title: 'Health Risks',
      icon: AlertOctagon,
      color: 'from-amber-500 to-orange-500',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-200 dark:border-amber-800',
      description: 'Potential health risks and mitigation strategies',
      emptyMessage: 'No risk analysis available. Generate one to see potential health risks.'
    },
    motivation: {
      title: 'Motivation',
      icon: Zap,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-200 dark:border-purple-800',
      description: 'Personalized motivation and goal encouragement',
      emptyMessage: 'No motivation analysis available. Generate one to get inspired.'
    },
    full: {
      title: 'Full Analysis',
      icon: Brain,
      color: 'from-indigo-500 to-purple-500',
      bgColor: 'bg-indigo-500/10',
      borderColor: 'border-indigo-200 dark:border-indigo-800',
      description: 'Complete health analysis and predictions',
      emptyMessage: 'No full analysis available. Generate one to get comprehensive insights.'
    },
    Analyze: {
      title: 'Complete Analysis',
      icon: FileSpreadsheet,
      color: 'from-rose-500 to-pink-500',
      bgColor: 'bg-rose-500/10',
      borderColor: 'border-rose-200 dark:border-rose-800',
      description: 'Deep CSV-based analysis',
      emptyMessage: 'No complete analysis available. Generate one for detailed insights.'
    }
  }

  const gradientOrbs = [
    { x: 5, y: 15, color: 'from-blue-500/20 to-cyan-500/20', size: 120, duration: 25 },
    { x: 90, y: 60, color: 'from-emerald-500/15 to-green-500/15', size: 160, duration: 30, delay: 3 },
    { x: 15, y: 80, color: 'from-purple-500/15 to-pink-500/15', size: 100, duration: 20, delay: 1 },
    { x: 85, y: 20, color: 'from-amber-500/15 to-orange-500/15', size: 140, duration: 35, delay: 2 },
    { x: 50, y: 50, color: 'from-indigo-500/10 to-blue-500/10', size: 180, duration: 40, delay: 5 },
  ]

  const floatingElements = [
    { icon: BrainCircuit, x: 10, y: 20, delay: 0, size: 24 },
    { icon: HeartPulse, x: 85, y: 30, delay: 1, size: 28 },
    { icon: Cpu, x: 20, y: 70, delay: 2, size: 22 },
    { icon: Database, x: 75, y: 65, delay: 3, size: 26 },
    { icon: LineChart, x: 40, y: 85, delay: 4, size: 24 },
  ]

  useEffect(() => {
    checkAuthAndLoadPredictions()
    
    const calculateNextAutoGen = () => {
      const now = new Date()
      const tomorrow = new Date(now)
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setHours(0, 30, 0, 0)
      
      const timeUntil = tomorrow.getTime() - now.getTime()
      const hours = Math.floor(timeUntil / (1000 * 60 * 60))
      const minutes = Math.floor((timeUntil % (1000 * 60 * 60)) / (1000 * 60))
      
      setNextAutoGeneration(`${hours}h ${minutes}m`)
    }
    
    calculateNextAutoGen()
    
    const checkAutoGen = async () => {
      try {
        setAutoGenerating(true)
        const generated = await aiService.checkAutoGeneration()
        if (generated) {
          setSuccess('Daily AI insights generated successfully!')
          setTimeout(() => setSuccess(null), 5000)
          await loadPredictions()
        }
      } catch (error) {
        console.error('Auto-generation check failed:', error)
      } finally {
        setAutoGenerating(false)
      }
    }
    
    checkAutoGen()
    
    const interval = setInterval(() => {
      calculateNextAutoGen()
    }, 60000)
    
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    loadPredictions()
  }, [viewMode, dateFilter, selectedTask])

  useEffect(() => {
    if (aiProcessing) {
      const interval = setInterval(() => {
        setProcessingProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval)
            return 100
          }
          return prev + 1
        })
      }, 100)

      return () => clearInterval(interval)
    }
  }, [aiProcessing])

  const checkAuthAndLoadPredictions = async () => {
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
      setUser(currentUser)

      await loadPredictions()
      
    } catch (error) {
      console.error('Dashboard error:', error)
      setError('Failed to load AI predictions')
      router.push('/signin')
    } finally {
      setLoading(false)
    }
  }
// In your loadPredictions function, add:
const loadPredictions = async () => {
  try {
    if (viewMode === 'today') {
      const todayPredictions = await aiService.getTodayPredictions()
      console.log('Today predictions:', todayPredictions)
      setPredictions(todayPredictions)
    } else {
      const historicalPredictions = await aiService.getPredictionsFromDate(dateFilter, selectedTask)
      console.log('Historical predictions for', selectedTask, ':', historicalPredictions)
      setPredictions(historicalPredictions)
    }
  } catch (error) {
    console.error('Error loading predictions:', error)
    setError('Failed to load predictions')
  }
}
  const generateTaskAnalysis = async (task: TaskType) => {
    try {
      setGeneratingTask(task)
      setAiProcessing(true)
      setProcessingProgress(0)
      setPulseAnimation(true)
      setError(null)
      
      const result = await aiService.generateTaskAnalysis(task)
      
      setSuccess(`${taskConfig[task].title} generated successfully!`)
      setTimeout(() => setSuccess(null), 3000)
      
      await loadPredictions()
      
    } catch (error: any) {
      setError(error.message || `Failed to generate ${task} analysis`)
    } finally {
      setGeneratingTask(null)
      setAiProcessing(false)
      setProcessingProgress(0)
      setPulseAnimation(false)
    }
  }

  const generateCompleteAnalysis = async () => {
    try {
      setGeneratingComplete(true)
      setAiProcessing(true)
      setProcessingProgress(0)
      setPulseAnimation(true)
      setError(null)
      
      const result = await aiService.generateCompleteAnalysis(dateRange.from, dateRange.to)
      
      setSuccess('Complete analysis generated successfully!')
      setTimeout(() => setSuccess(null), 3000)
      setShowCompleteAnalysis(false)
      
      await loadPredictions()
      
    } catch (error: any) {
      setError(error.message || 'Failed to generate complete analysis')
    } finally {
      setGeneratingComplete(false)
      setAiProcessing(false)
      setProcessingProgress(0)
      setPulseAnimation(false)
    }
  }

  const handleExportCSV = async () => {
    try {
      if (!user?.id) {
        setError('User ID not found')
        return
      }
      
      setExportingCSV(true)
      setError(null)
      
      // Construct the API URL
      const apiUrl = `http://127.0.0.1:8000/api/ai/export-nutrition-csv/?user_id=${user.id}&date_from=${dateRange.from}&date_to=${dateRange.to}`
      
      // Fetch the CSV file
      const response = await fetch(apiUrl)
      
      if (!response.ok) {
        throw new Error('Failed to export CSV')
      }
      
      // Get the blob and create download link
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `nutrition_data_${dateRange.from}_to_${dateRange.to}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      setSuccess('CSV exported successfully!')
      setTimeout(() => setSuccess(null), 3000)
      
    } catch (error: any) {
      setError(error.message || 'Failed to export CSV')
    } finally {
      setExportingCSV(false)
    }
  }

  const getTaskPredictions = (task: TaskType) => {
    return predictions.filter(p => p.task.toLowerCase() === task.toLowerCase())
  }

  const getLatestPrediction = (task: TaskType) => {
    const taskPredictions = getTaskPredictions(task)
    return taskPredictions[taskPredictions.length - 1]
  }

  const NutritionAnalysisComponent = ({ response }: { response: NutritionTip[] }) => {
    const foodIcons = [Apple, Carrot, Fish, Beef, Egg, Milk, Sandwich, Cookie, Cake]
    
    return (
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 mb-4 p-3 bg-gradient-to-r from-emerald-500/10 to-green-500/10 rounded-xl"
        >
          <div className="p-2 bg-gradient-to-br from-emerald-500 to-green-500 rounded-lg">
            <Utensils className="h-5 w-5 text-white" />
          </div>
          <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
            {response.length} nutrition recommendations
          </span>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {response.map((tip: NutritionTip, index: number) => {
            const FoodIcon = foodIcons[index % foodIcons.length]
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-xl border border-emerald-200 dark:border-emerald-800 bg-gradient-to-br from-emerald-50/50 to-green-50/50 dark:from-emerald-900/10 dark:to-green-900/10 p-5 hover:shadow-lg transition-all duration-300"
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-emerald-500/5 to-green-500/5 rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-500" />
                
                <div className="relative z-10">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="p-2.5 bg-gradient-to-br from-emerald-500 to-green-500 rounded-lg group-hover:rotate-12 transition-transform">
                      <FoodIcon className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 dark:text-white">{tip.tip}</h4>
                      {tip.caution && (
                        <div className="mt-2 flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400">
                          <AlertCircle className="h-3 w-3" />
                          <span>{tip.caution}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {tip.explanation}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    )
  }

const ActivityAnalysisComponent = ({ response }: { response: ActivityTip[] }) => {
  const sportsIcons = [Bike, Weight, Target, Volleyball, Shield, Target]
  
  // Debug log
  console.log('Activity response:', response)
  
  if (!Array.isArray(response) || response.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto space-y-6">
          <div className="relative">
            <div className="h-20 w-20 mx-auto mb-4 opacity-50">
              <Activity className="h-full w-full text-blue-400" />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No Activity Data Available
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Generate activity analysis to see workout recommendations.
            </p>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2 mb-6 p-4 bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-sky-500/10 rounded-xl border border-blue-200 dark:border-blue-800"
      >
        <div className="p-2.5 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
          <Activity className="h-6 w-6 text-white" />
        </div>
        <div className="flex-1">
          <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
            {response.length} Activity Recommendations
          </span>
          <p className="text-xs text-blue-600/70 dark:text-blue-400/70 mt-1">
            Personalized workout plans and fitness suggestions
          </p>
        </div>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {response.map((tip: ActivityTip, index: number) => {
          const SportIcon = sportsIcons[index % sportsIcons.length]
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-2xl border-2 border-blue-100 dark:border-blue-900 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-6 hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
            >
              {/* Animated background gradient effect */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700" />
              
              {/* Floating animation dots */}
              <motion.div
                className="absolute top-4 right-4 w-2 h-2 bg-blue-400/30 rounded-full"
                animate={{
                  y: [0, -10, 0],
                  opacity: [0.3, 0.7, 0.3]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: index * 0.2
                }}
              />
              <motion.div
                className="absolute bottom-4 left-4 w-1 h-1 bg-cyan-400/30 rounded-full"
                animate={{
                  y: [0, 8, 0],
                  opacity: [0.3, 0.7, 0.3]
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  delay: index * 0.3
                }}
              />
              
              <div className="relative z-10">
                <div className="flex items-start gap-4 mb-5">
                  <div className="relative">
                    <motion.div
                      whileHover={{ rotate: 12, scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl shadow-lg"
                    >
                      <SportIcon className="h-6 w-6 text-white" />
                    </motion.div>
                  </div>
                  <div className="flex-1">
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + 0.1 }}
                    >
                      <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-2">{tip.tip}</h4>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                          {tip.frequency}
                        </span>
                      </div>
                    </motion.div>
                  </div>
                  
                  {/* Animated activity type badge */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: index * 0.1 }}
                    className={`px-3 py-1.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full text-xs font-bold shadow-md`}
                  >
                    {tip.tip.includes('HIIT') ? 'High Intensity' : 
                     tip.tip.includes('Strength') ? 'Strength' : 
                     tip.tip.includes('Stretch') ? 'Flexibility' : 
                     tip.tip.includes('Rest') ? 'Recovery' : 'Fitness'}
                  </motion.div>
                </div>
                
                {/* Description with fade-in animation */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                  className="mb-6"
                >
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    {tip.explanation}
                  </p>
                </motion.div>
                
                {/* Benefits section with staggered animation */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                  className="pt-5 border-t border-blue-200/50 dark:border-blue-800/50"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <motion.div
                      animate={{ rotate: [0, 10, 0, -10, 0] }}
                      transition={{ duration: 4, repeat: Infinity }}
                    >
                      <Sparkles className="h-4 w-4 text-blue-500" />
                    </motion.div>
                    <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Key Benefits</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {(() => {
                      // Get benefits based on tip type
                      const benefits = tip.tip.toLowerCase().includes('strength') 
                        ? ['Builds muscle mass', 'Increases bone density', 'Improves metabolism']
                        : tip.tip.toLowerCase().includes('hiit') || tip.tip.toLowerCase().includes('high-intensity')
                        ? ['Boosts cardiovascular fitness', 'Burns calories efficiently', 'Improves endurance']
                        : tip.tip.toLowerCase().includes('stretch')
                        ? ['Improves flexibility', 'Reduces injury risk', 'Enhances range of motion']
                        : tip.tip.toLowerCase().includes('recovery') || tip.tip.toLowerCase().includes('rest')
                        ? ['Prevents overtraining', 'Allows muscle repair', 'Reduces fatigue']
                        : ['Improves overall fitness', 'Boosts energy levels', 'Enhances mood']
                      
                      return benefits.map((benefit: string, idx: number) => (
                        <motion.span
                          key={idx}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 + 0.4 + (idx * 0.1) }}
                          whileHover={{ scale: 1.05, y: -2 }}
                          className="px-3 py-1.5 text-xs font-medium bg-gradient-to-r from-blue-500/10 to-cyan-500/10 text-blue-700 dark:text-blue-300 rounded-full border border-blue-200 dark:border-blue-800 cursor-default"
                        >
                          {benefit}
                        </motion.span>
                      ))
                    })()}
                  </div>
                </motion.div>
              </div>
              
              {/* Hover effect line */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-sky-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </motion.div>
          )
        })}
      </div>
      
      {/* Animated summary card */}
      {response.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: response.length * 0.1 }}
          className="mt-8 bg-gradient-to-r from-blue-500/5 via-cyan-500/5 to-sky-500/5 rounded-2xl p-6 border-2 border-blue-200/50 dark:border-blue-800/50 relative overflow-hidden"
        >
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-cyan-500/5 to-sky-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="relative z-10 flex items-center gap-4">
            <motion.div
              animate={{ rotate: [0, 5, 0, -5, 0] }}
              transition={{ duration: 6, repeat: Infinity }}
              className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl"
            >
              <Target className="h-6 w-6 text-white" />
            </motion.div>
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-2">Weekly Activity Goal</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Aim for at least 150 minutes of moderate-intensity or 75 minutes of high-intensity activity per week.
                Mix different activities to work all muscle groups and prevent boredom.
              </p>
            </div>
          </div>
          
          {/* Floating animation in summary card */}
          <motion.div
            className="absolute top-2 right-2 w-3 h-3 bg-blue-400/20 rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.2, 0.5, 0.2]
            }}
            transition={{
              duration: 3,
              repeat: Infinity
            }}
          />
          <motion.div
            className="absolute bottom-2 left-2 w-2 h-2 bg-cyan-400/20 rounded-full"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              delay: 0.5
            }}
          />
        </motion.div>
      )}
    </div>
  )
}
  const RisksAnalysisComponent = ({ response }: { response: RiskItem[] }) => {
    const riskIcons = [AlertTriangle, AlertOctagon, Shield, HeartPulse, Thermometer, Eye, Ear, Pill, Stethoscope, Dna, Ambulance, Hospital, Bandage, HeartPulse]
    
    return (
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 mb-4 p-3 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-xl"
        >
          <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-white" />
          </div>
          <span className="text-sm font-medium text-amber-700 dark:text-amber-300">
            {response.length} health risks identified
          </span>
        </motion.div>
        
        <div className="space-y-4">
          {response.map((risk: RiskItem, index: number) => {
            const RiskIcon = riskIcons[index % riskIcons.length]
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-xl border border-amber-200 dark:border-amber-800 bg-gradient-to-r from-amber-50/50 to-orange-50/50 dark:from-amber-900/10 dark:to-orange-900/10 p-5 hover:shadow-lg transition-all duration-300"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-amber-500 to-orange-500" />
                
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="p-2.5 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg group-hover:scale-110 transition-transform">
                      <RiskIcon className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    <div>
                      <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-1">
                        {risk.risk}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {risk.explanation}
                      </p>
                    </div>
                    
                    <div className="p-3 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <ShieldCheckIcon className="h-4 w-4 text-emerald-500" />
                        <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Prevention Strategy</span>
                      </div>
                      <p className="text-sm text-emerald-800 dark:text-emerald-200">{risk.mitigation}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    )
  }

  const MotivationAnalysisComponent = ({ response }: { response: MotivationItem[] }) => {
    const happyIcons = [Smile, Star, Trophy, Award, HeartIcon, Sparkles, Zap, Sun]
    const emojis = ['🌟', '🎯', '💪', '🔥', '🚀', '🌈', '⭐', '✨']
    
    return (
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 mb-4 p-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl"
        >
          <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
            {response.length} motivational boosts
          </span>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {response.map((item: MotivationItem, index: number) => {
            const HappyIcon = happyIcons[index % happyIcons.length]
            const emoji = emojis[index % emojis.length]
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-rose-500/10 p-6 hover:shadow-xl transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10 text-center">
                  <div className="mb-4">
                    <div className="inline-flex p-2.5 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-3 group-hover:rotate-12 transition-transform">
                      <HappyIcon className="h-8 w-8 text-white" />
                    </div>
                    <div className="text-4xl mb-2">{emoji}</div>
                  </div>
                  
                  <p className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                    {item.message}
                  </p>
                  
                  <div className="mt-4 pt-4 border-t border-purple-200/50 dark:border-purple-800/50">
                    <div className="flex items-center justify-center gap-2 text-sm text-purple-600 dark:text-purple-400">
                      <ThumbsUp className="h-4 w-4" />
                      <span>You've got this!</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    )
  }

  const FullAnalysisComponent = ({ response }: { response: FullAnalysis }) => {
    return (
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 mb-4 p-3 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl"
        >
          <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg">
            <Brain className="h-5 w-5 text-white" />
          </div>
          <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
            Complete Health Analysis
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-indigo-50/50 to-purple-50/50 dark:from-indigo-900/10 dark:to-purple-900/10 p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white">Short-term Predictions</h3>
          </div>
          <p className="text-gray-700 dark:text-gray-300">{response.predictions.short_term}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-50/50 to-cyan-50/50 dark:from-blue-900/10 dark:to-cyan-900/10 p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
              <Target2 className="h-5 w-5 text-white" />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white">Actionable Recommendations</h3>
          </div>
          <div className="space-y-3">
            {response.recommendations.map((rec: string, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3 p-3 bg-white/50 dark:bg-gray-800/30 rounded-lg"
              >
                <div className="h-2 w-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full" />
                <span className="text-gray-700 dark:text-gray-300">{rec}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-amber-50/50 to-orange-50/50 dark:from-amber-900/10 dark:to-orange-900/10 p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white">Daily Motivation</h3>
          </div>
          <p className="text-lg font-medium text-gray-900 dark:text-white">
            {response.motivational_tip}
          </p>
        </motion.div>
      </div>
    )
  }

  const CompleteAnalysisComponent = ({ response }: { response: NutritionAnalysis }) => {
    return (
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 mb-4 p-3 bg-gradient-to-r from-rose-500/10 to-pink-500/10 rounded-xl"
        >
          <div className="p-2 bg-gradient-to-br from-rose-500 to-pink-500 rounded-lg">
            <FileSpreadsheet className="h-5 w-5 text-white" />
          </div>
          <span className="text-sm font-medium text-rose-700 dark:text-rose-300">
            Complete CSV Analysis
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-emerald-50/50 to-green-50/50 dark:from-emerald-900/10 dark:to-green-900/10 p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-gradient-to-br from-emerald-500 to-green-500 rounded-lg">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white">AI Analysis</h3>
          </div>
          <p className="text-gray-700 dark:text-gray-300">{response.analysis}</p>
        </motion.div>

        {response.key_problems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-amber-50/50 to-orange-50/50 dark:from-amber-900/10 dark:to-orange-900/10 p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg">
                <AlertCircle className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white">Key Areas for Improvement</h3>
            </div>
            <div className="space-y-3">
              {response.key_problems.map((problem: string, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3 p-3 bg-white/50 dark:bg-gray-800/30 rounded-lg"
                >
                  <div className="h-2 w-2 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full" />
                  <span className="text-gray-700 dark:text-gray-300">{problem}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {response.medical_note && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-red-50/50 to-rose-50/50 dark:from-red-900/10 dark:to-rose-900/10 p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-gradient-to-br from-red-500 to-rose-500 rounded-lg">
                <HeartPulse className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white">Medical Note</h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300">{response.medical_note}</p>
          </motion.div>
        )}

        {response.recommendations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-50/50 to-cyan-50/50 dark:from-blue-900/10 dark:to-cyan-900/10 p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
                <Lightbulb className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white">Personalized Recommendations</h3>
            </div>
            <div className="space-y-4">
              {response.recommendations.map((rec: any, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-white/50 dark:bg-gray-800/30 rounded-lg"
                >
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{rec.tip}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{rec.explanation}</p>
                  {rec.example_foods && rec.example_foods.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Example Foods:</p>
                      <div className="flex flex-wrap gap-2">
                        {rec.example_foods.map((food: string, foodIndex: number) => (
                          <span
                            key={foodIndex}
                            className="px-3 py-1 text-xs bg-gradient-to-r from-emerald-500/10 to-green-500/10 text-emerald-700 dark:text-emerald-300 rounded-full"
                          >
                            {food}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {response.weekly_strategy && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-900/10 dark:to-pink-900/10 p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white">Weekly Strategy</h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300">{response.weekly_strategy}</p>
          </motion.div>
        )}
      </div>
    )
  }

const renderPredictionContent = (prediction: AIPrediction) => {
  const response = prediction.response
  const task = prediction.task.toLowerCase()
  
  console.log(`Rendering ${task} content:`, response)
  
  // Force render based on task type to ensure correct component
  if (task === 'activity') {
    return <ActivityAnalysisComponent response={Array.isArray(response) ? response : []} />
  }
  
  if (task === 'nutrition') {
    return <NutritionAnalysisComponent response={Array.isArray(response) ? response : []} />
  }
  
  // For other task types, use the type guards
  if (aiService.isRiskResponse(response)) {
    return <RisksAnalysisComponent response={response} />
  }

  if (aiService.isMotivationResponse(response)) {
    return <MotivationAnalysisComponent response={response} />
  }

  if (aiService.isFullAnalysis(response)) {
    return <FullAnalysisComponent response={response} />
  }

  if (aiService.isNutritionAnalysis(response)) {
    return <CompleteAnalysisComponent response={response} />
  }

  // Fallback to raw data
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4 p-3 bg-gradient-to-r from-gray-500/10 to-gray-600/10 rounded-xl">
        <div className="p-2 bg-gradient-to-br from-gray-500 to-gray-600 rounded-lg">
          <Info className="h-5 w-5 text-white" />
        </div>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {prediction.task} Analysis
        </span>
      </div>
      
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 overflow-auto max-h-[500px]">
        <pre className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
          {JSON.stringify(response, null, 2)}
        </pre>
      </div>
    </div>
  )
}

  const renderIcon = (taskType: TaskType, className: string = "h-6 w-6 text-white") => {
    const Icon = taskConfig[taskType].icon;
    return <Icon className={className} />;
  };

  const renderTaskIcon = (taskType: string, className: string = "h-6 w-6") => {
    const Icon = taskConfig[taskType as TaskType]?.icon;
    return Icon ? <Icon className={className} /> : <Info className={className} />;
  };

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
              <div className="h-24 w-24 border-4 border-gray-200 dark:border-gray-800 rounded-full">
                <div className="absolute inset-0 border-4 border-transparent border-t-blue-500 border-r-purple-500 rounded-full animate-spin" />
                <div className="absolute inset-0 border-4 border-transparent border-b-emerald-500 border-l-amber-500 rounded-full animate-spin" style={{ animationDirection: 'reverse' }} />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-3"
            >
              <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                MedMind
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md">
                {autoGenerating ? 'Generating daily AI insights...' : 'Loading your AI health insights...'}
              </p>
              {autoGenerating && (
                <div className="flex items-center justify-center gap-2 text-sm text-blue-600 dark:text-blue-400">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Auto-generating daily analysis</span>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div className="bg-gradient-to-r from-emerald-500 to-green-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 backdrop-blur-sm">
              <CheckCircle className="h-5 w-5" />
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
            <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-xl shadow-lg backdrop-blur-sm">
              {error}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCompleteAnalysis && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-rose-500 to-pink-500 rounded-xl">
                    <FileSpreadsheet className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      Complete Analysis
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Generate in-depth analysis from CSV data
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Date Range
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-gray-500 dark:text-gray-400 mb-1">From</label>
                        <input
                          type="date"
                          value={dateRange.from}
                          onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 dark:text-gray-400 mb-1">To</label>
                        <input
                          type="date"
                          value={dateRange.to}
                          onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          Note: This may take a moment
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          The AI will analyze your CSV nutrition data and provide comprehensive insights.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowCompleteAnalysis(false)}
                    className="flex-1 px-4 py-3 border-2 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    disabled={generatingComplete}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={generateCompleteAnalysis}
                    disabled={generatingComplete}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-xl font-medium hover:from-rose-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    {generatingComplete ? (
                      <div className="flex items-center justify-center gap-2">
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span>Analyzing...</span>
                      </div>
                    ) : (
                      'Generate Analysis'
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {aiProcessing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl"
            >
              <div className="text-center space-y-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-xl opacity-50" />
                  <div className="relative">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="h-20 w-20 mx-auto mb-4"
                    >
                      <div className="relative h-full w-full">
                        <BrainCircuit className="h-full w-full text-white" />
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur" />
                      </div>
                    </motion.div>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {generatingTask ? `Generating ${taskConfig[generatingTask]?.title}` : 'AI Processing'}
                  </h3>
                  <p className="text-gray-300">
                    Analyzing your health data with advanced AI algorithms...
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: "0%" }}
                      animate={{ width: `${processingProgress}%` }}
                      className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
                    />
                  </div>
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>Processing</span>
                    <span>{processingProgress}%</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs text-gray-400">
                  <div className="text-center">
                    <Cpu className="h-4 w-4 mx-auto mb-1 text-blue-400" />
                    <span>AI Engine</span>
                  </div>
                  <div className="text-center">
                    <Database className="h-4 w-4 mx-auto mb-1 text-purple-400" />
                    <span>Data Analysis</span>
                  </div>
                  <div className="text-center">
                    <LineChart className="h-4 w-4 mx-auto mb-1 text-pink-400" />
                    <span>Patterns</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-950 overflow-hidden relative">
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
                x: [0, Math.sin(index) * 80, 0],
                y: [0, Math.cos(index) * 80, 0],
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: orb.duration,
                repeat: Infinity,
                delay: orb.delay || 0,
                ease: "easeInOut"
              }}
            />
          ))}

          {floatingElements.map((element, index) => {
            const Icon = element.icon
            return (
              <motion.div
                key={index}
                className="absolute text-gray-400/10 dark:text-gray-600/20"
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

        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000002_1px,transparent_1px),linear-gradient(to_bottom,#00000002_1px,transparent_1px)] bg-[size:60px_60px] opacity-30" />

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
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur" />
                    <motion.div
                      animate={{ rotate: pulseAnimation ? [0, 360] : 0 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="relative p-2.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"
                    >
                      <BrainCircuit className="h-6 w-6 text-white" />
                    </motion.div>
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                      <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                        MedMind
                      </span>
                      <span className="text-gray-900 dark:text-white"> Assistant</span>
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                      Advanced AI-powered health insights and predictions
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowCompleteAnalysis(true)}
                  className="px-4 py-2.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <FileSpreadsheet className="h-4 w-4" />
                  <span>Complete Analysis</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleExportCSV}
                  disabled={exportingCSV || !user?.id}
                  className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {exportingCSV ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                  <span>{exportingCSV ? 'Exporting...' : 'Export CSV'}</span>
                </motion.button>
                
                <button
                  onClick={() => router.push('/dashboard')}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                >
                  Back to Dashboard
                </button>
                <button
                  onClick={() => authService.logout().then(() => router.push('/signin'))}
                  className="group relative px-4 py-2.5 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all hover:scale-[1.02] flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4"
          >
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {autoGenerating ? (
                    <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />
                  ) : (
                    <Clock className="h-5 w-5 text-blue-500" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                      {autoGenerating ? 'Auto-generating daily AI insights...' : 'AI Auto-generation Schedule'}
                    </p>
                    <p className="text-xs text-blue-600/80 dark:text-blue-400/80">
                      {autoGenerating 
                        ? 'Generating nutrition, activity, risks, motivation & full analysis...' 
                        : `Next auto-generation in: ${nextAutoGeneration} (00:30 AM)`}
                    </p>
                  </div>
                </div>
                <div className="text-xs px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full">
                  AUTO-AI
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="inline-flex rounded-xl bg-gray-100 dark:bg-gray-800 p-1">
                  <button
                    onClick={() => setViewMode('today')}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      viewMode === 'today'
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    Today's Insights
                  </button>
                  <button
                    onClick={() => setViewMode('history')}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      viewMode === 'history'
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    Historical Analysis
                  </button>
                </div>
                
                {viewMode === 'history' && (
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-gray-400" />
                    <input
                      type="date"
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                    />
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <BatteryCharging className="h-4 w-4 text-green-500" />
                    <span>AI Engine Ready</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Clock className="h-4 w-4" />
                  <span>Updated: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {Object.entries(taskConfig).map(([task, config]) => {
                const Icon = config.icon
                const latestPrediction = getLatestPrediction(task as TaskType)
                const hasPrediction = !!latestPrediction
                
                return (
                  <motion.div
                    key={task}
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setSelectedTask(task as TaskType)
                      if (viewMode === 'history') {
                        loadPredictions()
                      }
                    }}
                    className={`relative overflow-hidden rounded-xl p-4 cursor-pointer transition-all duration-300 border ${config.borderColor} ${
                      selectedTask === task
                        ? `bg-gradient-to-br ${config.color} text-white shadow-xl`
                        : 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl text-gray-900 dark:text-white hover:shadow-lg'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className={`p-2.5 rounded-lg mb-3 ${
                          selectedTask === task
                            ? 'bg-white/20'
                            : `bg-gradient-to-br ${config.color}`
                        }`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <h3 className="font-bold text-sm mb-1">{config.title}</h3>
                        <p className={`text-xs ${
                          selectedTask === task ? 'text-white/80' : 'text-gray-600 dark:text-gray-400'
                        }`}>
                          {hasPrediction 
                            ? viewMode === 'today' 
                              ? '✓ Available' 
                              : new Date(latestPrediction.created_at).toLocaleDateString()
                            : 'Generate'
                          }
                        </p>
                      </div>
                      
                      {selectedTask === task && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="h-2 w-2 rounded-full bg-white"
                        />
                      )}
                    </div>
                    
                    {hasPrediction && viewMode === 'today' && (
                      <div className="mt-3 pt-3 border-t border-white/20">
                        <div className="text-xs opacity-90">Last update:</div>
                        <div className="text-xs font-medium">
                          {new Date(latestPrediction.created_at).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                      </div>
                    )}
                    
                    {!hasPrediction && viewMode === 'today' && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation()
                          generateTaskAnalysis(task as TaskType)
                        }}
                        disabled={generatingTask === task}
                        className={`mt-3 w-full px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          selectedTask === task
                            ? 'bg-white text-gray-900 hover:bg-gray-100'
                            : 'bg-gradient-to-r from-gray-800 to-gray-900 text-white hover:shadow-lg'
                        }`}
                      >
                        {generatingTask === task ? (
                          <div className="flex items-center justify-center gap-1">
                            <RefreshCw className="h-3 w-3 animate-spin" />
                            <span>Generating</span>
                          </div>
                        ) : (
                          'Generate'
                        )}
                      </motion.button>
                    )}
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-8"
          >
            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-lg overflow-hidden border border-gray-200/50 dark:border-gray-800/50">
              <div className="border-b border-gray-200 dark:border-gray-800 p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 bg-gradient-to-br ${taskConfig[selectedTask].color} rounded-xl`}>
                      {renderIcon(selectedTask, "h-6 w-6 text-white")}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {taskConfig[selectedTask].title}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400">
                        {viewMode === 'today' ? 'Today\'s analysis' : `Historical analysis from ${dateFilter}`}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => generateTaskAnalysis(selectedTask)}
                      disabled={generatingTask === selectedTask || aiProcessing}
                      className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {generatingTask === selectedTask ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          <span>Regenerating...</span>
                        </>
                      ) : (
                        <>
                          <RefreshCw className="h-4 w-4" />
                          <span>Regenerate</span>
                        </>
                      )}
                    </motion.button>
                    
                    <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                      <Share2 className="h-5 w-5" />
                    </button>
                    
                    <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                      <Download className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {viewMode === 'today' ? (
                  getLatestPrediction(selectedTask) ? (
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={getLatestPrediction(selectedTask)?.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                      >
                        {renderPredictionContent(getLatestPrediction(selectedTask)!)}
                      </motion.div>
                    </AnimatePresence>
                  ) : (
                    <div className="text-center py-12">
                      <div className="max-w-md mx-auto space-y-6">
                        <div className="relative">
                          <div className="h-20 w-20 mx-auto mb-4 opacity-50">
                            {(() => {
                              const Icon = taskConfig[selectedTask].icon;
                              return <Icon className="h-full w-full text-gray-400" />;
                            })()}
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-br from-gray-500/10 to-gray-600/10 blur-2xl" />
                        </div>
                        
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            No {taskConfig[selectedTask].title} Available
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 mb-6">
                            {taskConfig[selectedTask].emptyMessage}
                          </p>
                          
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => generateTaskAnalysis(selectedTask)}
                            disabled={generatingTask === selectedTask}
                            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {generatingTask === selectedTask ? (
                              <div className="flex items-center justify-center gap-2">
                                <RefreshCw className="h-4 w-4 animate-spin" />
                                <span>Generating Analysis...</span>
                              </div>
                            ) : (
                              `Generate ${taskConfig[selectedTask].title}`
                            )}
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  )
                ) : (
                  // Historical view
                  <div className="space-y-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Predictions from {dateFilter}
                      </h3>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {getTaskPredictions(selectedTask).length} entries
                      </div>
                    </div>
                    
                    {getTaskPredictions(selectedTask).length > 0 ? (
                      <div className="space-y-4">
                        {getTaskPredictions(selectedTask)
                          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                          .map((prediction, index) => (
                            <motion.div
                              key={prediction.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="group relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:shadow-lg transition-all duration-300"
                            >
                              <div className="p-5">
                                <div className="flex items-start justify-between mb-4">
                                  <div className="flex items-center gap-3">
                                    <div className={`p-2 bg-gradient-to-br ${taskConfig[selectedTask].color} rounded-lg`}>
                                      {renderTaskIcon(prediction.task, "h-4 w-4 text-white")}
                                    </div>
                                    <div>
                                      <h4 className="font-semibold text-gray-900 dark:text-white">
                                        {new Date(prediction.created_at).toLocaleDateString()}
                                      </h4>
                                      <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {new Date(prediction.created_at).toLocaleTimeString()}
                                      </p>
                                    </div>
                                  </div>
                                  
                                  <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                                    <ChevronDown className="h-4 w-4" />
                                  </button>
                                </div>
                                
                                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                                  {renderPredictionContent(prediction)}
                                </div>
                              </div>
                            </motion.div>
                          ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="max-w-md mx-auto space-y-6">
                          <div className="relative">
                            <div className="h-20 w-20 mx-auto mb-4 opacity-30">
                              <History className="h-full w-full text-gray-400" />
                            </div>
                          </div>
                          
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                              No Historical Data
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                              No {taskConfig[selectedTask].title.toLowerCase()} predictions found for {dateFilter}.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Quick Actions Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-8"
          >
            <div className="bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-2xl p-6 border border-blue-200/50 dark:border-blue-800/50">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick AI Actions</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    generateTaskAnalysis('nutrition')
                    generateTaskAnalysis('activity')
                    generateTaskAnalysis('risks')
                    generateTaskAnalysis('motivation')
                  }}
                  disabled={aiProcessing}
                  className="p-4 bg-gradient-to-r from-emerald-500/10 to-green-500/10 hover:from-emerald-500/20 hover:to-green-500/20 border border-emerald-200 dark:border-emerald-800 rounded-xl transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg group-hover:rotate-12 transition-transform">
                      <Zap className="h-5 w-5 text-white" />
                    </div>
                    <div className="text-left">
                      <h4 className="font-medium text-emerald-700 dark:text-emerald-300">Generate All</h4>
                      <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70">
                        Create nutrition, activity, risks & motivation
                      </p>
                    </div>
                  </div>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push('/dashboard')}
                  className="p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 hover:from-blue-500/20 hover:to-cyan-500/20 border border-blue-200 dark:border-blue-800 rounded-xl transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg group-hover:rotate-12 transition-transform">
                      <BarChart3 className="h-5 w-5 text-white" />
                    </div>
                    <div className="text-left">
                      <h4 className="font-medium text-blue-700 dark:text-blue-300">View Dashboard</h4>
                      <p className="text-xs text-blue-600/70 dark:text-blue-400/70">
                        See your health metrics & trends
                      </p>
                    </div>
                  </div>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowCompleteAnalysis(true)}
                  disabled={aiProcessing}
                  className="p-4 bg-gradient-to-r from-rose-500/10 to-pink-500/10 hover:from-rose-500/20 hover:to-pink-500/20 border border-rose-200 dark:border-rose-800 rounded-xl transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-rose-500 to-pink-500 rounded-lg group-hover:rotate-12 transition-transform">
                      <FileSpreadsheet className="h-5 w-5 text-white" />
                    </div>
                    <div className="text-left">
                      <h4 className="font-medium text-rose-700 dark:text-rose-300">CSV Analysis</h4>
                      <p className="text-xs text-rose-600/70 dark:text-rose-400/70">
                        Deep analysis from your nutrition data
                      </p>
                    </div>
                  </div>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleExportCSV}
                  disabled={exportingCSV || !user?.id}
                  className="p-4 bg-gradient-to-r from-cyan-500/10 to-teal-500/10 hover:from-cyan-500/20 hover:to-teal-500/20 border border-cyan-200 dark:border-cyan-800 rounded-xl transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-lg group-hover:rotate-12 transition-transform">
                      <Download className="h-5 w-5 text-white" />
                    </div>
                    <div className="text-left">
                      <h4 className="font-medium text-cyan-700 dark:text-cyan-300">
                        {exportingCSV ? 'Exporting...' : 'Export CSV'}
                      </h4>
                      <p className="text-xs text-cyan-600/70 dark:text-cyan-400/70">
                        Download nutrition data as CSV
                      </p>
                    </div>
                  </div>
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Stats Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-xl p-5 border border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between mb-3">
                  <Brain className="h-5 w-5 text-blue-500" />
                  <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-700 dark:text-blue-300 rounded-full">
                    AI
                  </span>
                </div>
                <div className="text-2xl font-bold text-blue-700 dark:text-blue-300 mb-1">
                  {predictions.length}
                </div>
                <div className="text-sm text-blue-600/70 dark:text-blue-400/70">
                  Total AI Predictions
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-emerald-500/10 to-green-500/10 rounded-xl p-5 border border-emerald-200 dark:border-emerald-800">
                <div className="flex items-center justify-between mb-3">
                  <RefreshCw className="h-5 w-5 text-emerald-500" />
                  <span className="text-xs px-2 py-1 bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 rounded-full">
                    AUTO
                  </span>
                </div>
                <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300 mb-1">
                  {autoGenerating ? 'Running' : 'Ready'}
                </div>
                <div className="text-sm text-emerald-600/70 dark:text-emerald-400/70">
                  Auto-generation
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-5 border border-purple-200 dark:border-purple-800">
                <div className="flex items-center justify-between mb-3">
                  <Calendar className="h-5 w-5 text-purple-500" />
                  <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-700 dark:text-purple-300 rounded-full">
                    {viewMode}
                  </span>
                </div>
                <div className="text-2xl font-bold text-purple-700 dark:text-purple-300 mb-1">
                  {getTaskPredictions(selectedTask).length}
                </div>
                <div className="text-sm text-purple-600/70 dark:text-purple-400/70">
                  {selectedTask} predictions
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-xl p-5 border border-amber-200 dark:border-amber-800">
                <div className="flex items-center justify-between mb-3">
                  <Clock className="h-5 w-5 text-amber-500" />
                  <span className="text-xs px-2 py-1 bg-amber-500/20 text-amber-700 dark:text-amber-300 rounded-full">
                    NEXT
                  </span>
                </div>
                <div className="text-2xl font-bold text-amber-700 dark:text-amber-300 mb-1">
                  {nextAutoGeneration.split(' ')[0]}
                </div>
                <div className="text-sm text-amber-600/70 dark:text-amber-400/70">
                  Until next auto-gen
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  )
}