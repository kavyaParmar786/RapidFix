'use client'

import { useTheme, ThemeMode } from '@/lib/theme-context'
import { Sun, Moon, Monitor } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

export type ThemeTogglerButtonProps = {
  variant?: 'default' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  direction?: 'horizontal' | 'vertical'
  modes?: ThemeMode[]
  className?: string
}

const iconMap: Record<ThemeMode, React.ReactNode> = {
  light: <Sun size={14} strokeWidth={2} />,
  dark: <Moon size={14} strokeWidth={2} />,
  dynamic: <Monitor size={14} strokeWidth={2} />,
}

const labelMap: Record<ThemeMode, string> = {
  light: 'Light',
  dark: 'Dark',
  dynamic: 'Auto',
}

export function ThemeTogglerButton({
  variant = 'default',
  size = 'md',
  direction = 'horizontal',
  modes = ['light', 'dark'],
  className,
}: ThemeTogglerButtonProps) {
  const { mode, setMode } = useTheme()

  const sizeClasses = {
    sm: 'px-2 py-1 text-[11px] gap-1',
    md: 'px-2.5 py-1.5 text-xs gap-1.5',
    lg: 'px-3 py-2 text-sm gap-2',
  }

  const iconSize = { sm: 12, md: 14, lg: 16 }[size]

  const containerClasses = cn(
    'relative flex items-center rounded-xl border transition-colors duration-200',
    direction === 'vertical' && 'flex-col',
    variant === 'default' && 'bg-[var(--bg-surface)] border-[var(--border-default)]',
    variant === 'ghost' && 'border-transparent bg-transparent',
    variant === 'outline' && 'border-[var(--border-strong)] bg-transparent',
    'p-0.5',
    className,
  )

  return (
    <div className={containerClasses}>
      {modes.map((m) => {
        const isActive = mode === m
        return (
          <motion.button
            key={m}
            onClick={() => setMode(m)}
            whileTap={{ scale: 0.92 }}
            className={cn(
              'relative flex items-center font-medium rounded-lg transition-colors duration-150 select-none z-10',
              sizeClasses[size],
              isActive
                ? 'text-[var(--text-primary)]'
                : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]',
            )}
          >
            {/* Sliding background pill */}
            {isActive && (
              <motion.div
                layoutId="theme-toggler-pill"
                className="absolute inset-0 rounded-lg bg-[var(--bg-base)] shadow-sm border border-[var(--border-subtle)]"
                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
              />
            )}

            {/* Icon with flip animation */}
            <span className="relative z-10 flex items-center justify-center" style={{ width: iconSize, height: iconSize }}>
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={m + '-icon'}
                  initial={{ rotate: -30, opacity: 0, scale: 0.7 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 30, opacity: 0, scale: 0.7 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                  className="flex items-center justify-center"
                >
                  {m === 'light' && <Sun size={iconSize} strokeWidth={2} />}
                  {m === 'dark' && <Moon size={iconSize} strokeWidth={2} />}
                  {m === 'dynamic' && <Monitor size={iconSize} strokeWidth={2} />}
                </motion.span>
              </AnimatePresence>
            </span>

            <span className="relative z-10">{labelMap[m]}</span>
          </motion.button>
        )
      })}
    </div>
  )
}

/**
 * A compact single-button toggler that cycles through modes on click.
 * Shows only the current mode icon with a smooth rotation animation.
 */
export function ThemeTogglerIconButton({
  modes = ['light', 'dark'],
  size = 'md',
  className,
}: Pick<ThemeTogglerButtonProps, 'modes' | 'size' | 'className'>) {
  const { mode, setMode } = useTheme()
  const currentIdx = modes.indexOf(mode as ThemeMode)
  const nextMode = modes[(currentIdx + 1) % modes.length]
  const iconSize = { sm: 14, md: 16, lg: 18 }[size]

  return (
    <motion.button
      onClick={() => setMode(nextMode)}
      whileTap={{ scale: 0.88, rotate: 15 }}
      whileHover={{ scale: 1.08 }}
      className={cn(
        'flex items-center justify-center rounded-full transition-colors duration-150',
        'text-[var(--text-secondary)] hover:text-[var(--text-primary)]',
        'hover:bg-[var(--bg-elevated)]',
        { sm: 'h-7 w-7', md: 'h-8 w-8', lg: 'h-9 w-9' }[size],
        className,
      )}
      aria-label={`Switch to ${labelMap[nextMode]} mode`}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={mode}
          initial={{ y: -10, opacity: 0, rotate: -20 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: 10, opacity: 0, rotate: 20 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center justify-center"
        >
          {mode === 'light' && <Sun size={iconSize} strokeWidth={2} />}
          {mode === 'dark' && <Moon size={iconSize} strokeWidth={2} />}
          {mode === 'dynamic' && <Monitor size={iconSize} strokeWidth={2} />}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  )
}
