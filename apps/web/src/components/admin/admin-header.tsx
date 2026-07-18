'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { LogOut, Users, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface AdminHeaderProps {
  email: string
}

export function AdminHeader({ email }: AdminHeaderProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    setLoading(true)
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/')
  }

  return (
    <motion.header
      className="flex items-center justify-between border-b px-8 py-4"
      style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="flex items-center gap-3">
        <div
          className="flex h-8 w-8 items-center justify-center rounded-lg"
          style={{ background: 'var(--cta)' }}
        >
          <Users className="h-4 w-4 text-white" strokeWidth={2.5} />
        </div>
        <div>
          <p className="text-[13px] font-bold tracking-tight" style={{ color: 'var(--text)' }}>
            Backoffice
          </p>
          <p className="text-[11px]" style={{ color: 'var(--muted)' }}>
            Gestão de clientes
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <p className="text-[12px]" style={{ color: 'var(--muted)' }}>
          {email}
        </p>
        <motion.button
          onClick={handleLogout}
          disabled={loading}
          className="flex cursor-pointer items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[12px] font-semibold transition-colors disabled:opacity-50"
          style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
          whileHover={
            { borderColor: 'var(--error)', color: 'var(--error)' } as Record<string, string>
          }
          whileTap={{ scale: 0.97 }}
        >
          {loading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <LogOut className="h-3.5 w-3.5" />
          )}
          Sair
        </motion.button>
      </div>
    </motion.header>
  )
}
