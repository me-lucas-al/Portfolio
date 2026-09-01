"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface SortableImageItemProps {
  id: string
  badge?: string
  badgeClassName?: string
  onRemove?: () => void
  disabled?: boolean
  children: React.ReactNode
}

export function SortableImageItem({ id, badge, badgeClassName, onRemove, disabled, children }: SortableImageItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id, disabled })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative group aspect-video rounded-lg overflow-hidden border bg-surface-2",
        isDragging ? "z-10 border-brand shadow-lg shadow-black/30 opacity-80" : "border-line"
      )}
    >
      {children}

      {badge && (
        <span className={cn("absolute top-1 left-1 text-[10px] font-semibold px-1.5 py-0.5 rounded border", badgeClassName)}>
          {badge}
        </span>
      )}

      {onRemove && !disabled && (
        <button
          type="button"
          onClick={onRemove}
          className="absolute top-1 right-1 p-1 rounded-full bg-ink/80 text-danger hover:bg-danger/20 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}

      {!disabled && (
        <button
          type="button"
          {...attributes}
          {...listeners}
          aria-label="Arrastar para reordenar"
          className="absolute bottom-1 right-1 p-1 rounded-full bg-ink/80 text-fg-muted opacity-0 group-hover:opacity-100 transition-opacity cursor-grab touch-none active:cursor-grabbing"
        >
          <GripVertical className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  )
}
