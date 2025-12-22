/**
 * Type definitions for API and Panel Layout
 * Based on data-model.md and contracts/api.yaml
 */

export interface Panel {
  id: string
  type: 'main' | 'knowledge' | 'dialogue'
  visible: boolean
  width: number
}

export interface PanelLayout {
  panels: Panel[]
  widths: number[]
  minWidths: number[]
}

export interface AppConfig {
  apiBaseUrl: string
  environment: 'development' | 'production'
}

export interface ErrorResponse {
  error: string
  message: string
  details?: Record<string, unknown>
}

