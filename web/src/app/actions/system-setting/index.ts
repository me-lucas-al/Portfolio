"use server";

import { makeSystemSettingService } from "@portfolio/core/src/factories/_index";
import { revalidatePath } from "next/cache";
import { getUserRole } from "@/lib/get-user-role";

export async function getSystemSettingAction(key: string) {
  const setting = await makeSystemSettingService().getByKey(key);
  return setting?.value ?? null;
}

export async function updateSystemSettingAction(prevState: any, formData: FormData) {
  try {
    const admin = await getUserRole("ADMIN");
    if (!admin) return { error: "Não autorizado" };

    const key = formData.get("key") as string;
    const value = formData.get("value") as string;

    if (!key || value === null || value === undefined) {
      return { error: "Dados inválidos" };
    }

    await makeSystemSettingService().upsert({ key, value });

    revalidatePath("/");
    revalidatePath("/control-painel");

    return { success: true, message: "Configuração atualizada com sucesso!" };
  } catch (error) {
    return { error: "Erro ao atualizar configuração" };
  }
}
