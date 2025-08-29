import { useState } from "react"
import { ThemeProvider } from "./components/theme-provider"
import { Sidebar } from "./components/sidebar"
import { Header } from "./components/header"
import { Dashboard } from "./components/dashboard"
import { CaixaModule } from "./components/caixa"

function App() {
  const [activeTab, setActiveTab] = useState("dashboard")

  const getTabTitle = (tab: string) => {
    const titles: Record<string, string> = {
      dashboard: "Dashboard",
      agenda: "Agenda",
      clientes: "Clientes",
      servicos: "Serviços",
      caixa: "Controle de Caixa",
      relatorios: "Relatórios",
      produtos: "Produtos",
      financeiro: "Financeiro",
      configuracoes: "Configurações"
    }
    return titles[tab] || "Divina Glow"
  }

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />
      case "caixa":
        return <CaixaModule />
      case "relatorios":
        return (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Módulo de Relatórios em desenvolvimento...</p>
          </div>
        )
      case "configuracoes":
        return (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Configurações em desenvolvimento...</p>
          </div>
        )
      default:
        return <Dashboard />
    }
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="min-h-screen bg-background">
        <div className="flex">
          {/* Sidebar */}
          <div className="hidden md:block border-r bg-muted/30">
            <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
          </div>
          
          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            <Header title={getTabTitle(activeTab)} />
            <main className="">
              {renderContent()}
            </main>
          </div>
        </div>
      </div>
    </ThemeProvider>
  )
}

export default App
