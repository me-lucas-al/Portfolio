"use server";

import { makeTimelineMilestoneService } from "@portfolio/core/src/factories/_index";
import { revalidatePath, updateTag, unstable_cache } from "next/cache";
import { getUserRole } from "@/lib/get-user-role";
import { IUploadFileDTO } from "@portfolio/core/src/@types/storage-service";
import { getStorageProvider } from "@/factories/storage-factory";
import {
  TimelineMilestoneKindType,
  TimelineSequenceStepType,
  TimelineGraveyardIdeaType,
} from "@portfolio/packages";

const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024;
const ALLOWED_IMAGE_MIME_TYPES = new Set(["image/png", "image/jpeg", "image/webp"]);

async function uploadTimelineImage(file: File): Promise<string> {
  if (!ALLOWED_IMAGE_MIME_TYPES.has(file.type)) {
    throw new Error("Apenas imagens PNG, JPG ou WEBP são permitidas");
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    throw new Error("A imagem deve ter no máximo 10MB");
  }

  const upload: IUploadFileDTO = {
    buffer: Buffer.from(await file.arrayBuffer()),
    mimeType: file.type,
    originalName: file.name || "timeline-image",
  };

  const storageProvider = getStorageProvider();
  const [url] = await storageProvider.uploadMultipleFiles([upload], "timeline-milestones");
  return url;
}

