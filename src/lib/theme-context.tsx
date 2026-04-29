'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'

export type ThemeMode = 'light' | 'dark' | 'dynamic'

interface ThemeContextType {
  mode: ThemeMode
  resolvedTheme: 'light' | 'dark'
  setMode: (mode: ThemeMode) => void
  toggle: () => void
}

const ThemeContext = createContext<ThemeContextType>({
  mode: 'light',
  resolvedTheme: 'light',
  setMode: () => {},
  toggle: () => {},
})

function getDynamicTheme(): 'light' | 'dark' {
  const hour = new Date().getHours()
  return hour >= 6 && hour < 19 ? 'light' : 'dark'
}

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyClass(resolved: 'light' | 'dark') {
  const root = document.documentElement
  if (resolved === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Read saved value during first render (client only — suppressed on server via suppressHydrationWarning)
  const [mode, setModeState] = useState<ThemeMode>('light')
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light')
  const [mounted, setMounted] = useState(false)

  const resolve = useCallback((m: ThemeMode): 'light' | 'dark' => {
    if (m === 'dynamic') return getDynamicTheme()
    return m
  }, [])

  // On mount: read localStorage, apply immediately
  useEffect(() => {
    const saved = (localStorage.getItem('rf-theme') as ThemeMode) || 'light'
    const resolved = resolve(saved)
    setModeState(saved)
    setResolvedTheme(resolved)
    applyClass(resolved)
    setMounted(true)
  }, [resolve])

  // Re-check dynamic every minute
  useEffect(() => {
    if (!mounted || mode !== 'dynamic') return
    const id = setInterval(() => {
      const resolved = resolve('dynamic')
      setResolvedTheme(resolved)
      applyClass(resolved)
    }, 60_000)
    return () => clearInterval(id)
  }, [mounted, mode, resolve])

  const setMode = useCallback((m: ThemeMode) => {
    const resolved = resolve(m)
    setModeState(m)
    setResolvedTheme(resolved)
    localStorage.setItem('rf-theme', m)
    applyClass(resolved)
  }, [resolve])

  const toggle = useCallback(() => {
    setMode(resolvedTheme === 'light' ? 'dark' : 'light')
  }, [resolvedTheme, setMode])

  return (
    <ThemeContext.Provider value={{ mode, resolvedTheme, setMode, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
