"use client"

import { useActionState, useEffect } from "react"
import { updateSystemSettingAction } from "@/app/actions/system-setting"
import { Loader2, FileText, Globe } from "lucide-react"
import { toast } from "react-toastify"

interface ResumeLinksFormProps {
  cvUrlPt: string
  cvUrlEn: string
}

export function ResumeLinksForm({ cvUrlPt, cvUrlEn }: ResumeLinksFormProps) {
  const [statePt, formActionPt, isPendingPt] = useActionState(updateSystemSettingAction, null)
  const [stateEn, formActionEn, isPendingEn] = useActionState(updateSystemSettingAction, null)

  useEffect(() => {
    if (statePt?.error) toast.error(statePt.error)
    if (statePt?.success && statePt?.message) toast.success(statePt.message)
  }, [statePt])

  useEffect(() => {
    if (stateEn?.error) toast.error(stateEn.error)
    if (stateEn?.success && stateEn?.message) toast.success(stateEn.message)
  }, [stateEn])

  return (
    <div className="rounded-2xl border border-blue-950/60 bg-blue-950/10 p-6 space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 rounded-lg bg-blue-950/50 text-blue-400">
          <FileText className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-white font-semibold">Links de Currículo</h3>
          <p className="text-xs text-neutral-500">Edite os links dos CVs exibidos no hero do portfólio</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* CV PT */}
        <form action={formActionPt} className="space-y-3">
          <input type="hidden" name="key" value="cvUrlPt" />
          <label className="flex items-center gap-2 text-sm font-medium text-neutral-300">
            <Globe className="w-4 h-4 text-green-400" />
            CV Português (PT)
          </label>
          <div className="flex gap-2">
            <input
              name="value"
              type="url"
              defaultValue={cvUrlPt}
              required
              disabled={isPendingPt}
              placeholder="https://drive.google.com/..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-neutral-900/60 border border-neutral-800 text-white text-sm focus:outline-none focus:border-blue-800 focus:ring-1 focus:ring-blue-800 transition-all disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isPendingPt}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-950 hover:bg-blue-900 border border-blue-800/50 text-white text-sm font-medium transition-all disabled:opacity-50 whitespace-nowrap"
            >
              {isPendingPt ? <Loader2 className="w-4 h-4 animate-spin" /> : "Salvar"}
            </button>
          </div>
          {cvUrlPt && (
            <a href={cvUrlPt} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:underline truncate block">
              {cvUrlPt}
            </a>
          )}
        </form>

        {/* CV EN */}
        <form action={formActionEn} className="space-y-3">
          <input type="hidden" name="key" value="cvUrlEn" />
          <label className="flex items-center gap-2 text-sm font-medium text-neutral-300">
            <Globe className="w-4 h-4 text-blue-400" />
            CV Inglês (EN)
          </label>
          <div className="flex gap-2">
            <input
              name="value"
              type="url"
              defaultValue={cvUrlEn}
              required
              disabled={isPendingEn}
              placeholder="https://drive.google.com/..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-neutral-900/60 border border-neutral-800 text-white text-sm focus:outline-none focus:border-blue-800 focus:ring-1 focus:ring-blue-800 transition-all disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isPendingEn}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-950 hover:bg-blue-900 border border-blue-800/50 text-white text-sm font-medium transition-all disabled:opacity-50 whitespace-nowrap"
            >
              {isPendingEn ? <Loader2 className="w-4 h-4 animate-spin" /> : "Salvar"}
            </button>
          </div>
          {cvUrlEn && (
            <a href={cvUrlEn} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:underline truncate block">
              {cvUrlEn}
            </a>
          )}
        </form>
      </div>
    </div>
  )
}
