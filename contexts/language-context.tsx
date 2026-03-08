"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

type Language = 'en' | 'fr' | 'ar'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.howItWorks': 'How It Works',
    'nav.features': 'Features',
    'nav.blog': 'Blog',
    'nav.about': 'About Us',
    'nav.contact': 'Contact',
    'nav.signIn': 'Sign In',
    'nav.getStarted': 'Get Started',
    
    // Hero
    'hero.title': 'Your AI Health Companion',
    'hero.subtitle': 'MedMind analyzes your lifestyle, predicts health risks, and provides personalized recommendations using cutting-edge AI technology to transform your well-being.',
    'hero.ctaPrimary': 'Get Started ',
    'hero.ctaSecondary': 'Watch Demo',
    'hero.badge': 'Powered by Advanced AI',
    'hero.feature1': 'AI-Powered Analysis',
    'hero.feature1Desc': 'Deep learning models analyze your health data',
    'hero.feature2': 'Privacy First',
    'hero.feature2Desc': 'Your data is encrypted and never shared',
    'hero.feature3': 'Real-time Insights',
    'hero.feature3Desc': 'Get instant health recommendations',
    
    // How It Works
    'howItWorks.title': 'Transform Your Health in 4 Simple Steps',
    'howItWorks.subtitle': 'Our AI-powered platform makes health optimization accessible and personalized for everyone.',
    'howItWorks.step1': 'Share Your Lifestyle',
    'howItWorks.step1Desc': 'Enter daily habits, diet, exercise, sleep patterns, and health metrics.',
    'howItWorks.step2': 'AI Analysis Engine',
    'howItWorks.step2Desc': 'Neural networks analyze patterns and predict potential health risks with 94% accuracy.',
    'howItWorks.step3': 'Personalized Insights',
    'howItWorks.step3Desc': 'Receive detailed reports with actionable health recommendations.',
    'howItWorks.step4': 'Continuous Improvement',
    'howItWorks.step4Desc': 'Track progress with ongoing monitoring and adaptive recommendations.',
    
    // Features
    'features.title': 'AI-Powered Features for Better Health',
    'features.subtitle': 'Experience the future of personalized healthcare with our comprehensive AI platform.',
    'features.feature1': 'Advanced AI Analysis',
    'features.feature1Desc': 'Deep learning models analyze lifestyle patterns and predict health risks with 94% accuracy.',
    'features.feature2': 'Personalized Health Plans',
    'features.feature2Desc': 'Customized recommendations for diet, exercise, and lifestyle adjustments.',
    'features.feature3': 'Military-Grade Security',
    'features.feature3Desc': 'Your health data is encrypted end-to-end and never shared with third parties.',
    'features.feature4': 'Progress Tracking',
    'features.feature4Desc': 'Monitor improvements with detailed analytics and progress reports.',
    'features.feature5': 'Expert Collaboration',
    'features.feature5Desc': 'Connect with healthcare professionals based on AI insights.',
    'features.feature6': 'Mobile-First Experience',
    'features.feature6Desc': 'Access your health insights anywhere with our iOS and Android apps.',
    
    // CTA
    'cta.title': 'Ready to Transform Your Health Journey?',
    'cta.subtitle': 'Join thousands who have improved their lifestyle with AI-powered insights',
    'cta.button': 'Start Your Free Analysis',
    'cta.demo': 'Schedule a Demo',
    'cta.benefit1': 'No credit card required',
    'cta.benefit2': 'Free 14-day trial',
    'cta.benefit3': 'Cancel anytime',
    
    // Footer
    'footer.product': 'Product',
    'footer.company': 'Company',
    'footer.legal': 'Legal',
    'footer.copyright': '© 2024 MedMind AI. All rights reserved.',
    'footer.features': 'Features',
    'footer.howItWorks': 'How It Works',
    'footer.pricing': 'Pricing',
    'footer.api': 'API',
    'footer.documentation': 'Documentation',
    'footer.aboutUs': 'About Us',
    'footer.blog': 'Blog',
    'footer.careers': 'Careers',
    'footer.press': 'Press',
    'footer.partners': 'Partners',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',
    'footer.cookie': 'Cookie Policy',
    'footer.gdpr': 'GDPR',
    'footer.compliance': 'Compliance',
    'footer.tagline': 'Empowering healthier lives through AI-powered insights and personalized recommendations.',
  },
  fr: {
    // Navigation
    'nav.home': 'Accueil',
    'nav.howItWorks': 'Comment ça marche',
    'nav.features': 'Fonctionnalités',
    'nav.blog': 'Blog',
    'nav.about': 'À propos',
    'nav.contact': 'Contact',
    'nav.signIn': 'Connexion',
    'nav.getStarted': 'Commencer',
    
    // Hero
    'hero.title': 'Votre Compagnon de Santé IA',
    'hero.subtitle': 'MedMind analyse votre mode de vie, prédit les risques pour la santé et fournit des recommandations personnalisées utilisant la technologie IA de pointe pour transformer votre bien-être.',
    'hero.ctaPrimary': 'Commencer',
    'hero.ctaSecondary': 'Voir la démo',
    'hero.badge': 'Propulsé par IA avancée',
    'hero.feature1': 'Analyse par IA',
    'hero.feature1Desc': 'Modèles d\'apprentissage profond analysent vos données de santé',
    'hero.feature2': 'Confidentialité d\'abord',
    'hero.feature2Desc': 'Vos données sont cryptées et jamais partagées',
    'hero.feature3': 'Informations en temps réel',
    'hero.feature3Desc': 'Obtenez des recommandations de santé instantanées',
    
    // How It Works
    'howItWorks.title': 'Transformez Votre Santé en 4 Étapes Simples',
    'howItWorks.subtitle': 'Notre plateforme alimentée par IA rend l\'optimisation de la santé accessible et personnalisée pour tous.',
    'howItWorks.step1': 'Partagez votre mode de vie',
    'howItWorks.step1Desc': 'Entrez vos habitudes quotidiennes, régime alimentaire, exercice, sommeil et mesures de santé.',
    'howItWorks.step2': 'Moteur d\'analyse IA',
    'howItWorks.step2Desc': 'Les réseaux neuronaux analysent les schémas et prédisent les risques pour la santé avec 94% de précision.',
    'howItWorks.step3': 'Insights personnalisés',
    'howItWorks.step3Desc': 'Recevez des rapports détaillés avec des recommandations de santé actionnables.',
    'howItWorks.step4': 'Amélioration continue',
    'howItWorks.step4Desc': 'Suivez vos progrès avec une surveillance continue et des recommandations adaptatives.',
    
    // Features
    'features.title': 'Fonctionnalités IA pour une Meilleure Santé',
    'features.subtitle': 'Découvrez l\'avenir des soins de santé personnalisés avec notre plateforme IA complète.',
    
    // CTA
    'cta.title': 'Prêt à transformer votre parcours santé?',
    'cta.subtitle': 'Rejoignez des milliers de personnes qui ont amélioré leur mode de vie grâce à l\'IA',
    'cta.button': 'Commencez votre analyse gratuite',
    'cta.demo': 'Planifier une démo',
    
    // Footer
    'footer.product': 'Produit',
    'footer.company': 'Entreprise',
    'footer.legal': 'Juridique',
    'footer.copyright': '© 2024 MedMind AI. Tous droits réservés.',
  },
  ar: {
    // Navigation
    'nav.home': 'الرئيسية',
    'nav.howItWorks': 'كيف تعمل',
    'nav.features': 'الميزات',
    'nav.blog': 'المدونة',
    'nav.about': 'من نحن',
    'nav.contact': 'اتصل بنا',
    'nav.signIn': 'تسجيل الدخول',
    'nav.getStarted': 'ابدأ الآن',
    
    // Hero
    'hero.title': 'رفيقك الذكي للصحة',
    'hero.subtitle': 'يحلل ميدمايند نمط حياتك، يتنبأ بالمخاطر الصحية، ويقدم توصيات شخصية باستخدام تكنولوجيا الذكاء الاصطناعي المتطورة لتحسين صحتك.',
    "hero.ctaPrimary": "ابدأ الآن",
    'hero.ctaSecondary': 'شاهد العرض',
    'hero.badge': 'مدعوم بالذكاء الاصطناعي المتقدم',
    'hero.feature1': 'تحليل بالذكاء الاصطناعي',
    'hero.feature1Desc': 'نماذج التعلم العميق تحلل بياناتك الصحية',
    'hero.feature2': 'الخصوصية أولاً',
    'hero.feature2Desc': 'بياناتك مشفرة ولا تشارك أبداً',
    'hero.feature3': 'رؤى فورية',
    'hero.feature3Desc': 'احصل على توصيات صحية فورية',
    
    // How It Works
    'howItWorks.title': 'حول صحتك في 4 خطوات بسيطة',
    'howItWorks.subtitle': 'منصتنا المدعومة بالذكاء الاصطناعي تجعل تحسين الصحة في متناول الجميع ومخصصة لكل فرد.',
    
    // CTA
    'cta.title': 'مستعد لتحويل رحلتك الصحية؟',
    'cta.subtitle': 'انضم إلى الآلاف الذين حسّنوا نمط حياتهم بفضل الذكاء الاصطناعي',
    'cta.button': 'ابدأ تحليلك المجاني',
    'cta.demo': 'جدولة عرض تجريبي',
    
    // Footer
    'footer.product': 'المنتج',
    'footer.company': 'الشركة',
    'footer.legal': 'قانوني',
    'footer.copyright': '© 2024 ميدمايند. جميع الحقوق محفوظة.',
  }
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en')

  useEffect(() => {
    const savedLang = localStorage.getItem('medmind-language') as Language
    if (savedLang && ['en', 'fr', 'ar'].includes(savedLang)) {
      setLanguage(savedLang)
    }
  }, [])

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem('medmind-language', lang)
    // Refresh page to apply language changes to static text
    window.location.reload()
  }

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}