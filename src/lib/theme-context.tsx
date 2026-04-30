'use client'

import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react'

export type ThemeMode = 'light' | 'dark' | 'dynamic'

interface ThemeContextType {
  mode: ThemeMode
  resolvedTheme: 'light' | 'dark'
  setMode: (mode: ThemeMode) => void
  toggle: () => void
  isTransitioning: boolean
}

const ThemeContext = createContext<ThemeContextType>({
  mode: 'light',
  resolvedTheme: 'light',
  setMode: () => {},
  toggle: () => {},
  isTransitioning: false,
})

function getDynamicTheme(): 'light' | 'dark' {
  const hour = new Date().getHours()
  return hour >= 6 && hour < 19 ? 'light' : 'dark'
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
  const [mode, setModeState] = useState<ThemeMode>('light')
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light')
  const [mounted, setMounted] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const overlayRef = useRef<HTMLDivElement | null>(null)

  const resolve = useCallback((m: ThemeMode): 'light' | 'dark' => {
    if (m === 'dynamic') return getDynamicTheme()
    return m
  }, [])

  // Create overlay element once on mount
  useEffect(() => {
    const overlay = document.createElement('div')
    overlay.id = 'theme-transition-overlay'
    overlay.style.cssText = `
      position: fixed;
      inset: 0;
      z-index: 99999;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    `
    document.body.appendChild(overlay)
    overlayRef.current = overlay
    return () => { if (overlay.parentNode) overlay.remove() }
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
    const overlay = overlayRef.current
    setIsTransitioning(true)

    if (overlay) {
      // Get current background color for overlay
      const isDark = resolved === 'dark'
      overlay.style.background = isDark ? '#09090b' : '#ffffff'

      // Fade IN: cover the page
      overlay.style.opacity = '1'

      setTimeout(() => {
        // Instantly swap the theme while hidden
        document.documentElement.classList.add('theme-switching')
        applyClass(resolved)
        setModeState(m)
        setResolvedTheme(resolved)
        localStorage.setItem('rf-theme', m)

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            document.documentElement.classList.remove('theme-switching')
            // Fade OUT: reveal new theme
            overlay.style.opacity = '0'
            setTimeout(() => setIsTransitioning(false), 220)
          })
        })
      }, 200)
    } else {
      applyClass(resolved)
      setModeState(m)
      setResolvedTheme(resolved)
      localStorage.setItem('rf-theme', m)
      setIsTransitioning(false)
    }
  }, [resolve])

  const toggle = useCallback(() => {
    setMode(resolvedTheme === 'light' ? 'dark' : 'light')
  }, [resolvedTheme, setMode])

  return (
    <ThemeContext.Provider value={{ mode, resolvedTheme, setMode, toggle, isTransitioning }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
