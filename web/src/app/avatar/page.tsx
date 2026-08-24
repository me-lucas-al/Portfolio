import { getDictionary } from "@/i18n"
import { getLocale } from "@/lib/locale"
import { AvatarView } from "@/modules/portfolio/avatar/avatar-view"

export default async function AvatarPage() {
  const locale = await getLocale()
  const dict = getDictionary(locale)

  return (
    <main className="min-h-screen bg-black text-white selection:bg-blue-900/30 selection:text-blue-200">
      <AvatarView dict={dict.assistant} locale={locale} />
    </main>
  )
}
