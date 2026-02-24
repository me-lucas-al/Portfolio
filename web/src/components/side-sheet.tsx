"use client"

import * as React from "react"
import {
  Sheet,
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
      className={`bg-neutral-950 border-l-neutral-800 w-full sm:max-w-md overflow-y-auto flex flex-col gap-0 p-6 ${className || ""}`}
      {...props}
    >
      {(title || description) && (
        <SheetHeader className="mb-8 space-y-1.5 text-left">
          {title && <SheetTitle className="text-white text-xl font-semibold tracking-tight">{title}</SheetTitle>}
          {description && <SheetDescription className="text-neutral-400 text-sm leading-relaxed">{description}</SheetDescription>}
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