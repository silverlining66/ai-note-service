/**
 * localStorage utilities for data persistence
 * Following FR-015, FR-023
 */

const STORAGE_KEYS = {
  DIALOGUE: (knowledgePointId: string) => `dialogue_${knowledgePointId}`,
  PANEL_WIDTHS: 'panel_widths',
  APP_CONFIG: 'app_config',
  LAST_IMAGE: 'last_uploaded_image',
} as const

export const storage = {
  /**
   * Save dialogue history for a knowledge point
   */
  saveDialogue: (knowledgePointId: string, data: unknown): void => {
    try {
      localStorage.setItem(
        STORAGE_KEYS.DIALOGUE(knowledgePointId),
        JSON.stringify(data)
      )
    } catch (error) {
      console.error('Failed to save dialogue:', error)
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        throw new Error('存储空间不足，请清理部分对话历史')
      }
    }
  },

  /**
   * Load dialogue history for a knowledge point
   */
  loadDialogue: <T>(knowledgePointId: string): T | null => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DIALOGUE(knowledgePointId))
      return data ? (JSON.parse(data) as T) : null
    } catch (error) {
      console.error('Failed to load dialogue:', error)
      return null
    }
  },

  /**
   * Save panel widths configuration
   */
  savePanelWidths: (widths: number[]): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.PANEL_WIDTHS, JSON.stringify(widths))
    } catch (error) {
      console.error('Failed to save panel widths:', error)
    }
  },

  /**
   * Load panel widths configuration
   */
  loadPanelWidths: (): number[] | null => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PANEL_WIDTHS)
      return data ? (JSON.parse(data) as number[]) : null
    } catch (error) {
      console.error('Failed to load panel widths:', error)
      return null
    }
  },

  /**
   * Clear all dialogue histories
   */
  clearAllDialogues: (): void => {
    try {
      const keys = Object.keys(localStorage)
      keys.forEach((key) => {
        if (key.startsWith('dialogue_')) {
          localStorage.removeItem(key)
        }
      })
      console.log('[Storage] All dialogues cleared')
    } catch (error) {
      console.error('Failed to clear dialogues:', error)
    }
  },

  /**
   * Clear all app data (for debugging)
   */
  clearAll: (): void => {
    try {
      localStorage.clear()
      console.log('[Storage] All storage cleared')
    } catch (error) {
      console.error('Failed to clear storage:', error)
    }
  },
}

