export interface AccessibilitySettings {
  textSizeMultiplier: number
  touchTargetMultiplier: number
  assistMode: boolean
  reduceMotion: boolean
}

export const ACCESSIBILITY_KEY = 'advantage-games-accessibility'

export const DEFAULT_ACCESSIBILITY_SETTINGS: AccessibilitySettings = {
  textSizeMultiplier: 1.0,
  touchTargetMultiplier: 1.0,
  assistMode: false,
  reduceMotion: false,
}

export function createDefaultAccessibilitySettings(): AccessibilitySettings {
  return { ...DEFAULT_ACCESSIBILITY_SETTINGS }
}

export function serializeAccessibilitySettings(
  settings: AccessibilitySettings
): string {
  return JSON.stringify(settings)
}

export function deserializeAccessibilitySettings(
  json: string
): AccessibilitySettings {
  try {
    const parsed = JSON.parse(json)
    const validKeys: (keyof AccessibilitySettings)[] = [
      'textSizeMultiplier',
      'touchTargetMultiplier',
      'assistMode',
      'reduceMotion',
    ]
    const result: AccessibilitySettings = { ...DEFAULT_ACCESSIBILITY_SETTINGS }
    for (const key of validKeys) {
      if (typeof parsed[key] !== 'undefined') {
        ;(result as Record<string, unknown>)[key] = parsed[key]
      }
    }
    return result
  } catch {
    return createDefaultAccessibilitySettings()
  }
}
