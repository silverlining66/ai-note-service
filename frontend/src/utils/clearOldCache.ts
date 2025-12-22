/**
 * Clear old mock data from localStorage
 * This prevents conflicts when switching from mock to real API
 */

const OLD_MOCK_DATA_IDS = [
  'kp-001',
  'kp-002',
  'kp-p001',
  'kp-p002',
  'kp-p003',
  'kp-p004',
  'kp-p005',
  'kp-n001',
  'kp-n002',
  'kp-n003',
  'kp-n004',
  'kp-n005',
]

const CACHE_CLEAR_VERSION = 'v2' // Increment this to force cache clear
const VERSION_KEY = 'cache_version'

/**
 * Clear old mock data dialogues from localStorage
 */
export const clearOldMockDataDialogues = (): void => {
  try {
    const currentVersion = localStorage.getItem(VERSION_KEY)
    
    // If version matches, no need to clear
    if (currentVersion === CACHE_CLEAR_VERSION) {
      return
    }

    console.log('[Cache] Clearing old mock data dialogues...')

    // Clear all dialogue histories with old mock IDs
    OLD_MOCK_DATA_IDS.forEach((id) => {
      const key = `dialogue_${id}`
      if (localStorage.getItem(key)) {
        localStorage.removeItem(key)
        console.log(`[Cache] Removed ${key}`)
      }
    })

    // Remove old app_config if it exists
    const oldConfig = localStorage.getItem('app_config')
    if (oldConfig) {
      try {
        const parsed = JSON.parse(oldConfig)
        if ('useMockData' in parsed) {
          localStorage.removeItem('app_config')
          console.log('[Cache] Removed old app_config')
        }
      } catch {
        // Invalid JSON, remove it anyway
        localStorage.removeItem('app_config')
      }
    }

    // Set new version
    localStorage.setItem(VERSION_KEY, CACHE_CLEAR_VERSION)
    console.log('[Cache] Cache cleared successfully')
  } catch (error) {
    console.error('[Cache] Failed to clear old cache:', error)
  }
}

/**
 * Force clear all dialogue histories
 */
export const clearAllDialogues = (): void => {
  try {
    const keys = Object.keys(localStorage)
    keys.forEach((key) => {
      if (key.startsWith('dialogue_')) {
        localStorage.removeItem(key)
      }
    })
    console.log('[Cache] All dialogues cleared')
  } catch (error) {
    console.error('[Cache] Failed to clear dialogues:', error)
  }
}

