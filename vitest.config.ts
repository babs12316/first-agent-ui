import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom', // fake browser environment
    globals: true,        // allow global test functions (describe, it, expect)
    setupFiles: './src/test/setup.ts' // jest-dom matchers
  }
})
