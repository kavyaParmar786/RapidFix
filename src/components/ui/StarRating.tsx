'use client'

import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StarRatingProps {
  value: number
  onChange?: (v: number) => void
  size?: number
  readonly?: boolean
}

export default function StarRating({ value, onChange, size = 16, readonly }: StarRatingProps) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          className={cn(
            'transition-transform',
            !readonly && 'hover:scale-110 cursor-pointer',
            readonly && 'cursor-default'
          )}
        >
          <Star
            size={size}
            className={cn(
              'transition-colors',
              star <= value ? 'fill-yellow-400 text-yellow-400' : 'text-[var(--text-muted)]'
            )}
          />
        </button>
      ))}
    </div>
  )
}
