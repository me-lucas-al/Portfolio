"use client"

import { useRef, useState } from "react"
import { Plus, Trash2 } from "lucide-react"
import { TimelineSequenceStepType, TimelineGraveyardIdeaType } from "@portfolio/packages"

const inputClass = "w-full bg-surface border border-line rounded-lg px-3 py-2 text-sm text-fg placeholder:text-muted-2 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-all"

type Row<T> = T & { _key: string }

function useRowKeyGenerator() {
  const nextId = useRef(0)
  return () => `row-${nextId.current++}`
}

function stripKey<T extends { _key: string }>(row: T): Omit<T, "_key"> {
  const { _key, ...rest } = row
  return rest
}

function RowCard({ children, onRemove }: { children: React.ReactNode; onRemove: () => void }) {
  return (
    <div className="relative space-y-2 p-4 rounded-xl border border-line bg-surface/60">
      <button
        type="button"
        onClick={onRemove}
        className="absolute top-2 right-2 p-1.5 text-fg-muted hover:text-danger hover:bg-danger/10 rounded-lg transition-colors cursor-pointer"
        title="Remover linha"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
      {children}
    </div>
  )
}

function AddRowButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-line-strong text-fg-muted hover:text-brand hover:border-brand/60 hover:bg-brand/5 transition-colors text-sm cursor-pointer"
    >
      <Plus className="w-4 h-4" />
      {label}
    </button>
  )
}

interface TimelineSequenceGraveyardFieldsProps {
  initialSequence?: TimelineSequenceStepType[]
  initialGraveyard?: TimelineGraveyardIdeaType[]
}

export function TimelineSequenceGraveyardFields({
  initialSequence = [],
  initialGraveyard = [],
}: TimelineSequenceGraveyardFieldsProps) {
  const nextRowKey = useRowKeyGenerator()
  const [sequence, setSequence] = useState<Row<TimelineSequenceStepType>[]>(
    () => initialSequence.map((step) => ({ ...step, _key: nextRowKey() }))
  )
  const [graveyard, setGraveyard] = useState<Row<TimelineGraveyardIdeaType>[]>(
    () => initialGraveyard.map((idea) => ({ ...idea, _key: nextRowKey() }))
  )

  const updateSequenceRow = (key: string, patch: Partial<TimelineSequenceStepType>) => {
    setSequence((rows) => rows.map((row) => (row._key === key ? { ...row, ...patch } : row)))
  }

  const updateGraveyardRow = (key: string, patch: Partial<TimelineGraveyardIdeaType>) => {
    setGraveyard((rows) => rows.map((row) => (row._key === key ? { ...row, ...patch } : row)))
  }

  return (
    <div className="space-y-8">
      <input type="hidden" name="sequence" value={JSON.stringify(sequence.map(stripKey))} />
      <input type="hidden" name="graveyard" value={JSON.stringify(graveyard.map(stripKey))} />

      <div className="space-y-3">
        <label className="text-sm font-medium text-fg-muted flex items-center justify-between">
          Linha do Tempo Detalhada (Sequence)
          <span className="text-muted-2 text-xs font-normal">Opcional</span>
        </label>

        {sequence.map((step) => (
          <RowCard key={step._key} onRemove={() => setSequence((rows) => rows.filter((row) => row._key !== step._key))}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <input
                placeholder="Data (PT) — Ex: 11–13/08"
                value={step.datePt}
                onChange={(e) => updateSequenceRow(step._key, { datePt: e.target.value })}
                className={inputClass}
              />
              <input
                placeholder="Date (EN) — optional"
                value={step.dateEn ?? ""}
                onChange={(e) => updateSequenceRow(step._key, { dateEn: e.target.value })}
                className={inputClass}
              />
            </div>
            <textarea
              placeholder="Descrição (PT)"
              rows={2}
              value={step.labelPt}
              onChange={(e) => updateSequenceRow(step._key, { labelPt: e.target.value })}
              className={`${inputClass} resize-none`}
            />
            <textarea
              placeholder="Description (EN) — optional"
              rows={2}
              value={step.labelEn ?? ""}
              onChange={(e) => updateSequenceRow(step._key, { labelEn: e.target.value })}
              className={`${inputClass} resize-none`}
            />
          </RowCard>
        ))}

        <AddRowButton
          label="Adicionar linha da sequência"
          onClick={() =>
            setSequence((rows) => [...rows, { datePt: "", dateEn: "", labelPt: "", labelEn: "", _key: nextRowKey() }])
          }
        />
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium text-fg-muted flex items-center justify-between">
          Cemitério de Ideias (Graveyard)
          <span className="text-muted-2 text-xs font-normal">Opcional</span>
        </label>

        {graveyard.map((idea) => (
          <RowCard key={idea._key} onRemove={() => setGraveyard((rows) => rows.filter((row) => row._key !== idea._key))}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <input
                placeholder="Título (PT)"
                value={idea.titlePt}
                onChange={(e) => updateGraveyardRow(idea._key, { titlePt: e.target.value })}
                className={inputClass}
              />
              <input
                placeholder="Title (EN) — optional"
                value={idea.titleEn ?? ""}
                onChange={(e) => updateGraveyardRow(idea._key, { titleEn: e.target.value })}
                className={inputClass}
              />
            </div>
            <textarea
              placeholder="Descrição (PT)"
              rows={2}
              value={idea.descriptionPt}
              onChange={(e) => updateGraveyardRow(idea._key, { descriptionPt: e.target.value })}
              className={`${inputClass} resize-none`}
            />
            <textarea
              placeholder="Description (EN) — optional"
              rows={2}
              value={idea.descriptionEn ?? ""}
              onChange={(e) => updateGraveyardRow(idea._key, { descriptionEn: e.target.value })}
              className={`${inputClass} resize-none`}
            />
          </RowCard>
        ))}

        <AddRowButton
          label="Adicionar ideia descartada"
          onClick={() =>
            setGraveyard((rows) => [...rows, { titlePt: "", titleEn: "", descriptionPt: "", descriptionEn: "", _key: nextRowKey() }])
          }
        />
      </div>
    </div>
  )
}
