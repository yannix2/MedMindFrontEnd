'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Activity, Dumbbell, Moon, Clock, TrendingUp,
  Plus, Trash2, ChevronLeft, RefreshCw, CheckCircle, 
  AlertCircle, Zap, Target, Flame, ArrowRight, X, 
  ChevronDown, Home, Search, Filter, Check, Heart, 
  Star, BarChart3, PieChart, Battery, Coffee, Bed, 
  Timer, Download, Share2, Settings, Bell, Menu, 
  MoreVertical, Play, Pause, Music, Volume2, Camera, 
  Phone, Send, Image, File, Cloud, Wifi, BatteryCharging, 
  Tv, Smartphone, Laptop, Shield, Lock, CreditCard, 
  Gift, Package, Grid, SlidersHorizontal, Type, Link, 
  List, Bookmark, Tag, Percent, PlusCircle, MinusCircle, 
  HelpCircle, Info, AlertTriangle, Megaphone, Speaker, 
  Headphones, Satellite, Wrench, Flag, Map, MapPin, 
  Navigation2, Compass, Globe, Mountain, TreePine, 
  Flower, Cat, Dog, Turtle, Heart as HeartIcon, Rocket, 
  Sun, CloudRain, CloudSnow, CloudLightning, Wind, 
  Fire, Droplet, Umbrella, Snowflake, Thermometer, 
  Gamepad, Mouse, Keyboard, Calculator, Calendar, 
  AlarmClock, Hourglass, Stopwatch, History, ShoppingCart, 
  Building, Hotel, School, Hospital, Car, Bus, Train, Plane, 
  Ship, Bike, Running, Swimming, Camping, Tent, Sunrise, Sunset
} from 'lucide-react';

import { activityTodayService, type ActivityDay, type Sport, type NewSportData, type SleepData } from '@/lib/activity-today'

const SPORT_TYPES = [
  'Running', 'Walking', 'Cycling', 'Swimming', 'Weight Training', 'Yoga',
  'Pilates', 'HIIT', 'Boxing', 'Martial Arts', 'Dancing', 'Basketball',
  'Football', 'Tennis', 'Badminton', 'Golf', 'Hiking', 'Climbing',
  'Skiing', 'Snowboarding', 'Skating', 'Rowing', 'CrossFit', 'Zumba',
  'Aerobics', 'Stretching', 'Meditation', 'Other'
]

