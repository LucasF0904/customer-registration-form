'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, User, Mail, CreditCard, Palette, FileText, Calendar } from 'lucide-react'
import { CustomerListItem } from '@customer-reg/shared'

interface CustomerDetailModalProps {
  customer: CustomerListItem | null
  onClose: () => void
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function CustomerDetailModal({ customer, onClose }: CustomerDetailModalProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <AnimatePresence>
      {customer && (
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
              className="relative w-full max-w-[480px] overflow-hidden rounded-2xl border shadow-2xl"
              style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
              initial={{ opacity: 0, y: 32, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 32, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            >
              {/* Header */}
              <div
                className="flex items-center justify-between border-b px-6 py-4"
                style={{ borderColor: 'var(--border)' }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white"
                    style={{ background: customer.color.hexCode }}
                  >
                    {customer.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-[14px] font-bold" style={{ color: 'var(--text)' }}>
                      {customer.name}
                    </p>
                    <p className="text-[11px]" style={{ color: 'var(--muted)' }}>
                      Cliente cadastrado
                    </p>
                  </div>
                </div>
                <motion.button
                  onClick={onClose}
                  className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg"
                  style={{ color: 'var(--muted)' }}
                  whileHover={{ scale: 1.1, backgroundColor: 'var(--border)' }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="h-4 w-4" />
                </motion.button>
              </div>

              {/* Body */}
              <div className="px-6 py-5 space-y-3">
                <DetailField
                  icon={<User className="h-4 w-4" />}
                  label="Nome"
                  value={customer.name}
                />
                <DetailField
                  icon={<CreditCard className="h-4 w-4" />}
                  label="CPF"
                  value={customer.cpfMasked}
                  mono
                />
                <DetailField
                  icon={<Mail className="h-4 w-4" />}
                  label="E-mail"
                  value={customer.email}
                />
                <DetailField
                  icon={<Palette className="h-4 w-4" />}
                  label="Cor preferida"
                  value={
                    <span className="inline-flex items-center gap-2">
                      <span
                        className="inline-block h-3 w-3 rounded-full"
                        style={{
                          background: customer.color.hexCode,
                          outline: `2px solid ${customer.color.hexCode}`,
                          outlineOffset: '2px',
                        }}
                      />
                      {customer.color.name}
                      <span className="text-[10px] font-mono" style={{ color: 'var(--subtle)' }}>
                        {customer.color.hexCode}
                      </span>
                    </span>
                  }
                />
                {customer.notes && (
                  <DetailField
                    icon={<FileText className="h-4 w-4" />}
                    label="Observações"
                    value={customer.notes}
                  />
                )}
                <DetailField
                  icon={<Calendar className="h-4 w-4" />}
                  label="Cadastrado em"
                  value={formatDate(customer.createdAt)}
                />
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

function DetailField({
  icon,
  label,
  value,
  mono = false,
}: {
  icon: React.ReactNode
  label: string
  value: React.ReactNode
  mono?: boolean
}) {
  return (
    <div
      className="flex items-start gap-3 rounded-lg px-3 py-2.5"
      style={{ background: 'var(--bg)' }}
    >
      <span className="mt-0.5 shrink-0" style={{ color: 'var(--muted)' }}>
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p
          className="text-[10px] font-bold uppercase tracking-[0.06em]"
          style={{ color: 'var(--subtle)' }}
        >
          {label}
        </p>
        <p
          className={`text-[13px] break-all ${mono ? 'font-mono' : 'font-medium'}`}
          style={{ color: 'var(--text)' }}
        >
          {value}
        </p>
      </div>
    </div>
  )
}
