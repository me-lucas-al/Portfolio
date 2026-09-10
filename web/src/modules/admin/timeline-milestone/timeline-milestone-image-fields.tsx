import { TimelineImageField } from "./timeline-image-field"

interface TimelineMilestoneImageFieldsProps {
  beforeImageUrl?: string | null
  beforeImageAlt?: string | null
  afterImageUrl?: string | null
  afterImageAlt?: string | null
  idPrefix: string
  disabled?: boolean
}

export function TimelineMilestoneImageFields({
  beforeImageUrl,
  beforeImageAlt,
  afterImageUrl,
  afterImageAlt,
  idPrefix,
  disabled,
}: TimelineMilestoneImageFieldsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <TimelineImageField
        label="Imagem Antes"
        fileInputName="beforeImageFile"
        keptUrlInputName="keptBeforeImageUrl"
        altInputName="beforeImageAlt"
        imageUrl={beforeImageUrl}
        imageAlt={beforeImageAlt}
        inputId={`${idPrefix}-before-image`}
        disabled={disabled}
      />
      <TimelineImageField
        label="Imagem Depois"
        fileInputName="afterImageFile"
        keptUrlInputName="keptAfterImageUrl"
        altInputName="afterImageAlt"
        imageUrl={afterImageUrl}
        imageAlt={afterImageAlt}
        inputId={`${idPrefix}-after-image`}
        disabled={disabled}
      />
    </div>
  )
}
