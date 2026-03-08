'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Variants, TargetAndTransition } from "framer-motion";
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Brain, Send, User, Bot, Clock,  ChevronLeft,
  MessageSquare, Loader2, Copy, ThumbsUp, ThumbsDown,
  X, CheckCircle, AlertCircle,
  BrainCircuit, 
  Heart, Dumbbell, Apple, Moon,Pill,
 
  Trash2, 
   Cpu as Processor, Atom, Binary,
  CircuitBoard,  Infinity as InfinityIcon,
  Network, Orbit, Hexagon,
  ShieldCheck,
} from 'lucide-react'

import Cookies from 'js-cookie'

interface Message {
  id: string
  content: string
  sender: 'user' | 'bot'
  timestamp: Date
  isLoading?: boolean
  error?: boolean
}

interface ChatbotResponse {
  response: string[]
}

interface Capability {
  icon: React.ReactNode
  title: string
  description: string
  color: string
  textColor: string
  examples: string[]
  gradient: string
}

const API_BASE_URL = 'http://127.0.0.1:8000/api'

const SUGGESTED_QUESTIONS = [
  "How can I improve my sleep quality?",
  "What's the best workout routine for beginners?",
  "Can you analyze my nutrition data?",
  "How to manage stress effectively?",
  "What are signs of vitamin deficiency?",
  "How much water should I drink daily?",
  "Best exercises for back pain?",
  "How to boost metabolism naturally?",
  "Healthy meal prep ideas?",
  "Signs of overtraining and recovery tips?"
]

