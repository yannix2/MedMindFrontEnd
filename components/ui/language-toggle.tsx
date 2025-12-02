"use client"

import * as React from "react"
import { Globe, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/contexts/language-context"



const languages = [
  { 
    code: 'en', 
    label: 'English', 
  },
  { 
    code: 'fr', 
    label: 'Français', 
  },
  { 
    code: 'ar', 
    label: 'العربية', 
  },
]

export function LanguageToggle({ className }: { className?: string }) {
  const { language, setLanguage } = useLanguage()
  const [open, setOpen] = React.useState(false)

  const currentLang = languages.find(l => l.code === language) || languages[0]

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen(!open)}
        className={cn(
          "rounded-xl gap-2 h-10 px-3 transition-all duration-300",
          "bg-gradient-to-br from-gray-100 to-white dark:from-gray-800 dark:to-gray-900",
          "border border-gray-200 dark:border-gray-700",
          "shadow-md hover:shadow-lg hover:scale-105",
          className
        )}
        aria-label="Change language"
      >
        <Globe className="h-4 w-4" />
        <span className="font-medium">{currentLang.code.toUpperCase()}</span>
        <ChevronDown className={cn(
          "h-4 w-4 transition-transform duration-300",
          open && "rotate-180"
        )} />
      </Button>

      {open && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute top-full right-0 mt-2 w-48 z-50 animate-fadeIn">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 p-2 backdrop-blur-xl">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code as any)
                    setOpen(false)
                  }}
                  className={cn(
                    "flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm transition-all duration-300 hover:scale-105",
                    language === lang.code
                      ? "bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-600 dark:text-blue-400"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  )}
                >
                  {lang.icon}
                  {/* Or use the SVG flag component: */}
                  {/* {lang.flagComponent()} */}
                  
                  <div className="flex flex-col items-start">
                    <span className="font-medium">{lang.label}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {lang.code.toUpperCase()}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}