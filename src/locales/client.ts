import en from './en'

type TranslationKeys = typeof en
type TranslationValue = string | TranslationKeys

const translations: Record<string, TranslationValue> = flattenTranslations(en)

function flattenTranslations(obj: TranslationKeys, prefix = ''): Record<string, TranslationValue> {
  const result: Record<string, TranslationValue> = {}
  
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key
    
    if (typeof value === 'string') {
      result[fullKey] = value
    } else {
      Object.assign(result, flattenTranslations(value, fullKey))
    }
  }
  
  return result
}

export function useScopedI18n(scope: string) {
  return (key: string, params?: Record<string, string | number>) => {
    const fullKey = `${scope}.${key}`
    let translation = translations[fullKey] || key
    
    if (params) {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        translation = (translation as string).replace(`{${paramKey}}`, String(paramValue))
      })
    }
    
    return translation as string
  }
}

export function useCurrentLocale() {
  return 'en'
}

export function useI18n() {
  return (key: string, params?: Record<string, string | number>) => {
    let translation = translations[key] || key
    
    if (params) {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        translation = (translation as string).replace(`{${paramKey}}`, String(paramValue))
      })
    }
    
    return translation as string
  }
}

export { en }
export type { TranslationKeys }
