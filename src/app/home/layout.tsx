import { FullSidebar } from "@/components/FullSidebar"
import { ToastifyContainer } from "@/components/ToastifyContainer"
import { AuthenticationRepository } from "@/repositories"

type HomeLayoutProps = {
    children: React.ReactNode
}

export const dynamic = 'force-dynamic'

export default async function HomeLayout({ children }:Readonly<HomeLayoutProps>) {
    const user = await AuthenticationRepository.getUserByLoginSession()
    const userEmail = user ? user.email : ''
    const userName = user ? user.name : 'Anônimo' 

    return (
        <FullSidebar email={userEmail} name={userName}>
            {children}
            <ToastifyContainer />
        </FullSidebar>
    )
}