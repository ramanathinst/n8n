import { SidebarTrigger } from "./ui/sidebar"

export const AppHeader = () => {
    return(
        <header className="flex flex-1 gap-x-4 h-10 bg-background shrink-0 px-4 items-center border-b">
            <SidebarTrigger />
        </header>
    )
}