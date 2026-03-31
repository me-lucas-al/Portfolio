"use server";

import { makeLinkService } from "@portfolio/core/src/factories/_index";
import { revalidatePath } from "next/cache";
import { getUserRole } from "@/lib/get-user-role";

export async function createLinkAction(prevState: any, formData: FormData) {
  try {
    const admin = await getUserRole("ADMIN");
    if (!admin) return { error: "Não autorizado" };

    const links = await makeLinkService().getAllLinks();
    const nextOrder = links.length > 0 ? Math.max(...links.map(l => l.order ?? 0)) + 1 : 0;

    await makeLinkService().createLink({
      title: formData.get("title") as string,
      url: formData.get("url") as string,
      icon: formData.get("icon") as string,
      order: nextOrder
    });

    revalidatePath("/");
    revalidatePath("/control-painel");

    return { success: true, message: "Link criado com sucesso!" };
  } catch (error) {
    return { error: "Erro ao criar link" };
  }
}

export async function reorderLinkAction(id: number, direction: 'up' | 'down') {
  try {
    const admin = await getUserRole("ADMIN");
    if (!admin) return { error: "Não autorizado" };

    const links = await makeLinkService().getAllLinks();
    const index = links.findIndex(l => l.id === id);

    if (index === -1) return { error: "Link não encontrado" };
    if (direction === 'up' && index === 0) return { error: "Já é o primeiro" };
    if (direction === 'down' && index === links.length - 1) return { error: "Já é o último" };

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const currentLink = links[index];
    const targetLink = links[targetIndex];

    const currentOrder = currentLink.order;
    const targetOrder = targetLink.order;

    await Promise.all([
      makeLinkService().updateLinkById({ ...currentLink, order: targetOrder } as any),
      makeLinkService().updateLinkById({ ...targetLink, order: currentOrder } as any)
    ]);

    revalidatePath("/");
    revalidatePath("/control-painel");

    return { success: true };
  } catch (error) {
    return { error: "Erro ao reordenar link" };
  }
}

export async function updateLinkAction(prevState: any, formData: FormData) {
  try {
    const admin = await getUserRole("ADMIN");

    if (!admin) return { error: "Não autorizado" };

    const id = Number(formData.get("id"));

    await makeLinkService().updateLinkById({
      id,
      title: formData.get("title") as string,
      url: formData.get("url") as string,
      icon: formData.get("icon") as string,
    });

    revalidatePath("/");
    revalidatePath("/control-painel");

    return { success: true, message: "Link atualizado com sucesso!" };
  } catch (error) {
    return { error: "Erro ao atualizar link" };
  }
}

export async function deleteLinkAction(id: number) {
  const admin = await getUserRole("ADMIN");

  if (!admin) return { error: "Não autorizado" };

  await makeLinkService().deleteLinkById({ id });

  revalidatePath("/");
  revalidatePath("/control-painel");

  return { success: true, message: "Link deletado com sucesso!" };
}

export async function getLinksAction() {
  return makeLinkService().getAllLinks();
}
