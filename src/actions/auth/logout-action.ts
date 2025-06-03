'use server'

import { AuthenticationRepository } from "@/repositories"
import { redirect } from "next/navigation"

export async function logoutAction() {
    await AuthenticationRepository.deleteLoginJwtSession()
    redirect('/')
}
