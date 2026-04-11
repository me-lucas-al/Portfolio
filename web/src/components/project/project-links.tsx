import { ExternalLink, Github } from "lucide-react"
import Link from "next/link"

interface ProjectLinksProps {
  githubUrl?: string | null
  deployUrl?: string | null
}

export function ProjectLinks({ githubUrl, deployUrl }: ProjectLinksProps) {
  if (!githubUrl && !deployUrl) return null

  return (
    <div className="flex items-center gap-5 mt-auto pt-6 border-t border-neutral-900/50">
      {githubUrl && (
        <Link href={githubUrl} target="_blank" className="flex items-center gap-2 text-sm font-medium text-neutral-500 hover:text-white transition-colors">
          <Github className="w-4 h-4" />
          Código
        </Link>
      )}
      {deployUrl && (
        <Link href={deployUrl} target="_blank" className="flex items-center gap-2 text-sm font-medium text-neutral-500 hover:text-blue-400 transition-colors">
          <ExternalLink className="w-4 h-4" />
          Site (Deploy)
        </Link>
      )}
    </div>
  )
}
