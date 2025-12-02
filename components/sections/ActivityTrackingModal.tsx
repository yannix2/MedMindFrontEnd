'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  X,
  Moon,
  Sun,
  Activity,
  Check,
  Loader2,
  Clock,
  Bed,
  Sunrise,
  Zap,
  AlertCircle
} from 'lucide-react'

interface ActivityTrackingModalProps {
  onClose: () => void
  onSave: (data: { sleep_start: string; sleep_end: string; active_general: boolean }) => Promise<void>
}

export default function ActivityTrackingModal({ onClose, onSave }: ActivityTrackingModalProps) {
  const [sleepStart, setSleepStart] = useState('23:00')
  const [sleepEnd, setSleepEnd] = useState('07:00')
  const [isActive, setIsActive] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    if (!sleepStart || !sleepEnd) {
      setError('Please fill in both sleep times')
      return
    }

    setLoading(true)
    setError(null)

    try {
      await onSave({
        sleep_start: sleepStart,
        sleep_end: sleepEnd,
        active_general: isActive
      })
    } catch (err: any) {
      setError(err.message || 'Failed to save activity')
    } finally {
      setLoading(false)
    }
  }

  const calculateSleepDuration = () => {
    const start = new Date(`1970-01-01T${sleepStart}`)
    const end = new Date(`1970-01-01T${sleepEnd}`)
    
    let diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60) // hours
    
    // Handle overnight sleep
    if (diff < 0) {
      diff += 24
    }
    
    return Math.round(diff * 10) / 10
  }

  return (
    <>
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-40"
      />
      
      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden border border-gray-200 dark:border-gray-800">
          {/* Modal Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                  <Activity className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Track Today's Activity
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Record your sleep and daily activity
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
          </div>

          {/* Modal Content */}
          <div className="p-6 space-y-6">
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-lg">
                <div className="flex items-center gap-2 text-red-700 dark:text-red-400 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              </div>
            )}

            {/* Sleep Tracking */}
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Moon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                Sleep Schedule
              </h4>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <div className="flex items-center gap-2">
                      <Bed className="h-4 w-4" />
                      Sleep Start
                    </div>
                  </label>
                  <div className="relative">
                    <input
                      type="time"
                      value={sleepStart}
                      onChange={(e) => setSleepStart(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    />
                    <Clock className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <div className="flex items-center gap-2">
                      <Sunrise className="h-4 w-4" />
                      Sleep End
                    </div>
                  </label>
                  <div className="relative">
                    <input
                      type="time"
                      value={sleepEnd}
                      onChange={(e) => setSleepEnd(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    />
                    <Clock className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                    {calculateSleepDuration()} hours
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Estimated Sleep Duration</div>
                </div>
              </div>
            </div>

            {/* Activity Level */}
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Zap className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                Daily Activity Level
              </h4>
              
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setIsActive(true)}
                  className={`p-4 rounded-xl border-2 transition-all ${isActive ? 
                    'border-purple-500 bg-gradient-to-r from-purple-500/10 to-blue-500/10' : 
                    'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700'}`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <Activity className={`h-6 w-6 ${isActive ? 'text-purple-600 dark:text-purple-400' : 'text-gray-400'}`} />
                    <div className="text-center">
                      <div className="font-medium text-gray-900 dark:text-white">Active Day</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Exercised or moved a lot</div>
                    </div>
                  </div>
                </button>
                
                <button
                  onClick={() => setIsActive(false)}
                  className={`p-4 rounded-xl border-2 transition-all ${!isActive ? 
                    'border-gray-500 bg-gradient-to-r from-gray-500/10 to-gray-600/10' : 
                    'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'}`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <Moon className={`h-6 w-6 ${!isActive ? 'text-gray-600 dark:text-gray-400' : 'text-gray-400'}`} />
                    <div className="text-center">
                      <div className="font-medium text-gray-900 dark:text-white">Rest Day</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Took it easy today</div>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-900/50 rounded-xl">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <p className="font-medium mb-1">💡 Quick Tips:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Aim for 7-9 hours of sleep per night</li>
                  <li>• Track sports separately after saving</li>
                  <li>• You can update this later if needed</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="p-6 border-t border-gray-200 dark:border-gray-800 bg-gradient-to-r from-white/80 to-white/50 dark:from-gray-900/80 dark:to-gray-900/50">
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    Save Activity
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  )
}