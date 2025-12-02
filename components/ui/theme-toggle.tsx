"use client"

import * as React from "react"
import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function ThemeToggle({ className, variant = "ghost" }: { className?: string, variant?: "default" | "ghost" | "outline" }) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button
        variant={variant}
        size="icon"
        className={cn("rounded-xl", className)}
        aria-label="Toggle theme"
      >
        <Monitor className="h-5 w-5" />
      </Button>
    )
  }

  const themes = [
    { value: "light", icon: Sun, label: "Light" },
    { value: "dark", icon: Moon, label: "Dark" },
    { value: "system", icon: Monitor, label: "System" },
  ]

  const currentTheme = themes.find(t => t.value === theme) || themes[2]
  const nextTheme = themes[(themes.findIndex(t => t.value === theme) + 1) % themes.length]

  return (
    <>
      {/* Desktop - Cycle through themes */}
      <div className="hidden md:block">
        <Button
          variant={variant}
          size="icon"
          onClick={() => setTheme(nextTheme.value)}
          className={cn(
            "rounded-xl h-10 w-10 transition-all duration-300 hover:scale-110",
            "bg-gradient-to-br from-gray-100 to-white dark:from-gray-800 dark:to-gray-900",
            "border border-gray-200 dark:border-gray-700",
            "shadow-md hover:shadow-lg",
            className
          )}
          aria-label={`Switch to ${nextTheme.label} mode`}
          title={`Current: ${currentTheme.label} - Click for ${nextTheme.label}`}
        >
          <currentTheme.icon className="h-5 w-5 transition-all duration-300" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>

      {/* Mobile - Theme selector with labels */}
      <div className="md:hidden">
        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
          {themes.map((t) => (
            <button
              key={t.value}
              onClick={() => setTheme(t.value)}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300",
                theme === t.value
                  ? "bg-white dark:bg-gray-900 shadow-md"
                  : "hover:bg-white/50 dark:hover:bg-gray-700/50"
              )}
              aria-label={`Switch to ${t.label} mode`}
            >
              <t.icon className="h-4 w-4" />
              <span>{t.label}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  )
}