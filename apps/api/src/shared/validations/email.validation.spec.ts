import { describe, it, expect } from 'vitest'
import { isValidEmail } from './email.validation'

describe('isValidEmail', () => {
  it('should return true for a valid email', () => {
    expect(isValidEmail('maria@exemplo.com')).toBe(true)
    expect(isValidEmail('user.name+tag@domain.co.uk')).toBe(true)
  })

  it('should return false for an email without @', () => {
    expect(isValidEmail('mariaexemplo.com')).toBe(false)
  })

  it('should return false for an email without domain', () => {
    expect(isValidEmail('maria@')).toBe(false)
  })

  it('should return false for an email without TLD', () => {
    expect(isValidEmail('maria@exemplo')).toBe(false)
  })

  it('should return false for an empty string', () => {
    expect(isValidEmail('')).toBe(false)
  })

  it('should trim whitespace before validating', () => {
    expect(isValidEmail('  maria@exemplo.com  ')).toBe(true)
  })
})
