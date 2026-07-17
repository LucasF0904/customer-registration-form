import { describe, it, expect } from 'vitest'
import { registrationFormSchema } from './registration-form.schema'

const validData = {
  name: 'Maria Oliveira',
  cpf: '529.982.247-25',
  email: 'maria@exemplo.com',
  colorId: '550e8400-e29b-41d4-a716-446655440000',
  notes: '',
}

describe('registrationFormSchema', () => {
  it('should pass for valid data', () => {
    const result = registrationFormSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('should fail when name is too short', () => {
    const result = registrationFormSchema.safeParse({ ...validData, name: 'Jo' })
    expect(result.success).toBe(false)
  })

  it('should fail when name has only one word', () => {
    const result = registrationFormSchema.safeParse({ ...validData, name: 'Maria' })
    expect(result.success).toBe(false)
  })

  it('should fail for invalid CPF', () => {
    const result = registrationFormSchema.safeParse({ ...validData, cpf: '111.111.111-11' })
    expect(result.success).toBe(false)
  })

  it('should fail for invalid email', () => {
    const result = registrationFormSchema.safeParse({ ...validData, email: 'not-an-email' })
    expect(result.success).toBe(false)
  })

  it('should fail when colorId is not a UUID', () => {
    const result = registrationFormSchema.safeParse({ ...validData, colorId: 'not-a-uuid' })
    expect(result.success).toBe(false)
  })

  it('should pass without notes', () => {
    const { notes: _notes, ...withoutNotes } = validData
    const result = registrationFormSchema.safeParse(withoutNotes)
    expect(result.success).toBe(true)
  })
})
