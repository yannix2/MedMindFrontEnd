"use client"

import { Button } from '@/components/ui/button'
import { ArrowRight, Shield, CheckCircle, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/language-context'
import Link from 'next/link'
export function CTA() {
  const { t } = useLanguage()

  return (
    <section className="py-24 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-900/20">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-6 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-400 border-none">
              Get Started Today
            </Badge>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              {t('cta.title')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-10">
              {t('cta.subtitle')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/signup">
              <Button size="lg" className="px-10 py-7 hover:cursor-pointer text-lg bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white shadow-2xl hover:shadow-3xl rounded-2xl group">
                <Sparkles className="h-5 w-5 mr-3 group-hover:rotate-12 transition-transform duration-500" />
                {t('cta.button')}
                <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
              </Button>
                </Link>
              <Button size="lg" variant="outline" className="px-10 py-7 text-lg border-2 border-gray-300 dark:border-gray-700 hover:border-primary dark:hover:border-primary rounded-2xl hover:scale-105 transition-all duration-300">
                {t('cta.demo')}
              </Button>
            </div>

            <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-600 dark:text-gray-400">
              {[
                { key: 'cta.benefit1', icon: CheckCircle },
                { key: 'cta.benefit2', icon: Shield },
                { key: 'cta.benefit3', icon: CheckCircle },
              ].map((benefit, index) => (
                <motion.div
                  key={benefit.key}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-2"
                >
                  <benefit.icon className="h-4 w-4 text-green-500" />
                  <span>{t(benefit.key)}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// Need to import Badge component
import { Badge } from '@/components/ui/badge'