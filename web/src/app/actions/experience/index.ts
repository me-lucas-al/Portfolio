"use server";

import { makeExperienceService } from "@portfolio/core/src/factories/_index";
import { revalidatePath } from "next/cache";
import { getUserRole } from "@/lib/get-user-role";

export async function createExperienceAction(
  _prevState: unknown,
  formData: FormData,
) {
  try {
    const admin = await getUserRole("ADMIN");
    if (!admin) return { error: "Não autorizado" };

    const techs = formData.get("techs") as string;

    const experiences = await makeExperienceService().getAllExperiences();
    const nextOrder = experiences.length > 0 ? Math.max(...experiences.map(e => e.order ?? 0)) + 1 : 0;

    const endDateRaw = formData.get("endDate") as string;
    const endDate = endDateRaw ? new Date(endDateRaw) : null;

    await makeExperienceService().createExperience({
      role: formData.get("role") as string,
      roleEn: (formData.get("roleEn") as string) || undefined,
      company: formData.get("company") as string,
      startDate: new Date(formData.get("startDate") as string),
      endDate,
      description: formData.get("description") as string,
      descriptionEn: (formData.get("descriptionEn") as string) || undefined,
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
        makeExperienceService().updateExperienceById({
          id: experience.id,
          role: experience.role,
          roleEn: experience.roleEn ?? undefined,
          company: experience.company,
          startDate: experience.startDate,
          endDate: experience.endDate,
          description: experience.description,
          descriptionEn: experience.descriptionEn ?? undefined,
          techs: experience.techs,
          order: i,
        })
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
  _prevState: unknown,
  formData: FormData,
) {
  try {
    const admin = await getUserRole("ADMIN");

    if (!admin) return { error: "Não autorizado" };

    const id = Number(formData.get("id"));
    const techs = formData.get("techs") as string;

    const endDateRaw = formData.get("endDate") as string;
    const endDate = endDateRaw ? new Date(endDateRaw) : null;

    await makeExperienceService().updateExperienceById({
      id,
      role: formData.get("role") as string,
      roleEn: (formData.get("roleEn") as string) || undefined,
      company: formData.get("company") as string,
      startDate: new Date(formData.get("startDate") as string),
      endDate,
      description: formData.get("description") as string,
      descriptionEn: (formData.get("descriptionEn") as string) || undefined,
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
