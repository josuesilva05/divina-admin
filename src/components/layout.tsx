import { useState, useEffect } from "react"
import { Outlet, useLocation } from "@tanstack/react-router"
import { Sidebar } from "./sidebar"
import { Header } from "./header"
import DragWindowRegion from "./DragWindowRegion"

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const checkIsMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      // No mobile, iniciar fechado
      if (mobile && sidebarOpen) {
        setSidebarOpen(false)
      }
    }
    
    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)
    
    return () => window.removeEventListener('resize', checkIsMobile)
  }, [sidebarOpen])

  const getTabTitle = (pathname: string) => {
    const titles: Record<string, string> = {
      "/": "Dashboard",
      "/dashboard": "Dashboard",
      "/agenda": "Agenda",
      "/clientes": "Clientes",
      "/servicos": "Serviços",
      "/caixa": "Controle de Caixa",
      "/relatorios": "Relatórios",
      "/produtos": "Produtos",
      "/financeiro": "Financeiro",
      "/configuracoes": "Configurações"
    }
    return titles[pathname] || "Cantinho das Unhas"
  }

  const getCurrentTab = (pathname: string) => {
    if (pathname === "/") return "dashboard"
    return pathname.slice(1) // Remove a barra inicial
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Drag Window Region - Barra de título do Electron */}
      <DragWindowRegion title="Cantinho das Unhas" />
      
      {/* Mobile overlay */}
      {sidebarOpen && isMobile && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      <div className="flex" style={{ height: 'calc(100vh - 32px)' }}>
        {/* Sidebar */}
        <aside className={`
          ${isMobile 
            ? `fixed inset-y-0 left-0 z-50 bg-background border-r transition-transform duration-300 ease-in-out ${
                sidebarOpen ? 'translate-x-0 w-full' : '-translate-x-full w-0'
              }`
            : `relative bg-muted/30 border-r transition-all duration-300 ease-in-out ${
                sidebarOpen ? 'w-64' : 'w-16'
              }`
          }
        `}>
          <Sidebar 
            activeTab={getCurrentTab(location.pathname)} 
            onTabChange={(tab: string) => {
              // Fechar sidebar no mobile após selecionar
              if (isMobile) {
                setSidebarOpen(false)
              }
            }}
            isCollapsed={!isMobile && !sidebarOpen}
          />
        </aside>
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Header 
            title={getTabTitle(location.pathname)} 
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            sidebarOpen={sidebarOpen}
          />
          <main className="flex-1 overflow-auto p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
