"use client"

import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  BrainCircuit,
  HeartPulse,
  Shield,
  TrendingUp,
  Users,
  Smartphone,
  Zap,
  CheckCircle
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useLanguage } from '@/contexts/language-context'

const features = [
  {
    icon: BrainCircuit,
    title: 'features.feature1',
    description: 'features.feature1Desc',
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: HeartPulse,
    title: 'features.feature2',
    description: 'features.feature2Desc',
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: Shield,
    title: 'features.feature3',
    description: 'features.feature3Desc',
    gradient: "from-green-500 to-emerald-500",
  },
  {
    icon: TrendingUp,
    title: 'features.feature4',
    description: 'features.feature4Desc',
    gradient: "from-orange-500 to-amber-500",
  },
  {
    icon: Users,
    title: 'features.feature5',
    description: 'features.feature5Desc',
    gradient: "from-red-500 to-rose-500",
  },
  {
    icon: Smartphone,
    title: 'features.feature6',
    description: 'features.feature6Desc',
    gradient: "from-indigo-500 to-blue-500",
  },
]

export function Features() {
  const { t } = useLanguage()

  return (
    <section id="features" className="py-24 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-4 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-400 border-none">
              Features
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              {t('features.title')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              {t('features.subtitle')}
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <Card className="h-full border-2 border-gray-100 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-3xl transition-all duration-500 group overflow-hidden bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className={`p-4 rounded-2xl bg-gradient-to-br ${feature.gradient} group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
                      <feature.icon className="h-7 w-7 text-white" />
                    </div>
                    <span className="text-4xl font-bold text-gray-100 dark:text-gray-800 group-hover:text-gray-200 dark:group-hover:text-gray-700 transition-colors">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardTitle className="text-2xl mb-4 text-gray-800 dark:text-gray-200">
                    {t(feature.title)}
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400 text-lg">
                    {t(feature.description)}
                  </CardDescription>
                  <div className="mt-6 flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
                    <CheckCircle className="h-4 w-4" />
                    <span>Included in all plans</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24"
        >
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-3xl p-12 backdrop-blur-xl border border-gray-200/30 dark:border-gray-800/30">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: "94%", label: "Prediction Accuracy", icon: Zap },
                { value: "10K+", label: "Active Users", icon: Users },
                { value: "24/7", label: "Real-time Analysis", icon: BrainCircuit },
                { value: "99.9%", label: "Uptime", icon: TrendingUp },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-2xl mb-4">
                    <stat.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}