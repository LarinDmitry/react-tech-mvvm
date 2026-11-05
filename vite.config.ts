import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/react-tech-mvvm/' : '/',
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    include: ['src/**/*.test.{ts,tsx}'],
  },
}));
