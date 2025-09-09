import { useTheme } from "./theme-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Moon, Sun, Monitor, Palette, Settings as SettingsIcon } from "lucide-react"
import { ServicosDisponiveis } from "./ServicosDisponiveis"

export function Configuracoes() {
  const { theme, setTheme } = useTheme()

  const handleThemeChange = (checked: boolean) => {
    setTheme(checked ? "dark" : "light")
  }

  const getThemeIcon = () => {
    switch (theme) {
      case "light":
        return <Sun className="h-4 w-4" />
      case "dark":
        return <Moon className="h-4 w-4" />
      default:
        return <Monitor className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
          <SettingsIcon className="h-4 w-4 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Configurações</h1>
          <p className="text-muted-foreground">
            Gerencie suas preferências e configurações do sistema
          </p>
        </div>
      </div>

      <Separator />

      {/* Tema */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Palette className="h-5 w-5" />
            <span>Aparência</span>
          </CardTitle>
          <CardDescription>
            Personalize a aparência da aplicação conforme sua preferência
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Modo Escuro/Claro */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base flex items-center space-x-2">
                {getThemeIcon()}
                <span>Modo escuro</span>
              </Label>
              <p className="text-sm text-muted-foreground">
                {theme === "dark" 
                  ? "A interface está no modo escuro" 
                  : theme === "light" 
                  ? "A interface está no modo claro"
                  : "A interface segue o tema do sistema"
                }
              </p>
            </div>
            <Switch
              checked={theme === "dark"}
              onCheckedChange={handleThemeChange}
              aria-label="Alternar modo escuro"
            />
          </div>

          <Separator />

          {/* Opções de tema */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Preferência de tema</Label>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setTheme("light")}
                className={`
                  flex flex-col items-center space-y-2 p-3 rounded-lg border-2 transition-all
                  ${theme === "light" 
                    ? "border-primary bg-primary/5" 
                    : "border-border hover:border-primary/50"
                  }
                `}
              >
                <Sun className="h-5 w-5" />
                <span className="text-xs">Claro</span>
              </button>
              
              <button
                onClick={() => setTheme("dark")}
                className={`
                  flex flex-col items-center space-y-2 p-3 rounded-lg border-2 transition-all
                  ${theme === "dark" 
                    ? "border-primary bg-primary/5" 
                    : "border-border hover:border-primary/50"
                  }
                `}
              >
                <Moon className="h-5 w-5" />
                <span className="text-xs">Escuro</span>
              </button>
              
              <button
                onClick={() => setTheme("system")}
                className={`
                  flex flex-col items-center space-y-2 p-3 rounded-lg border-2 transition-all
                  ${theme === "system" 
                    ? "border-primary bg-primary/5" 
                    : "border-border hover:border-primary/50"
                  }
                `}
              >
                <Monitor className="h-5 w-5" />
                <span className="text-xs">Sistema</span>
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Serviços Disponíveis */}
      <ServicosDisponiveis />

      {/* Outras configurações em desenvolvimento */}
      <Card>
        <CardHeader>
          <CardTitle>Outras Configurações</CardTitle>
          <CardDescription>
            Configurações adicionais estarão disponíveis em futuras atualizações
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32 text-muted-foreground">
            <p>Mais opções em desenvolvimento...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
