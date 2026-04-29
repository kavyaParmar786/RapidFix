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
  // Light: 6am - 7pm, Dark: 7pm - 6am
  return hour >= 6 && hour < 19 ? 'light' : 'dark'
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>('light')
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light')

  const applyTheme = useCallback((m: ThemeMode) => {
    let resolved: 'light' | 'dark'
    if (m === 'dynamic') {
      resolved = getDynamicTheme()
    } else {
      resolved = m
    }
    setResolvedTheme(resolved)
    const root = document.documentElement
    if (resolved === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [])

  useEffect(() => {
    const saved = (localStorage.getItem('rf-theme') as ThemeMode) || 'light'
    setModeState(saved)
    applyTheme(saved)
  }, [applyTheme])

  // For dynamic mode, re-check every minute
  useEffect(() => {
    if (mode !== 'dynamic') return
    const interval = setInterval(() => {
      applyTheme('dynamic')
    }, 60 * 1000)
    return () => clearInterval(interval)
  }, [mode, applyTheme])

  const setMode = useCallback((m: ThemeMode) => {
    setModeState(m)
    localStorage.setItem('rf-theme', m)
    applyTheme(m)
  }, [applyTheme])

  const toggle = useCallback(() => {
    const next = resolvedTheme === 'light' ? 'dark' : 'light'
    setMode(next)
  }, [resolvedTheme, setMode])

  return (
    <ThemeContext.Provider value={{ mode, resolvedTheme, setMode, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
