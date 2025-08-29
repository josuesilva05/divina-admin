import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  CreditCard, 
  BarChart3, 
  Settings, 
  Scissors,
  Package,
  TrendingUp
} from "lucide-react"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  activeTab: string
  onTabChange: (tab: string) => void
}

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    id: "dashboard"
  },
  {
    title: "Caixa",
    icon: CreditCard,
    id: "caixa"
  },
  {
    title: "Relatórios",
    icon: BarChart3,
    id: "relatorios"
  }
]

export function Sidebar({ className, activeTab, onTabChange }: SidebarProps) {
  return (
    <div className={cn("pb-12 w-64", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="flex items-center mb-6">
            <Scissors className="h-6 w-6 mr-2 text-primary" />
            <h2 className="text-lg font-semibold tracking-tight">
              Divina Glow
            </h2>
          </div>
          <div className="space-y-1">
            <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
              Principal
            </h3>
            {menuItems.slice(0, 1).map((item) => (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => onTabChange(item.id)}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.title}
              </Button>
            ))}
          </div>
        </div>
        <Separator className="mx-3" />
        <div className="px-3 py-2">
          <div className="space-y-1">
            <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
              Gestão
            </h3>
            {menuItems.slice(1, 4).map((item) => (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => onTabChange(item.id)}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.title}
              </Button>
            ))}
          </div>
        </div>
        <Separator className="mx-3" />
        <div className="px-3 py-2">
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => onTabChange("configuracoes")}
          >
            <Settings className="mr-2 h-4 w-4" />
            Configurações
          </Button>
        </div>
      </div>
    </div>
  )
}
