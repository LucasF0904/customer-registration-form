import { isUUID } from 'class-validator'

export function isValidColorId(colorId: string): boolean {
  return isUUID(colorId, '4')
}
