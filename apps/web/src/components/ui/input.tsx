import * as React from 'react'
import { cn } from '@/lib/utils'

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded border-[1.5px] border-[var(--border)] bg-[var(--input-bg)] px-3 py-2 text-sm text-[var(--text)] placeholder:text-[var(--subtle)] transition-all outline-none',
          'focus:border-[var(--cta)] focus:ring-2 focus:ring-[var(--cta)]/10',
          'aria-[invalid=true]:border-[var(--error)] aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-[var(--error)]/10',
          'disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        ref={ref}
        {...props}
      />
    )
  },
)
Input.displayName = 'Input'

export { Input }
