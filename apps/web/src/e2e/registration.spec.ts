import { test, expect } from '@playwright/test'

const VALID_CPF = '529.982.247-25'
const INVALID_CPF = '111.111.111-11'

test.describe('Registration Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should display the registration form on load', async ({ page }) => {
    await expect(page.getByTestId('registration-form')).toBeVisible()
    await expect(page.getByTestId('input-name')).toBeVisible()
    await expect(page.getByTestId('input-cpf')).toBeVisible()
    await expect(page.getByTestId('input-email')).toBeVisible()
    await expect(page.getByTestId('submit-button')).toBeVisible()
  })

  test('should show validation errors when submitting empty form', async ({ page }) => {
    await page.getByTestId('submit-button').click()
    await expect(page.getByRole('alert').first()).toBeVisible()
    await expect(page.getByTestId('input-name')).toHaveAttribute('aria-invalid', 'true')
  })

  test('should show CPF error for invalid CPF', async ({ page }) => {
    await page.getByTestId('input-name').fill('Maria Oliveira')
    await page.getByTestId('input-cpf').fill(INVALID_CPF)
    await page.getByTestId('input-email').fill('maria@exemplo.com')
    await page.getByTestId('submit-button').click()
    await expect(page.getByText(/cpf inv[aá]lido/i)).toBeVisible()
  })

  test('should apply CPF mask while typing', async ({ page }) => {
    const cpfInput = page.getByTestId('input-cpf')
    await cpfInput.fill('52998224725')
    await expect(cpfInput).toHaveValue('529.982.247-25')
  })

  test('should show success screen after successful submission', async ({ page }) => {
    await page.route('**/customers', (route) => {
      route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            id: '550e8400-e29b-41d4-a716-446655440000',
            name: 'Maria Oliveira',
            cpfMasked: '***.982.247-**',
            email: 'maria@exemplo.com',
            color: { id: 'color-id', name: 'Vermelho', hexCode: '#E53E3E' },
            createdAt: new Date().toISOString(),
          },
          message: 'Customer registered successfully',
        }),
      })
    })

    await page.route('**/colors', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: [
            {
              id: 'color-id',
              name: 'Vermelho',
              hexCode: '#E53E3E',
              createdAt: new Date().toISOString(),
            },
          ],
        }),
      })
    })

    await page.reload()
    await page.getByTestId('input-name').fill('Maria Oliveira')
    await page.getByTestId('input-cpf').fill(VALID_CPF)
    await page.getByTestId('input-email').fill('maria@exemplo.com')

    await page.locator('label[title="Vermelho"]').click()
    await page.getByTestId('submit-button').click()

    await expect(page.getByText('Cadastro realizado!')).toBeVisible({ timeout: 5000 })
    await expect(page.getByText('Maria Oliveira')).toBeVisible()
    await expect(page.getByText('Vermelho')).toBeVisible()
  })

  test('should display API error when server returns conflict', async ({ page }) => {
    await page.route('**/customers', (route) => {
      route.fulfill({
        status: 409,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          error: { code: 'CONFLICT', message: 'Já existe um cadastro com este CPF.' },
        }),
      })
    })

    await page.route('**/colors', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: [
            {
              id: 'color-id',
              name: 'Vermelho',
              hexCode: '#E53E3E',
              createdAt: new Date().toISOString(),
            },
          ],
        }),
      })
    })

    await page.reload()
    await page.getByTestId('input-name').fill('Maria Oliveira')
    await page.getByTestId('input-cpf').fill(VALID_CPF)
    await page.getByTestId('input-email').fill('maria@exemplo.com')
    await page.locator('label[title="Vermelho"]').click()
    await page.getByTestId('submit-button').click()

    await expect(page.getByTestId('api-error')).toBeVisible({ timeout: 5000 })
    await expect(page.getByText(/j[aá] existe um cadastro/i)).toBeVisible()
  })

  test('should be responsive on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await expect(page.getByTestId('registration-form')).toBeVisible()
    await expect(page.getByTestId('submit-button')).toBeVisible()
  })
})
