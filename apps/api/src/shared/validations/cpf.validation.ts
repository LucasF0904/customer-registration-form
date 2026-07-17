const CPF_LENGTH = 11
const INVALID_CPF_SEQUENCES = Array.from({ length: 10 }, (_, i) => String(i).repeat(CPF_LENGTH))

function stripNonDigits(value: string): string {
  return value.replace(/\D/g, '')
}

function calculateDigit(digits: string, factor: number): number {
  let sum = 0
  for (const digit of digits) {
    sum += parseInt(digit, 10) * factor--
  }
  const remainder = (sum * 10) % 11
  return remainder >= 10 ? 0 : remainder
}

export function isValidCpf(cpf: string): boolean {
  const digits = stripNonDigits(cpf)

  if (digits.length !== CPF_LENGTH) return false
  if (INVALID_CPF_SEQUENCES.includes(digits)) return false

  const firstDigit = calculateDigit(digits.slice(0, 9), 10)
  if (firstDigit !== parseInt(digits[9]!, 10)) return false

  const secondDigit = calculateDigit(digits.slice(0, 10), 11)
  return secondDigit === parseInt(digits[10]!, 10)
}

export function formatCpf(cpf: string): string {
  const digits = stripNonDigits(cpf)
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9, 11)}`
}
