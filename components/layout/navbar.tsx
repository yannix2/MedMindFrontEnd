"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from '@/components/ui/navigation-menu'
import { Badge } from '@/components/ui/badge'
import { Menu, X, Sparkles, BrainCircuit } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { LanguageToggle } from '@/components/ui/language-toggle'
import { useLanguage } from '@/contexts/language-context'
import Image from 'next/image'
import logo from "@/public/logo.png"
export function PremiumNavbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { t } = useLanguage()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { label: t('nav.howItWorks'), href: '/#how-it-works' },
    { label: t('nav.features'), href: '/#features' },
    { label: t('nav.blog'), href: '/blog' },
    { label: t('nav.about'), href: '/aboutus' },
    { label: t('nav.contact'), href: '/contactus' },
  ]

  if (!mounted) return null

  return (
    <header className={cn(
      "fixed top-0 w-full z-50 transition-all duration-500",
      scrolled 
        ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-2xl shadow-blue-500/10 dark:shadow-blue-900/20 border-b border-gray-200/50 dark:border-gray-800/50" 
        : "bg-transparent"
    )}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              
               <Image src={logo} alt='medmindlogo' width={80 } height={80}></Image>
              
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
                MedMind
              </span>
           
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            <NavigationMenu>
              <NavigationMenuList className="gap-1">
                {navItems.map((item) => (
                  <NavigationMenuItem key={item.label}>
                    <Link href={item.href} passHref>
                      <NavigationMenuLink className={cn(
                        "px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105",
                        scrolled 
                          ? "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800/50" 
                          : "text-gray-300 hover:text-white hover:bg-white/10 backdrop-blur-sm"
                      )}>
                        {item.label}
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>

            {/* Theme & Language Switchers */}
            <div className="flex items-center gap-x-50 border-l  border-gray-300/30 dark:border-gray-700/30 pl-6">
              <ThemeToggle variant="ghost" className='hover:cursor-pointer'/>
            
              {/* CTA Button */}
              <Link href="/signin">
                <Button className="bg-gradient-to-r hover:cursor-pointer from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-500 rounded-xl px-6 h-10 group/cta">
                  <span className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 group-hover/cta:rotate-12 transition-transform duration-500" />
                    {t('nav.signIn')}
                  </span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className={cn(
                "h-7 w-7 transition-colors duration-300",
                scrolled 
                  ? "text-gray-700 dark:text-gray-300" 
                  : "text-white dark:text-gray-300"
              )} />
            ) : (
              <Menu className={cn(
                "h-7 w-7 transition-colors duration-300",
                scrolled 
                  ? "text-gray-700 dark:text-gray-300" 
                  : "text-white dark:text-gray-300"
              )} />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-800/50 shadow-2xl animate-fadeIn">
            <div className="flex flex-col py-6 px-4 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-gray-700 dark:text-gray-300 font-medium py-3 px-4 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-all duration-300 hover:scale-105"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              
              {/* Mobile Theme & Language */}
              <div className="pt-4 mt-4 border-t border-gray-200/30 dark:border-gray-800/30">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Theme</p>
                    <ThemeToggle />
                  </div>
               
                </div>
              </div>

              {/* Mobile CTA */}
              <div className="pt-4">
                <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white shadow-2xl hover:shadow-3xl rounded-xl py-6 text-lg">
                    <Sparkles className="h-5 w-5 mr-2" />
                    {t('nav.getStarted')}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}