const INTENSITY_LEVELS = [
  { value: 'low', label: 'Low', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300', icon: '🐢' },
  { value: 'moderate', label: 'Moderate', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300', icon: '🚶‍♂️' },
  { value: 'high', label: 'High', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300', icon: '🏃‍♂️' },
  { value: 'very_high', label: 'Very High', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300', icon: '⚡' },
]

export default function ActivityTodayPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [activityDay, setActivityDay] = useState<ActivityDay | null>(null)
  const [showAddSportModal, setShowAddSportModal] = useState(false)
  const [showEditSleepModal, setShowEditSleepModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  
  // New sport form state
  const [newSport, setNewSport] = useState<NewSportData>({
    sport_type: '',
    duration_minutes: 30,
    intensity_level: 'moderate',
    calories_burned: 0,
    notes: ''
  })

  // Sleep form state
  const [sleepForm, setSleepForm] = useState<SleepData>({
    sleep_start: '',
    sleep_end: '',
    active_general: true
  })

  useEffect(() => {
    loadActivityData()
  }, [])

  const loadActivityData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const data = await activityTodayService.getTodayActivity()
      setActivityDay(data)
      
      // Initialize sleep form with existing data
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
        // No activity day exists yet, create one
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

      // Calculate calories if not provided
      const sportData = {
        ...newSport,
        calories_burned: newSport.calories_burned || activityTodayService.calculateEstimatedCalories(
          newSport.duration_minutes,
          newSport.intensity_level
        )
      }

      const newSportData = await activityTodayService.addSport(sportData, activityDay.id)
      
      // Update local state
      setActivityDay(prev => prev ? {
        ...prev,
        sports: [...prev.sports, newSportData]
      } : null)

      // Reset form
      setNewSport({
        sport_type: '',
        duration_minutes: 30,
        intensity_level: 'moderate',
        calories_burned: 0,
        notes: ''
      })
      
      setShowAddSportModal(false)
      showNotification('Sport activity added successfully!', 'success')
      
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
      showNotification('Sleep data updated successfully!', 'success')
      
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

      // Update local state
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

  const getActivityScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-500'
    if (score >= 60) return 'text-green-500'
    if (score >= 40) return 'text-yellow-500'
    if (score >= 20) return 'text-orange-500'
    return 'text-red-500'
  }

  const getActivityScoreBgColor = (score: number) => {
    if (score >= 80) return 'from-emerald-500 to-green-500'
    if (score >= 60) return 'from-green-500 to-lime-500'
    if (score >= 40) return 'from-yellow-500 to-amber-500'
    if (score >= 20) return 'from-orange-500 to-red-500'
    return 'from-red-500 to-pink-500'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-950">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              <div className="h-16 w-16 border-4 border-gray-200 dark:border-gray-700 rounded-full">
                <div className="absolute inset-0 border-4 border-transparent border-t-blue-500 border-r-purple-500 rounded-full animate-spin" />
              </div>
            </motion.div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                Loading Your Activity
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Fetching your daily activity data...
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-950">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-gradient-to-r from-green-500/10 to-cyan-500/10 blur-3xl" />
      </div>

      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </motion.button>
              <div>
                <motion.h1 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-2xl font-bold text-gray-900 dark:text-white"
                >
                  Today's Activity
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="text-gray-600 dark:text-gray-400 text-sm"
                >
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </motion.p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={loadActivityData}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <RefreshCw className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Success/Error Messages */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="container mx-auto px-4 pt-4 z-50 relative"
          >
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-4 rounded-xl shadow-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">{success}</span>
              </div>
            </div>
          </motion.div>
        )}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="container mx-auto px-4 pt-4 z-50 relative"
          >
            <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-4 rounded-xl shadow-lg">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5" />
                <span className="font-medium">{error}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 py-6 relative">
        {/* Activity Score Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <div className="bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl p-8 text-white shadow-2xl transform hover:scale-[1.01] transition-transform duration-300">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">Activity Score</h2>
                <p className="text-blue-100/80">Your daily activity performance</p>
              </div>
              <div className="text-right">
                <motion.div 
                  key={activityDay?.activity_score}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className={`text-5xl font-bold ${getActivityScoreColor(activityDay?.activity_score || 0)}`}
                >
                  {activityDay?.activity_score.toFixed(1) || '0.0'}
                </motion.div>
                <div className="text-blue-100/80">out of 100</div>
              </div>
            </div>
            
            <div className="h-3 bg-white/30 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${activityDay?.activity_score || 0}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className={`h-full bg-gradient-to-r ${getActivityScoreBgColor(activityDay?.activity_score || 0)} rounded-full`}
              />
            </div>
            
            <div className="mt-6 flex items-center justify-between text-sm">
              <div className="flex items-center gap-3">
                <motion.div 
                  whileHover={{ rotate: 15 }}
                  className="p-2 bg-white/20 rounded-lg"
                >
                  <Moon className="h-4 w-4" />
                </motion.div>
                <span>{activityDay?.active_general ? 'Active Day' : 'Rest Day'}</span>
              </div>
              <div className="flex items-center gap-3">
                <motion.div 
                  whileHover={{ rotate: 15 }}
                  className="p-2 bg-white/20 rounded-lg"
                >
                  <TrendingUp className="h-4 w-4" />
                </motion.div>
                <span>Updated: {new Date(activityDay?.updated_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Sleep & Activity Status */}
          <div className="lg:col-span-2 space-y-6">
            {/* Sleep Tracking Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-800"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <motion.div 
                    whileHover={{ rotate: 15 }}
                    className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl"
                  >
                    <Moon className="h-6 w-6 text-white" />
                  </motion.div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Sleep Tracking</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Track your sleep patterns</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowEditSleepModal(true)}
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                >
                  {activityDay?.sleep_start ? 'Edit' : 'Add'} Sleep
                </motion.button>
              </div>

              {activityDay?.sleep_start && activityDay?.sleep_end ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {[
                      { label: 'Sleep Start', value: activityTodayService.formatTime(activityDay.sleep_start), icon: '🌙' },
                      { label: 'Sleep End', value: activityTodayService.formatTime(activityDay.sleep_end), icon: '☀️' },
                      { 
                        label: 'Sleep Duration', 
                        value: `${activityTodayService.calculateSleepDuration(activityDay.sleep_start, activityDay.sleep_end).toFixed(1)}h`,
                        icon: '⏱️'
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
                        <div className="flex items-center gap-3 mb-3">
                          <div className="text-2xl">{item.icon}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">{item.label}</div>
                        </div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">{item.value}</div>
                      </motion.div>
                    ))}
                  </div>
                  
                  <div className="pt-6 border-t border-gray-200 dark:border-gray-800">
                    <div className="flex items-center justify-between">
                      <div className="text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Sleep Quality: </span>
                        <span className="font-medium text-emerald-600 dark:text-emerald-400">Excellent</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Bedtime Consistency: </span>
                        <span className="font-medium text-blue-600 dark:text-blue-400">Regular</span>
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
                    <div className="h-20 w-20 mx-auto rounded-full bg-gradient-to-br from-blue-500/10 to-cyan-500/10 flex items-center justify-center">
                      <Moon className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">
                    No Sleep Data Recorded
                  </h4>
                  <p className="text-gray-500 dark:text-gray-400 text-sm max-w-md mx-auto mb-8">
                    Track your sleep patterns to understand your sleep quality and duration.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowEditSleepModal(true)}
                    className="px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                  >
                    Add Sleep Data
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
              className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-800"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <motion.div 
                    whileHover={{ rotate: 15 }}
                    className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl"
                  >
                    <Dumbbell className="h-6 w-6 text-white" />
                  </motion.div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Sports Activities</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Your physical activities today</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAddSportModal(true)}
                  className="px-5 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Sport
                </motion.button>
              </div>

              {activityDay?.sports && activityDay.sports.length > 0 ? (
                <div className="space-y-4">
                  {activityDay.sports.map((sport, index) => {
                    const intensityInfo = activityTodayService.getIntensityInfo(sport.intensity_level)
                    return (
                      <motion.div
                        key={sport.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 * index }}
                        whileHover={{ x: 5 }}
                        className="group bg-gradient-to-r from-gray-50 to-white dark:from-gray-800/50 dark:to-gray-900/50 rounded-2xl p-5 hover:shadow-lg transition-all border border-gray-200 dark:border-gray-700"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-5">
                            <motion.div 
                              whileHover={{ scale: 1.1, rotate: 10 }}
                              className="h-14 w-14 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 flex items-center justify-center group-hover:from-purple-500/20 group-hover:to-pink-500/20 transition-all"
                            >
                              <span className="text-2xl">{activityTodayService.getSportIcon(sport.sport_type)}</span>
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
                                <span className={`px-3 py-1 rounded-full ${intensityInfo.color}`}>
                                  {intensityInfo.icon} {intensityInfo.label}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="font-bold text-gray-900 dark:text-white text-2xl">
                              {sport.calories_burned}
                              <span className="text-sm font-normal text-gray-600 dark:text-gray-400 ml-1">cal</span>
                            </div>
                            <div className="flex items-center gap-3 mt-3">
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
                              {sport.notes}
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
                    <div className="h-20 w-20 mx-auto rounded-full bg-gradient-to-br from-purple-500/10 to-pink-500/10 flex items-center justify-center">
                      <Dumbbell className="h-10 w-10 text-purple-600 dark:text-purple-400" />
                    </div>
                  </div>
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">
                    No Sports Activities Yet
                  </h4>
                  <p className="text-gray-500 dark:text-gray-400 text-sm max-w-md mx-auto mb-8">
                    Add your physical activities to track calories burned and stay active.
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

          {/* Right Column: Stats & Quick Actions */}
          <div className="space-y-6">
            {/* Stats Summary Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ y: -5 }}
              className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-800"
            >
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Today's Summary</h3>
              
              <div className="space-y-5">
                {[
                  { 
                    icon: <Flame className="h-5 w-5 text-orange-600 dark:text-orange-400" />,
                    label: 'Calories Burned',
                    value: `${calculateTotalCalories()} cal`,
                    color: 'bg-orange-100 dark:bg-orange-900/30',
                    progress: Math.min(100, (calculateTotalCalories() / 500) * 100)
                  },
                  { 
                    icon: <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
                    label: 'Activity Duration',
                    value: `${calculateTotalDuration()} min`,
                    color: 'bg-blue-100 dark:bg-blue-900/30',
                    progress: Math.min(100, (calculateTotalDuration() / 60) * 100)
                  },
                  { 
                    icon: <Target className="h-5 w-5 text-purple-600 dark:text-purple-400" />,
                    label: 'Activities Count',
                    value: `${activityDay?.sports.length || 0}`,
                    color: 'bg-purple-100 dark:bg-purple-900/30',
                    progress: Math.min(100, ((activityDay?.sports.length || 0) / 5) * 100)
                  },
                  { 
                    icon: <Zap className="h-5 w-5 text-amber-600 dark:text-amber-400" />,
                    label: 'Daily Goal',
                    value: activityDay?.active_general ? 'Active' : 'Rest',
                    color: activityDay?.active_general ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-gray-100 dark:bg-gray-800',
                    progress: activityDay?.active_general ? 100 : 50
                  },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${stat.color}`}>
                          {stat.icon}
                        </div>
                        <div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                          <div className="font-bold text-gray-900 dark:text-white">{stat.value}</div>
                        </div>
                      </div>
                    </div>
                    <div className="h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${stat.progress}%` }}
                        transition={{ duration: 1, delay: 0.2 + (index * 0.1) }}
                        className={`h-full ${
                          stat.label === 'Calories Burned' ? 'bg-gradient-to-r from-orange-500 to-red-500' :
                          stat.label === 'Activity Duration' ? 'bg-gradient-to-r from-blue-500 to-cyan-500' :
                          stat.label === 'Activities Count' ? 'bg-gradient-to-r from-purple-500 to-pink-500' :
                          'bg-gradient-to-r from-emerald-500 to-green-500'
                        } rounded-full`}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Overall Progress</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {Math.round((activityDay?.activity_score || 0))}%
                  </span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${activityDay?.activity_score || 0}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-emerald-500 via-green-500 to-lime-500 rounded-full"
                  />
                </div>
              </div>
            </motion.div>

            {/* Quick Actions Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              whileHover={{ y: -5 }}
              className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-800"
            >
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Quick Actions</h3>
              
              <div className="space-y-3">
                {[
                  { 
                    label: 'Add New Activity', 
                    icon: <Plus className="h-5 w-5" />,
                    color: 'from-blue-500 to-cyan-500',
                    action: () => setShowAddSportModal(true)
                  },
                  { 
                    label: 'Update Sleep', 
                    icon: <Moon className="h-5 w-5" />,
                    color: 'from-purple-500 to-pink-500',
                    action: () => setShowEditSleepModal(true)
                  },
                  { 
                    label: 'Refresh Data', 
                    icon: <RefreshCw className="h-5 w-5" />,
                    color: 'from-gray-600 to-gray-700',
                    action: loadActivityData
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
                    className="w-full flex items-center justify-between p-4 bg-gradient-to-r hover:scale-[1.02] transition-all duration-300 rounded-xl group"
                    style={{ background: `linear-gradient(135deg, var(--tw-gradient-stops))` }}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2.5 rounded-lg bg-gradient-to-r ${action.color} text-white`}>
                        {action.icon}
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white">{action.label}</span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Add Sport Modal */}
      <AnimatePresence>
        {showAddSportModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="p-8 border-b border-gray-200 dark:border-gray-800 sticky top-0 bg-white dark:bg-gray-900">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl">
                      <Dumbbell className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Add Sport Activity
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Log your physical activity and track calories
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
                      <div className="relative">
                        <select
                          value={newSport.sport_type}
                          onChange={(e) => {
                            setNewSport({ ...newSport, sport_type: e.target.value })
                          }}
                          className="w-full px-5 py-4 border-2 border-gray-300 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none"
                        >
                          <option value="">Select a sport...</option>
                          {SPORT_TYPES.map((type) => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                      </div>
                    </div>

                    {/* Duration */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Duration (minutes) *
                      </label>
                      <div className="flex items-center gap-3">
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          type="button"
                          onClick={() => setNewSport({ ...newSport, duration_minutes: Math.max(1, newSport.duration_minutes - 5) })}
                          className="p-3 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700"
                        >
                          <MinusCircle className="h-5 w-5" />
                        </motion.button>
                        <div className="flex-1">
                          <input
                            type="range"
                            min="1"
                            max="180"
                            value={newSport.duration_minutes}
                            onChange={(e) => setNewSport({ ...newSport, duration_minutes: parseInt(e.target.value) })}
                            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-500"
                          />
                          <div className="text-center mt-2">
                            <span className="text-2xl font-bold text-gray-900 dark:text-white">
                              {newSport.duration_minutes}
                            </span>
                            <span className="text-gray-600 dark:text-gray-400 ml-2">minutes</span>
                          </div>
                        </div>
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          type="button"
                          onClick={() => setNewSport({ ...newSport, duration_minutes: newSport.duration_minutes + 5 })}
                          className="p-3 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700"
                        >
                          <PlusCircle className="h-5 w-5" />
                        </motion.button>
                      </div>
                    </div>

                    {/* Calories */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Calories Burned
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={newSport.calories_burned || ''}
                          onChange={(e) => setNewSport({ ...newSport, calories_burned: parseInt(e.target.value) || 0 })}
                          placeholder="Enter calories burned"
                          className="w-full px-5 py-4 border-2 border-gray-300 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                          cal
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Intensity & Preview */}
                  <div className="space-y-6">
                    {/* Intensity Level */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Intensity Level *
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {INTENSITY_LEVELS.map((level) => {
                          const isSelected = newSport.intensity_level === level.value
                          return (
                            <motion.button
                              key={level.value}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              type="button"
                              onClick={() => setNewSport({ ...newSport, intensity_level: level.value as any })}
                              className={`p-4 rounded-2xl border-2 transition-all ${isSelected ? 'border-purple-500' : 'border-gray-300 dark:border-gray-700'} ${level.color}`}
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-2xl">{level.icon}</span>
                                <div className="text-left">
                                  <div className="font-semibold">{level.label}</div>
                                  <div className="text-xs opacity-75">
                                    {level.value === 'low' && 'Light activity'}
                                    {level.value === 'moderate' && 'Moderate effort'}
                                    {level.value === 'high' && 'Vigorous activity'}
                                    {level.value === 'very_high' && 'Maximum effort'}
                                  </div>
                                </div>
                              </div>
                            </motion.button>
                          )
                        })}
                      </div>
                    </div>

                    {/* Notes */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Notes (Optional)
                      </label>
                      <textarea
                        value={newSport.notes}
                        onChange={(e) => setNewSport({ ...newSport, notes: e.target.value })}
                        rows={3}
                        placeholder="Any additional notes about your activity..."
                        className="w-full px-5 py-4 border-2 border-gray-300 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>

                    {/* Preview Card */}
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-5">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">Activity Preview</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {newSport.sport_type || 'Select a sport'}
                          </p>
                        </div>
                        <div className="text-2xl">
                          {newSport.sport_type ? activityTodayService.getSportIcon(newSport.sport_type) : '⚽'}
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Duration</span>
                          <span className="font-medium text-gray-900 dark:text-white">{newSport.duration_minutes} min</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Intensity</span>
                          <span className={`px-3 py-1 rounded-full ${INTENSITY_LEVELS.find(l => l.value === newSport.intensity_level)?.color || 'bg-gray-100 text-gray-700'}`}>
                            {INTENSITY_LEVELS.find(l => l.value === newSport.intensity_level)?.label || 'Moderate'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Calories</span>
                          <span className="font-bold text-purple-600 dark:text-purple-400 text-lg">
                            {newSport.calories_burned || activityTodayService.calculateEstimatedCalories(newSport.duration_minutes, newSport.intensity_level)} cal
                          </span>
                        </div>
                      </div>
                    </div>
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
                      'Add Activity'
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Sleep Modal */}
      <AnimatePresence>
        {showEditSleepModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
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
                      Sleep Tracking
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Update your sleep data
                    </p>
                  </div>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-8">
                <div className="space-y-6">
                  {/* Sleep Start */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Sleep Start Time
                    </label>
                    <input
                      type="time"
                      value={sleepForm.sleep_start || ''}
                      onChange={(e) => setSleepForm({ ...sleepForm, sleep_start: e.target.value })}
                      className="w-full px-5 py-4 border-2 border-gray-300 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Sleep End */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Sleep End Time
                    </label>
                    <input
                      type="time"
                      value={sleepForm.sleep_end || ''}
                      onChange={(e) => setSleepForm({ ...sleepForm, sleep_end: e.target.value })}
                      className="w-full px-5 py-4 border-2 border-gray-300 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
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
                          Did you have physical activity today?
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
                          <p className="font-semibold">Sleep Duration</p>
                          <p className="text-blue-100/80 text-sm">
                            Based on your input times
                          </p>
                        </div>
                        <div className="text-3xl font-bold">
                          {activityTodayService.calculateSleepDuration(sleepForm.sleep_start, sleepForm.sleep_end).toFixed(1)}h
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
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}