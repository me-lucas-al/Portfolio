"use client"

import { useState, useEffect, useRef, ChangeEvent } from "react"
import { FileUp, FileText, X, Eye } from "lucide-react"
import { buildCertificatePreviewUrl } from "@/lib/certificate-preview-url"

interface EducationCertificateFieldProps {
  certificateUrl?: string | null
  disabled?: boolean
  inputId?: string
}

export function EducationCertificateField({
  certificateUrl,
  disabled = false,
  inputId = "education-certificate-file",
}: EducationCertificateFieldProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [filePreview, setFilePreview] = useState<string | null>(null)
  const [keptUrl, setKeptUrl] = useState<string>(certificateUrl || "")
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setKeptUrl(certificateUrl || "")
  }, [certificateUrl])

  useEffect(() => {
    if (!selectedFile) {
      setFilePreview(null)
      return
    }

    if (selectedFile.type.startsWith("image/")) {
      const url = URL.createObjectURL(selectedFile)
      setFilePreview(url)
      return () => {
        URL.revokeObjectURL(url)
      }
    } else {
      setFilePreview(null)
    }
  }, [selectedFile])

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      setSelectedFile(files[0])
    }
  }

  const handleClear = () => {
    setSelectedFile(null)
    setKeptUrl("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const hasSelectedFile = Boolean(selectedFile)
  const isSelectedPdf = selectedFile?.type === "application/pdf" || selectedFile?.name.toLowerCase().endsWith(".pdf")
  const hasKeptCertificate = !hasSelectedFile && Boolean(keptUrl)
  const keptPreviewUrl = hasKeptCertificate ? buildCertificatePreviewUrl(keptUrl) : ""

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-fg-muted flex items-center justify-between">
        Certificado do Curso
        <span className="text-muted-2 text-xs font-normal">Opcional (PNG, JPG ou PDF)</span>
      </label>

      {/* Hidden inputs to send in FormData */}
      <input type="hidden" name="keptCertificateUrl" value={keptUrl} />
      <input
        ref={fileInputRef}
        id={inputId}
        name="certificateFile"
        type="file"
        accept="image/png,image/jpeg,image/webp,application/pdf,.pdf"
        disabled={disabled}
        onChange={handleFileChange}
        className="sr-only"
      />

      {/* State 1: Newly selected file */}
      {hasSelectedFile && (
        <div className="relative flex items-center justify-between p-4 rounded-xl border border-line bg-surface/80">
          <div className="flex items-center gap-3 overflow-hidden">
            {filePreview ? (
              <img
                src={filePreview}
                alt="Preview do certificado"
                className="w-12 h-12 rounded-lg object-cover border border-line flex-shrink-0"
              />
            ) : (
              <div className="w-12 h-12 rounded-lg bg-brand/10 border border-brand/20 flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 text-brand" />
              </div>
            )}
            <div className="truncate text-left">
              <p className="text-sm font-medium text-fg truncate">{selectedFile?.name}</p>
              <p className="text-xs text-muted-2">
                {isSelectedPdf ? "Documento PDF" : "Imagem"} • {((selectedFile?.size || 0) / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={disabled}
            onClick={handleClear}
            className="p-2 text-fg-muted hover:text-danger hover:bg-danger/10 rounded-lg transition-colors cursor-pointer"
            title="Remover arquivo selecionado"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* State 2: Existing certificate already saved */}
      {hasKeptCertificate && (
        <div className="relative flex items-center justify-between p-4 rounded-xl border border-line bg-surface/80">
          <div className="flex items-center gap-3 overflow-hidden">
            {keptPreviewUrl ? (
              <img
                src={keptPreviewUrl}
                alt="Certificado cadastrado"
                className="w-12 h-12 rounded-lg object-cover border border-line flex-shrink-0"
              />
            ) : (
              <div className="w-12 h-12 rounded-lg bg-brand/10 border border-brand/20 flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 text-brand" />
              </div>
            )}
            <div className="truncate text-left">
              <p className="text-sm font-medium text-fg truncate">Certificado anexado</p>
              <a
                href={keptUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-brand hover:underline inline-flex items-center gap-1 mt-0.5"
              >
                <Eye className="w-3 h-3" />
                Visualizar original
              </a>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label
              htmlFor={inputId}
              className="px-3 py-1.5 text-xs font-medium border border-line hover:border-brand text-fg-muted hover:text-fg rounded-lg cursor-pointer transition-colors"
            >
              Trocar
            </label>
            <button
              type="button"
              disabled={disabled}
              onClick={handleClear}
              className="p-2 text-fg-muted hover:text-danger hover:bg-danger/10 rounded-lg transition-colors cursor-pointer"
              title="Remover certificado"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* State 3: Empty dropzone */}
      {!hasSelectedFile && !hasKeptCertificate && (
        <label
          htmlFor={inputId}
          className="group relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-line-strong bg-surface/40 px-6 py-8 text-center transition-all hover:border-brand/60 hover:bg-surface-2/60 disabled:opacity-50"
        >
          <FileUp className="w-8 h-8 text-fg-muted group-hover:text-brand transition-colors mb-2" />
          <span className="text-sm font-medium text-fg-muted group-hover:text-fg transition-colors">
            Selecionar certificado
          </span>
          <span className="mt-1 text-xs text-muted-2">PNG, JPG ou PDF até 10MB</span>
        </label>
      )}
    </div>
  )
}
