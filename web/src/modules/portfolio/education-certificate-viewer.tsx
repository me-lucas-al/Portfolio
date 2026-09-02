"use client"

import { FileText } from "lucide-react"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { MediaFullscreenDialog } from "@/components/media/media-fullscreen-dialog"
import { buildCertificatePreviewUrl } from "@/lib/certificate-preview-url"

interface EducationCertificateViewerProps {
  certificateUrl: string
  label: string
  srTitle: string
}

export function EducationCertificateViewer({
  certificateUrl,
  label,
  srTitle,
}: EducationCertificateViewerProps) {
  const previewUrl = buildCertificatePreviewUrl(certificateUrl)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-brand hover:text-brand-strong bg-brand/10 hover:bg-brand/20 border border-brand/20 rounded-lg px-2.5 py-1 transition-all cursor-pointer mt-4 self-start"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>{label}</span>
        </button>
      </DialogTrigger>
      <MediaFullscreenDialog
        title={srTitle}
        srTitle={srTitle}
        alt={srTitle}
        imagesUrl={[previewUrl]}
      />
    </Dialog>
  )
}
