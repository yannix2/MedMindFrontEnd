// app/reset-password/page.tsx
"use client";

import { useState, FormEvent, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { 
  Lock, 
  LockKeyhole, 
  Shield,
  ArrowRight,
  AlertCircle,
  Loader2,
  Check,
  Brain,
  Eye,
  EyeOff,
  Sparkles,
  UserCheck,
  KeyRound,
  Mail,
  ArrowLeft
} from 'lucide-react';
import { PremiumNavbar } from '@/components/layout/navbar';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  useEffect(() => {
    const emailFromQuery = searchParams.get('email');
    if (emailFromQuery) {
      setEmail(decodeURIComponent(emailFromQuery));
    }
  }, [searchParams]);

  // Check password strength
  useEffect(() => {
    const checks = {
      length: newPassword.length >= 8,
      uppercase: /[A-Z]/.test(newPassword),
      lowercase: /[a-z]/.test(newPassword),
      number: /[0-9]/.test(newPassword),
      special: /[^A-Za-z0-9]/.test(newPassword),
    };
    
    setPasswordCriteria(checks);
    
    // Calculate strength (0-100)
    const passed = Object.values(checks).filter(Boolean).length;
    setPasswordStrength((passed / 5) * 100);
  }, [newPassword]);

  const getStrengthColor = (strength: number) => {
    if (strength < 40) return 'from-red-500 to-red-400';
    if (strength < 70) return 'from-yellow-500 to-yellow-400';
    return 'from-emerald-500 to-green-400';
  };

  const getStrengthText = (strength: number) => {
    if (strength < 40) return 'Weak';
    if (strength < 70) return 'Medium';
    return 'Strong';
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/accounts/reset-password/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          new_password: newPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to reset password');
      }

      const result = await response.json();

      if (result.ok) {
        setSuccess('Password reset successfully! Redirecting to sign in...');

        // Clear cookies
        document.cookie = 'verification_code=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        document.cookie = 'verification_email=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';

        // Redirect to sign in after 2 seconds
        setTimeout(() => {
          router.push('/signin');
        }, 2000);
      } else {
        throw new Error(result.message || 'Password reset failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Floating gradient orbs
  const gradientOrbs = [
    { x: 10, y: 20, color: 'from-emerald-500/20 to-green-500/20', size: 96, duration: 20 },
    { x: 85, y: 40, color: 'from-blue-500/20 to-cyan-500/20', size: 128, duration: 25, delay: 2 },
    { x: 25, y: 70, color: 'from-teal-500/20 to-emerald-500/20', size: 80, duration: 30, delay: 4 },
  ];

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
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500 rounded-3xl blur-xl opacity-70 group-hover:opacity-90 transition-opacity duration-500" />
                    <div className="relative bg-gradient-to-br from-emerald-600 via-teal-600 to-blue-600 p-4 rounded-3xl shadow-2xl shadow-emerald-500/20 dark:shadow-emerald-900/30">
                      <Brain className="h-10 w-10 text-white" />
                    </div>
                  </motion.div>
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 bg-clip-text text-transparent">
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
                    Create Your{' '}
                    <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 bg-clip-text text-transparent">
                      New Password
                    </span>
                  </h2>
                  <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                    Secure your account with a strong, unique password. 
                    Your data's security is our top priority.
                  </p>
                  <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-emerald-50/50 to-teal-50/50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl border border-emerald-200/50 dark:border-emerald-800/30">
                    <Mail className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Account Recovery</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Resetting password for: {email}</p>
                    </div>
                  </div>
                </div>

                {/* Password Guidelines */}
                <div className="space-y-6 pt-4">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                    <LockKeyhole className="h-5 w-5 text-emerald-500" />
                    Password Security Guidelines
                  </h3>
                  <div className="space-y-3">
                    {[
                      { criteria: 'length', label: 'At least 8 characters', icon: '🔢' },
                      { criteria: 'uppercase', label: 'One uppercase letter', icon: '⬆️' },
                      { criteria: 'lowercase', label: 'One lowercase letter', icon: '⬇️' },
                      { criteria: 'number', label: 'One number', icon: '🔟' },
                      { criteria: 'special', label: 'One special character', icon: '✨' },
                    ].map((item) => (
                      <motion.div
                        key={item.criteria}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="flex items-center gap-3"
                      >
                        <div className={`h-6 w-6 rounded-full flex items-center justify-center transition-all duration-300 ${
                          passwordCriteria[item.criteria as keyof typeof passwordCriteria]
                            ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500'
                        }`}>
                          {passwordCriteria[item.criteria as keyof typeof passwordCriteria] ? (
                            <Check className="h-3 w-3" />
                          ) : (
                            <span className="text-xs">{item.icon}</span>
                          )}
                        </div>
                        <span className={`text-sm transition-colors duration-300 ${
                          passwordCriteria[item.criteria as keyof typeof passwordCriteria]
                            ? 'text-emerald-700 dark:text-emerald-300 font-medium'
                            : 'text-gray-600 dark:text-gray-400'
                        }`}>
                          {item.label}
                        </span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Password Strength Meter */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        Password Strength
                      </span>
                      <span className={`text-sm font-semibold bg-gradient-to-r ${getStrengthColor(passwordStrength)} bg-clip-text text-transparent`}>
                        {getStrengthText(passwordStrength)}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full bg-gradient-to-r ${getStrengthColor(passwordStrength)}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${passwordStrength}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Right Side - Reset Password Form */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="relative"
              >
                {/* Form Glow Effect */}
                <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-blue-500/10 rounded-3xl blur-2xl" />
                
                <Card className="relative border-0 shadow-2xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl overflow-hidden">
                  {/* Card Header */}
                  <CardHeader className="space-y-3 pb-6">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white">
                        Set New Password
                      </CardTitle>
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full blur" />
                        <div className="relative p-2 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full">
                          <LockKeyhole className="h-5 w-5 text-white" />
                        </div>
                      </div>
                    </div>
                    <CardDescription className="text-gray-600 dark:text-gray-400 text-base">
                      Create a strong password to secure your MedMind account
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="pb-8">
                    <form onSubmit={handleSubmit} className="space-y-7">
                      {/* New Password Field */}
                      <div className="space-y-3">
                        <Label htmlFor="newPassword" className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                          New Password
                        </Label>
                        <div className="relative group">
                          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="relative">
                            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <Input
                              id="newPassword"
                              name="newPassword"
                              type={showNewPassword ? "text" : "password"}
                              placeholder="Create strong password"
                              className="pl-12 pr-12 h-14 rounded-xl border-2 border-gray-300/50 dark:border-gray-700/50 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              required
                              disabled={isLoading}
                              minLength={8}
                            />
                            <button
                              type="button"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                              disabled={isLoading}
                            >
                              {showNewPassword ? (
                                <EyeOff className="h-5 w-5" />
                              ) : (
                                <Eye className="h-5 w-5" />
                              )}
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Minimum 8 characters with letters, numbers, and symbols
                        </p>
                      </div>

                      {/* Confirm Password Field */}
                      <div className="space-y-3">
                        <Label htmlFor="confirmPassword" className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                          Confirm Password
                        </Label>
                        <div className="relative group">
                          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="relative">
                            <LockKeyhole className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <Input
                              id="confirmPassword"
                              name="confirmPassword"
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="Re-enter your password"
                              className="pl-12 pr-12 h-14 rounded-xl border-2 border-gray-300/50 dark:border-gray-700/50 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              required
                              disabled={isLoading}
                              minLength={8}
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                              disabled={isLoading}
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="h-5 w-5" />
                              ) : (
                                <Eye className="h-5 w-5" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Password Match Indicator */}
                      {newPassword && confirmPassword && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className={`flex items-center gap-3 p-3 rounded-xl ${
                            newPassword === confirmPassword
                              ? 'bg-emerald-50/50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800/50'
                              : 'bg-red-50/50 dark:bg-red-900/20 border-red-200 dark:border-red-800/50'
                          } border`}
                        >
                          {newPassword === confirmPassword ? (
                            <>
                              <Check className="h-5 w-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                              <p className="text-sm text-emerald-700 dark:text-emerald-300 font-medium">
                                Passwords match
                              </p>
                            </>
                          ) : (
                            <>
                              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                              <p className="text-sm text-red-700 dark:text-red-300 font-medium">
                                Passwords do not match
                              </p>
                            </>
                          )}
                        </motion.div>
                      )}

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
                            <p className="text-sm text-red-700 dark:text-red-300">
                              {error}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Success Message */}
                      <AnimatePresence>
                        {success && (
                          <motion.div
                            initial={{ opacity: 0, height: 0, y: -10 }}
                            animate={{ opacity: 1, height: 'auto', y: 0 }}
                            exit={{ opacity: 0, height: 0, y: -10 }}
                            className="flex items-start gap-3 p-4 bg-gradient-to-r from-emerald-50 to-emerald-50/50 dark:from-emerald-900/20 dark:to-emerald-900/10 rounded-xl border border-emerald-200 dark:border-emerald-800/50"
                          >
                            <Check className="h-5 w-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                                Password Reset Successful!
                              </p>
                              <p className="text-sm text-emerald-600/80 dark:text-emerald-400/80 mt-1">
                                Redirecting to sign in...
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Submit Button */}
                      <Button
                        type="submit"
                        className="w-full h-14 bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 hover:from-emerald-700 hover:via-teal-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl rounded-xl group relative overflow-hidden transition-all duration-500"
                        disabled={isLoading || newPassword !== confirmPassword || passwordStrength < 40}
                      >
                        {/* Button Shine Effect */}
                        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-full transition-transform duration-1000" />
                        
                        {isLoading ? (
                          <div className="flex items-center gap-3 relative z-10">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span className="font-semibold">Securing Account...</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3 relative z-10">
                            <span className="font-semibold">Reset Password</span>
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
                          Remember your password?
                        </span>
                      </div>
                    </div>

                    {/* Back to Sign In */}
                    <div className="text-center">
                      <Link href="/signin">
                        <Button
                          variant="outline"
                          className="w-full h-14 rounded-xl border-2 border-gray-300/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-900/50 hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/20 text-gray-800 dark:text-gray-200 hover:text-emerald-700 dark:hover:text-emerald-400 transition-all duration-300 group"
                          disabled={isLoading}
                        >
                          <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                          <span className="font-semibold">Back to Sign In</span>
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
  );
}