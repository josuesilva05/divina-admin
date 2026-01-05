import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Link, useLocation } from "@tanstack/react-router"
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  CreditCard, 
  BarChart3, 
  Settings, 
  Scissors,
  Package,
  TrendingUp,
  BadgeDollarSign
} from "lucide-react"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  activeTab: string
  onTabChange: (tab: string) => void
  isCollapsed: boolean
}

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    id: "dashboard",
    path: "/dashboard"
  },
  // {
  //   title: "Agenda",
  //   icon: Calendar,
  //   id: "agenda",
  //   path: "/agenda"
  // },
  // {
  //   title: "Clientes",
  //   icon: Users,
  //   id: "clientes",
  //   path: "/clientes"
  // },
  // {
  //   title: "Serviços",
  //   icon: Scissors,
  //   id: "servicos",
  //   path: "/servicos"
  // },
  {
    title: "Caixa",
    icon: CreditCard,
    id: "caixa",
    path: "/caixa"
  },
  {
    title: "Relatórios",
    icon: BarChart3,
    id: "relatorios",
    path: "/relatorios"
  },
  // {
  //   title: "Produtos",
  //   icon: Package,
  //   id: "produtos",
  //   path: "/produtos"
  // },
  // {
  //   title: "Financeiro",
  //   icon: TrendingUp,
  //   id: "financeiro",
  //   path: "/financeiro"
  // }
]

export function Sidebar({ className, activeTab, onTabChange, isCollapsed }: SidebarProps) {
  const location = useLocation()
  
  const SidebarButton = ({ item, isActive }: { item: any, isActive: boolean }) => {
    const button = (
      <Button
        variant={isActive ? "secondary" : "ghost"}
        className={cn(
          "w-full transition-all duration-200",
          isCollapsed ? "justify-center px-2 h-10 w-10" : "justify-start"
        )}
        asChild
      >
        <Link 
          to={item.path} 
          onClick={() => onTabChange(item.id)}
        >
          <item.icon className={cn("h-4 w-4", !isCollapsed && "mr-2")} />
          {!isCollapsed && item.title}
        </Link>
      </Button>
    )

    if (isCollapsed) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              {button}
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>{item.title}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    }

    return button
  }

  return (
    <div className={cn("h-full flex flex-col bg-background", className)}>
      <ScrollArea className="flex-1 h-full">
        <div className="space-y-4 py-4 h-full">
          <div className="px-3 py-2">
            <div className={cn(
              "flex items-center mb-6 transition-all duration-300",
              isCollapsed ? "justify-center" : "justify-start"
            )}>
              <div className={cn(
                "flex items-center justify-center rounded-lg bg-primary/10 p-2",
                isCollapsed ? "w-10 h-10" : "w-8 h-8"
              )}>
                <BadgeDollarSign className="h-4 w-4 text-primary" />
              </div>
              {!isCollapsed && (
                <h2 className="ml-3 text-lg font-semibold tracking-tight text-foreground">
                  Cantinho das Unhas
                </h2>
              )}
            </div>
            
            <div className="space-y-1">
              {!isCollapsed && (
                <h3 className="px-2 text-xs uppercase tracking-wider text-muted-foreground mb-3">
                  Principal
                </h3>
              )}
              {menuItems.slice(0, 1).map((item) => (
                <SidebarButton 
                  key={item.id} 
                  item={item} 
                  isActive={location.pathname === item.path || (location.pathname === "/" && item.id === "dashboard")} 
                />
              ))}
            </div>
          </div>
          
          <Separator className="mx-3" />
          
          <div className="px-3 py-2">
            <div className="space-y-1">
              {!isCollapsed && (
                <h3 className="px-2 text-xs uppercase tracking-wider text-muted-foreground mb-3">
                  Gestão
                </h3>
              )}
              {menuItems.slice(1, 7).map((item) => (
                <SidebarButton 
                  key={item.id} 
                  item={item} 
                  isActive={location.pathname === item.path} 
                />
              ))}
            </div>
          </div>
          
          <Separator className="mx-3" />
          
          <div className="px-3 py-2">
            <SidebarButton 
              item={{ id: "configuracoes", title: "Configurações", icon: Settings, path: "/configuracoes" }}
              isActive={location.pathname === "/configuracoes"} 
            />
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
