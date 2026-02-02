// app/forgot-password/page.tsx
"use client";

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import jwt from "jwt-encode";
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { 
  Mail, 
  LockKeyhole, 
  Shield,
  ArrowRight,
  Sparkles,
  AlertCircle,
  Loader2,
  Check,
  Brain,
  Heart,
  UserCheck,
  Lock,
  ArrowLeft,
  KeyRound,
  MailCheck
} from 'lucide-react';
import { PremiumNavbar } from '@/components/layout/navbar';

// Type definitions
interface User {
  id: number;
  name: string;
  last_name: string;
  email: string;
  cin: string;
  phone_number: string;
  address: string;
  is_active: boolean;
}

interface EmailResponse {
  ok: boolean;
  email: string;
  verification_code: string;
  message: string;
}

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [step, setStep] = useState(1); // 1: Email input, 2: Verification code
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Function to create JWT token
  const JWT_SECRET = process.env.NEXT_PUBLIC_MAILER_SECRET || "dev-secret"; 
  
  const createForgotPasswordToken = (email: string): string => {
    const payload = {
      email,
      purpose: "forgot_password",
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 600 // expires in 10 min
    };
    return jwt(payload, JWT_SECRET);
  };

  // Function to set cookie
  const setVerificationCodeCookie = (code: string, email: string) => {
    const expires = new Date(Date.now() + 10 * 60 * 1000).toUTCString();
    document.cookie = `verification_code=${code}; path=/; expires=${expires}; SameSite=Strict`;
    document.cookie = `verification_email=${email}; path=/; expires=${expires}; SameSite=Strict`;
  };

  // Step 1: Check email and send verification code
  const handleEmailSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const checkEmailResponse = await fetch(
        `http://127.0.0.1:8000/api/accounts/users?email=${encodeURIComponent(email)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!checkEmailResponse.ok) {
        throw new Error('Failed to check email');
      }

      const users: User[] = await checkEmailResponse.json();

      if (!users || users.length === 0) {
        setError('No account found with this email address.');
        setIsLoading(false);
        return;
      }

      const user = users[0];
      const token = createForgotPasswordToken(user.email);
      console.log("TOKEN USED:", token);

      const emailResponse = await fetch('http://localhost:5009/mail/forgot-password', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      if (!emailResponse.ok) {
        throw new Error('Failed to send verification email');
      }

      const emailResult: EmailResponse = await emailResponse.json();

      if (emailResult.ok) {
        setVerificationCodeCookie(emailResult.verification_code, user.email);
        setStep(2);
        setSuccess('Verification code sent to your email!');
      } else {
        throw new Error(emailResult.message || 'Failed to send email');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify code and redirect to reset password
  const handleVerificationSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const emailCookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('verification_email='))
        ?.split('=')[1];

      const savedCode = document.cookie
        .split('; ')
        .find(row => row.startsWith('verification_code='))
        ?.split('=')[1];

      if (!savedCode || !emailCookie) {
        throw new Error('Verification session expired. Please start again.');
      }

      if (verificationCode !== savedCode) {
        throw new Error('Invalid verification code');
      }

      document.cookie = 'verification_code=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      router.push(`/reset-password?email=${encodeURIComponent(emailCookie)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Floating gradient orbs
  const gradientOrbs = [
    { x: 10, y: 20, color: 'from-blue-500/20 to-purple-500/20', size: 96, duration: 20 },
    { x: 85, y: 40, color: 'from-purple-500/20 to-pink-500/20', size: 128, duration: 25, delay: 2 },
    { x: 25, y: 70, color: 'from-cyan-500/20 to-blue-500/20', size: 80, duration: 30, delay: 4 },
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
                    Reset Your{' '}
                    <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                      Password
                    </span>
                  </h2>
                  <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                    Secure your account with our multi-step verification process. 
                    We'll send you a verification code to ensure maximum security.
                  </p>
                </div>

                {/* Security Features */}
                <div className="space-y-6 pt-4">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                    <Shield className="h-5 w-5 text-blue-500" />
                    Enterprise-Grade Security Process
                  </h3>
                  <div className="space-y-4">
                    {[
                      { icon: MailCheck, title: 'Email Verification', desc: 'Secure code sent to your registered email', step: 1 },
                      { icon: KeyRound, title: 'Code Validation', desc: 'One-time verification code for security', step: 2 },
                      { icon: LockKeyhole, title: 'Password Reset', desc: 'Create a new strong password', step: 3 },
                    ].map((feature) => (
                      <motion.div
                        key={feature.title}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 + feature.step * 0.1 }}
                        className={`flex items-start gap-4 p-4 rounded-2xl backdrop-blur-sm border transition-all duration-300 ${
                          step >= feature.step 
                            ? 'bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-900/30 dark:to-purple-900/30 border-blue-200 dark:border-blue-800/50' 
                            : 'bg-white/30 dark:bg-gray-900/30 border-gray-200/30 dark:border-gray-800/30'
                        }`}
                      >
                        <div className={`flex-shrink-0 p-3 rounded-xl transition-all duration-300 ${
                          step >= feature.step 
                            ? 'bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/40 dark:to-purple-900/40' 
                            : 'bg-gray-100 dark:bg-gray-800/50'
                        }`}>
                          <feature.icon className={`h-5 w-5 transition-colors duration-300 ${
                            step >= feature.step 
                              ? 'text-blue-600 dark:text-blue-400' 
                              : 'text-gray-400 dark:text-gray-500'
                          }`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                              step >= feature.step 
                                ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400' 
                                : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                            }`}>
                              Step {feature.step}
                            </span>
                            <h4 className={`font-semibold transition-colors duration-300 ${
                              step >= feature.step 
                                ? 'text-gray-800 dark:text-gray-200' 
                                : 'text-gray-600 dark:text-gray-400'
                            }`}>
                              {feature.title}
                            </h4>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{feature.desc}</p>
                        </div>
                      </motion.div>
                    ))}
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
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl blur-2xl" />
                
                <Card className="relative border-0 shadow-2xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl overflow-hidden">
                  {/* Card Header */}
                  <CardHeader className="space-y-3 pb-6">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white">
                        {step === 1 ? 'Reset Password' : 'Verify Identity'}
                      </CardTitle>
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur" />
                        <div className="relative p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full">
                          {step === 1 ? <Mail className="h-5 w-5 text-white" /> : <KeyRound className="h-5 w-5 text-white" />}
                        </div>
                      </div>
                    </div>
                    <CardDescription className="text-gray-600 dark:text-gray-400 text-base">
                      {step === 1 
                        ? 'Enter your email to receive a verification code' 
                        : 'Enter the 6-digit code sent to your email'}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="pb-8">
                    <AnimatePresence mode="wait">
                      {step === 1 ? (
                        <motion.form
                          key="email-form"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          onSubmit={handleEmailSubmit}
                          className="space-y-7"
                        >
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
                                  value={email}
                                  onChange={(e) => setEmail(e.target.value)}
                                  required
                                  disabled={isLoading}
                                />
                              </div>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              We'll send a verification code to this address
                            </p>
                          </div>

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
                                <p className="text-sm text-emerald-700 dark:text-emerald-300">
                                  {success}
                                </p>
                              </motion.div>
                            )}
                          </AnimatePresence>

                          {/* Submit Button */}
                          <Button
                            type="submit"
                            className="w-full h-14 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl rounded-xl group relative overflow-hidden transition-all duration-500"
                            disabled={isLoading}
                          >
                            {/* Button Shine Effect */}
                            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-full transition-transform duration-1000" />
                            
                            {isLoading ? (
                              <div className="flex items-center gap-3 relative z-10">
                                <Loader2 className="h-5 w-5 animate-spin" />
                                <span className="font-semibold">Sending Code...</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-3 relative z-10">
                                <span className="font-semibold">Send Verification Code</span>
                                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                              </div>
                            )}
                          </Button>
                        </motion.form>
                      ) : (
                        <motion.form
                          key="verification-form"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          onSubmit={handleVerificationSubmit}
                          className="space-y-7"
                        >
                          {/* Verification Code Field */}
                          <div className="space-y-3">
                            <Label htmlFor="verificationCode" className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                              Verification Code
                            </Label>
                            <div className="relative group">
                              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                              <div className="relative">
                                <KeyRound className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <Input
                                  id="verificationCode"
                                  name="verificationCode"
                                  type="text"
                                  placeholder="Enter 6-digit code"
                                  className="pl-12 h-14 rounded-xl border-2 border-gray-300/50 dark:border-gray-700/50 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-center tracking-widest text-2xl font-mono"
                                  value={verificationCode}
                                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                  required
                                  disabled={isLoading}
                                  maxLength={6}
                                />
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                Check your email for the verification code
                              </p>
                              <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors flex items-center gap-1"
                              >
                                <ArrowLeft className="h-3 w-3" />
                                Change email
                              </button>
                            </div>
                          </div>

                          {/* Timer Display (optional) */}
                          <div className="p-4 bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-200/50 dark:border-blue-800/30">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="h-8 w-8 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/40 dark:to-purple-900/40 rounded-lg flex items-center justify-center">
                                  <LockKeyhole className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Code expires in 10 minutes</p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">For your security</p>
                                </div>
                              </div>
                            </div>
                          </div>

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

                          {/* Submit Button */}
                          <Button
                            type="submit"
                            className="w-full h-14 bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-600 hover:from-emerald-700 hover:via-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl rounded-xl group relative overflow-hidden transition-all duration-500"
                            disabled={isLoading}
                          >
                            {/* Button Shine Effect */}
                            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-full transition-transform duration-1000" />
                            
                            {isLoading ? (
                              <div className="flex items-center gap-3 relative z-10">
                                <Loader2 className="h-5 w-5 animate-spin" />
                                <span className="font-semibold">Verifying...</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-3 relative z-10">
                                <span className="font-semibold">Verify & Continue</span>
                                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                              </div>
                            )}
                          </Button>
                        </motion.form>
                      )}
                    </AnimatePresence>

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
                          className="w-full h-14 rounded-xl border-2 border-gray-300/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-900/50 hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 text-gray-800 dark:text-gray-200 hover:text-blue-700 dark:hover:text-blue-400 transition-all duration-300 group"
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