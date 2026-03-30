"use server";

import { makeProjectService } from "@portfolio/core/src/factories/_index";
import { revalidatePath } from "next/cache";
import { getUserRole } from "@/lib/get-user-role";
import {
  getFirebaseStorageEmulatorPublicHost,
  getFirebaseStorageBucket,
  isFirebaseStorageEmulator,
} from "@/lib/firebase-admin";

const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024;

function sanitizeFileName(fileName: string) {
  return fileName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9.-]/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase();
}

async function uploadProjectImages(files: File[]) {
  const bucket = getFirebaseStorageBucket();

  if (!bucket.name) {
    throw new Error("Bucket do Firebase Storage não configurado");
  }

  const isEmulator = isFirebaseStorageEmulator();

  return Promise.all(
    files.map(async (file) => {
      if (!file.type.startsWith("image/")) {
        throw new Error("Apenas arquivos de imagem são permitidos");
      }

      if (file.size > MAX_IMAGE_SIZE_BYTES) {
        throw new Error("Cada imagem deve ter no máximo 10MB");
      }

      const sanitizedName = sanitizeFileName(file.name || "image");
      const uploadPath = `projects/${Date.now()}-${crypto.randomUUID()}-${sanitizedName}`;
      const downloadToken = crypto.randomUUID();
      const fileRef = bucket.file(uploadPath);
      const buffer = Buffer.from(await file.arrayBuffer());

      await fileRef.save(buffer, {
        resumable: false,
        metadata: {
          contentType: file.type,
          metadata: {
            firebaseStorageDownloadTokens: downloadToken,
          },
        },
      });

      const encodedPath = encodeURIComponent(uploadPath);

      if (isEmulator) {
        const publicHost = getFirebaseStorageEmulatorPublicHost();
        return `http://${publicHost}/v0/b/${bucket.name}/o/${encodedPath}?alt=media`;
      }

      return `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodedPath}?alt=media&token=${downloadToken}`;
    })
  );
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
    });

    revalidatePath("/");
    revalidatePath("/control-painel");

    return { success: true, message: "Projeto criado com sucesso!" };
  } catch (error) {
    return { error: "Erro ao criar projeto" };
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
