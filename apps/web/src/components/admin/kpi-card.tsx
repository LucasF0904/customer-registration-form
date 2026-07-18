'use client'

import { motion } from 'framer-motion'

interface KpiCardProps {
  label: string
  value: string | number
  sub?: string
  accent?: string
  index?: number
}

export function KpiCard({ label, value, sub, accent = 'var(--cta)', index = 0 }: KpiCardProps) {
  return (
    <motion.div
      className="rounded-xl border p-5"
      style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, type: 'spring', stiffness: 280, damping: 28 }}
      whileHover={{ y: -2, boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}
    >
      <p
        className="mb-3 text-[11px] font-bold uppercase tracking-[0.08em]"
        style={{ color: 'var(--muted)' }}
      >
        {label}
      </p>
      <p className="text-[32px] font-bold leading-none tracking-tight" style={{ color: accent }}>
        {value}
      </p>
      {sub && (
        <p className="mt-2 text-[12px]" style={{ color: 'var(--subtle)' }}>
          {sub}
        </p>
      )}
    </motion.div>
  )
}
