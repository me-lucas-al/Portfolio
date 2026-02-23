"use server"

import { ExperienceService } from "@portfolio/core/src/services/experience"
import { revalidatePath } from "next/cache"
import { auth } from "@/auth"
import { getUserRole } from "@/lib/get-user-role"

export async function createExperienceAction(prevState: any, formData: FormData) {
  try {
    const admin = await getUserRole('ADMIN')
    if (!admin) return { error: "Não autorizado" }

    const techs = formData.get("techs") as string

    await ExperienceService.createExperience({
      role: formData.get("role") as string,
      company: formData.get("company") as string,
      period: formData.get("period") as string,
      description: formData.get("description") as string,
      techs: techs ? techs.split(",").map(t => t.trim()).filter(Boolean) : [],
    })
    
    revalidatePath("/")
    revalidatePath("/control-painel")

    return { success: true, message: "Experiência criada com sucesso!" }
  } catch (error) {
    return { error: "Erro ao criar experiência" }
  }
}

export async function updateExperienceAction(prevState: any, formData: FormData) {
  try {
    const session = await auth()
    if (!session) return { error: "Não autorizado" }

    const id = Number(formData.get("id"))
    const techs = formData.get("techs") as string
    
    await ExperienceService.updateExperienceById({
      id,
      role: formData.get("role") as string,
      company: formData.get("company") as string,
      period: formData.get("period") as string,
      description: formData.get("description") as string,
      techs: techs ? techs.split(",").map(t => t.trim()).filter(Boolean) : [],
    })

    revalidatePath("/")
    revalidatePath("/control-painel")
    
    return { success: true, message: "Experiência atualizada com sucesso!" }
  } catch (error) {
    return { error: "Erro ao atualizar experiência" }
  }
}

export async function deleteExperienceAction(id: number) {
  const session = await auth()
  if (!session) throw new Error("Não autorizado")
  
  await ExperienceService.deleteExperienceById({ id })
  
  revalidatePath("/")
  revalidatePath("/control-painel")
  
  return { success: true, message: "Experiência deletada com sucesso!" }
}

export async function getExperiencesAction() {
  return ExperienceService.getAllExperiences()
}