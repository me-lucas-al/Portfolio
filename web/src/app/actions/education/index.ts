"use server";

import { EducationService } from "@portfolio/core/src/services/education";
import { revalidatePath } from "next/cache";
import { getUserRole } from "@/lib/get-user-role";

export async function createEducationAction(
  prevState: any,
  formData: FormData,
) {
  try {
    const admin = await getUserRole("ADMIN");

    if (!admin) return { error: "Não autorizado" };

    await EducationService.createEducation({
      course: formData.get("course") as string,
      institution: formData.get("institution") as string,
      period: formData.get("period") as string,
      type: formData.get("type") as string,
    });

    revalidatePath("/");
    revalidatePath("/control-painel");

    return { success: true, message: "Formação criada com sucesso!" };
  } catch (error) {
    return { error: "Erro ao criar formação acadêmica" };
  }
}

export async function updateEducationAction(
  prevState: any,
  formData: FormData,
) {
  try {
    const admin = await getUserRole("ADMIN");

    if (!admin) return { error: "Não autorizado" };

    const id = Number(formData.get("id"));

    await EducationService.updateEducationById({
      id,
      course: formData.get("course") as string,
      institution: formData.get("institution") as string,
      period: formData.get("period") as string,
      type: formData.get("type") as string,
    });

    revalidatePath("/");
    revalidatePath("/control-painel");

    return { success: true, message: "Formação atualizada com sucesso!" };
  } catch (error) {
    return { error: "Erro ao atualizar formação acadêmica" };
  }
}

export async function deleteEducationAction(id: number) {
  const admin = await getUserRole("ADMIN");

  if (!admin) return { error: "Não autorizado" };

  await EducationService.deleteEducationById({ id });

  revalidatePath("/");
  revalidatePath("/control-painel");

  return { success: true, message: "Formação deletada com sucesso!" };
}

export async function getEducationsAction() {
  return EducationService.getAllEducations();
}
