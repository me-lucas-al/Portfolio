import { textareaClass, inputClass } from "./form-field-styles"
import { TimelineMilestoneBilingualDefaults } from "./timeline-milestone-bilingual-defaults"

export function TimelineMilestoneTextFieldsEn({ defaults }: { defaults?: TimelineMilestoneBilingualDefaults }) {
  return (
    <>
      <div className="space-y-2">
        <label className="text-sm font-medium text-fg-muted">Date (label) <span className="text-muted-2">(optional)</span></label>
        <input name="dateLabelEn" defaultValue={defaults?.dateLabelEn} placeholder="Ex: Jan – Feb 2026" className={inputClass} />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-fg-muted">Title <span className="text-muted-2">(optional)</span></label>
        <input name="titleEn" defaultValue={defaults?.titleEn} placeholder="Ex: The Foundation and the CMS" className={inputClass} />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-fg-muted">Impact <span className="text-muted-2">(optional)</span></label>
        <textarea name="impactEn" rows={3} defaultValue={defaults?.impactEn} className={textareaClass} />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-fg-muted">Narration <span className="text-muted-2">(optional)</span></label>
        <textarea name="narrationEn" rows={4} defaultValue={defaults?.narrationEn} className={textareaClass} />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-fg-muted">Problem <span className="text-muted-2">(optional)</span></label>
        <textarea name="problemEn" rows={3} defaultValue={defaults?.problemEn} className={textareaClass} />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-fg-muted">Inflection Point <span className="text-muted-2">(optional)</span></label>
        <textarea name="inflectionEn" rows={3} defaultValue={defaults?.inflectionEn} className={textareaClass} />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-fg-muted">Solution <span className="text-muted-2">(optional)</span></label>
        <textarea name="solutionEn" rows={3} defaultValue={defaults?.solutionEn} className={textareaClass} />
      </div>
    </>
  )
}
