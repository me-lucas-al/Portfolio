"use client"

import * as React from "react"
import { XIcon } from "lucide-react"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet"

interface SideSheetContentProps extends React.ComponentPropsWithoutRef<typeof SheetContent> {
  title?: string
  description?: string
}

const SideSheetContent = React.forwardRef<React.ElementRef<typeof SheetContent>, SideSheetContentProps>(
  ({ className, title, description, children, ...props }, ref) => (
    <SheetContent
      ref={ref}
      showCloseButton={false}
      className={`bg-surface border-l-line w-full sm:max-w-md overflow-y-auto flex flex-col gap-0 p-6 ${className || ""}`}
      {...props}
    >
      <SheetClose className="absolute right-4 top-4 z-10 flex size-8 items-center justify-center rounded-full border border-line bg-surface-2 text-fg-muted transition-colors hover:border-line-strong hover:text-fg focus:outline-none focus-visible:ring-2 focus-visible:ring-brand">
        <XIcon className="size-4" />
        <span className="sr-only">Fechar</span>
      </SheetClose>
      {(title || description) && (
        <SheetHeader className="mb-8 space-y-1.5 text-left pr-10">
          {title && <SheetTitle className="text-fg text-xl font-semibold tracking-tight">{title}</SheetTitle>}
          {description && <SheetDescription className="text-fg-muted text-sm leading-relaxed">{description}</SheetDescription>}
        </SheetHeader>
      )}
      <div className="flex-1">
        {children}
      </div>
    </SheetContent>
  )
)
SideSheetContent.displayName = "SideSheetContent"

export const SideSheet = {
  Root: Sheet,
  Trigger: SheetTrigger,
  Content: SideSheetContent,
  Footer: SheetFooter,
}
