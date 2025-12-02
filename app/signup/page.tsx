"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  Brain,
  Shield,
  Heart,
  AlertCircle,
  Loader2,
  Check,
  Phone,
  Home,
  CreditCard,
  FileText,
  ArrowLeft
} from 'lucide-react'
import { useUser } from '@/contexts/user-context'
import { PremiumNavbar } from '@/components/layout/navbar'

export default function SignUpPage() {
  const router = useRouter()
  const { user, isLoading: authLoading, register } = useUser()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // Required fields
    name: '',
    last_name: '',
    email: '',
    cin: '',
    password: '',
    confirmPassword: '',
    // Optional fields
    phone_number: '',
    address: '',
    // Terms
    acceptTerms: false,
    acceptPrivacy: false,
    marketingEmails: false
  })

  // Redirect if already logged in
  useEffect(() => {
    if (user && !authLoading) {
      router.push('/dashboard')
    }
  }, [user, authLoading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
      return
    }
    
    // Final validation
    if (!formData.acceptTerms || !formData.acceptPrivacy) {
      setError('You must accept the Terms of Service and Privacy Policy')
      return
    }

    setError('')
    setIsSubmitting(true)

    try {
      await register(formData)
      setSuccess(true)
      setTimeout(() => {
        router.push('/signin')
      }, 3000)
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.name && formData.last_name && formData.email && formData.cin)
      case 2:
        return !!(formData.password && formData.confirmPassword && formData.password === formData.confirmPassword && formData.password.length >= 6)
      case 3:
        return true
      default:
        return false
    }
  }

  // Floating gradient orbs
  const gradientOrbs = [
    { x: 15, y: 25, color: 'from-blue-500/15 to-purple-500/15', size: 120, duration: 25 },
    { x: 80, y: 35, color: 'from-purple-500/15 to-pink-500/15', size: 160, duration: 30, delay: 3 },
    { x: 30, y: 65, color: 'from-emerald-500/15 to-cyan-500/15', size: 100, duration: 35, delay: 6 },
  ]

  // Show loading state while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-950 overflow-hidden">
        <PremiumNavbar />
        <div className="container mx-auto px-4 py-24">
          <div className="flex flex-col items-center justify-center min-h-[70vh] gap-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              <div className="h-20 w-20 border-4 border-gray-200 dark:border-gray-800 rounded-full">
                <div className="absolute inset-0 border-4 border-transparent border-t-emerald-500 border-r-cyan-500 rounded-full animate-spin" />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-3"
            >
              <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                Checking Authentication
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md">
                Please wait while we verify your session status.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    )
  }

  // Show success state
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-950">
        <PremiumNavbar />
        <div className="container mx-auto px-4 py-24">
          <div className="flex flex-col items-center justify-center min-h-[70vh] gap-8">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", damping: 15 }}
              className="relative"
            >
              <div className="h-24 w-24 bg-gradient-to-br from-emerald-500 to-green-500 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/30">
                <Check className="h-12 w-12 text-white" />
              </div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="absolute -top-2 -right-2 h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg"
              >
                <User className="h-5 w-5 text-white" />
              </motion.div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center space-y-4"
            >
              <h2 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                Account Created Successfully!
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-md">
                Your MedMind account has been created. You will be redirected to sign in.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="w-80 max-w-full"
            >
              <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-500"
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 3, ease: "easeInOut" }}
                />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 text-center">
                Redirecting to sign in page...
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    )
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <div className="space-y-1">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                Personal Information
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Enter your basic information to create your account
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* First Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">
                  First Name <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="name"
                    name="name"
                    placeholder="John"
                    className="pl-10 h-12 rounded-xl border-2 border-gray-300/50 dark:border-gray-700/50 bg-transparent"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Last Name */}
              <div className="space-y-2">
                <Label htmlFor="last_name" className="text-gray-700 dark:text-gray-300">
                  Last Name <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="last_name"
                    name="last_name"
                    placeholder="Doe"
                    className="pl-10 h-12 rounded-xl border-2 border-gray-300/50 dark:border-gray-700/50 bg-transparent"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
                  Email Address <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john.doe@example.com"
                    className="pl-10 h-12 rounded-xl border-2 border-gray-300/50 dark:border-gray-700/50 bg-transparent"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* CIN */}
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="cin" className="text-gray-700 dark:text-gray-300">
                  CIN / National ID <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="cin"
                    name="cin"
                    placeholder="Enter your CIN or National ID"
                    className="pl-10 h-12 rounded-xl border-2 border-gray-300/50 dark:border-gray-700/50 bg-transparent"
                    value={formData.cin}
                    onChange={handleChange}
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  This will be used for identity verification and is required for health services.
                </p>
              </div>
            </div>
          </>
        )

      case 2:
        return (
          <>
            <div className="space-y-1">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                Security & Credentials
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Create a secure password for your account
              </p>
            </div>

            <div className="space-y-4">
              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">
                  Password <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    className="pl-10 pr-10 h-12 rounded-xl border-2 border-gray-300/50 dark:border-gray-700/50 bg-transparent"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className={`h-2 flex-1 rounded-full ${formData.password.length >= 6 ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'}`} />
                    <span className="text-xs text-gray-500">6+ characters</span>
                  </div>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-700 dark:text-gray-300">
                  Confirm Password <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    className="pl-10 pr-10 h-12 rounded-xl border-2 border-gray-300/50 dark:border-gray-700/50 bg-transparent"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="text-sm text-red-500">Passwords do not match</p>
                )}
              </div>

              {/* Password Requirements */}
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800/50">
                <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Password Requirements:</h4>
                <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
                  <li className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${formData.password.length >= 6 ? 'bg-green-500' : 'bg-gray-300'}`} />
                    At least 6 characters long
                  </li>
                  <li className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${/[A-Z]/.test(formData.password) ? 'bg-green-500' : 'bg-gray-300'}`} />
                    Contains uppercase letters
                  </li>
                  <li className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${/[0-9]/.test(formData.password) ? 'bg-green-500' : 'bg-gray-300'}`} />
                    Contains numbers
                  </li>
                </ul>
              </div>
            </div>
          </>
        )

      case 3:
        return (
          <>
            <div className="space-y-1">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                Additional Information & Terms
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Optional details and agreements
              </p>
            </div>

            <div className="space-y-6">
              {/* Optional Fields */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-700 dark:text-gray-300">Optional Information</h4>
                
                <div className="space-y-2">
                  <Label htmlFor="phone_number" className="text-gray-600 dark:text-gray-400">
                    Phone Number (Optional)
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="phone_number"
                      name="phone_number"
                      type="tel"
                      placeholder="+212 600 000 000"
                      className="pl-10 h-12 rounded-xl border-2 border-gray-300/50 dark:border-gray-700/50 bg-transparent"
                      value={formData.phone_number}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="text-gray-600 dark:text-gray-400">
                    Address (Optional)
                  </Label>
                  <div className="relative">
                    <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="address"
                      name="address"
                      placeholder="Your address for delivery (optional)"
                      className="pl-10 h-12 rounded-xl border-2 border-gray-300/50 dark:border-gray-700/50 bg-transparent"
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              {/* Terms & Agreements */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-700 dark:text-gray-300">Agreements</h4>
                
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="acceptTerms"
                      name="acceptTerms"
                      checked={formData.acceptTerms}
                      onCheckedChange={(checked) => setFormData({...formData, acceptTerms: checked as boolean})}
                      className="h-5 w-5 rounded-lg mt-0.5"
                    />
                    <Label htmlFor="acceptTerms" className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      I agree to the{' '}
                      <Link href="/terms" className="text-blue-600 hover:text-blue-700 dark:text-blue-400">
                        Terms of Service
                      </Link>{' '}
                      <span className="text-red-500">*</span>
                    </Label>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="acceptPrivacy"
                      name="acceptPrivacy"
                      checked={formData.acceptPrivacy}
                      onCheckedChange={(checked) => setFormData({...formData, acceptPrivacy: checked as boolean})}
                      className="h-5 w-5 rounded-lg mt-0.5"
                    />
                    <Label htmlFor="acceptPrivacy" className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      I agree to the{' '}
                      <Link href="/privacy" className="text-blue-600 hover:text-blue-700 dark:text-blue-400">
                        Privacy Policy
                      </Link>{' '}
                      and understand how my health data will be used <span className="text-red-500">*</span>
                    </Label>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="marketingEmails"
                      name="marketingEmails"
                      checked={formData.marketingEmails}
                      onCheckedChange={(checked) => setFormData({...formData, marketingEmails: checked as boolean})}
                      className="h-5 w-5 rounded-lg mt-0.5"
                    />
                    <Label htmlFor="marketingEmails" className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      I want to receive health tips, AI insights, and product updates via email
                    </Label>
                  </div>
                </div>
              </div>
            </div>
          </>
        )
    }
  }

  return (
    <>
      <PremiumNavbar />
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
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000002_1px,transparent_1px),linear-gradient(to_bottom,#00000002_1px,transparent_1px)] bg-[size:60px_60px] opacity-30" />

        <div className="container relative mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-5xl mx-auto"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {/* Left Side - Elegant Introduction */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="space-y-10"
              >
                {/* Logo & Brand */}
                <div className="inline-flex items-center gap-4 group">
                  <motion.div
                    whileHover={{ rotate: 12, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl blur-xl opacity-70 group-hover:opacity-90 transition-opacity duration-500" />
                    <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-4 rounded-3xl shadow-2xl shadow-blue-500/20 dark:shadow-blue-900/30">
                      <Brain className="h-10 w-10 text-white" />
                    </div>
                  </motion.div>
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                      MedMind
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium tracking-wide">
                      AI-Powered Health Intelligence Platform
                    </p>
                  </div>
                </div>

                {/* Main Message */}
                <div className="space-y-6">
                  <h2 className="text-5xl font-bold text-gray-900 dark:text-white leading-tight">
                    Start Your{' '}
                    <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                      Health Journey
                    </span>
                  </h2>
                  <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                    Join thousands who have transformed their health with AI-powered insights, 
                    personalized recommendations, and continuous monitoring.
                  </p>
                </div>

                {/* Benefits */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-purple-500" />
                    Why Join MedMind?
                  </h3>
                  <div className="space-y-4">
                    {[
                      { icon: Brain, title: 'AI Health Analysis', desc: 'Get personalized health insights powered by advanced AI' },
                      { icon: Heart, title: 'Continuous Monitoring', desc: 'Track your health progress with real-time updates' },
                      { icon: Shield, title: 'Secure & Private', desc: 'Your health data is encrypted and never shared' },
                      { icon: FileText, title: 'Medical Reports', desc: 'Generate professional health reports for doctors' },
                    ].map((benefit, index) => (
                      <motion.div
                        key={benefit.title}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                        className="flex items-start gap-3 p-4 rounded-2xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200/30 dark:border-gray-800/30"
                      >
                        <div className="flex-shrink-0 p-2.5 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-xl">
                          <benefit.icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800 dark:text-gray-200">{benefit.title}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">{benefit.desc}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Right Side - Multi-step Sign Up Form */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="relative"
              >
                {/* Form Glow Effect */}
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl blur-2xl" />
                
                <Card className="relative border-0 shadow-2xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl overflow-hidden">
                  {/* Progress Steps */}
                  <div className="px-8 pt-8">
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                          Create Account
                        </CardTitle>
                        <CardDescription className="text-gray-600 dark:text-gray-400">
                          Step {currentStep} of 3
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3].map((step) => (
                          <div
                            key={step}
                            className={`h-2 w-8 rounded-full transition-all duration-300 ${
                              step === currentStep
                                ? 'bg-gradient-to-r from-blue-500 to-purple-500'
                                : step < currentStep
                                ? 'bg-emerald-500'
                                : 'bg-gray-300 dark:bg-gray-700'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <CardContent className="pb-8">
                    <form onSubmit={handleSubmit}>
                      <div className="space-y-6">
                        {renderStep()}

                        {/* Error Message */}
                        <AnimatePresence>
                          {error && (
                            <motion.div
                              initial={{ opacity: 0, height: 0, y: -10 }}
                              animate={{ opacity: 1, height: 'auto', y: 0 }}
                              exit={{ opacity: 0, height: 0, y: -10 }}
                              className="flex items-start gap-3 p-4 bg-gradient-to-r from-red-50 to-red-50/50 dark:from-red-900/20 dark:to-red-900/10 rounded-xl border border-red-200 dark:border-red-800/50"
                            >
                              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-4 pt-6">
                          {currentStep > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              onClick={handleBack}
                              className="flex-1 h-12 rounded-xl border-2 border-gray-300/50 dark:border-gray-700/50"
                              disabled={isSubmitting}
                            >
                              <ArrowLeft className="h-4 w-4 mr-2" />
                              Back
                            </Button>
                          )}
                          
                          <Button
                            type="submit"
                            className={`${currentStep > 1 ? 'flex-1' : 'w-full'} h-12 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl rounded-xl group relative overflow-hidden`}
                            disabled={isSubmitting || !validateStep(currentStep)}
                          >
                            {/* Button Shine Effect */}
                            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-full transition-transform duration-1000" />
                            
                            {isSubmitting ? (
                              <div className="flex items-center gap-2 relative z-10">
                                <Loader2 className="h-5 w-5 animate-spin" />
                                <span>Creating Account...</span>
                              </div>
                            ) : currentStep < 3 ? (
                              <div className="flex items-center gap-2 relative z-10">
                                <span>Continue</span>
                                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 relative z-10">
                                <Sparkles className="h-4 w-4" />
                                <span>Create Account</span>
                              </div>
                            )}
                          </Button>
                        </div>
                      </div>
                    </form>

                    {/* Already have account */}
                    <div className="pt-8 mt-8 border-t border-gray-200/50 dark:border-gray-800/50">
                      <div className="text-center">
                        <p className="text-gray-600 dark:text-gray-400">
                          Already have an account?{' '}
                          <Link
                            href="/signin"
                            className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                          >
                            Sign In
                          </Link>
                        </p>
                      </div>
                    </div>
                  </CardContent>

                  {/* Security Footer */}
                  <CardFooter className="border-t border-gray-200/50 dark:border-gray-800/50 pt-6">
                    <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400 w-full">
                      <Shield className="h-3 w-3" />
                      <span>HIPAA compliant • GDPR ready • End-to-end encrypted</span>
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  )
}