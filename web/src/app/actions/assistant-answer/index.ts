"use server";

import { makeAssistantAnswerService } from "@portfolio/core/src/factories/_index";
import { getUserRole } from "@/lib/get-user-role";

export async function clearAssistantCacheAction(_prevState: unknown, _formData: FormData) {
  try {
    const admin = await getUserRole("ADMIN");
    if (!admin) return { error: "Não autorizado" };

    const deletedCount = await makeAssistantAnswerService().clearCache();

    return { success: true, message: `Cache do assistente limpo: ${deletedCount} resposta(s) removida(s).` };
  } catch (error) {
    return { error: "Erro ao limpar cache do assistente" };
  }
}
