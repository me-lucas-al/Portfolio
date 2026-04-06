"use server";

import { makeProjectService } from "@portfolio/core/src/factories/_index";
import { revalidatePath } from "next/cache";
import { getUserRole } from "@/lib/get-user-role";
import { IUploadFileDTO } from "@portfolio/core/src/@types/storage-service";
import { getStorageProvider } from "@/factories/storage-factory";

const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024;

async function uploadProjectImages(files: File[]) {
  const uploads: IUploadFileDTO[] = await Promise.all(
    files.map(async (file) => {
      if (!file.type.startsWith("image/")) {
        throw new Error("Apenas arquivos de imagem são permitidos");
      }

      if (file.size > MAX_IMAGE_SIZE_BYTES) {
        throw new Error("Cada imagem deve ter no máximo 10MB");
      }

      return {
        buffer: Buffer.from(await file.arrayBuffer()),
        mimeType: file.type,
        originalName: file.name || "image",
      };
    })
  );

  const storageProvider = getStorageProvider();
  return storageProvider.uploadMultipleFiles(uploads, "projects");
}

export async function createProjectAction(prevState: any, formData: FormData) {
  try {
    const admin = await getUserRole("ADMIN");
    if (!admin) return { error: "Não autorizado" };

    const techs = formData.get("technologies") as string;
    const imageFiles = formData
      .getAll("images")
      .filter((value): value is File => value instanceof File && value.size > 0);

    const imagesUrl = imageFiles.length > 0 ? await uploadProjectImages(imageFiles) : [];
    
    const projects = await makeProjectService().getAllProjects();
    const nextOrder = projects.length > 0 ? Math.max(...projects.map(p => p.order ?? 0)) + 1 : 0;

    await makeProjectService().createProject({
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      technologies: techs
        ? techs
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [],
      deployUrl: formData.get("deployUrl") as string,
      githubUrl: formData.get("githubUrl") as string,
      imagesUrl,
      order: nextOrder
    });

    revalidatePath("/");
    revalidatePath("/control-painel");

    return { success: true, message: "Projeto criado com sucesso!" };
  } catch (error) {
    return { error: "Erro ao criar projeto" };
  }
}

export async function reorderProjectAction(id: number, direction: 'up' | 'down') {
  try {
    const admin = await getUserRole("ADMIN");
    if (!admin) return { error: "Não autorizado" };

    const projects = await makeProjectService().getAllProjects();
    const index = projects.findIndex(p => p.id === id);

    if (index === -1) return { error: "Projeto não encontrado" };
    if (direction === 'up' && index === 0) return { error: "Já é o primeiro" };
    if (direction === 'down' && index === projects.length - 1) return { error: "Já é o último" };

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const newProjects = [...projects];
    const [movedProject] = newProjects.splice(index, 1);
    newProjects.splice(targetIndex, 0, movedProject);

    await Promise.all(
      newProjects.map((project, i) => 
        makeProjectService().updateProjectById({ ...project, order: i } as any)
      )
    );

    revalidatePath("/");
    revalidatePath("/control-painel");

    return { success: true };
  } catch (error) {
    return { error: "Erro ao reordenar projeto" };
  }
}

export async function updateProjectAction(prevState: any, formData: FormData) {
  try {
    const admin = await getUserRole("ADMIN");

    if (!admin) return { error: "Não autorizado" };

    const id = Number(formData.get("id"));
    const techs = formData.get("technologies") as string;
    const images = formData.get("imagesUrl") as string;

    await makeProjectService().updateProjectById({
      id,
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      technologies: techs
        ? techs
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [],
      deployUrl: formData.get("deployUrl") as string,
      githubUrl: formData.get("githubUrl") as string,
      imagesUrl: images
        ? images
            .split(",")
            .map((i) => i.trim())
            .filter(Boolean)
        : [],
    });

    revalidatePath("/");
    revalidatePath("/control-painel");

    return { success: true, message: "Projeto atualizado com sucesso!" };
  } catch (error) {
    return { error: "Erro ao atualizar projeto" };
  }
}

export async function deleteProjectAction(id: number) {
  const admin = await getUserRole("ADMIN");

  if (!admin) return { error: "Não autorizado" };

  await makeProjectService().deleteProjectById({ id });

  revalidatePath("/");
  revalidatePath("/control-painel");

  return { success: true, message: "Projeto deletado com sucesso!" };
}

export async function getProjectsAction() {
  return makeProjectService().getAllProjects();
}
