import { describe, it, expect } from 'vitest'
import { isValidCpf, formatCpf } from './cpf.validation'

describe('isValidCpf', () => {
  it('should return true for a valid CPF with formatting', () => {
    expect(isValidCpf('529.982.247-25')).toBe(true)
  })

  it('should return true for a valid CPF without formatting', () => {
    expect(isValidCpf('52998224725')).toBe(true)
  })

  it('should return false for a CPF with invalid check digits', () => {
    expect(isValidCpf('529.982.247-26')).toBe(false)
  })

  it('should return false for a CPF with all equal digits', () => {
    expect(isValidCpf('111.111.111-11')).toBe(false)
    expect(isValidCpf('000.000.000-00')).toBe(false)
    expect(isValidCpf('999.999.999-99')).toBe(false)
  })

  it('should return false for a CPF with wrong length', () => {
    expect(isValidCpf('123.456.789')).toBe(false)
    expect(isValidCpf('123456789012')).toBe(false)
  })

  it('should return false for an empty string', () => {
    expect(isValidCpf('')).toBe(false)
  })

  it('should return false for a CPF with letters', () => {
    expect(isValidCpf('abc.def.ghi-jk')).toBe(false)
  })
})

describe('formatCpf', () => {
  it('should format a raw CPF string', () => {
    expect(formatCpf('52998224725')).toBe('529.982.247-25')
  })

  it('should reformat an already formatted CPF', () => {
    expect(formatCpf('529.982.247-25')).toBe('529.982.247-25')
  })
})
