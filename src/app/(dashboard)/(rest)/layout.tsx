import { AppHeader } from "@/components/app-header";

const Layout = ({children}: {children: React.ReactNode}) => {
    return(
        <div>
            <AppHeader/>
            <main className="flex-1">{children} </main>
        </div>
    )
}

export default Layout;