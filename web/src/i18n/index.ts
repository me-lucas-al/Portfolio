import { pt } from './pt'
import { en } from './en'

export type Locale = 'pt' | 'en'

export function getDictionary(locale: Locale) {
  return locale === 'en' ? en : pt
}

export { pt, en }
export type { Dictionary } from './pt'
