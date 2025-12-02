'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Brain,
  Heart,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  Save,
  Loader2,
  Plus,
  X,
  Shield,
  Sparkles,
  Pill,
  HeartPulse,
  LucideAlarmSmoke,
  Wine,
  AlertTriangle,
  Stethoscope,
  Activity,
  ChevronRight,
  UserCircle,
  FileText,
  Thermometer,
  Syringe
} from 'lucide-react'
import { authService } from '@/lib/auth'
import { medicalProfileService, MedicalProfileFormData } from '@/lib/medical-profile'

export default function MyHealthProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const [medicalProfile, setMedicalProfile] = useState<any>(null)
  const [hasProfile, setHasProfile] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  const [formData, setFormData] = useState<MedicalProfileFormData>({
    allergies: [],
    maladies: [],
    is_smoker: false,
    is_alcoholic: false,
    is_drugging: false,
    drug_type: ''
  })

  const [newAllergy, setNewAllergy] = useState('')
  const [newMalady, setNewMalady] = useState('')

  const gradientOrbs = [
    { x: 5, y: 10, color: 'from-blue-500/20 to-purple-500/20', size: 140, duration: 25 },
    { x: 90, y: 60, color: 'from-emerald-500/15 to-cyan-500/15', size: 120, duration: 30, delay: 2 },
    { x: 15, y: 85, color: 'from-purple-500/15 to-pink-500/15', size: 160, duration: 20, delay: 1 },
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
        const profile = await medicalProfileService.getMedicalProfile()
        
        if (profile) {
          setMedicalProfile(profile)
          setHasProfile(true)
          setFormData({
            allergies: profile.allergies || [],
            maladies: profile.maladies || [],
            is_smoker: profile.is_smoker || false,
            is_alcoholic: profile.is_alcoholic || false,
            is_drugging: profile.is_drugging || false,
            drug_type: profile.drug_type || ''
          })
        } else {
          setHasProfile(false)
        }
      } catch (error: any) {
        if (!error.message.includes('404') && !error.message.includes('not found')) {
          console.error('Error loading medical profile:', error)
          setError('Failed to load medical profile. Please try again.')
        }
      }
    } catch (error) {
      console.error('Auth check error:', error)
      router.push('/signin')
    } finally {
      setLoading(false)
    }
  }

  const handleAddAllergy = () => {
    if (newAllergy.trim() && !formData.allergies.includes(newAllergy.trim())) {
      setFormData(prev => ({
        ...prev,
        allergies: [...prev.allergies, newAllergy.trim()]
      }))
      setNewAllergy('')
    }
  }

  const handleRemoveAllergy = (allergy: string) => {
    setFormData(prev => ({
      ...prev,
      allergies: prev.allergies.filter(a => a !== allergy)
    }))
  }

  const handleAddMalady = () => {
    if (newMalady.trim() && !formData.maladies.includes(newMalady.trim())) {
      setFormData(prev => ({
        ...prev,
        maladies: [...prev.maladies, newMalady.trim()]
      }))
      setNewMalady('')
    }
  }

  const handleRemoveMalady = (malady: string) => {
    setFormData(prev => ({
      ...prev,
      maladies: prev.maladies.filter(m => m !== malady)
    }))
  }

  const handleToggle = (field: keyof Pick<MedicalProfileFormData, 'is_smoker' | 'is_alcoholic' | 'is_drugging'>) => {
    setFormData(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
    if (field === 'is_drugging' && !formData.is_drugging) {
      setFormData(prev => ({ ...prev, drug_type: '' }))
    }
  }

  const validateForm = () => {
    const errors = []
    
    if (formData.is_drugging && !formData.drug_type?.trim()) {
      errors.push('Please specify the drug type if you use drugs')
    }
    
    if (formData.allergies.length > 50) {
      errors.push('Too many allergies. Please limit to 50 or fewer.')
    }
    
    if (formData.maladies.length > 50) {
      errors.push('Too many medical conditions. Please limit to 50 or fewer.')
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
      if (medicalProfile?.id) {
        // Update existing profile
        await medicalProfileService.updateMedicalProfile(medicalProfile.id, formData)
        setSuccess('Medical profile updated successfully!')
      } else {
        // Create new profile
        await medicalProfileService.createMedicalProfile(formData)
        setSuccess('Medical profile created successfully!')
        setHasProfile(true)
        setIsCreating(false)
      }
      
      // Refresh data
      const updatedProfile = await medicalProfileService.getMedicalProfile()
      if (updatedProfile) {
        setMedicalProfile(updatedProfile)
      }
      
    } catch (err: any) {
      setError(err.message || 'Failed to save medical profile')
      console.error('Failed to save medical profile:', err)
    } finally {
      setSaving(false)
    }
  }

  const getCommonAllergies = medicalProfileService.getCommonAllergies()
  const getCommonMaladies = medicalProfileService.getCommonMaladies()
  const getCommonDrugTypes = medicalProfileService.getCommonDrugTypes()

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
                Loading Your Medical Profile
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md">
                Fetching your medical history and health conditions...
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
                    <HeartPulse className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                    Update Medical Profile
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 text-lg">
                    Your complete medical history and health conditions
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full text-sm">
              <Shield className="h-3 w-3" />
              <span>HIPAA Compliant</span>
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
                  No Medical Profile Found
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  You haven't set up your medical profile yet. This information helps us provide better health insights.
                </p>
              </div>
              
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 mb-8">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Information We'll Ask:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                      <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Allergies</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Food, medication, environmental</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                      <Stethoscope className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Medical Conditions</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Chronic illnesses, diseases</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                      <LucideAlarmSmoke className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Lifestyle Factors</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">LucideAlarmSmoke, alcohol, substance use</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                      <Heart className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Health Insights</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Personalized recommendations</p>
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
                    Set Up Medical Profile
                  </div>
                </button>
                
                <button
                  onClick={() => router.push('/dashboard')}
                  className="w-full h-12 border-2 border-gray-300/50 dark:border-gray-700/50 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-all duration-300"
                >
                  Skip for Now
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
                        {hasProfile ? 'Medical Information' : 'Create Medical Profile'}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Provide accurate medical information for better health insights
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      {hasProfile && medicalProfile?.updated_at && (
                        <span>Last updated: {new Date(medicalProfile.updated_at).toLocaleString()}</span>
                      )}
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

                    {/* Allergies */}
                    <div className="space-y-4">
                      <label className="text-gray-700 dark:text-gray-300 text-base font-medium flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                        Allergies
                      </label>
                      <div className="space-y-4">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newAllergy}
                            onChange={(e) => setNewAllergy(e.target.value)}
                            placeholder="Add an allergy (e.g., Penicillin, Pollen)"
                            className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-300/50 dark:border-gray-700/50 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                          />
                          <button
                            type="button"
                            onClick={handleAddAllergy}
                            className="px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
                          >
                            <Plus className="h-5 w-5" />
                          </button>
                        </div>
                        
                        {/* Suggested allergies */}
                        <div className="flex flex-wrap gap-2">
                          {getCommonAllergies.slice(0, 8).map((allergy) => (
                            <button
                              key={allergy}
                              type="button"
                              onClick={() => {
                                if (!formData.allergies.includes(allergy)) {
                                  setFormData(prev => ({
                                    ...prev,
                                    allergies: [...prev.allergies, allergy]
                                  }))
                                }
                              }}
                              className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            >
                              + {allergy}
                            </button>
                          ))}
                        </div>

                        {/* Selected allergies */}
                        {formData.allergies.length > 0 && (
                          <div className="mt-4">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Selected allergies ({formData.allergies.length}):</p>
                            <div className="flex flex-wrap gap-2">
                              {formData.allergies.map((allergy) => (
                                <div
                                  key={allergy}
                                  className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-900/10 rounded-lg"
                                >
                                  <span className="text-sm text-gray-900 dark:text-white">{allergy}</span>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveAllergy(allergy)}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Medical Conditions */}
                    <div className="space-y-4">
                      <label className="text-gray-700 dark:text-gray-300 text-base font-medium flex items-center gap-2">
                        <Stethoscope className="h-4 w-4 text-green-500" />
                        Medical Conditions
                      </label>
                      <div className="space-y-4">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newMalady}
                            onChange={(e) => setNewMalady(e.target.value)}
                            placeholder="Add a medical condition (e.g., Diabetes, Hypertension)"
                            className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-300/50 dark:border-gray-700/50 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                          />
                          <button
                            type="button"
                            onClick={handleAddMalady}
                            className="px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300"
                          >
                            <Plus className="h-5 w-5" />
                          </button>
                        </div>
                        
                        {/* Suggested conditions */}
                        <div className="flex flex-wrap gap-2">
                          {getCommonMaladies.slice(0, 8).map((malady) => (
                            <button
                              key={malady}
                              type="button"
                              onClick={() => {
                                if (!formData.maladies.includes(malady)) {
                                  setFormData(prev => ({
                                    ...prev,
                                    maladies: [...prev.maladies, malady]
                                  }))
                                }
                              }}
                              className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            >
                              + {malady}
                            </button>
                          ))}
                        </div>

                        {/* Selected conditions */}
                        {formData.maladies.length > 0 && (
                          <div className="mt-4">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Medical conditions ({formData.maladies.length}):</p>
                            <div className="flex flex-wrap gap-2">
                              {formData.maladies.map((malady) => (
                                <div
                                  key={malady}
                                  className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/10 rounded-lg"
                                >
                                  <span className="text-sm text-gray-900 dark:text-white">{malady}</span>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveMalady(malady)}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Lifestyle Factors */}
                    <div className="space-y-6">
                      <label className="text-gray-700 dark:text-gray-300 text-base font-medium flex items-center gap-2">
                        <Activity className="h-4 w-4 text-purple-500" />
                        Lifestyle Factors
                      </label>

                      {/* LucideAlarmSmoke */}
                      <div className="p-4 bg-gray-50/50 dark:bg-gray-800/50 rounded-xl">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${formData.is_smoker ? 'bg-red-100 dark:bg-red-900/30' : 'bg-gray-100 dark:bg-gray-800'}`}>
                              <LucideAlarmSmoke className={`h-5 w-5 ${formData.is_smoker ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'}`} />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">Smoker</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Do you smoke tobacco products?</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleToggle('is_smoker')}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.is_smoker ? 'bg-red-500' : 'bg-gray-300 dark:bg-gray-700'}`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.is_smoker ? 'translate-x-6' : 'translate-x-1'}`}
                            />
                          </button>
                        </div>
                      </div>

                      {/* Alcohol */}
                      <div className="p-4 bg-gray-50/50 dark:bg-gray-800/50 rounded-xl">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${formData.is_alcoholic ? 'bg-amber-100 dark:bg-amber-900/30' : 'bg-gray-100 dark:bg-gray-800'}`}>
                              <Wine className={`h-5 w-5 ${formData.is_alcoholic ? 'text-amber-600 dark:text-amber-400' : 'text-gray-600 dark:text-gray-400'}`} />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">Alcohol Consumption</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Do you consume alcohol regularly?</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleToggle('is_alcoholic')}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.is_alcoholic ? 'bg-amber-500' : 'bg-gray-300 dark:bg-gray-700'}`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.is_alcoholic ? 'translate-x-6' : 'translate-x-1'}`}
                            />
                          </button>
                        </div>
                      </div>

                      {/* Drug Use */}
                      <div className="p-4 bg-gray-50/50 dark:bg-gray-800/50 rounded-xl">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${formData.is_drugging ? 'bg-purple-100 dark:bg-purple-900/30' : 'bg-gray-100 dark:bg-gray-800'}`}>
                              <Pill className={`h-5 w-5 ${formData.is_drugging ? 'text-purple-600 dark:text-purple-400' : 'text-gray-600 dark:text-gray-400'}`} />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">Substance Use</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">Do you use recreational drugs?</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleToggle('is_drugging')}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.is_drugging ? 'bg-purple-500' : 'bg-gray-300 dark:bg-gray-700'}`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.is_drugging ? 'translate-x-6' : 'translate-x-1'}`}
                            />
                          </button>
                        </div>

                        {formData.is_drugging && (
                          <div className="space-y-4">
                            <label className="text-sm text-gray-700 dark:text-gray-300">
                              What type of substances do you use?
                            </label>
                            <div className="flex flex-wrap gap-2 mb-4">
                              {getCommonDrugTypes.slice(0, 6).map((drugType) => (
                                <button
                                  key={drugType}
                                  type="button"
                                  onClick={() => setFormData(prev => ({ ...prev, drug_type: drugType }))}
                                  className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${formData.drug_type === drugType
                                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                  }`}
                                >
                                  {drugType}
                                </button>
                              ))}
                            </div>
                            <input
                              type="text"
                              value={formData.drug_type || ''}
                              onChange={(e) => setFormData(prev => ({ ...prev, drug_type: e.target.value }))}
                              placeholder="Or specify other drug type..."
                              className="w-full px-4 py-3 rounded-xl border-2 border-gray-300/50 dark:border-gray-700/50 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                            />
                          </div>
                        )}
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
                              {hasProfile ? 'Update Medical Profile' : 'Create Medical Profile'}
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

            {/* Right Column - Profile Preview */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-8"
            >
              {/* Medical Summary Card */}
              <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-2xl sticky top-8 border-0">
                <div className="p-6 border-b border-gray-200/50 dark:border-gray-800/50">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Brain className="h-5 w-5 text-blue-500" />
                    Medical Summary
                  </h3>
                </div>
                <div className="p-6 space-y-6">
                  {/* Health Status */}
                  <div className="p-4 bg-gradient-to-br from-blue-50/80 to-purple-50/80 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Health Status</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Based on your information</p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        formData.allergies.length === 0 && 
                        formData.maladies.length === 0 && 
                        !formData.is_smoker && 
                        !formData.is_alcoholic && 
                        !formData.is_drugging
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                      }`}>
                        {formData.allergies.length === 0 && 
                         formData.maladies.length === 0 && 
                         !formData.is_smoker && 
                         !formData.is_alcoholic && 
                         !formData.is_drugging
                          ? 'Excellent'
                          : 'Needs Review'}
                      </div>
                    </div>
                    
                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {formData.allergies.length}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Allergies</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {formData.maladies.length}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Conditions</p>
                      </div>
                    </div>
                  </div>

                  {/* Risk Factors */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white">Risk Factors</h4>
                    <div className="space-y-3">
                      {formData.is_smoker && (
                        <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-red-50 to-red-50/50 dark:from-red-900/20 dark:to-red-900/10 rounded-lg">
                          <LucideAlarmSmoke className="h-4 w-4 text-red-600 dark:text-red-400" />
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">LucideAlarmSmoke</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">High health risk factor</p>
                          </div>
                        </div>
                      )}
                      
                      {formData.is_alcoholic && (
                        <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-amber-50 to-amber-50/50 dark:from-amber-900/20 dark:to-amber-900/10 rounded-lg">
                          <Wine className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">Alcohol Use</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">Moderate health risk factor</p>
                          </div>
                        </div>
                      )}
                      
                      {formData.is_drugging && (
                        <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50 to-purple-50/50 dark:from-purple-900/20 dark:to-purple-900/10 rounded-lg">
                          <Pill className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">Substance Use</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              {formData.drug_type ? `Type: ${formData.drug_type}` : 'Substance use detected'}
                            </p>
                          </div>
                        </div>
                      )}
                      
                      {!formData.is_smoker && !formData.is_alcoholic && !formData.is_drugging && (
                        <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-emerald-50 to-emerald-50/50 dark:from-emerald-900/20 dark:to-emerald-900/10 rounded-lg">
                          <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">No Lifestyle Risks</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">Good lifestyle choices</p>
                          </div>
                        </div>
                      )}
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
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Confidential Medical Data</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Your medical information is protected by HIPAA regulations. Only authorized healthcare professionals can access this data.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400"
        >
          <div className="flex items-center justify-center gap-6">
            <div className="flex items-center gap-2">
              <Sparkles className="h-3 w-3" />
              <span>HIPAA Compliant</span>
            </div>
            <div className="h-4 w-px bg-gray-300 dark:bg-gray-700" />
            <div className="flex items-center gap-2">
              <Shield className="h-3 w-3" />
              <span>End-to-End Encryption</span>
            </div>
            <div className="h-4 w-px bg-gray-300 dark:bg-gray-700" />
            <div>© 2024 MedMind Health Intelligence</div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}