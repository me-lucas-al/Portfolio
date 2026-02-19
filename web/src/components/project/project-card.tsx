import { ExternalLink, Github, FolderGit2 } from "lucide-react"
import Link from "next/link"

interface ProjectCardProps {
  title: string
  description: string
  deployUrl: string | null
  githubUrl: string | null
  imageUrl: string | null
}

export function ProjectCard({ title, description, deployUrl, githubUrl }: ProjectCardProps) {
  return (
    <div className="group relative flex flex-col justify-between p-8 rounded-2xl bg-neutral-950 border border-neutral-900 hover:border-blue-900/50 transition-all duration-300 hover:shadow-[0_0_40px_-15px_rgba(23,37,84,0.6)] hover:-translate-y-1">
      <div>
        <div className="w-12 h-12 rounded-xl bg-blue-950/40 flex items-center justify-center mb-6 border border-blue-900/50">
          <FolderGit2 className="w-6 h-6 text-blue-500" />
        </div>
        <h4 className="text-xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors">
          {title}
        </h4>
        <p className="text-neutral-400 text-sm leading-relaxed mb-8 line-clamp-4">
          {description}
        </p>
      </div>

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
            Live Preview
          </Link>
        )}
      </div>
    </div>
  )
}