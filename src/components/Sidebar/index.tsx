"use client"

import * as React from "react"
import {
  BookOpenText,
  Bot,
  Brush,
  CircleHelp,
  Info,
  Library,
  NotebookPen,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "Lucas Portinho",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
