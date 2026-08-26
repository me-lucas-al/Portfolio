"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"

interface ModalContentProps extends React.ComponentPropsWithoutRef<typeof DialogContent> {
  title?: string
  description?: string
}

const ModalContent = React.forwardRef<React.ElementRef<typeof DialogContent>, ModalContentProps>(
  ({ className, title, description, children, ...props }, ref) => (
    <DialogContent
      ref={ref}
      className={`bg-surface border-line sm:max-w-md ${className || ""}`}
      {...props}
    >
      {(title || description) && (
        <DialogHeader>
          {title && <DialogTitle className="text-fg">{title}</DialogTitle>}
          {description && <DialogDescription className="text-fg-muted">{description}</DialogDescription>}
        </DialogHeader>
      )}
      {children}
    </DialogContent>
  )
)
ModalContent.displayName = "ModalContent"

export const Modal = {
  Root: Dialog,
  Trigger: DialogTrigger,
  Content: ModalContent,
  Footer: DialogFooter,
}