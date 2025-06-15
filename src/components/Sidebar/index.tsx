"use client"

import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Brush, BookOpenText, NotebookPen, Library, Bot, Info, CircleHelp } from "lucide-react"

type AppSidebarProps = {
  name: string;
  email: string;
} & React.ComponentProps<typeof Sidebar>

export function AppSidebar({ name, email, ...props }: AppSidebarProps) {
  const userData = {
    name,
    email,
    avatar: ''
  }

  
  const data = {
    navMain: [
      {
        title: "Ilustrações",
        url: "#",
        icon: Brush,
        isActive: true,
        items: [
          {
            title: "Criar ilustrações",
            url: "/home/illustrate",
          },
          {
            title: "Minhas ilustrações",
            url: "/home/my-illustrations",
          },
        ],
      },
      {
        title: "Gibis",
        url: "#",
        icon: BookOpenText,
        items: [
          {
            title: "Criar gibis",
            url: "/home/comic",
          },
          {
            title: "Meus gibis",
            url: "/home/my-comics",
          },
        ],
      },
      {
        title: "Resumos",
        url: "#",
        icon: NotebookPen,
        items: [
          {
            title: "Criar resumo",
            url: "/home/summary",
          },
          {
            title: "Meus resumos",
            url: "/home/my-summaries",
          },
        ],
      },
      {
        title: "Biblioteca",
        url: "#",
        icon: Library,
        items: [
          {
            title: "Meus livros",
            url: "/home/my-books",
          },
        ],
      },
      {
        title: 'Agentes',
        url: '#',
        icon: Bot,
        items: [
          {
            title: 'Criar agentes',
            url: '/home/create-agents'
          },
          {
            title: 'Meus agentes',
            url: '/home/my-agents'
          }
        ]
      }
    ],
    projects: [
      {
        name: "Como usar",
        url: "/",
        icon: Info,
      },
      {
        name: "O que somos?",
        url: "/",
        icon: CircleHelp,
      },
    ],
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