function parseJsonArray<T>(raw: FormDataEntryValue | null): T[] {
  if (typeof raw !== "string" || !raw.trim()) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

function parseTags(raw: FormDataEntryValue | null): string[] {
  if (typeof raw !== "string") return [];
  return raw.split(",").map((tag) => tag.trim()).filter(Boolean);
}

function toFriendlyErrorMessage(error: unknown, fallback: string): string {
  if (error && typeof error === "object" && "code" in error && (error as { code?: string }).code === "P2002") {
    return "Já existe um marco da jornada com esse slug.";
  }
  return error instanceof Error ? error.message : fallback;
}

function toAdminMilestone<T extends { sequence: unknown; graveyard: unknown }>(row: T) {
  return {
    ...row,
    sequence: (row.sequence as TimelineSequenceStepType[] | null) ?? [],
    graveyard: (row.graveyard as TimelineGraveyardIdeaType[] | null) ?? [],
  };
}

export async function createTimelineMilestoneAction(
  _prevState: unknown,
  formData: FormData,
) {
  try {
    const admin = await getUserRole("ADMIN");
    if (!admin) return { error: "Não autorizado" };

    const milestones = await makeTimelineMilestoneService().getAllMilestones();
    const nextOrder = milestones.length > 0 ? Math.max(...milestones.map(m => m.order ?? 0)) + 1 : 0;

    const beforeImageFile = formData.get("beforeImageFile");
    const afterImageFile = formData.get("afterImageFile");

    const beforeImageUrl = beforeImageFile instanceof File && beforeImageFile.size > 0
      ? await uploadTimelineImage(beforeImageFile)
      : null;
    const afterImageUrl = afterImageFile instanceof File && afterImageFile.size > 0
      ? await uploadTimelineImage(afterImageFile)
      : null;

    await makeTimelineMilestoneService().createMilestone({
      slug: (formData.get("slug") as string)?.trim(),
      kind: (formData.get("kind") as TimelineMilestoneKindType) || "MILESTONE",
      dateLabelPt: formData.get("dateLabelPt") as string,
      dateLabelEn: (formData.get("dateLabelEn") as string)?.trim() || undefined,
      titlePt: formData.get("titlePt") as string,
      titleEn: (formData.get("titleEn") as string)?.trim() || undefined,
      impactPt: formData.get("impactPt") as string,
      impactEn: (formData.get("impactEn") as string)?.trim() || undefined,
      narrationPt: formData.get("narrationPt") as string,
      narrationEn: (formData.get("narrationEn") as string)?.trim() || undefined,
      problemPt: formData.get("problemPt") as string,
      problemEn: (formData.get("problemEn") as string)?.trim() || undefined,
      inflectionPt: formData.get("inflectionPt") as string,
      inflectionEn: (formData.get("inflectionEn") as string)?.trim() || undefined,
      solutionPt: formData.get("solutionPt") as string,
      solutionEn: (formData.get("solutionEn") as string)?.trim() || undefined,
      tags: parseTags(formData.get("tags")),
      beforeImageUrl,
      beforeImageAlt: (formData.get("beforeImageAlt") as string)?.trim() || null,
      afterImageUrl,
      afterImageAlt: (formData.get("afterImageAlt") as string)?.trim() || null,
      sequence: parseJsonArray<TimelineSequenceStepType>(formData.get("sequence")),
      graveyard: parseJsonArray<TimelineGraveyardIdeaType>(formData.get("graveyard")),
      order: nextOrder,
    });

    revalidatePath("/");
    revalidatePath("/control-painel");
    updateTag("timeline-milestones");

    return { success: true, message: "Marco da jornada criado com sucesso!" };
  } catch (error) {
    return { error: toFriendlyErrorMessage(error, "Erro ao criar marco da jornada") };
  }
}

export async function reorderTimelineMilestoneAction(id: number, direction: 'up' | 'down') {
  try {
    const admin = await getUserRole("ADMIN");
    if (!admin) return { error: "Não autorizado" };

    const milestones = await makeTimelineMilestoneService().getAllMilestones();
    const index = milestones.findIndex(m => m.id === id);

    if (index === -1) return { error: "Marco não encontrado" };
    if (direction === 'up' && index === 0) return { error: "Já é o primeiro" };
    if (direction === 'down' && index === milestones.length - 1) return { error: "Já é o último" };

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const newMilestones = [...milestones];
    const [movedMilestone] = newMilestones.splice(index, 1);
    newMilestones.splice(targetIndex, 0, movedMilestone);

    await Promise.all(
      newMilestones.map((milestone, i) =>
        makeTimelineMilestoneService().updateMilestoneById({ id: milestone.id, order: i })
      )
    );

    revalidatePath("/");
    revalidatePath("/control-painel");
    updateTag("timeline-milestones");

    return { success: true };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Erro ao reordenar a jornada" };
  }
}

export async function updateTimelineMilestoneAction(
  _prevState: unknown,
  formData: FormData,
) {
  try {
    const admin = await getUserRole("ADMIN");
    if (!admin) return { error: "Não autorizado" };

    const id = Number(formData.get("id"));

    const beforeImageFile = formData.get("beforeImageFile");
    const afterImageFile = formData.get("afterImageFile");
    const keptBeforeImageUrl = formData.get("keptBeforeImageUrl") as string;
    const keptAfterImageUrl = formData.get("keptAfterImageUrl") as string;

    const beforeImageUrl = beforeImageFile instanceof File && beforeImageFile.size > 0
      ? await uploadTimelineImage(beforeImageFile)
      : (keptBeforeImageUrl?.trim() || null);
    const afterImageUrl = afterImageFile instanceof File && afterImageFile.size > 0
      ? await uploadTimelineImage(afterImageFile)
      : (keptAfterImageUrl?.trim() || null);

    await makeTimelineMilestoneService().updateMilestoneById({
      id,
      slug: (formData.get("slug") as string)?.trim(),
      kind: (formData.get("kind") as TimelineMilestoneKindType) || "MILESTONE",
      dateLabelPt: formData.get("dateLabelPt") as string,
      dateLabelEn: (formData.get("dateLabelEn") as string)?.trim() || undefined,
      titlePt: formData.get("titlePt") as string,
      titleEn: (formData.get("titleEn") as string)?.trim() || undefined,
      impactPt: formData.get("impactPt") as string,
      impactEn: (formData.get("impactEn") as string)?.trim() || undefined,
      narrationPt: formData.get("narrationPt") as string,
      narrationEn: (formData.get("narrationEn") as string)?.trim() || undefined,
      problemPt: formData.get("problemPt") as string,
      problemEn: (formData.get("problemEn") as string)?.trim() || undefined,
      inflectionPt: formData.get("inflectionPt") as string,
      inflectionEn: (formData.get("inflectionEn") as string)?.trim() || undefined,
      solutionPt: formData.get("solutionPt") as string,
      solutionEn: (formData.get("solutionEn") as string)?.trim() || undefined,
      tags: parseTags(formData.get("tags")),
      beforeImageUrl,
      beforeImageAlt: (formData.get("beforeImageAlt") as string)?.trim() || null,
      afterImageUrl,
      afterImageAlt: (formData.get("afterImageAlt") as string)?.trim() || null,
      sequence: parseJsonArray<TimelineSequenceStepType>(formData.get("sequence")),
      graveyard: parseJsonArray<TimelineGraveyardIdeaType>(formData.get("graveyard")),
    });

    revalidatePath("/");
    revalidatePath("/control-painel");
    updateTag("timeline-milestones");

    return { success: true, message: "Marco da jornada atualizado com sucesso!" };
  } catch (error) {
    return { error: toFriendlyErrorMessage(error, "Erro ao atualizar marco da jornada") };
  }
}

export async function deleteTimelineMilestoneAction(id: number) {
  const admin = await getUserRole("ADMIN");
  if (!admin) return { error: "Não autorizado" };

  await makeTimelineMilestoneService().deleteMilestoneById({ id });

  revalidatePath("/");
  revalidatePath("/control-painel");
  updateTag("timeline-milestones");

  return { success: true, message: "Marco da jornada deletado com sucesso!" };
}

export const getTimelineMilestonesAction = unstable_cache(
  async () => {
    const milestones = await makeTimelineMilestoneService().getAllMilestones();
    return milestones.map(toAdminMilestone);
  },
  ["timeline-milestones"],
  { tags: ["timeline-milestones"], revalidate: false }
);
