interface LogoMarkProps {
  className?: string
}

// A terminal prompt ("›") followed by a cursor bar — the same "waiting to
// type" glyph the avatar's own typewriter effect renders mid-response. This
// mark is the site's one deliberate signature, so it's kept out of every
// other component: no gradients, no brand color splashed elsewhere.
export function LogoMark({ className }: LogoMarkProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden focusable="false">
      <rect width="100" height="100" rx="22" fill="var(--ink)" />
      <path
        d="M30 28 L58 50 L30 72"
        fill="none"
        stroke="var(--prompt)"
        strokeWidth={11}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="66" y="30" width="12" height="40" rx="3" fill="var(--brand)" />
    </svg>
  )
}

interface LogoProps {
  className?: string
  wordmarkClassName?: string
}

export function Logo({ className, wordmarkClassName }: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className ?? ""}`}>
      <LogoMark className="h-8 w-8 shrink-0 rounded-[22%]" />
      <span className={`font-display font-semibold tracking-tight text-fg ${wordmarkClassName ?? ""}`}>
        Lucas Almeida
      </span>
    </span>
  )
}
