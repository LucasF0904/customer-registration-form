import { z } from 'zod'

function stripCpfMask(cpf: string): string {
  return cpf.replace(/\D/g, '')
}

function isValidCpf(cpf: string): boolean {
  const digits = stripCpfMask(cpf)
  if (digits.length !== 11) return false
  if (/^(\d)\1{10}$/.test(digits)) return false

  let sum = 0
  for (let i = 0; i < 9; i++) sum += parseInt(digits[i]!, 10) * (10 - i)
  let remainder = (sum * 10) % 11
  if (remainder >= 10) remainder = 0
  if (remainder !== parseInt(digits[9]!, 10)) return false

  sum = 0
  for (let i = 0; i < 10; i++) sum += parseInt(digits[i]!, 10) * (11 - i)
  remainder = (sum * 10) % 11
  if (remainder >= 10) remainder = 0

  return remainder === parseInt(digits[10]!, 10)
}

export const registrationFormSchema = z.object({
  name: z
    .string()
    .min(3, 'O nome deve ter pelo menos 3 caracteres')
    .max(255, 'O nome deve ter no máximo 255 caracteres')
    .refine((v) => v.trim().split(/\s+/).length >= 2, 'Informe o nome completo'),

  cpf: z
    .string()
    .min(1, 'O CPF é obrigatório')
    .refine((v) => isValidCpf(v), 'CPF inválido. Verifique os dígitos verificadores.'),

  email: z.string().min(1, 'O e-mail é obrigatório').email('Informe um e-mail válido'),

  colorId: z.string().uuid('Selecione uma cor válida').min(1, 'Selecione uma cor preferida'),

  notes: z.string().max(1000, 'Observações devem ter no máximo 1000 caracteres').optional(),
})

export type RegistrationFormData = z.infer<typeof registrationFormSchema>
