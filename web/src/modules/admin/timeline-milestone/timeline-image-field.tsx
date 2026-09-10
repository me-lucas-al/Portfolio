"use client"

import { useState, useEffect, useRef, ChangeEvent } from "react"
import { ImageUp, X } from "lucide-react"

interface TimelineImageFieldProps {
  label: string
  fileInputName: string
  keptUrlInputName: string
  altInputName: string
  imageUrl?: string | null
  imageAlt?: string | null
  disabled?: boolean
  inputId: string
}

export function TimelineImageField({
  label,
  fileInputName,
  keptUrlInputName,
  altInputName,
  imageUrl,
  imageAlt,
  disabled = false,
  inputId,
}: TimelineImageFieldProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [filePreview, setFilePreview] = useState<string | null>(null)
  const [keptUrl, setKeptUrl] = useState<string>(imageUrl || "")
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setKeptUrl(imageUrl || "")
  }, [imageUrl])

  useEffect(() => {
    if (!selectedFile) {
      setFilePreview(null)
      return
    }

    const url = URL.createObjectURL(selectedFile)
    setFilePreview(url)
    return () => {
      URL.revokeObjectURL(url)
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
  const hasKeptImage = !hasSelectedFile && Boolean(keptUrl)
  const previewSrc = filePreview || (hasKeptImage ? keptUrl : null)

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-fg-muted flex items-center justify-between">
        {label}
        <span className="text-muted-2 text-xs font-normal">Opcional (PNG, JPG ou WEBP)</span>
      </label>

      <input type="hidden" name={keptUrlInputName} value={keptUrl} />
      <input
        ref={fileInputRef}
        id={inputId}
        name={fileInputName}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        disabled={disabled}
        onChange={handleFileChange}
        className="sr-only"
      />

      {(hasSelectedFile || hasKeptImage) ? (
        <div className="relative flex items-center justify-between p-4 rounded-xl border border-line bg-surface/80">
          <div className="flex items-center gap-3 overflow-hidden">
            {previewSrc && (
              <img
                src={previewSrc}
                alt="Pré-visualização"
                className="w-12 h-12 rounded-lg object-cover border border-line flex-shrink-0"
              />
            )}
            <p className="text-sm font-medium text-fg truncate">
              {selectedFile?.name || "Imagem cadastrada"}
            </p>
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
              title="Remover imagem"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <label
          htmlFor={inputId}
          className="group relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-line-strong bg-surface/40 px-6 py-6 text-center transition-all hover:border-brand/60 hover:bg-surface-2/60"
        >
          <ImageUp className="w-6 h-6 text-fg-muted group-hover:text-brand transition-colors mb-2" />
          <span className="text-sm font-medium text-fg-muted group-hover:text-fg transition-colors">
            Selecionar imagem
          </span>
        </label>
      )}

      <input
        name={altInputName}
        defaultValue={imageAlt ?? ""}
        placeholder="Texto alternativo da imagem (acessibilidade)"
        className="w-full bg-surface border border-line rounded-xl px-4 py-2.5 text-sm text-fg placeholder:text-muted-2 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all"
      />
    </div>
  )
}
