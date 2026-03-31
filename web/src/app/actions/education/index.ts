"use server";

import { makeEducationService } from "@portfolio/core/src/factories/_index";
import { revalidatePath } from "next/cache";
import { getUserRole } from "@/lib/get-user-role";

export async function createEducationAction(
  prevState: any,
  formData: FormData,
) {
  try {
    const admin = await getUserRole("ADMIN");

    if (!admin) return { error: "Não autorizado" };

    const educations = await makeEducationService().getAllEducations();
    const nextOrder = educations.length > 0 ? Math.max(...educations.map(e => e.order ?? 0)) + 1 : 0;

    await makeEducationService().createEducation({
      course: formData.get("course") as string,
      institution: formData.get("institution") as string,
      startDate: new Date(formData.get("startDate") as string),
      endDate: new Date(formData.get("endDate") as string),
      type: formData.get("type") as string,
      order: nextOrder
    });

    revalidatePath("/");
    revalidatePath("/control-painel");

    return { success: true, message: "Formação criada com sucesso!" };
  } catch (error) {
    return { error: "Erro ao criar formação acadêmica" };
  }
}

export async function reorderEducationAction(id: number, direction: 'up' | 'down') {
  try {
    const admin = await getUserRole("ADMIN");
    if (!admin) return { error: "Não autorizado" };

    const educations = await makeEducationService().getAllEducations();
    const index = educations.findIndex(e => e.id === id);

    if (index === -1) return { error: "Formação não encontrada" };
    if (direction === 'up' && index === 0) return { error: "Já é a primeira" };
    if (direction === 'down' && index === educations.length - 1) return { error: "Já é a última" };

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const currentEducation = educations[index];
    const targetEducation = educations[targetIndex];

    const currentOrder = currentEducation.order;
    const targetOrder = targetEducation.order;

    await Promise.all([
      makeEducationService().updateEducationById({ ...currentEducation, order: targetOrder } as any),
      makeEducationService().updateEducationById({ ...targetEducation, order: currentOrder } as any)
    ]);

    revalidatePath("/");
    revalidatePath("/control-painel");

    return { success: true };
  } catch (error) {
    return { error: "Erro ao reordenar formação" };
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

    await makeEducationService().updateEducationById({
      id,
      course: formData.get("course") as string,
      institution: formData.get("institution") as string,
      startDate: new Date(formData.get("startDate") as string),
      endDate: new Date(formData.get("endDate") as string),
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

  await makeEducationService().deleteEducationById({ id });

  revalidatePath("/");
  revalidatePath("/control-painel");

  return { success: true, message: "Formação deletada com sucesso!" };
}

export async function getEducationsAction() {
  return makeEducationService().getAllEducations();
}
