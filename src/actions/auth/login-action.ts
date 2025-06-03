'use server'

import { AuthenticationRepository } from "@/repositories"
import { redirect } from "next/navigation"

type LoginActionState = {
    email: string,
    error: string
}

export async function loginAction(state: LoginActionState, formData: FormData) {
    await new Promise(resolve => setTimeout(resolve, 1500))  // Timeout to avoid brute force attack

    if (!(formData instanceof FormData)) {
        return {
            email: '',
            error: 'Dados inválidos',
        }
    }

    const email = formData.get('email')?.toString().trim() || ''
    const password = formData.get('password')?.toString().trim() || ''

    if (!email || !password) {
        return {
            email,
            error: 'Digite o e-mail e senha'
        }
    }

    const loggedIn = await AuthenticationRepository.loginUser(email, password)
    if (!loggedIn) {
        return {
            email,
            error: 'E-mail ou senha inválidos'
        }
    }
    redirect('/home')
}