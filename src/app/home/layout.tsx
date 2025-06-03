import { FullSidebar } from "@/components/FullSidebar"
import { ToastifyContainer } from "@/components/ToastifyContainer"

type HomeLayoutProps = {
    children: React.ReactNode
}

export default async function HomeLayout({ children }:Readonly<HomeLayoutProps>) {
    return (
        <FullSidebar>
            {children}
            <ToastifyContainer />
        </FullSidebar>
    )
}