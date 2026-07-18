'use client'

import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { RainbowColor, RegisterCustomerResponse } from '@customer-reg/shared'
import { registrationFormSchema, RegistrationFormData } from './registration-form.schema'
import { ColorPicker } from './color-picker'
import { SuccessScreen } from './success-screen'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { apiClient } from '@/lib/api-client'

interface RegistrationFormProps {
  colors: RainbowColor[]
}

function applyMask(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length > 9)
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`
  if (digits.length > 6) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`
  if (digits.length > 3) return `${digits.slice(0, 3)}.${digits.slice(3)}`
  return digits
}

const fieldVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07 + 0.1, type: 'spring' as const, stiffness: 300, damping: 28 },
  }),
}

export function RegistrationForm({ colors }: RegistrationFormProps) {
  const [successData, setSuccessData] = useState<RegisterCustomerResponse | null>(null)
  const [apiError, setApiError] = useState<string | null>(null)

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationFormSchema),
    defaultValues: { name: '', cpf: '', email: '', colorId: '', notes: '' },
  })

  const onSubmit = async (data: RegistrationFormData) => {
    setApiError(null)
    try {
      const payload = {
        name: data.name,
        cpf: data.cpf,
        email: data.email,
        colorId: data.colorId,
        ...(data.notes ? { notes: data.notes } : {}),
      }
      const response = await apiClient.customers.register(payload)
      if (response.success && response.data) {
        setSuccessData(response.data)
      }
    } catch (err: unknown) {
      const message =
        err &&
        typeof err === 'object' &&
        'error' in err &&
        err.error &&
        typeof err.error === 'object' &&
        'message' in err.error
          ? String((err.error as { message: string }).message)
          : 'Erro ao realizar cadastro. Tente novamente.'
      setApiError(message)
    }
  }

  if (successData) {
    return <SuccessScreen data={successData} />
  }

  return (
    <motion.div
      className="rounded-[10px] border border-[var(--border)] bg-[var(--card)] p-9"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate data-testid="registration-form">
        <div className="space-y-5">
          <motion.div
            custom={0}
            variants={fieldVariants}
            initial="hidden"
            animate="visible"
            className="space-y-1.5"
          >
            <Label htmlFor="name">
              Nome completo <span className="text-[var(--cta)]">*</span>
            </Label>
            <Input
              id="name"
              placeholder="Ex.: Maria Oliveira"
              autoComplete="name"
              aria-invalid={!!errors.name}
              data-testid="input-name"
              {...register('name')}
            />
            {errors.name && (
              <motion.p
                className="text-xs text-[var(--error)]"
                role="alert"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {errors.name.message}
              </motion.p>
            )}
          </motion.div>

          <motion.div
            custom={1}
            variants={fieldVariants}
            initial="hidden"
            animate="visible"
            className="space-y-1.5"
          >
            <Label htmlFor="cpf">
              CPF <span className="text-[var(--cta)]">*</span>
            </Label>
            <Controller
              name="cpf"
              control={control}
              render={({ field }) => (
                <Input
                  id="cpf"
                  inputMode="numeric"
                  placeholder="000.000.000-00"
                  maxLength={14}
                  autoComplete="off"
                  aria-invalid={!!errors.cpf}
                  data-testid="input-cpf"
                  value={field.value}
                  onChange={(e) => field.onChange(applyMask(e.target.value))}
                />
              )}
            />
            <p className="text-[11px] text-[var(--subtle)]">
              Validação completa do dígito verificador
            </p>
            {errors.cpf && (
              <motion.p
                className="text-xs text-[var(--error)]"
                role="alert"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {errors.cpf.message}
              </motion.p>
            )}
          </motion.div>

          <motion.div
            custom={2}
            variants={fieldVariants}
            initial="hidden"
            animate="visible"
            className="space-y-1.5"
          >
            <Label htmlFor="email">
              E-mail <span className="text-[var(--cta)]">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="maria@exemplo.com"
              autoComplete="email"
              aria-invalid={!!errors.email}
              data-testid="input-email"
              {...register('email')}
            />
            {errors.email && (
              <motion.p
                className="text-xs text-[var(--error)]"
                role="alert"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {errors.email.message}
              </motion.p>
            )}
          </motion.div>

          <hr className="border-[var(--border)]" />

          <motion.div
            custom={3}
            variants={fieldVariants}
            initial="hidden"
            animate="visible"
            className="space-y-2"
          >
            <Label>
              Cor preferida <span className="text-[var(--cta)]">*</span>
            </Label>
            <Controller
              name="colorId"
              control={control}
              render={({ field }) => (
                <ColorPicker
                  colors={colors}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.colorId?.message}
                />
              )}
            />
          </motion.div>

          <hr className="border-[var(--border)]" />

          <motion.div
            custom={4}
            variants={fieldVariants}
            initial="hidden"
            animate="visible"
            className="space-y-1.5"
          >
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              placeholder="Informações adicionais relevantes para o cadastro…"
              data-testid="input-notes"
              {...register('notes')}
            />
            {errors.notes && (
              <motion.p
                className="text-xs text-[var(--error)]"
                role="alert"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {errors.notes.message}
              </motion.p>
            )}
          </motion.div>
        </div>

        <AnimatePresence>
          {apiError && (
            <motion.div
              className="mt-5 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400"
              role="alert"
              data-testid="api-error"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              {apiError}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          className="mt-7"
          custom={5}
          variants={fieldVariants}
          initial="hidden"
          animate="visible"
        >
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
            data-testid="submit-button"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Enviando…
              </>
            ) : (
              'Enviar cadastro'
            )}
          </Button>
        </motion.div>
      </form>
    </motion.div>
  )
}
