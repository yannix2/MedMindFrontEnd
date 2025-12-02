"use client"

import * as React from "react"
import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

export function ClearThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const themes = [
    { 
      value: "light", 
      icon: Sun, 
      label: "Light", 
      color: "bg-yellow-100 text-yellow-800 border-yellow-300",
      iconColor: "text-yellow-600"
    },
    { 
      value: "dark", 
      icon: Moon, 
      label: "Dark", 
      color: "bg-blue-100 text-blue-800 border-blue-300",
      iconColor: "text-blue-600"
    },
    { 
      value: "system", 
      icon: Monitor, 
      label: "System", 
      color: "bg-gray-100 text-gray-800 border-gray-300",
      iconColor: "text-gray-600"
    },
  ]

  if (!mounted) {
    return (
      <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
        {themes.map((t) => (
          <Button
            key={t.value}
            variant="ghost"
            size="sm"
            className="h-8 px-3 rounded-lg"
          >
            <t.icon className="h-4 w-4" />
          </Button>
        ))}
      </div>
    )
  }

  return (
    <div className={cn("flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1", className)}>
      {themes.map((t) => (
        <button
          key={t.value}
          onClick={() => setTheme(t.value)}
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300",
            "hover:scale-105",
            theme === t.value
              ? `${t.color} border shadow-md`
              : "text-gray-600 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-gray-700/50"
          )}
          aria-label={`Switch to ${t.label} mode`}
        >
          <t.icon className={cn("h-4 w-4", t.iconColor)} />
          <span>{t.label}</span>
          {theme === t.value && (
            <Check className="h-4 w-4 ml-1" />
          )}
        </button>
      ))}
    </div>
  )
}