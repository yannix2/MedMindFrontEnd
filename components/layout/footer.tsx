"use client"
import { Brain, Twitter, Linkedin, Instagram, Github, Heart } from 'lucide-react'
import Link from 'next/link'
import { useLanguage } from '@/contexts/language-context'

const footerLinks = {
  product: [
    { key: 'footer.features', href: '#features' },
    { key: 'footer.howItWorks', href: '#how-it-works' },
    { key: 'footer.pricing', href: '/' },
    { key: 'footer.api', href: '/' },
    { key: 'footer.documentation', href: '/' },
  ],
  company: [
    { key: 'footer.aboutUs', href: '/aboutus' },
    { key: 'footer.blog', href: '/blog' },
    { key: 'footer.careers', href: '/' },
    { key: 'footer.press', href: '/' },
    { key: 'footer.partners', href: '/' },
  ],
  legal: [
    { key: 'footer.privacy', href: '/' },
    { key: 'footer.terms', href: '/' },
    { key: 'footer.cookie', href: '/' },
    { key: 'footer.gdpr', href: '/' },
    { key: 'footer.compliance', href: '/' },
  ]
}

export function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 border-t">
      <div className="container mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-8">
              <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-3 rounded-2xl shadow-2xl">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <div>
                <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  MedMind
                </span>
                <p className="text-sm text-gray-500 dark:text-gray-400">AI Health Companion</p>
              </div>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md">
              {t('footer.tagline')}
            </p>
           <div className="flex gap-4">
  {[
    { Icon: Twitter, href: "https://twitter.com/Y4nnix22", label: "Twitter" },
    { Icon: Linkedin, href: "https://linkedin.com/in/yassine-khiari-111150255/", label: "LinkedIn" },
    { Icon: Github, href: "https://github.com/yannix2", label: "GitHub" }
  ].map((social, i) => (
    <a
      key={i}
      href={social.href}
      target="_blank"
      rel="noopener noreferrer"
      className="p-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-all duration-300 hover:scale-110"
      aria-label={social.label}
    >
      <social.Icon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
    </a>
  ))}
</div>
          </div>

          {/* Quick Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-bold text-lg mb-6 text-gray-800 dark:text-gray-200">
                {t(`footer.${category}`)}
              </h3>
              <ul className="space-y-4">
                {links.map((link) => (
                  <li key={link.key}>
                    <Link 
                      href={link.href} 
                      className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
                    >
                      {t(link.key)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 mt-12 pt-8 text-center">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 dark:text-gray-400">
              {t('footer.copyright')}
            </p>
            <p className="text-gray-500 dark:text-gray-400 flex items-center gap-2">
              Made with <Heart className="h-4 w-4 text-red-500" /> by MedMind Team
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}