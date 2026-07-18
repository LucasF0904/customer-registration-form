'use client'

import { motion } from 'framer-motion'
import { Users, Circle } from 'lucide-react'

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
}

const itemVariants = {
  hidden: { opacity: 0, x: -16 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring' as const, stiffness: 320, damping: 28 },
  },
}

export function AnimatedPanel() {
  return (
    <motion.aside
      className="sticky top-0 flex h-screen w-[420px] shrink-0 flex-col justify-between p-14"
      style={{ background: 'var(--panel-bg)', color: 'var(--panel-text)' }}
      initial={{ opacity: 0, x: -32 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <motion.div variants={containerVariants} initial="hidden" animate="visible">
        <motion.div variants={itemVariants} className="mb-12 flex items-center gap-2.5">
          <motion.div
            className="flex h-8 w-8 items-center justify-center rounded-[6px] bg-[var(--cta)]"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            <Users className="h-4 w-4 text-white" strokeWidth={2.5} />
          </motion.div>
          <span
            className="text-[15px] font-bold tracking-tight"
            style={{ color: 'var(--panel-text)' }}
          >
            John Doe
          </span>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="mb-4 text-[30px] font-bold leading-tight tracking-[-0.03em]"
          style={{ color: 'var(--panel-text)', textWrap: 'balance' } as React.CSSProperties}
        >
          Cadastro de clientes
        </motion.h1>
        <motion.p
          variants={itemVariants}
          className="max-w-[300px] text-[15px] leading-relaxed"
          style={{ color: 'var(--panel-muted)' }}
        >
          Preencha o formulário uma única vez. Suas informações são armazenadas com segurança.
        </motion.p>

        <div className="mt-12 space-y-5">
          <AnimatedStep label="Informações pessoais" desc="Nome, CPF e e-mail" active index={0} />
          <AnimatedStep label="Preferências" desc="Cor favorita e observações" index={1} />
          <AnimatedStep label="Confirmação" desc="Cadastro concluído" index={2} />
        </div>
      </motion.div>

      <motion.p
        className="text-xs"
        style={{ color: '#334155' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        Seus dados são protegidos e utilizados exclusivamente para fins de cadastro.
      </motion.p>
    </motion.aside>
  )
}

function AnimatedStep({
  label,
  desc,
  active = false,
  index,
}: {
  label: string
  desc: string
  active?: boolean
  index: number
}) {
  return (
    <motion.div
      className="flex items-start gap-3.5"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.35 + index * 0.1, type: 'spring', stiffness: 300, damping: 28 }}
    >
      <div className="relative mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center">
        {active ? (
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-[var(--cta)] bg-[var(--cta)]"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4 + index * 0.1, type: 'spring', stiffness: 400 }}
          >
            <motion.svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="3"
              className="absolute inset-0 h-full w-full p-1.5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.6, duration: 0.3 }}
            >
              <polyline points="20 6 9 17 4 12" />
            </motion.svg>
          </motion.div>
        ) : (
          <Circle className="h-7 w-7 text-[#334155]" strokeWidth={2} />
        )}

        {active && (
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-[var(--cta)]"
            animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}
      </div>

      <div>
        <p
          className="text-[13px] font-semibold uppercase tracking-[0.04em]"
          style={{ color: active ? 'var(--panel-text)' : 'var(--panel-muted)' }}
        >
          {label}
        </p>
        <p className="text-[13px]" style={{ color: 'var(--panel-muted)' }}>
          {desc}
        </p>
      </div>
    </motion.div>
  )
}
