"use client"

import Link from "next/link"
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar"
import Image from "next/image"
import { CreditCardIcon, FolderOpenIcon, HistoryIcon, KeyRoundIcon, LogOutIcon, StarIcon } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "./ui/button"

const menuItems = [
    {
        title: "main",
        items: [
            {
                title: "Workflows",
                icon: FolderOpenIcon,
                url: "/workflows"
            },

            {
                title: "Executions",
                icon: KeyRoundIcon,
                url: "/executions"
            },

            {
                title: "Credentials",
                icon: HistoryIcon,
                url: "/credentials"
            },
        ]

    }
]

export const AppSidebar = () => {
    const pathname = usePathname();
    const router = useRouter();
    return(
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild className="gap-x-4 px-4 h-10">
                        <Link href={"/"} prefetch>
                            <Image src={"/logos/logo.svg"} height={30} width={30} alt="Nodebase" />
                            <span className="font-semibold text-sm">Nodebase</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarHeader>

            <SidebarContent>
                {menuItems.map((group) =>(
                    <SidebarGroup key={group.title}>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {group.items.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                        tooltip={item.title}
                                        isActive={item.url === "/" ? pathname === "/" : pathname.startsWith(item.url)}
                                        >
                                            <item.icon className="size-4"/>
                                            <Link href={item.url}>
                                                <span> {item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>

            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton tooltip={"Upgrade to pro"} onClick={() => {}}>
                            <StarIcon size={4}/>
                            Upgrade to pro
                        </SidebarMenuButton>
                    </SidebarMenuItem>

                    <SidebarMenuItem>
                        <SidebarMenuButton tooltip={"Billing Portal"} onClick={() => {}}>
                            <CreditCardIcon size={4} />
                            Billing Portal
                        </SidebarMenuButton>
                    </SidebarMenuItem>

                    <SidebarMenuItem>
                        <SidebarMenuButton tooltip={"Logout"} onClick={() => {}}>
                            <LogOutIcon size={4} />
                            Logout
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}