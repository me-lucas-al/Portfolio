import { textareaClass, inputClass } from "./form-field-styles"
import { TimelineMilestoneBilingualDefaults } from "./timeline-milestone-bilingual-defaults"

export function TimelineMilestoneTextFieldsPt({ defaults }: { defaults?: TimelineMilestoneBilingualDefaults }) {
  return (
    <>
      <div className="space-y-2">
        <label className="text-sm font-medium text-fg-muted">Data (label)</label>
        <input required name="dateLabelPt" defaultValue={defaults?.dateLabelPt} placeholder="Ex: Jan – Fev 2026" className={inputClass} />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-fg-muted">Título</label>
        <input required name="titlePt" defaultValue={defaults?.titlePt} placeholder="Ex: A Fundação e o CMS" className={inputClass} />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-fg-muted">Impacto (resumo do card)</label>
        <textarea required name="impactPt" rows={3} defaultValue={defaults?.impactPt} className={textareaClass} />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-fg-muted">Narração (falas do assistente)</label>
        <textarea required name="narrationPt" rows={4} defaultValue={defaults?.narrationPt} className={textareaClass} />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-fg-muted">Problema</label>
        <textarea required name="problemPt" rows={3} defaultValue={defaults?.problemPt} className={textareaClass} />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-fg-muted">Ponto de Inflexão</label>
        <textarea required name="inflectionPt" rows={3} defaultValue={defaults?.inflectionPt} className={textareaClass} />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-fg-muted">Solução</label>
        <textarea required name="solutionPt" rows={3} defaultValue={defaults?.solutionPt} className={textareaClass} />
      </div>
    </>
  )
}
