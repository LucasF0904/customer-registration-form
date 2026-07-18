'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { LogIn } from 'lucide-react'
import { LoginModal } from './login-modal'

interface LoginButtonProps {
  autoOpen?: boolean
}

export function LoginButton({ autoOpen = false }: LoginButtonProps) {
  const [open, setOpen] = useState(autoOpen)

  return (
    <>
      <motion.button
        onClick={() => setOpen(true)}
        className="fixed right-5 top-5 z-30 flex cursor-pointer items-center gap-2 rounded-xl border px-3.5 py-2 text-[13px] font-semibold shadow-sm"
        style={{
          background: 'var(--card)',
          borderColor: 'var(--border)',
          color: 'var(--text)',
        }}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        whileHover={{ scale: 1.03, boxShadow: '0 4px 16px rgba(0,0,0,0.12)' }}
        whileTap={{ scale: 0.97 }}
      >
        <LogIn className="h-3.5 w-3.5" style={{ color: 'var(--cta)' }} />
        Admin
      </motion.button>

      <LoginModal open={open} onClose={() => setOpen(false)} />
    </>
  )
}
