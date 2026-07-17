import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      exclude: ['**/node_modules/**', '**/dist/**', '**/*.spec.ts', 'src/main.ts'],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 75,
        statements: 80,
      },
    },
  },
  resolve: {
    alias: {
      '@shared': resolve(__dirname, './src/shared'),
      '@customers': resolve(__dirname, './src/customers'),
      '@colors': resolve(__dirname, './src/colors'),
      '@database': resolve(__dirname, './src/database'),
      '@health': resolve(__dirname, './src/health'),
    },
  },
})
