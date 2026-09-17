"use client"

import { TimelineMilestoneKindType } from "@portfolio/packages"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { inputClass } from "./form-field-styles"

interface TimelineMilestoneBasicFieldsProps {
  defaultSlug?: string
  defaultTags?: string
  kind: TimelineMilestoneKindType
  onKindChange: (kind: TimelineMilestoneKindType) => void
}

export function TimelineMilestoneBasicFields({
  defaultSlug,
  defaultTags,
  kind,
  onKindChange,
}: TimelineMilestoneBasicFieldsProps) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-fg-muted">Slug (identificador único)</label>
          <input
            required
            name="slug"
            defaultValue={defaultSlug}
            placeholder="Ex: fundacao-cms"
            className={inputClass}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-fg-muted">Tipo</label>
          <input type="hidden" name="kind" value={kind} />
          <Select value={kind} onValueChange={(val) => onKindChange(val as TimelineMilestoneKindType)}>
            <SelectTrigger className="w-full bg-surface border border-line rounded-xl px-4 py-2.5 text-fg">
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MILESTONE">Marco (Milestone)</SelectItem>
              <SelectItem value="GAP">Hiato (Gap)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-fg-muted">Tags</label>
        <input
          name="tags"
          defaultValue={defaultTags}
          placeholder="Separadas por vírgula. Ex: Next.js, PostgreSQL, Prisma"
          className={inputClass}
        />
      </div>
    </>
  )
}
