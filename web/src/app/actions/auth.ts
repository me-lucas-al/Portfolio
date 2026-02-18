"use server"
import { signIn, signOut } from "@/auth"
import { AuthError } from "next-auth"

export async function loginAction(prevState: any, formData: FormData) {
  try {
    await signIn("credentials", formData)
    console.log("formData", Object.fromEntries(formData.entries()))
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          console.error("🚨 ERRO DE CREDENCIAIS:", error)
          return { error: "Usuário ou senha incorretos." }
        default:
          return { error: "Ocorreu um erro inesperado ao fazer login." }
      }
    }
    throw error
  }
}

export async function logoutAction() {
  try {
    await signOut({ redirectTo: "/login" })
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Ocorreu um erro ao tentar sair da conta." }
    }
    throw error
  }
}