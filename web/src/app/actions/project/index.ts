"use server"

import { ProjectService } from "@portfolio/core/src/services/project"
import { revalidatePath } from "next/cache"
import { auth } from "@/auth"
import { getUserRole } from "@/lib/get-user-role"

export async function createProjectAction(prevState: any, formData: FormData) {
  try {
    const admin = await getUserRole('ADMIN')

    if (!admin) return { error: "Não autorizado" }

    const techs = formData.get("technologies") as string
    const images = formData.get("imagesUrl") as string

    await ProjectService.createProject({
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      technologies: techs ? techs.split(",").map(t => t.trim()).filter(Boolean) : [],
      deployUrl: formData.get("deployUrl") as string,
      githubUrl: formData.get("githubUrl") as string,
      imagesUrl: images ? images.split(",").map(i => i.trim()).filter(Boolean) : [],
    })
    
    revalidatePath("/")
    revalidatePath("/control-painel")

    return { success: true, message: "Projeto criado com sucesso!" }
  } catch (error) {
    return { error: "Erro ao criar projeto" }
  }
}

export async function updateProjectAction(prevState: any, formData: FormData) {
  try {
    const session = await auth()
    if (!session) return { error: "Não autorizado" }

    const id = Number(formData.get("id"))
    const techs = formData.get("technologies") as string
    const images = formData.get("imagesUrl") as string
    
    await ProjectService.updateProjectById({
      id,
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      technologies: techs ? techs.split(",").map(t => t.trim()).filter(Boolean) : [],
      deployUrl: formData.get("deployUrl") as string,
      githubUrl: formData.get("githubUrl") as string,
      imagesUrl: images ? images.split(",").map(i => i.trim()).filter(Boolean) : [],
    })

    revalidatePath("/")
    revalidatePath("/control-painel")
    
    return { success: true, message: "Projeto atualizado com sucesso!" }
  } catch (error) {
    return { error: "Erro ao atualizar projeto" }
  }
}

export async function deleteProjectAction(id: number) {
  const session = await auth()
  if (!session) throw new Error("Não autorizado")
  
  await ProjectService.deleteProjectById({ id })
  
  revalidatePath("/")
  revalidatePath("/control-painel")
  
  return { success: true, message: "Projeto deletado com sucesso!" }
}

export async function getProjectsAction() {
  return ProjectService.getAllProjects()
}