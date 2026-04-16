"use client"

import { EditProfileForm } from "./edit-profile-form"

interface ProfileTabContentProps {
  systemSettings: Record<string, string>
}

export function ProfileTabContent({ systemSettings }: ProfileTabContentProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Perfil e Tecnologias</h2>
          <p className="text-neutral-500 text-sm mt-1">
            Atualize o texto "Quem Sou" e as tecnologias exibidas na sua página inicial.
          </p>
        </div>
      </div>

      <div className="max-w-2xl">
        <EditProfileForm systemSettings={systemSettings} />
      </div>
    </div>
  )
}
