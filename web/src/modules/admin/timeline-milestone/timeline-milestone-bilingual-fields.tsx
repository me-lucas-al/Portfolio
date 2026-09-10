import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TimelineMilestoneBilingualDefaults } from "./timeline-milestone-bilingual-defaults"
import { TimelineMilestoneTextFieldsPt } from "./timeline-milestone-text-fields-pt"
import { TimelineMilestoneTextFieldsEn } from "./timeline-milestone-text-fields-en"

export function TimelineMilestoneBilingualFields({ defaults }: { defaults?: TimelineMilestoneBilingualDefaults }) {
  return (
    <Tabs defaultValue="pt" className="w-full">
      <TabsList className="grid w-full grid-cols-2 bg-surface border border-line">
        <TabsTrigger value="pt" className="data-[state=active]:bg-brand/10 data-[state=active]:text-brand text-fg-muted">
          🇧🇷 PT-BR
        </TabsTrigger>
        <TabsTrigger value="en" className="data-[state=active]:bg-brand/10 data-[state=active]:text-brand text-fg-muted">
          🇺🇸 EN-US
        </TabsTrigger>
      </TabsList>
      <TabsContent value="pt" className="space-y-4 mt-4 data-[state=inactive]:hidden" forceMount>
        <TimelineMilestoneTextFieldsPt defaults={defaults} />
      </TabsContent>
      <TabsContent value="en" className="space-y-4 mt-4 data-[state=inactive]:hidden" forceMount>
        <TimelineMilestoneTextFieldsEn defaults={defaults} />
      </TabsContent>
    </Tabs>
  )
}
