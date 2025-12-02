'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Brain, 
  User, 
  CheckCircle, 
  AlertCircle, 
  ArrowLeft,
  Save,
  TrendingUp,
  Target,
  Heart,
  Activity,
  Shield,
  Sparkles,
  Loader2,
  ChevronRight,
  Weight,
  Ruler,
  Calendar,
  Venus,
  Mars,
  UserCircle,
  Lock,
  Plus,
  FileText,
  Stethoscope,
  AlertTriangle
} from 'lucide-react'
import { authService } from '@/lib/auth'
import { profileService, ProfileFormData } from '@/lib/profile'

export default function MyProfilePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isNewUser = searchParams.get('new') === 'true'
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const [existingProfile, setExistingProfile] = useState<any>(null)
  const [hasProfile, setHasProfile] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  const [formData, setFormData] = useState<ProfileFormData>({
    age: 25,
    weight: 70,
    height: 170,
    sex: 'M'
  })

  const gradientOrbs = [
    { x: 10, y: 10, color: 'from-blue-500/20 to-purple-500/20', size: 160, duration: 25 },
    { x: 85, y: 70, color: 'from-emerald-500/15 to-cyan-500/15', size: 120, duration: 30, delay: 2 },
    { x: 20, y: 85, color: 'from-purple-500/15 to-pink-500/15', size: 140, duration: 20, delay: 1 },
  ]

  useEffect(() => {
    checkAuthAndLoadProfile()
  }, [])

  const checkAuthAndLoadProfile = async () => {
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

      try {
        const profile = await profileService.getProfile()
        
        if (profile) {
          setExistingProfile(profile)
          setHasProfile(true)
          setFormData({
            age: profile.age,
            weight: profile.weight,
            height: profile.height,
            sex: profile.sex
          })
        } else {
          setHasProfile(false)
        }
      } catch (error: any) {
        if (!error.message.includes('404') && !error.message.includes('not found')) {
          console.error('Error loading profile:', error)
        }
      }
    } catch (error) {
      console.error('Auth check error:', error)
      router.push('/signin')
    } finally {
      setLoading(false)
    }
  }

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0
    setFormData(prev => ({
      ...prev,
      weight: value
    }))
    if (success) setSuccess(null)
  }

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0
    setFormData(prev => ({
      ...prev,
      height: value
    }))
    if (success) setSuccess(null)
  }

  const handleSexSelect = (sex: 'M' | 'F' | 'O') => {
    setFormData(prev => ({ ...prev, sex }))
    if (success) setSuccess(null)
  }
  
  const validateForm = () => {
    const errors = []
    
    if (formData.age < 1 || formData.age > 120) {
      errors.push('Age must be between 1 and 120 years')
    }
    if (formData.weight < 20 || formData.weight > 300) {
      errors.push('Weight must be between 20kg and 300kg')
    }
    if (formData.height < 50 || formData.height > 250) {
      errors.push('Height must be between 50cm and 250cm')
    }
    if (!['M', 'F', 'O'].includes(formData.sex)) {
      errors.push('Please select a valid gender option')
    }

    return errors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const errors = validateForm()
    if (errors.length > 0) {
      setError(errors.join('\n'))
      return
    }

    setSaving(true)
    setError(null)
    setSuccess(null)

    try {
      const profile = await profileService.getProfile()
      if (profile?.id) {
        // Only send weight, height, and sex for update
        const updateData = {
          weight: formData.weight,
          height: formData.height,
          sex: formData.sex
        }
        await profileService.updateProfile(profile.id, updateData)
        setSuccess('Profile updated successfully!')
      } else {
        // Create new profile
        await profileService.saveProfile(formData)
        setSuccess('Profile created successfully!')
        setHasProfile(true)
        setIsCreating(false)
      }
      
      // Refresh profile data after update
      const updatedProfile = await profileService.getProfile()
      if (updatedProfile) {
        setExistingProfile(updatedProfile)
      }
      
    } catch (err: any) {
      setError(err.message || 'Failed to save profile')
      console.error('Failed to save profile:', err)
    } finally {
      setSaving(false)
    }
  }

  const calculateBMI = () => {
    return profileService.calculateBMI(formData.weight, formData.height)
  }

  const getBMICategory = () => {
    return profileService.getBMICategory(calculateBMI())
  }

  const getBMR = () => {
    // Mifflin-St Jeor Equation
    if (formData.sex === 'M') {
      return Math.round(10 * formData.weight + 6.25 * formData.height - 5 * formData.age + 5)
    } else {
      return Math.round(10 * formData.weight + 6.25 * formData.height - 5 * formData.age - 161)
    }
  }

  const getDailyCalories = () => {
    const bmr = getBMR()
    // Assuming moderate activity level
    return Math.round(bmr * 1.55)
  }

  const getBMIProgress = () => {
    const bmi = calculateBMI()
    // Scale BMI to progress bar (15-40 range)
    if (bmi < 15) return 0
    if (bmi > 40) return 100
    return ((bmi - 15) / 25) * 100
  }

  const lastTimeUpdated = existingProfile
    ? new Date(existingProfile.updated_at).toLocaleString()
    : "N/A"

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
                <div className="absolute inset-0 border-4 border-transparent border-t-blue-500 border-r-purple-500 rounded-full animate-spin" />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-3"
            >
              <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                Loading Your Health Profile
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md">
                Fetching your personalized health data and analytics...
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
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur" />
                  <div className="relative p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full">
                    <UserCircle className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                    {hasProfile ? 'Health Profile' : 'Complete Your Profile'}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 text-lg">
                    {hasProfile 
                      ? 'Update your health metrics for accurate insights' 
                      : 'Set up your basic health information to get started'
                    }
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full text-sm">
              <Shield className="h-3 w-3" />
              <span>Secure & Encrypted</span>
            </div>
          </div>
        </motion.div>

        {!hasProfile && !isCreating ? (
         
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 text-center border-0">
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full mb-4">
                  <FileText className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  No Health Profile Found
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  You haven't set up your basic health profile yet. This information helps us provide personalized health insights.
                </p>
              </div>
              
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 mb-8">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Information We'll Ask:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Age</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">For age-appropriate recommendations</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                      <Weight className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Weight</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">For BMI and calorie calculations</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                      <Ruler className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Height</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">For BMI and growth tracking</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-lg">
                      <User className="h-4 w-4 text-pink-600 dark:text-pink-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Gender</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">For personalized health insights</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => setIsCreating(true)}
                  className="w-full h-14 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl rounded-xl font-semibold text-lg transition-all duration-300"
                >
                  <div className="flex items-center justify-center gap-3">
                    <Plus className="h-5 w-5" />
                    Set Up Health Profile
                  </div>
                </button>
             
              </div>
            </div>
          </motion.div>
        ) : (
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-2"
            >
              <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border-0">
                <div className="p-8 border-b border-gray-200/50 dark:border-gray-800/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {hasProfile ? 'Health Information' : 'Create Health Profile'}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Provide accurate information for personalized health insights
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <span>Last updated: {lastTimeUpdated}</span>
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-8">
                    <AnimatePresence>
                      {error && (
                        <motion.div
                          initial={{ opacity: 0, height: 0, y: -10 }}
                          animate={{ opacity: 1, height: 'auto', y: 0 }}
                          exit={{ opacity: 0, height: 0, y: -10 }}
                          className="flex items-start gap-3 p-4 bg-gradient-to-r from-red-50 to-red-50/50 dark:from-red-900/20 dark:to-red-900/10 rounded-xl border border-red-200 dark:border-red-800/50"
                        >
                          <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                          <div className="space-y-1">
                            <p className="font-medium text-red-700 dark:text-red-300">Validation Error</p>
                            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                          </div>
                        </motion.div>
                      )}

                      {success && (
                        <motion.div
                          initial={{ opacity: 0, height: 0, y: -10 }}
                          animate={{ opacity: 1, height: 'auto', y: 0 }}
                          exit={{ opacity: 0, height: 0, y: -10 }}
                          className="flex items-start gap-3 p-4 bg-gradient-to-r from-emerald-50 to-emerald-50/50 dark:from-emerald-900/20 dark:to-emerald-900/10 rounded-xl border border-emerald-200 dark:border-emerald-800/50"
                        >
                          <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                          <div className="space-y-1">
                            <p className="font-medium text-emerald-700 dark:text-emerald-300">Success!</p>
                            <p className="text-sm text-emerald-600 dark:text-emerald-400">{success}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Age */}
                    <div className="space-y-4">
                      <label className="text-gray-700 dark:text-gray-300 text-base font-medium flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-blue-500" />
                        Age (years)
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="relative">
                          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                              <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            </div>
                          </div>
                          <input
                            type="number"
                            value={formData.age}
                            onChange={(e) => {
                              const value = parseFloat(e.target.value) || 0
                              setFormData(prev => ({ ...prev, age: value }))
                              if (success) setSuccess(null)
                            }}
                            min="1"
                            max="120"
                            className="w-full pl-12 pr-4 h-14 rounded-xl border-2 border-gray-300/50 dark:border-gray-700/50 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-lg"
                            required
                          />
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Age helps provide age-appropriate health recommendations
                      </p>
                    </div>

                    {/* Weight & Height Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Weight */}
                      <div className="space-y-4">
                        <label className="text-gray-700 dark:text-gray-300 text-base font-medium flex items-center gap-2">
                          <Weight className="h-4 w-4 text-green-500" />
                          Weight (kg)
                        </label>
                        <div className="relative group">
                          <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="relative">
                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                <Weight className="h-5 w-5 text-green-600 dark:text-green-400" />
                              </div>
                            </div>
                            <input
                              type="number"
                              step="0.1"
                              min="20"
                              max="300"
                              value={formData.weight}
                              onChange={handleWeightChange}
                              className="w-full pl-12 pr-4 h-14 rounded-xl border-2 border-gray-300/50 dark:border-gray-700/50 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 text-lg"
                              required
                            />
                          </div>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Current: {existingProfile?.weight || formData.weight} kg
                        </p>
                      </div>

                      {/* Height */}
                      <div className="space-y-4">
                        <label className="text-gray-700 dark:text-gray-300 text-base font-medium flex items-center gap-2">
                          <Ruler className="h-4 w-4 text-purple-500" />
                          Height (cm)
                        </label>
                        <div className="relative group">
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="relative">
                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                <Ruler className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                              </div>
                            </div>
                            <input
                              type="number"
                              step="0.1"
                              min="50"
                              max="250"
                              value={formData.height}
                              onChange={handleHeightChange}
                              className="w-full pl-12 pr-4 h-14 rounded-xl border-2 border-gray-300/50 dark:border-gray-700/50 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-lg"
                              required
                            />
                          </div>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Current: {existingProfile?.height || formData.height} cm
                        </p>
                      </div>
                    </div>

                    {/* Gender Selection */}
                    <div className="space-y-4">
                      <label className="text-gray-700 dark:text-gray-300 text-base font-medium flex items-center gap-2">
                        <User className="h-4 w-4 text-pink-500" />
                        Gender
                      </label>
                      <div className="grid grid-cols-3 gap-4">
                        {[
                          { value: 'M', label: 'Male', icon: Mars, color: 'from-blue-500 to-cyan-500' },
                          { value: 'F', label: 'Female', icon: Venus, color: 'from-pink-500 to-rose-500' },
                          { value: 'O', label: 'Other', icon: User, color: 'from-purple-500 to-violet-500' },
                        ].map((option) => (
                          <motion.button
                            key={option.value}
                            type="button"
                            onClick={() => handleSexSelect(option.value as 'M' | 'F' | 'O')}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`relative overflow-hidden rounded-2xl p-6 border-2 transition-all duration-300 ${
                              formData.sex === option.value
                                ? `border-transparent bg-gradient-to-br ${option.color} text-white shadow-xl`
                                : 'border-gray-300/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-900/50 text-gray-700 dark:text-gray-300 hover:border-gray-400/50 dark:hover:border-gray-600/50'
                            }`}
                          >
                            {formData.sex === option.value && (
                              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                            )}
                            <div className="relative z-10">
                              <div className="flex flex-col items-center gap-3">
                                <div className={`p-3 rounded-xl ${
                                  formData.sex === option.value
                                    ? 'bg-white/20'
                                    : 'bg-gray-100 dark:bg-gray-800'
                                }`}>
                                  <option.icon className={`h-6 w-6 ${
                                    formData.sex === option.value
                                      ? 'text-white'
                                      : 'text-gray-600 dark:text-gray-400'
                                  }`} />
                                </div>
                                <span className="font-semibold">{option.label}</span>
                                {formData.sex === option.value && existingProfile?.sex === option.value && (
                                  <span className="text-xs opacity-80">Current</span>
                                )}
                              </div>
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-6">
                      <button
                        type="submit"
                        disabled={saving}
                        className="w-full h-14 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl rounded-xl group relative overflow-hidden transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {/* Button Shine Effect */}
                        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-full transition-transform duration-1000" />
                        
                        {saving ? (
                          <div className="flex items-center gap-3 relative z-10 justify-center h-full">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span className="font-semibold">
                              {hasProfile ? 'Updating...' : 'Creating...'}
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-3 relative z-10 h-full">
                            <Save className="h-5 w-5" />
                            <span className="font-semibold text-lg">
                              {hasProfile ? 'Update Health Profile' : 'Create Health Profile'}
                            </span>
                            <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                          </div>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </motion.div>

            {/* Right Column - Preview & Insights */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-8"
            >
              {/* Health Summary Card */}
              <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-2xl sticky top-8 border-0">
                <div className="p-6 border-b border-gray-200/50 dark:border-gray-800/50">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Brain className="h-5 w-5 text-blue-500" />
                    Health Insights
                  </h3>
                </div>
                <div className="p-6 space-y-6">
                  {/* BMI Preview */}
                  <div className="p-4 bg-gradient-to-br from-blue-50/80 to-purple-50/80 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Body Mass Index</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Current calculation</p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        getBMICategory().category === 'Normal weight' 
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                          : getBMICategory().category === 'Overweight'
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                          : getBMICategory().category === 'Obese'
                          ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                          : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                      }`}>
                        {getBMICategory().category}
                      </div>
                    </div>
                    <div className="text-center mb-4">
                      <p className="text-5xl font-bold text-gray-900 dark:text-white">
                        {calculateBMI().toFixed(1)}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        Based on {formData.weight}kg & {formData.height}cm
                      </p>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${getBMIProgress()}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
                      <span>15</span>
                      <span>25</span>
                      <span>35</span>
                      <span>40+</span>
                    </div>
                  </div>

                  {/* Metabolic Stats */}
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50/50 dark:bg-gray-800/50 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Basal Metabolic Rate</p>
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">{getBMR()} kcal</p>
                        </div>
                        <div className="p-2 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-lg">
                          <Activity className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50/50 dark:bg-gray-800/50 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Daily Calorie Needs</p>
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">{getDailyCalories()} kcal</p>
                        </div>
                        <div className="p-2 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-lg">
                          <Target className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50/50 dark:bg-gray-800/50 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Daily Water Target</p>
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {Math.round(formData.weight * 35)} ml
                          </p>
                        </div>
                        <div className="p-2 bg-gradient-to-br from-cyan-100 to-blue-100 dark:from-cyan-900/30 dark:to-blue-900/30 rounded-lg">
                          <TrendingUp className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Data Security */}
              <div className="bg-gradient-to-br from-emerald-50/80 to-green-50/80 dark:from-emerald-900/20 dark:to-green-900/20 backdrop-blur-xl rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 p-3 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Your Data is Secure</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      All health information is encrypted end-to-end and never shared with third parties.
                      HIPAA compliant & GDPR ready.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}


      </div>
    </div>
  )
}