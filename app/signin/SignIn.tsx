"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { 
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
  LockKeyhole,
  UserCheck
} from 'lucide-react'
import { useUser } from '@/contexts/user-context'
import { PremiumNavbar } from '@/components/layout/navbar'

export default function SignInPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/dashboard'
  const { user, isLoading: authLoading, login, error: authError } = useUser()
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [success, setSuccess] = useState(false)

  // Check if already logged in
  useEffect(() => {
    if (user && !authLoading) {
      const timer = setTimeout(() => {
        router.push(redirect)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [user, authLoading, router, redirect])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      await login(formData.email, formData.password)
      setSuccess(true)
      setTimeout(() => {
        router.push(redirect)
      }, 1500)
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  // Floating gradient orbs
  const gradientOrbs = [
    { x: 10, y: 20, color: 'from-blue-500/20 to-purple-500/20', size: 96, duration: 20 },
    { x: 85, y: 40, color: 'from-purple-500/20 to-pink-500/20', size: 128, duration: 25, delay: 2 },
    { x: 25, y: 70, color: 'from-cyan-500/20 to-blue-500/20', size: 80, duration: 30, delay: 4 },
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
                <div className="absolute inset-0 border-4 border-transparent border-t-blue-500 border-r-purple-500 rounded-full animate-spin" />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-3"
            >
              <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                Securing Your Session
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md">
                We're verifying your authentication status with enterprise-grade security protocols.
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
                <LockKeyhole className="h-5 w-5 text-white" />
              </motion.div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center space-y-4"
            >
              <h2 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                Authentication Successful
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-md">
                Welcome back! Your secure session is being established.
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
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 text-center">
                Redirecting to your personalized dashboard...
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    )
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
                x: [0, Math.sin(index) * 40, 0],
                y: [0, Math.cos(index) * 40, 0],
                scale: [1, 1.1, 1],
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
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000003_1px,transparent_1px),linear-gradient(to_bottom,#00000003_1px,transparent_1px)] bg-[size:60px_60px] opacity-50" />

        <div className="container relative mx-auto px-4 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-5xl mx-auto"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
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
                    Welcome to{' '}
                    <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                      Smarter Health
                    </span>
                  </h2>
                  <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                    Access your personalized health insights, AI-driven recommendations, 
                    and progress tracking through our secure, enterprise-grade platform.
                  </p>
                </div>

                {/* Premium Features */}
                <div className="space-y-6 pt-4">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                    <UserCheck className="h-5 w-5 text-blue-500" />
                    Enterprise-Grade Security & Features
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { icon: Shield, title: 'End-to-End Encryption', desc: 'Military-grade data protection' },
                      { icon: Brain, title: 'AI Health Analysis', desc: 'Personalized insights in real-time' },
                      { icon: Heart, title: 'Health Monitoring', desc: 'Continuous wellness tracking' },
                      { icon: LockKeyhole, title: 'Privacy First', desc: 'Your data never leaves your control' },
                    ].map((feature, index) => (
                      <motion.div
                        key={feature.title}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                        className="flex items-start gap-3 p-4 rounded-2xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200/30 dark:border-gray-800/30 hover:border-blue-200 dark:hover:border-blue-800/50 transition-colors"
                      >
                        <div className="flex-shrink-0 p-2.5 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-xl">
                          <feature.icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800 dark:text-gray-200 text-sm">{feature.title}</h4>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">{feature.desc}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Right Side - Premium Sign In Form */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="relative"
              >
                {/* Form Glow Effect */}
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl blur-2xl" />
                
                <Card className="relative border-0 shadow-2xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl overflow-hidden">
                  {/* Card Header */}
                  <CardHeader className="space-y-3 pb-6">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white">
                        Secure Sign In
                      </CardTitle>
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur" />
                        <div className="relative p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full">
                          <LockKeyhole className="h-5 w-5 text-white" />
                        </div>
                      </div>
                    </div>
                    <CardDescription className="text-gray-600 dark:text-gray-400 text-base">
                      Enter your credentials to access your personalized health dashboard
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="pb-8">
                    <form onSubmit={handleSubmit} className="space-y-7">
                      {/* Email Field */}
                      <div className="space-y-3">
                        <Label htmlFor="email" className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                          Email Address
                        </Label>
                        <div className="relative group">
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="relative">
                            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              placeholder="you@company.com"
                              className="pl-12 h-14 rounded-xl border-2 border-gray-300/50 dark:border-gray-700/50 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                              value={formData.email}
                              onChange={handleChange}
                              required
                              disabled={isSubmitting}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Password Field */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="password" className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                            Password
                          </Label>
                          <Link
                            href="/forgot-password"
                            className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                          >
                            Forgot password?
                          </Link>
                        </div>
                        <div className="relative group">
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="relative">
                            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <Input
                              id="password"
                              name="password"
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter your password"
                              className="pl-12 pr-12 h-14 rounded-xl border-2 border-gray-300/50 dark:border-gray-700/50 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                              value={formData.password}
                              onChange={handleChange}
                              required
                              disabled={isSubmitting}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                              disabled={isSubmitting}
                            >
                              {showPassword ? (
                                <EyeOff className="h-5 w-5" />
                              ) : (
                                <Eye className="h-5 w-5" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Remember Me */}
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id="remember"
                          checked={rememberMe}
                          onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                          disabled={isSubmitting}
                          className="h-5 w-5 rounded-lg border-2 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-blue-600 data-[state=checked]:to-purple-600"
                        />
                        <Label
                          htmlFor="remember"
                          className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer"
                        >
                          Keep me signed in 
                        </Label>
                      </div>

                      {/* Error Message */}
                      <AnimatePresence>
                        {(error || authError) && (
                          <motion.div
                            initial={{ opacity: 0, height: 0, y: -10 }}
                            animate={{ opacity: 1, height: 'auto', y: 0 }}
                            exit={{ opacity: 0, height: 0, y: -10 }}
                            className="flex items-start gap-3 p-4 bg-gradient-to-r from-red-50 to-red-50/50 dark:from-red-900/20 dark:to-red-900/10 rounded-xl border border-red-200 dark:border-red-800/50"
                          >
                            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-700 dark:text-red-300">
                              {error || authError}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Submit Button */}
                      <Button
                        type="submit"
                        className="w-full h-14 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl rounded-xl group relative overflow-hidden transition-all duration-500"
                        disabled={isSubmitting}
                      >
                        {/* Button Shine Effect */}
                        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-full transition-transform duration-1000" />
                        
                        {isSubmitting ? (
                          <div className="flex items-center gap-3 relative z-10">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span className="font-semibold">Authenticating...</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3 relative z-10">
                            <span className="font-semibold">Sign In to Dashboard</span>
                            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                          </div>
                        )}
                      </Button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-8">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300/50 dark:border-gray-700/50" />
                      </div>
                      <div className="relative flex justify-center">
                        <span className="px-4 bg-white dark:bg-gray-900 text-sm text-gray-500 dark:text-gray-400">
                          New to MedMind?
                        </span>
                      </div>
                    </div>

                    {/* Create Account */}
                    <div className="text-center">
                      <Link href="/signup">
                        <Button
                          variant="outline"
                          className="w-full h-14 rounded-xl border-2 border-gray-300/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-900/50 hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 text-gray-800 dark:text-gray-200 hover:text-blue-700 dark:hover:text-blue-400 transition-all duration-300 group"
                          disabled={isSubmitting}
                        >
                          <span className="font-semibold">Create new account</span>
                          <Sparkles className="h-4 w-4 ml-2 group-hover:rotate-12 transition-transform" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>

                  {/* Security Footer */}
                  <CardFooter className="border-t border-gray-200/50 dark:border-gray-800/50 pt-6">
                    <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400 w-full">
                      <Shield className="h-3 w-3" />
                      <span>Enterprise-grade security • HIPAA compliant • GDPR ready</span>
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