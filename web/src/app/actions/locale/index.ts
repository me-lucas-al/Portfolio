"use server"

import { cookies } from "next/headers"
import type { Locale } from "@/i18n"

const LOCALE_COOKIE = "NEXT_LOCALE"

export async function setLocaleAction(locale: Locale) {
  const cookieStore = await cookies()
  cookieStore.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  })
}
