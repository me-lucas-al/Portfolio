"use server";

import { makeLinkService } from "@portfolio/core/src/factories/_index";
import { revalidatePath } from "next/cache";
import { getUserRole } from "@/lib/get-user-role";

export async function createLinkAction(prevState: any, formData: FormData) {
  try {
    const admin = await getUserRole("ADMIN");
    if (!admin) return { error: "Não autorizado" };

    await makeLinkService().createLink({
      title: formData.get("title") as string,
      url: formData.get("url") as string,
      icon: formData.get("icon") as string,
    });

    revalidatePath("/");
    revalidatePath("/control-painel");

    return { success: true, message: "Link criado com sucesso!" };
  } catch (error) {
    return { error: "Erro ao criar link" };
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
