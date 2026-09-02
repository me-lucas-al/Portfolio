"use server";

import { makeEducationService } from "@portfolio/core/src/factories/_index";
import { revalidatePath } from "next/cache";
import { getUserRole } from "@/lib/get-user-role";

export async function createEducationAction(
  _prevState: unknown,
  formData: FormData,
) {
  try {
    const admin = await getUserRole("ADMIN");

    if (!admin) return { error: "Não autorizado" };

    const educations = await makeEducationService().getAllEducations();
    const nextOrder = educations.length > 0 ? Math.max(...educations.map(e => e.order ?? 0)) + 1 : 0;

    const endDateRaw = formData.get("endDate") as string;
    const endDate = endDateRaw ? new Date(endDateRaw) : null;

    await makeEducationService().createEducation({
      course: formData.get("course") as string,
      courseEn: (formData.get("courseEn") as string) || undefined,
      institution: formData.get("institution") as string,
      startDate: new Date(formData.get("startDate") as string),
      endDate,
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
    const newEducations = [...educations];
    const [movedEducation] = newEducations.splice(index, 1);
    newEducations.splice(targetIndex, 0, movedEducation);

    await Promise.all(
      newEducations.map((education, i) =>
        makeEducationService().updateEducationById({
          id: education.id,
          course: education.course,
          courseEn: education.courseEn ?? undefined,
          institution: education.institution,
          startDate: education.startDate,
          endDate: education.endDate,
          type: education.type,
          order: i,
        })
      )
    );

    revalidatePath("/");
    revalidatePath("/control-painel");

    return { success: true };
  } catch (error) {
    return { error: "Erro ao reordenar formação" };
  }
}

export async function updateEducationAction(
  _prevState: unknown,
  formData: FormData,
) {
  try {
    const admin = await getUserRole("ADMIN");

    if (!admin) return { error: "Não autorizado" };

    const id = Number(formData.get("id"));
    const endDateRaw = formData.get("endDate") as string;
    const endDate = endDateRaw ? new Date(endDateRaw) : null;

    await makeEducationService().updateEducationById({
      id,
      course: formData.get("course") as string,
      courseEn: (formData.get("courseEn") as string) || undefined,
      institution: formData.get("institution") as string,
      startDate: new Date(formData.get("startDate") as string),
      endDate,
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
