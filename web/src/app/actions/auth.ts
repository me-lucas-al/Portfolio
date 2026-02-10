"use server"
import { signIn, signOut } from "@/auth"

export async function loginAction(formData: FormData) {
  await signIn("credentials", formData)
}

export async function logoutAction() {
  await signOut()
}