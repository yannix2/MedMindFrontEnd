import { PremiumNavbar } from '@/components/layout/navbar'
import { PremiumHero } from '@/components/sections/Hero'
import { HowItWorks } from '@/components/sections/HowItWorks'
import { Features } from '@/components/sections/Features'
import { CTA } from '@/components/sections/CTA'
import { Footer } from '@/components/layout/footer'
import { Suspense } from 'react'
export default function Home() {
  return (
      
    <>
    <Suspense fallback={<div>Loading...</div>}>
      <PremiumNavbar />
      <main className="overflow-hidden">
        <PremiumHero />
        <HowItWorks />
        <Features />
        <CTA />
      </main>
      <Footer />
      </Suspense>
    </>
    
  )
}