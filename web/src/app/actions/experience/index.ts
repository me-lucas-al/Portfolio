"use server";

import { makeExperienceService } from "@portfolio/core/src/factories/_index";
import { revalidatePath } from "next/cache";
import { getUserRole } from "@/lib/get-user-role";

export async function createExperienceAction(
  prevState: any,
  formData: FormData,
) {
  try {
    const admin = await getUserRole("ADMIN");
    if (!admin) return { error: "Não autorizado" };

    const techs = formData.get("techs") as string;
    
    const experiences = await makeExperienceService().getAllExperiences();
    const nextOrder = experiences.length > 0 ? Math.max(...experiences.map(e => e.order ?? 0)) + 1 : 0;

    await makeExperienceService().createExperience({
      role: formData.get("role") as string,
      company: formData.get("company") as string,
      startDate: new Date(formData.get("startDate") as string),
      endDate: new Date(formData.get("endDate") as string),
      description: formData.get("description") as string,
      techs: techs
        ? techs
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [],
      order: nextOrder
    });

    revalidatePath("/");
    revalidatePath("/control-painel");

    return { success: true, message: "Experiência criada com sucesso!" };
  } catch (error) {
    return { error: "Erro ao criar experiência" };
  }
}

export async function reorderExperienceAction(id: number, direction: 'up' | 'down') {
  try {
    const admin = await getUserRole("ADMIN");
    if (!admin) return { error: "Não autorizado" };

    const experiences = await makeExperienceService().getAllExperiences();
    const index = experiences.findIndex(e => e.id === id);

    if (index === -1) return { error: "Experiência não encontrada" };
    if (direction === 'up' && index === 0) return { error: "Já é a primeira" };
    if (direction === 'down' && index === experiences.length - 1) return { error: "Já é a última" };

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const newExperiences = [...experiences];
    const [movedExperience] = newExperiences.splice(index, 1);
    newExperiences.splice(targetIndex, 0, movedExperience);

    await Promise.all(
      newExperiences.map((experience, i) => 
        makeExperienceService().updateExperienceById({ ...experience, order: i } as any)
      )
    );

    revalidatePath("/");
    revalidatePath("/control-painel");

    return { success: true };
  } catch (error) {
    return { error: "Erro ao reordenar experiência" };
  }
}

export async function updateExperienceAction(
  prevState: any,
  formData: FormData,
) {
  try {
    const admin = await getUserRole("ADMIN");

    if (!admin) return { error: "Não autorizado" };

    const id = Number(formData.get("id"));
    const techs = formData.get("techs") as string;

    await makeExperienceService().updateExperienceById({
      id,
      role: formData.get("role") as string,
      company: formData.get("company") as string,
      startDate: new Date(formData.get("startDate") as string),
      endDate: new Date(formData.get("endDate") as string),
      description: formData.get("description") as string,
      techs: techs
        ? techs
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [],
    });

    revalidatePath("/");
    revalidatePath("/control-painel");

    return { success: true, message: "Experiência atualizada com sucesso!" };
  } catch (error) {
    return { error: "Erro ao atualizar experiência" };
  }
}

export async function deleteExperienceAction(id: number) {
  const admin = await getUserRole("ADMIN");

  if (!admin) return { error: "Não autorizado" };
  await makeExperienceService().deleteExperienceById({ id });

  revalidatePath("/");
  revalidatePath("/control-painel");

  return { success: true, message: "Experiência deletada com sucesso!" };
}

export async function getExperiencesAction() {
  return makeExperienceService().getAllExperiences();
}
