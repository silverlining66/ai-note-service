/**
 * Application configuration service
 * Manages API settings
 */

import type { AppConfig } from '../types/api'

const defaultConfig: AppConfig = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  environment: import.meta.env.MODE === 'production' ? 'production' : 'development',
}

export const getConfig = (): AppConfig => {
  return defaultConfig
}