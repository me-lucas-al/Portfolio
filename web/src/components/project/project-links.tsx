import { ExternalLink, Github } from "lucide-react"
import Link from "next/link"
import type { Locale } from "@/i18n"

interface ProjectLinksProps {
  githubUrl?: string | null
  deployUrl?: string | null
  locale?: Locale
}

export function ProjectLinks({ githubUrl, deployUrl, locale = "pt" }: ProjectLinksProps) {
  if (!githubUrl && !deployUrl) return null

  const codeLabel = locale === "en" ? "Code" : "Código"
  const deployLabel = locale === "en" ? "Live Demo" : "Site (Deploy)"

  return (
    <div className="flex items-center gap-5 mt-auto pt-6 border-t border-line/50">
      {githubUrl && (
        <Link href={githubUrl} target="_blank" className="flex items-center gap-2 text-sm font-medium text-muted-2 hover:text-fg transition-colors">
          <Github className="w-4 h-4" />
          {codeLabel}
        </Link>
      )}
      {deployUrl && (
        <Link href={deployUrl} target="_blank" className="flex items-center gap-2 text-sm font-medium text-muted-2 hover:text-accent transition-colors">
          <ExternalLink className="w-4 h-4" />
          {deployLabel}
        </Link>
      )}
    </div>
  )
}