export default function MedMindChatbotPage() {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm MedMind Bot 🤖 Your Advanced AI Health Assistant. I can help with nutrition analysis, fitness planning, sleep optimization, mental wellness, and personalized health recommendations. How can I assist you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [botStatus, setBotStatus] = useState<'idle' | 'thinking' | 'responding'>('idle')
  const [showSuggestions, setShowSuggestions] = useState(true)
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null)
  const [activeCapability, setActiveCapability] = useState<string | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(true)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Advanced capabilities showcase with cosmic theme
  const capabilities: Capability[] = [
    {
      icon: <div className="relative">
        <Hexagon className="h-7 w-7" />
        <Apple className="h-3 w-3 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
      </div>,
      title: "Nutrition Analysis",
      description: "MedMind dietary analysis with molecular optimization",
      color: "from-emerald-500 via-cyan-400 to-teal-500",
      textColor: "text-emerald-300",
      gradient: "bg-gradient-to-br from-emerald-900/30 via-teal-900/20 to-cyan-900/20",
      examples: ["Analyze my current diet", "Create a vegetarian meal plan", "Foods to boost energy"]
    },
    {
      icon: <div className="relative">
        <CircuitBoard className="h-7 w-7" />
        <Dumbbell className="h-3 w-3 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
      </div>,
      title: "Fitness Planning",
      description: "AI network optimized workout algorithms",
      color: "from-blue-500 via-indigo-400 to-violet-500",
      textColor: "text-blue-300",
      gradient: "bg-gradient-to-br from-blue-900/30 via-indigo-900/20 to-violet-900/20",
      examples: ["Beginner workout plan", "Home exercises", "Strength training tips"]
    },
    {
      icon: <div className="relative">
        <Orbit className="h-7 w-7" />
        <Moon className="h-3 w-3 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
      </div>,
      title: "Sleep Optimization",
      description: "Circadian rhythm synchronization technology",
      color: "from-indigo-500 via-purple-400 to-violet-500",
      textColor: "text-indigo-300",
      gradient: "bg-gradient-to-br from-indigo-900/30 via-purple-900/20 to-violet-900/20",
      examples: ["Sleep hygiene tips", "Fix sleep schedule", "Natural sleep aids"]
    },
    {
      icon: <div className="relative">
        <Network className="h-7 w-7" />
        <Brain className="h-3 w-3 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
      </div>,
      title: "Mental Wellness",
      description: "AI pathway optimization & cognitive enhancement",
      color: "from-purple-500 via-fuchsia-400 to-pink-500",
      textColor: "text-purple-300",
      gradient: "bg-gradient-to-br from-purple-900/30 via-fuchsia-900/20 to-pink-900/20",
      examples: ["Meditation techniques", "Stress relief", "Mindfulness exercises"]
    },
    {
      icon: <div className="relative">
        <Binary className="h-7 w-7" />
        <Heart className="h-3 w-3 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
      </div>,
      title: "Health Monitoring",
      description: "Real-time biometric AI tracking",
      color: "from-rose-500 via-pink-400 to-red-500",
      textColor: "text-rose-300",
      gradient: "bg-gradient-to-br from-rose-900/30 via-pink-900/20 to-red-900/20",
      examples: ["Check my symptoms", "Healthy vitals range", "Wellness tracking"]
    },
    {
      icon: <div className="relative">
        <Atom className="h-7 w-7" />
        <Pill className="h-3 w-3 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
      </div>,
      title: "Medical Guidance",
      description: "AI-powered diagnostic assistance protocols",
      color: "from-amber-500 via-orange-400 to-yellow-500",
      textColor: "text-amber-300",
      gradient: "bg-gradient-to-br from-amber-900/30 via-orange-900/20 to-yellow-900/20",
      examples: ["When to see a doctor", "First aid tips", "Medication guidance"]
    }
  ]

  // Scroll to bottom with smooth behavior
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'end'
    })
  }, [messages])

  // Focus input with animation
  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus()
    }, 300)
  }, [])

  // Get auth token
  const getAuthToken = () => {
    const token = Cookies.get('jwt')
    if (!token) {
      router.push('/signin')
      throw new Error('No authentication token found')
    }
    return token
  }

  // Handle sending message
  const handleSendMessage = async (content?: string) => {
    const messageContent = content || inputValue.trim()
    if (!messageContent || isLoading) return

    // Add user message with animation
    const userMessage: Message = {
      id: `${Date.now()}-user`,
      content: messageContent,
      sender: 'user',
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setShowSuggestions(false)
    setIsLoading(true)
    setBotStatus('thinking')
    setError(null)

    // Add thinking animation message
    const loadingMessage: Message = {
      id: `${Date.now() + 1}-loading`,
      content: '',
      sender: 'bot',
      timestamp: new Date(),
      isLoading: true
    }
    setMessages(prev => [...prev, loadingMessage])

    try {
      const token = getAuthToken()
      
      const response = await fetch(`${API_BASE_URL}/chatbot/chat/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: messageContent })
      })

      if (!response.ok) {
        throw new Error('Failed to get response from chatbot')
      }

      const data: ChatbotResponse = await response.json()
      
      // Remove loading message
      setMessages(prev => prev.filter(msg => !msg.isLoading))
      
      // Set bot status to responding
      setBotStatus('responding')
      
      // Process response with streaming effect
      if (data.response && Array.isArray(data.response)) {
        const fullResponse = data.response.join('')
        
        const botMessage: Message = {
          id: `${Date.now() + 2}-bot`,
          content: '',
          sender: 'bot',
          timestamp: new Date()
        }
        setMessages(prev => [...prev, botMessage])
        
        setIsTyping(true)
        let currentText = ''
        const typingSpeed = 3 // Ultra-fast typing for premium feel
        
        for (let i = 0; i < fullResponse.length; i++) {
          await new Promise(resolve => setTimeout(resolve, typingSpeed))
          currentText += fullResponse[i]
          setMessages(prev => 
            prev.map(msg => 
              msg.id === botMessage.id 
                ? { ...msg, content: currentText }
                : msg
            )
          )
        }
        
        setIsTyping(false)
        setBotStatus('idle')
        setSuccess('✓ AI response integrated successfully')
        setTimeout(() => setSuccess(null), 2000)
      }
      
    } catch (err: any) {
      console.error('Error sending message:', err)
      setError('MedMind connection disrupted. Recalibrating...')
      
      // Remove loading message and add error message
      setMessages(prev => {
        const filtered = prev.filter(msg => !msg.isLoading)
        return [...filtered, {
          id: `${Date.now() + 3}-error`,
          content: "⚠️ AI pathway interruption detected. Please retry your AI query.",
          sender: 'bot',
          timestamp: new Date(),
          error: true
        }]
      })
      setBotStatus('idle')
      
      setTimeout(() => setError(null), 5000)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle quick suggestion click
  const handleSuggestionClick = (question: string) => {
    setInputValue(question)
    setTimeout(() => handleSendMessage(question), 100)
  }

  // Copy message to clipboard with haptic feedback
  const copyToClipboard = async (text: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(text)
      if ('vibrate' in navigator) navigator.vibrate(50)
      setCopiedMessageId(messageId)
      setSuccess('Text AI-entangled to clipboard')
      setTimeout(() => {
        setCopiedMessageId(null)
        setSuccess(null)
      }, 2000)
    } catch (err) {
      setError('Failed to establish AI copy link')
    }
  }

  // Clear chat with cinematic effect
  const clearChat = () => {
    if (messages.length <= 1) return
    
    if (window.confirm('Initiate neural memory wipe sequence?')) {
      setMessages([{
        id: '1',
        content: "Hello! I'm MedMind Bot 🤖 Your Advanced AI Health Assistant. I can help with nutrition analysis, fitness planning, sleep optimization, mental wellness, and personalized health recommendations. How can I assist you today?",
        sender: 'bot',
        timestamp: new Date()
      }])
      setShowSuggestions(true)
      setSuccess('AI cache cleared successfully')
      setTimeout(() => setSuccess(null), 2000)
    }
  }

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // Toggle fullscreen
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }



  // Animation variants
const messageVariants: Variants = {
  hidden: ({ sender }: { sender: "user" | "bot" }): TargetAndTransition => ({
    opacity: 0,
    x: sender === "user" ? 50 : -50,
    scale: 0.8,
    rotateY: 15,
  }),
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    rotateY: 0,
    transition: {
      type: "spring" as const, // <-- fix: assert exact string literal
      stiffness: 300,
      damping: 30,
      mass: 1,
    },
  },
  exit: {
    opacity: 0,
    x: 0,
    scale: 0.8,
    rotateY: 15,
    transition: { duration: 0.3 },
  },
};

  return (
    <div className={`min-h-screen ${isFullscreen ? 'fixed inset-0 z-50' : ''} ${isDarkMode 
      ? 'bg-gradient-to-br from-gray-950 via-slate-950 to-neutral-950' 
      : 'bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50/30'}`}>
      
      {/* MedMind Particle Field Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Animated quantum particles */}
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 4 + 1,
              height: Math.random() * 4 + 1,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: `radial-gradient(circle, ${
                i % 5 === 0 ? '#60a5fa' : 
                i % 5 === 1 ? '#8b5cf6' : 
                i % 5 === 2 ? '#10b981' : 
                i % 5 === 3 ? '#ec4899' : 
                '#f59e0b'
              }, transparent)`,
              boxShadow: `0 0 ${Math.random() * 15 + 5}px ${Math.random() * 10 + 2}px currentColor`
            }}
            animate={{
              x: [0, Math.sin(i) * 400, 0],
              y: [0, Math.cos(i) * 400, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: Math.random() * 25 + 25,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 10
            }}
          />
        ))}
        
        {/* Animated grid with perspective */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(to right, #3b82f6 0.5px, transparent 0.5px),
                             linear-gradient(to bottom, #3b82f6 0.5px, transparent 0.5px)`,
            backgroundSize: '50px 50px',
            transform: 'perspective(1000px) rotateX(60deg)',
            transformOrigin: 'center top'
          }} />
        </div>

        {/* Floating geometric shapes */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`shape-${i}`}
            className="absolute border"
            style={{
              width: 100 + Math.random() * 200,
              height: 100 + Math.random() * 200,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              borderColor: i % 3 === 0 ? '#60a5fa40' : i % 3 === 1 ? '#8b5cf640' : '#10b98140',
              borderRadius: i % 2 === 0 ? '50%' : '0%',
              transform: `rotate(${Math.random() * 360}deg)`
            }}
            animate={{
              rotate: [0, 180, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: Math.random() * 30 + 30,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>

      {/* Neuromorphic Header */}
      <motion.header
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
        className={`sticky top-0 z-50 ${isDarkMode 
          ? 'bg-gray-900/80 backdrop-blur-2xl border-gray-800/60' 
          : 'bg-white/95 backdrop-blur-xl border-gray-300/60'} border-b shadow-2xl`}
        style={{
          boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.1), 0 8px 32px 0 rgba(0,0,0,0.3)'
        }}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <motion.button
                whileHover={{ scale: 1.1, rotate: -5 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => router.back()}
                className={`p-3 rounded-2xl ${isDarkMode 
                  ? 'bg-gray-800/60 hover:bg-gray-700/80' 
                  : 'bg-gray-100 hover:bg-gray-200'} transition-all duration-200 group`}
                style={{
                  boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.1), inset -2px -2px 4px rgba(255,255,255,0.1)'
                }}
              >
                <ChevronLeft className={`h-5 w-5 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} group-hover:text-blue-400 transition-colors`} />
              </motion.button>
              
              <div className="flex items-center gap-4">
                <motion.div
                  animate={{ 
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity,
                    repeatType: "reverse" 
                  }}
                  className="relative"
                >
                  <div className="relative p-4 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-3xl shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl" />
                    <BrainCircuit className="h-8 w-8 text-white" />
                    <motion.div
                      animate={{ 
                        scale: [1, 1.5, 1],
                        opacity: [0.3, 0.6, 0.3]
                      }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity 
                      }}
                      className="absolute -inset-2 border-2 border-blue-300/30 rounded-3xl"
                    />
                  </div>
                </motion.div>
                
                <div>
                  <motion.div
                    animate={{ 
                      backgroundPosition: ['0% 0%', '100% 100%'] 
                    }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity,
                      repeatType: "reverse" 
                    }}
                    className={`text-3xl font-bold bg-gradient-to-r ${isDarkMode 
                      ? 'from-blue-400 via-purple-400 to-pink-400' 
                      : 'from-blue-600 via-purple-600 to-pink-600'} bg-clip-text text-transparent bg-[length:200%_auto]`}
                  >
                    MedMind BOT
                  </motion.div>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-2">
                      <motion.div
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className={`h-2.5 w-2.5 rounded-full ${botStatus === 'idle' 
                          ? 'bg-gradient-to-r from-emerald-400 to-green-500' 
                          : botStatus === 'thinking' 
                          ? 'bg-gradient-to-r from-amber-400 to-orange-500' 
                          : 'bg-gradient-to-r from-blue-400 to-cyan-500'}`}
                      />
                      <span className={`text-sm font-medium ${isDarkMode 
                        ? botStatus === 'idle' ? 'text-emerald-400' : 
                          botStatus === 'thinking' ? 'text-amber-400' : 'text-blue-400'
                        : botStatus === 'idle' ? 'text-emerald-600' : 
                          botStatus === 'thinking' ? 'text-amber-600' : 'text-blue-600'}`}
                      >
                        {botStatus === 'thinking' ? 'AI Processing...' : 
                         botStatus === 'responding' ? 'MedMind Writing...' : 
                         'MedMind Ready'}
                      </span>
                    </div>
                    <div className={`h-4 w-px ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`} />
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      v2.1.4 | MedMind AI
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleFullscreen}
                className={`p-3 rounded-2xl ${isDarkMode 
                  ? 'bg-gray-800/60 hover:bg-gray-700/80 text-gray-300' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}`}
              >
                {isFullscreen ? '⛶ Exit' : '⛶ Full'}
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.08, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={clearChat}
                disabled={messages.length <= 1}
                className={`px-6 py-3 ${isDarkMode 
                  ? 'bg-gradient-to-r from-red-900/30 to-rose-900/20 text-red-400 hover:text-red-300' 
                  : 'bg-gradient-to-r from-red-50 to-rose-50 text-red-600 hover:text-red-700'} rounded-2xl transition-all duration-200 flex items-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed border ${isDarkMode ? 'border-red-800/40' : 'border-red-200'}`}
                style={{
                  boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.1), 0 4px 12px rgba(239, 68, 68, 0.2)'
                }}
              >
                <Trash2 className="h-4.5 w-4.5" />
                <span className="font-medium">Clear AI Cache</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/dashboard')}
                className={`px-6 py-3 ${isDarkMode 
                  ? 'bg-gradient-to-r from-blue-900/30 to-indigo-900/20 text-blue-400 hover:text-blue-300' 
                  : 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 hover:text-blue-700'} rounded-2xl font-medium border ${isDarkMode ? 'border-blue-800/40' : 'border-blue-200'}`}
                style={{
                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                }}
              >
                Dashboard
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* MedMind Notification System */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -80, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -80, scale: 0.8 }}
            className="fixed top-28 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-lg pointer-events-none"
          >
            <div className={`mx-6 px-6 py-4 ${isDarkMode 
              ? 'bg-gradient-to-r from-emerald-900/90 to-green-900/80 backdrop-blur-2xl' 
              : 'bg-gradient-to-r from-emerald-500 to-green-500'} text-white rounded-3xl shadow-2xl flex items-center gap-4 border ${isDarkMode ? 'border-emerald-700/50' : 'border-emerald-300'}`}
              style={{
                boxShadow: '0 20px 60px rgba(16, 185, 129, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)'
              }}
            >
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 0.5 }}
              >
                <CheckCircle className="h-7 w-7" />
              </motion.div>
              <span className="font-medium flex-1">{success}</span>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSuccess(null)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors pointer-events-auto"
              >
                <X className="h-4 w-4" />
              </motion.button>
            </div>
          </motion.div>
        )}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -80, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -80, scale: 0.8 }}
            className="fixed top-28 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-lg pointer-events-none"
          >
            <div className={`mx-6 px-6 py-4 ${isDarkMode 
              ? 'bg-gradient-to-r from-red-900/90 to-rose-900/80 backdrop-blur-2xl' 
              : 'bg-gradient-to-r from-red-500 to-rose-500'} text-white rounded-3xl shadow-2xl flex items-center gap-4 border ${isDarkMode ? 'border-red-700/50' : 'border-red-300'}`}
              style={{
                boxShadow: '0 20px 60px rgba(239, 68, 68, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)'
              }}
            >
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 0.5 }}
              >
                <AlertCircle className="h-7 w-7" />
              </motion.div>
              <span className="font-medium flex-1">{error}</span>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setError(null)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors pointer-events-auto"
              >
                <X className="h-4 w-4" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`container mx-auto ${isFullscreen ? 'px-0' : 'px-6'} py-8`}>
        <div className={`grid ${isFullscreen ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-5'} gap-8 h-[calc(100vh-180px)]`}>
          {/* MedMind Chat Interface */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            className={`${isFullscreen ? 'col-span-1' : 'lg:col-span-3'} h-full`}
          >
            <div className={`${isDarkMode ? 'bg-gray-900/80' : 'bg-white/95'} backdrop-blur-2xl rounded-3xl shadow-2xl border ${isDarkMode ? 'border-gray-800/60' : 'border-gray-300/50'} h-full flex flex-col overflow-hidden`}
              style={{
                boxShadow: 'inset 0 2px 8px 0 rgba(0,0,0,0.2), 0 20px 60px rgba(0,0,0,0.3)'
              }}
            >
              {/* MedMind Chat Header */}
              <div className={`p-8 border-b ${isDarkMode ? 'border-gray-800/60' : 'border-gray-300/60'} ${isDarkMode 
                ? 'bg-gradient-to-r from-blue-900/20 via-indigo-900/20 to-purple-900/20' 
                : 'bg-gradient-to-r from-blue-50/80 via-indigo-50/80 to-purple-50/80'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <motion.div
                      animate={{ 
                        rotate: botStatus === 'thinking' ? [0, 360] : 0,
                        scale: botStatus === 'thinking' ? [1, 1.1, 1] : 1
                      }}
                      transition={{ 
                        duration: botStatus === 'thinking' ? 3 : 0.4,
                        repeat: botStatus === 'thinking' ? Infinity : 0 
                      }}
                      className="relative"
                    >
                      <div className="relative h-20 w-20 rounded-3xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-2xl">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-3xl" />
                        <BrainCircuit className="h-10 w-10 text-white" />
                      </div>
                      {botStatus === 'thinking' && (
                        <>
                          <motion.div
                            animate={{ scale: [1, 2, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="absolute -inset-3 border-2 border-blue-400/30 rounded-3xl"
                          />
                          <motion.div
                            animate={{ scale: [1, 2.5, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                            className="absolute -inset-4 border border-purple-400/20 rounded-3xl"
                          />
                        </>
                      )}
                    </motion.div>
                    <div>
                      <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                        MedMind Chat Assistant
                      </h2>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3">
                          <motion.div
                            animate={{ scale: [1, 1.4, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className={`h-2.5 w-2.5 rounded-full ${botStatus === 'idle' 
                              ? 'bg-gradient-to-r from-emerald-400 to-green-500' 
                              : botStatus === 'thinking' 
                              ? 'bg-gradient-to-r from-amber-400 to-orange-500' 
                              : 'bg-gradient-to-r from-blue-400 to-cyan-500'}`}
                          />
                          <span className={`text-sm font-medium ${isDarkMode 
                            ? botStatus === 'idle' ? 'text-emerald-400' : 
                              botStatus === 'thinking' ? 'text-amber-400' : 'text-blue-400'
                            : botStatus === 'idle' ? 'text-emerald-600' : 
                              botStatus === 'thinking' ? 'text-amber-600' : 'text-blue-600'}`}
                          >
                            {botStatus === 'thinking' ? 'AI Analysis Active' :
                             botStatus === 'responding' ? 'MedMind Synthesis' :
                             'AI Network Ready'}
                          </span>
                        </div>
                        <div className={`h-4 w-px ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`} />
                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          MedMind AI v1.0.1
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className={`px-5 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl font-bold shadow-lg flex items-center gap-3`}
                      style={{
                        textShadow: '0 1px 2px rgba(0,0,0,0.2)'
                      }}
                    >
                      <CircuitBoard className="h-5 w-5" />
                      <span>GEMMA 2 </span>
                    </motion.div>
                    <ShieldCheck className={`h-7 w-7 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                  </div>
                </div>
              </div>

              {/* MedMind Messages Container */}
              <div 
                className="flex-1 overflow-y-auto p-8 space-y-8"
                style={{ scrollBehavior: 'smooth' }}
              >
                <AnimatePresence mode="popLayout">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      custom={{ sender: message.sender }}
                      variants={messageVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      layout
                      className={`flex gap-6 ${message.sender === 'user' ? 'justify-end' : 'justify-start'} items-start`}
                    >
                      {message.sender === 'bot' && (
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          className="flex-shrink-0 pt-2 relative"
                        >
                          <div className="relative h-14 w-14 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-2xl">
                            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl" />
                            <Bot className="h-7 w-7 text-white" />
                          </div>
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute -inset-1 border border-blue-400/20 rounded-2xl"
                          />
                        </motion.div>
                      )}
                      
                      <div className={`max-w-[78%] ${message.sender === 'user' ? 'order-1' : 'order-2'}`}>
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          className={`relative rounded-3xl p-7 shadow-2xl ${message.sender === 'user' 
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                            : `${isDarkMode ? 'bg-gradient-to-r from-gray-800 to-gray-900' : 'bg-gradient-to-r from-gray-50 to-white'} border ${isDarkMode ? 'border-gray-700/50' : 'border-gray-300/50'} ${message.error ? 'border-red-500/60' : ''}`
                          }`}
                          style={{
                            boxShadow: message.sender === 'user' 
                              ? '0 10px 40px rgba(59, 130, 246, 0.3), inset 0 1px 0 rgba(255,255,255,0.2)' 
                              : '0 10px 40px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.1)'
                          }}
                        >
                          {message.isLoading ? (
                            <div className="flex items-center gap-5">
                              <div className="flex space-x-2">
                                {[0, 1, 2, 3, 4].map((i) => (
                                  <motion.div
                                    key={i}
                                    animate={{ 
                                      scale: [1, 1.8, 1],
                                      y: [0, -6, 0],
                                      opacity: [0.4, 1, 0.4]
                                    }}
                                    transition={{ 
                                      duration: 1.2, 
                                      repeat: Infinity,
                                      delay: i * 0.15 
                                    }}
                                    className="h-2.5 w-2.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                                  />
                                ))}
                              </div>
                              <div className="space-y-1.5">
                                <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                  MedMind Processing...
                                </div>
                                <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                  Analyzing neural pathways
                                </div>
                              </div>
                            </div>
                          ) : (
                            <>
                              <p className={`text-base leading-relaxed whitespace-pre-wrap break-words ${message.sender === 'bot' ? (isDarkMode ? 'text-gray-200' : 'text-gray-800') : 'text-white'}`}>
                                {message.content}
                                {message.sender === 'bot' && isTyping && messages[messages.length - 1]?.id === message.id && (
                                  <motion.span
                                    animate={{ opacity: [0.3, 1, 0.3] }}
                                    transition={{ duration: 0.8, repeat: Infinity }}
                                    className="ml-1 inline-block h-6 w-1.5 bg-current rounded-full align-middle"
                                  />
                                )}
                              </p>
                              
                              <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className={`flex items-center justify-between mt-6 pt-6 ${message.sender === 'user' ? 'border-white/20' : isDarkMode ? 'border-gray-700/50' : 'border-gray-300/50'} border-t`}
                              >
                                <div className="flex items-center gap-2.5">
                                  <Clock className={`h-4 w-4 ${message.sender === 'user' ? 'text-white/70' : isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                                  <span className={`text-xs ${message.sender === 'user' ? 'text-white/80' : isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  {message.sender === 'bot' && !message.error && (
                                    <motion.button
                                      whileHover={{ scale: 1.15, y: -3 }}
                                      whileTap={{ scale: 0.9 }}
                                      onClick={() => copyToClipboard(message.content, message.id)}
                                      className={`p-2.5 rounded-2xl ${copiedMessageId === message.id 
                                        ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg' 
                                        : `${isDarkMode ? 'bg-gray-800/80 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`
                                      }`}
                                      style={{
                                        boxShadow: copiedMessageId === message.id 
                                          ? '0 4px 12px rgba(16, 185, 129, 0.4)' 
                                          : '0 2px 8px rgba(0,0,0,0.1)'
                                      }}
                                    >
                                      {copiedMessageId === message.id ? (
                                        <CheckCircle className="h-4.5 w-4.5" />
                                      ) : (
                                        <Copy className="h-4.5 w-4.5" />
                                      )}
                                    </motion.button>
                                  )}
                                  {message.sender === 'bot' && (
                                    <>
                                      <motion.button
                                        whileHover={{ scale: 1.15, y: -3 }}
                                        whileTap={{ scale: 0.9 }}
                                        className={`p-2.5 rounded-2xl ${isDarkMode ? 'bg-gray-800/80 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                        style={{
                                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                        }}
                                      >
                                        <ThumbsUp className="h-4.5 w-4.5" />
                                      </motion.button>
                                      <motion.button
                                        whileHover={{ scale: 1.15, y: -3 }}
                                        whileTap={{ scale: 0.9 }}
                                        className={`p-2.5 rounded-2xl ${isDarkMode ? 'bg-gray-800/80 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                        style={{
                                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                        }}
                                      >
                                        <ThumbsDown className="h-4.5 w-4.5" />
                                      </motion.button>
                                    </>
                                  )}
                                </div>
                              </motion.div>
                            </>
                          )}
                        </motion.div>
                      </div>
                      
                      {message.sender === 'user' && (
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: -5 }}
                          className="flex-shrink-0 pt-2 relative"
                        >
                          <div className="relative h-14 w-14 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center shadow-2xl">
                            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl" />
                            <User className="h-7 w-7 text-white" />
                          </div>
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute -inset-1 border border-emerald-400/20 rounded-2xl"
                          />
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </div>

              {/* MedMind Input Interface */}
              <div className={`p-8 border-t ${isDarkMode ? 'border-gray-800/60' : 'border-gray-300/60'} ${isDarkMode 
                ? 'bg-gradient-to-r from-gray-900/80 to-gray-800/80' 
                : 'bg-gradient-to-r from-gray-50/80 to-gray-100/80'}`}>
                <div className="relative">
                  <div className="flex gap-5">
                    <div className="relative flex-1">
                      <motion.div
                        animate={inputValue.trim() ? {
                          boxShadow: [
                            '0 0 20px rgba(59, 130, 246, 0.3)',
                            '0 0 30px rgba(139, 92, 246, 0.4)',
                            '0 0 20px rgba(59, 130, 246, 0.3)'
                          ]
                        } : {}}
                        transition={{ duration: 2, repeat: Infinity }}
                        className={`absolute -inset-0.5 rounded-3xl ${inputValue.trim() 
                          ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-30' 
                          : ''}`}
                      />
                      <input
                        ref={inputRef}
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Enter AI query about health, fitness, nutrition, sleep, mental wellness..."
                        disabled={isLoading}
                        className={`relative w-full px-7 py-5 pr-16 rounded-3xl ${isDarkMode 
                          ? 'bg-gray-800 text-white placeholder:text-gray-500' 
                          : 'bg-white text-gray-900 placeholder:text-gray-400'} border-2 ${isDarkMode ? 'border-gray-700/70' : 'border-gray-300/70'} focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl text-base z-10`}
                      />
                      <div className="absolute right-5 top-1/2 transform -translate-y-1/2 z-20">
                        {isTyping ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1.2, repeat: Infinity }}
                            className="relative"
                          >
                            <CircuitBoard className="h-7 w-7 text-blue-500" />
                            <motion.div
                              animate={{ scale: [1, 1.5, 1] }}
                              transition={{ duration: 1, repeat: Infinity }}
                              className="absolute -inset-1 border border-blue-500/30 rounded-full"
                            />
                          </motion.div>
                        ) : (
                          <MessageSquare className={`h-7 w-7 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                        )}
                      </div>
                    </div>
                    
                    <motion.button
                      whileHover={!isLoading && inputValue.trim() ? { 
                        scale: 1.08, 
                        boxShadow: "0 15px 35px -5px rgba(59, 130, 246, 0.5), 0 0 20px rgba(139, 92, 246, 0.4)" 
                      } : {}}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleSendMessage()}
                      disabled={!inputValue.trim() || isLoading}
                      className={`relative px-10 py-5 rounded-3xl font-bold transition-all duration-300 flex items-center gap-4 ${isLoading || !inputValue.trim()
                        ? `${isDarkMode ? 'bg-gray-800 text-gray-500' : 'bg-gray-300 text-gray-400'} cursor-not-allowed`
                        : 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 shadow-2xl'
                      }`}
                      style={{
                        textShadow: '0 1px 2px rgba(0,0,0,0.2)'
                      }}
                    >
                      {isLoading ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1.2, repeat: Infinity }}
                          >
                            <Loader2 className="h-7 w-7" />
                          </motion.div>
                          <span>MedMind Processing...</span>
                        </>
                      ) : (
                        <>
                          <Send className="h-7 w-7" />
                          <span className="text-base">Transmit Query</span>
                        </>
                      )}
                    </motion.button>
                  </div>
                  
                  {/* MedMind Suggestions */}
                  <AnimatePresence>
                    {showSuggestions && !isLoading && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-8 overflow-hidden"
                      >
                        <div className="flex flex-wrap gap-3">
                          {SUGGESTED_QUESTIONS.map((question, index) => (
                            <motion.button
                              key={question}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.05 }}
                              whileHover={{ scale: 1.05, y: -3 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleSuggestionClick(question)}
                              disabled={isLoading}
                              className={`px-5 py-3.5 rounded-2xl ${isDarkMode 
                                ? 'bg-gray-800/80 text-gray-300 hover:bg-gray-700/90 border-gray-700/70' 
                                : 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 hover:from-blue-100 hover:to-indigo-100 border-blue-200/70'} border text-sm font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg`}
                            >
                              {question}
                            </motion.button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {/* MedMind Status Bar */}
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className={`flex items-center justify-between mt-8 pt-8 ${isDarkMode ? 'border-gray-800/50' : 'border-gray-300/50'} border-t text-sm`}
                  >
                    <div className="flex items-center gap-4">
                      <motion.div
                        animate={{ rotate: [0, 10, 0, -10, 0] }}
                        transition={{ duration: 4, repeat: Infinity }}
                      >
                        <div className="relative">
                          <Binary className={`h-6 w-6 ${isDarkMode ? 'text-blue-500' : 'text-blue-600'}`} />
                          <motion.div
                            animate={{ scale: [1, 1.5, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute -inset-1 border border-blue-500/30 rounded-full"
                          />
                        </div>
                      </motion.div>
                      <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        MedMind AI processing enabled
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <div className="relative">
                          <ShieldCheck className={`h-6 w-6 ${isDarkMode ? 'text-emerald-500' : 'text-emerald-600'}`} />
                          <motion.div
                            animate={{ scale: [1, 1.3, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="absolute -inset-1 border border-emerald-500/30 rounded-full"
                          />
                        </div>
                      </motion.div>
                      <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        MedMind encryption active
                      </span>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* AI Interface Panel - Hidden in fullscreen */}
          {!isFullscreen && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="lg:col-span-2 space-y-8 h-full overflow-y-auto"
            >
              {/* AI Status Panel */}
              <div className={`${isDarkMode ? 'bg-gradient-to-br from-gray-900/80 to-gray-800/80' : 'bg-gradient-to-br from-white/95 to-gray-50/95'} backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border ${isDarkMode ? 'border-gray-800/60' : 'border-gray-300/50'}`}
                style={{
                  boxShadow: 'inset 0 2px 8px 0 rgba(0,0,0,0.1), 0 20px 60px rgba(0,0,0,0.2)'
                }}
              >
                <div className="flex items-center gap-5 mb-8">
                  <motion.div
                    animate={{ rotate: [0, 5, 0, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className={`p-4 rounded-2xl ${isDarkMode ? 'bg-gray-800/60' : 'bg-gray-100/80'} backdrop-blur-sm`}
                  >
                    <Processor className={`h-8 w-8 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                  </motion.div>
                  <div>
                    <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>AI Network</h2>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Powered by gemma 2</p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  {[
                    { label: "MedMind Status", value: "Online & Calibrated", icon: "⚛️", color: "text-emerald-400" },
                    { label: "Processing Speed", value: "80 ms latency", icon: "⚡", color: "text-blue-400" },
                    { label: "Memory Allocation", value: "Context-aware", icon: "🧠", color: "text-purple-400" },
                    { label: "Accuracy Level", value: "97.5%", icon: "🎯", color: "text-amber-400" },
                  ].map((item, index) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex items-center justify-between p-4 rounded-2xl ${isDarkMode 
                        ? 'bg-gray-800/40 hover:bg-gray-800/60' 
                        : 'bg-gray-100/60 hover:bg-gray-200/60'} backdrop-blur-sm border ${isDarkMode ? 'border-gray-700/50' : 'border-gray-300/50'} transition-all duration-300`}
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-2xl">{item.icon}</span>
                        <div>
                          <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{item.label}</div>
                          <div className={`font-bold ${item.color}`}>{item.value}</div>
                        </div>
                      </div>
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className={`h-2 w-12 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`}
                      >
                        <motion.div
                          className={`h-full rounded-full ${index === 0 ? 'bg-emerald-500' : index === 1 ? 'bg-blue-500' : index === 2 ? 'bg-purple-500' : 'bg-amber-500'}`}
                          initial={{ width: 0 }}
                          animate={{ width: ['0%', '85%', '100%', '85%'] }}
                          transition={{ duration: 2 + index * 0.5, repeat: Infinity }}
                        />
                      </motion.div>
                    </motion.div>
                  ))}
                </div>
                
                <motion.div 
                  className={`mt-10 pt-8 border-t ${isDarkMode ? 'border-gray-800/50' : 'border-gray-300/50'}`}
                  animate={{ 
                    backgroundColor: botStatus === 'thinking' 
                      ? isDarkMode 
                        ? ['rgba(59, 130, 246, 0.1)', 'rgba(139, 92, 246, 0.2)', 'rgba(59, 130, 246, 0.1)'] 
                        : ['rgba(59, 130, 246, 0.05)', 'rgba(139, 92, 246, 0.1)', 'rgba(59, 130, 246, 0.05)']
                      : isDarkMode ? 'rgba(59, 130, 246, 0.05)' : 'rgba(59, 130, 246, 0.02)' 
                  }}
                  transition={{ duration: 2, repeat: botStatus === 'thinking' ? Infinity : 0 }}
                >
                  <div className="text-center">
                    <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-3`}>AI Activity</div>
                    <div className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {botStatus === 'thinking' ? '🔮 MedMind Analysis Active' :
                       botStatus === 'responding' ? '⚡ AI Synthesis' :
                       '💫 Awaiting MedMind Input'}
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* AI Capabilities Grid */}
              <div className={`${isDarkMode ? 'bg-gradient-to-br from-gray-900/80 to-gray-800/80' : 'bg-gradient-to-br from-white/95 to-gray-50/95'} backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border ${isDarkMode ? 'border-gray-800/60' : 'border-gray-300/50'}`}>
                <div className="flex items-center gap-5 mb-8">
                  <motion.div
                    whileHover={{ rotate: 15 }}
                    className={`p-4 rounded-2xl ${isDarkMode ? 'bg-gradient-to-r from-emerald-900/40 to-teal-900/40' : 'bg-gradient-to-r from-emerald-50 to-teal-50'}`}
                  >
                    <Network className={`h-8 w-8 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                  </motion.div>
                  <div>
                    <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>MedMind Modules</h2>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Advanced AI capabilities</p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  {capabilities.map((capability, index) => (
                    <motion.div
                      key={capability.title}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ x: 8, scale: 1.02 }}
                      className={`p-5 rounded-2xl border cursor-pointer transition-all duration-300 ${capability.gradient} ${
                        activeCapability === capability.title
                          ? `border-blue-500/50 ${isDarkMode ? 'bg-blue-900/20' : 'bg-blue-50/50'} shadow-lg`
                          : `${isDarkMode ? 'border-gray-700/70 hover:border-blue-500/30' : 'border-gray-300/70 hover:border-blue-400/50'}`
                      }`}
                      onClick={() => setActiveCapability(
                        activeCapability === capability.title ? null : capability.title
                      )}
                    >
                      <div className="flex items-center gap-5 mb-5">
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          className={`p-3.5 rounded-2xl bg-gradient-to-r ${capability.color} shadow-lg`}
                        >
                          {capability.icon}
                        </motion.div>
                        <div className="flex-1">
                          <h3 className={`font-bold text-lg ${capability.textColor}`}>
                            {capability.title}
                          </h3>
                          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-1.5`}>
                            {capability.description}
                          </p>
                        </div>
                      </div>
                      
                      <AnimatePresence>
                        {activeCapability === capability.title && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                          >
                            <div className={`pt-5 border-t ${isDarkMode ? 'border-gray-700/50' : 'border-gray-300/50'}`}>
                              <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-3`}>MedMind Queries:</p>
                              <div className="flex flex-wrap gap-2.5">
                                {capability.examples.map((example, idx) => (
                                  <motion.button
                                    key={idx}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: idx * 0.1 }}
                                    whileHover={{ scale: 1.08, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleSuggestionClick(example)
                                    }}
                                    className={`px-4 py-2.5 text-xs font-medium ${isDarkMode 
                                      ? 'bg-gray-800/60 text-blue-300 hover:bg-gray-700/80 border-gray-700/70' 
                                      : 'bg-gradient-to-r from-blue-50/80 to-purple-50/80 text-blue-700 hover:from-blue-100 hover:to-purple-100 border-blue-200/70'} rounded-xl border transition-all duration-300`}
                                  >
                                    {example}
                                  </motion.button>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
                
                <div className={`mt-8 pt-8 border-t ${isDarkMode ? 'border-gray-800/50' : 'border-gray-300/50'}`}>
                  <div className="flex items-center justify-between">
                    <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      <span className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {messages.filter(m => m.sender === 'user').length}
                      </span> AI queries processed
                    </div>
                    <div className="flex items-center gap-2.5">
                      <motion.div
                        animate={{ rotate: [0, 20, 0, -20, 0] }}
                        transition={{ duration: 4, repeat: Infinity }}
                      >
                        <InfinityIcon className={`h-5 w-5 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                      </motion.div>
                      <span className={`text-sm font-medium ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                        AI Evolution
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* MedMind Analytics */}
              <div className={`${isDarkMode ? 'bg-gradient-to-br from-gray-900/80 to-gray-800/80' : 'bg-gradient-to-br from-white/95 to-gray-50/95'} backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border ${isDarkMode ? 'border-gray-800/60' : 'border-gray-300/50'}`}>
                <h3 className={`font-bold text-xl ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-6`}>MedMind Metrics</h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { value: messages.filter(m => m.sender === 'user').length, label: "AI Queries", color: "from-blue-500 to-cyan-500" },
                    { value: messages.filter(m => m.sender === 'bot').length, label: "AI Responses", color: "from-purple-500 to-fuchsia-500" },
                    { value: Math.round(messages.reduce((acc, msg) => acc + msg.content.length, 0) / 1000), label: "Data (KB)", color: "from-emerald-500 to-teal-500" },
                    { value: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), label: "MedMind Time", color: "from-amber-500 to-orange-500" },
                  ].map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -5, scale: 1.05 }}
                      className={`text-center p-5 rounded-2xl border ${isDarkMode 
                        ? 'bg-gray-800/40 border-gray-700/50' 
                        : 'bg-white/80 border-gray-300/50'} shadow-lg`}
                      style={{
                        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05), 0 4px 12px rgba(0,0,0,0.1)'
                      }}
                    >
                      <div className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}>
                        {stat.value}
                      </div>
                      <div className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {stat.label}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}