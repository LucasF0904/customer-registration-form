'use client'

import type { RainbowColor } from '@customer-reg/shared'
import { cn } from '@/lib/utils'

interface ColorPickerProps {
  colors: RainbowColor[]
  value: string
  onChange: (colorId: string) => void
  error?: string
}

export function ColorPicker({ colors, value, onChange, error }: ColorPickerProps) {
  return (
    <div>
      <div
        className="grid gap-3"
        style={{ gridTemplateColumns: `repeat(${Math.min(colors.length, 7)}, minmax(0, 1fr))` }}
        role="radiogroup"
        aria-label="Selecione sua cor preferida"
      >
        {colors.map((color) => {
          const isSelected = value === color.id
          return (
            <label
              key={color.id}
              className="flex cursor-pointer flex-col items-center gap-1.5"
              title={color.name}
            >
              <input
                type="radio"
                name="color"
                value={color.id}
                checked={isSelected}
                onChange={() => onChange(color.id)}
                className="sr-only"
                aria-label={color.name}
              />
              <span
                className={cn(
                  'block h-9 w-9 rounded-full border-[2.5px] transition-transform duration-150',
                  isSelected
                    ? 'scale-110 border-[var(--text)]'
                    : 'border-transparent hover:scale-110',
                )}
                style={{ backgroundColor: color.hexCode }}
                aria-hidden="true"
              />
              <span
                className={cn(
                  'text-center text-[9px] font-semibold uppercase tracking-wider transition-colors',
                  isSelected ? 'text-[var(--text)]' : 'text-[var(--subtle)]',
                )}
              >
                {color.name}
              </span>
            </label>
          )
        })}
      </div>
      {error && (
        <p className="mt-2 text-xs text-[var(--error)]" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
