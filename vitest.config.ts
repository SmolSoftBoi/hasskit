import { defineConfig } from 'vitest/config';

export default defineConfig({
  // Configure Vitest (https://vitest.dev/config/)
  test: {
    coverage: {
      enabled: true,
      reporter: ['text', 'json', 'html'],
      include: ['src/**'],
    },
  },
});
