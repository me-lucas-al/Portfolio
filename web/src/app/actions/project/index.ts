"use server"

import { ProjectService } from "@portfolio/core/src/services/project"
import { revalidatePath } from "next/cache"
import { auth } from "@/auth"

export async function createProjectAction(prevState: any, formData: FormData) {
  const session = await auth()
  if (!session) throw new Error("Unauthorized")

  const data = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    deployUrl: formData.get("deployUrl") as string,
    githubUrl: formData.get("githubUrl") as string,
    imageUrl: formData.get("imageUrl") as string,
  }

  await ProjectService.createProject(data)
  
  revalidatePath("/")
  revalidatePath("/admin")
}

export async function getProjectsAction() {
  return ProjectService.getAllProjects()
}