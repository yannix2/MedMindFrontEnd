"use client"

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { ClipboardList, Brain, BarChart3, Heart, ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/contexts/language-context'

const steps = [
  {
    icon: ClipboardList,
    title: 'howItWorks.step1',
    description: 'howItWorks.step1Desc',
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Brain,
    title: 'howItWorks.step2',
    description: 'howItWorks.step2Desc',
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: BarChart3,
    title: 'howItWorks.step3',
    description: 'howItWorks.step3Desc',
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Heart,
    title: 'howItWorks.step4',
    description: 'howItWorks.step4Desc',
    color: "from-orange-500 to-red-500",
  },
]

export function HowItWorks() {
  const { t } = useLanguage()

  return (
    <section id="how-it-works" className="py-24 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-4 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-400 border-none">
              How It Works
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              {t('howItWorks.title')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              {t('howItWorks.subtitle')}
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Steps */}
          <div className="space-y-8">
            {steps.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
              >
                <Card className="border-none shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden group bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl">
                  <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-blue-500 to-purple-500" />
                  <CardContent className="p-8 pl-12">
                    <div className="flex items-start gap-6">
                      <div className={`flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
                        <item.icon className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-sm font-bold text-gray-400 dark:text-gray-500">0{index + 1}</span>
                          <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                            {t(item.title)}
                          </h3>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400">
                          {t(item.description)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Visual Demo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl p-8 border border-gray-200/30 dark:border-gray-800/30 backdrop-blur-sm">
              {/* Mock AI Analysis Dashboard */}
              <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-3xl">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <div className="h-4 w-40 bg-gray-200 dark:bg-gray-800 rounded mb-2"></div>
                    <div className="h-3 w-32 bg-gray-100 dark:bg-gray-700 rounded"></div>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
                </div>
                
                {/* Health Metrics */}
                <div className="space-y-6 mb-8">
                  {['Sleep Quality', 'Nutrition Score', 'Stress Level', 'Activity Points'].map((metric, i) => (
                    <div key={metric} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">{metric}</span>
                      <div className="flex items-center gap-3">
                        <div className="h-3 w-48 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full rounded-full ${i % 2 === 0 ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-gradient-to-r from-blue-400 to-purple-500'}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${65 + i * 10}%` }}
                            transition={{ duration: 1, delay: i * 0.2 }}
                          />
                        </div>
                        <span className="text-sm font-bold">{65 + i * 10}%</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* AI Recommendations */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                      <Brain className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="h-4 w-48 bg-blue-200 dark:bg-blue-800/50 rounded mb-1"></div>
                      <div className="h-3 w-36 bg-blue-100 dark:bg-blue-900/30 rounded"></div>
                    </div>
                  </div>
                  <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                    <p className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      Increase daily water intake by 500ml
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      Aim for 7.5 hours of sleep tonight
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="text-green-500">✓</span>
                      Consider adding more leafy greens to dinner
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="absolute -top-4 -right-4 bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800"
              >
                <div className="h-8 w-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg"></div>
              </motion.div>
              <motion.div
                animate={{ y: [0, 20, 0] }}
                transition={{ repeat: Infinity, duration: 3, delay: 0.5 }}
                className="absolute -bottom-4 -left-4 bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800"
              >
                <div className="h-8 w-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg"></div>
              </motion.div>
            </div>
          </motion.div>
        </div>


      </div>
    </section>
  )
}