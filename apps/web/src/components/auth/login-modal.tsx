'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Loader2, LogIn, Eye, EyeOff } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface LoginModalProps {
  open: boolean
  onClose: () => void
}

export function LoginModal({ open, onClose }: LoginModalProps) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!open) {
      setEmail('')
      setPassword('')
      setError(null)
      setShowPassword(false)
    }
  }, [open])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (open) document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        const msg =
          data?.error?.message ?? data?.message ?? 'Credenciais inválidas. Tente novamente.'
        setError(msg)
        return
      }

      onClose()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      router.push('/admin' as any)
    } catch {
      setError('Erro de conexão. Verifique sua rede e tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="overlay"
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              key="modal"
              className="relative w-full max-w-[400px] overflow-hidden rounded-2xl border shadow-2xl"
              style={{
                background: 'var(--card)',
                borderColor: 'var(--border)',
              }}
              initial={{ opacity: 0, scale: 0.92, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 16 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            >
              {/* Header */}
              <div
                className="flex items-center justify-between border-b px-6 py-5"
                style={{ borderColor: 'var(--border)' }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-lg"
                    style={{ background: 'var(--cta)' }}
                  >
                    <LogIn className="h-4 w-4 text-white" strokeWidth={2.5} />
                  </div>
                  <div>
                    <p
                      className="text-[13px] font-bold tracking-tight"
                      style={{ color: 'var(--text)' }}
                    >
                      Acesso Restrito
                    </p>
                    <p className="text-[11px]" style={{ color: 'var(--muted)' }}>
                      Área administrativa
                    </p>
                  </div>
                </div>
                <motion.button
                  onClick={onClose}
                  className="flex h-7 w-7 items-center justify-center rounded-lg cursor-pointer"
                  style={{ color: 'var(--muted)' }}
                  whileHover={{ scale: 1.1, backgroundColor: 'var(--border)' }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="h-4 w-4" />
                </motion.button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="px-6 py-6 space-y-4">
                <div className="space-y-1.5">
                  <label
                    htmlFor="login-email"
                    className="text-[13px] font-semibold"
                    style={{ color: 'var(--text)' }}
                  >
                    E-mail
                  </label>
                  <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="JohnDoe@mail.com"
                    autoComplete="email"
                    required
                    className="w-full rounded-lg border px-3.5 py-2.5 text-sm outline-none transition-colors focus:ring-2 focus:ring-[var(--cta)] focus:ring-offset-1"
                    style={{
                      background: 'var(--input-bg)',
                      borderColor: 'var(--border)',
                      color: 'var(--text)',
                    }}
                  />
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="login-password"
                    className="text-[13px] font-semibold"
                    style={{ color: 'var(--text)' }}
                  >
                    Senha
                  </label>
                  <div className="relative">
                    <input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      autoComplete="current-password"
                      required
                      className="w-full rounded-lg border px-3.5 py-2.5 pr-10 text-sm outline-none transition-colors focus:ring-2 focus:ring-[var(--cta)] focus:ring-offset-1"
                      style={{
                        background: 'var(--input-bg)',
                        borderColor: 'var(--border)',
                        color: 'var(--text)',
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                      style={{ color: 'var(--muted)' }}
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <p
                        className="rounded-lg border px-3.5 py-2.5 text-xs"
                        style={{
                          background: 'rgba(220,38,38,0.08)',
                          borderColor: 'rgba(220,38,38,0.25)',
                          color: 'var(--error)',
                        }}
                      >
                        {error}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg py-2.5 text-sm font-semibold text-white cursor-pointer disabled:opacity-60"
                  style={{ background: 'var(--cta)' }}
                  whileHover={{ filter: 'brightness(1.08)' }}
                  whileTap={{ scale: 0.98 }}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Entrando…
                    </span>
                  ) : (
                    'Entrar'
                  )}
                </motion.button>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
