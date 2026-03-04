"use client"
import { DefaultLinkType } from "@portfolio/packages/schemas/link"
import { LinkItem } from "./link-item"

export function LinkList({ links }: { links: (DefaultLinkType & { id: number })[] }) {
  if (!links?.length) {
    return <p className="text-neutral-500 text-sm py-8">Nenhum link cadastrado no momento.</p>
  }

  return (
    <div className="space-y-4">
      {links.map((link) => (
        <LinkItem key={link.id} link={link} />
      ))}
    </div>
  )
}
