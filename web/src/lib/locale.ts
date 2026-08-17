import { cookies } from 'next/headers'
import type { Locale } from '@/i18n'

const LOCALE_COOKIE = 'NEXT_LOCALE'
const DEFAULT_LOCALE: Locale = 'pt'

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies()
  const value = cookieStore.get(LOCALE_COOKIE)?.value
  if (value === 'en' || value === 'pt') return value
  return DEFAULT_LOCALE
}
