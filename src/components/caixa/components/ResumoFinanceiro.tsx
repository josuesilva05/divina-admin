import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar as CalendarIcon,
  BarChart3
} from "lucide-react"

interface ResumoFinanceiroProps {
  resumo: {
    entradas: number
    saidas: number
    saldo: number
    totalTransacoes: number
  }
  estatisticas: {
    entradasHoje: number
    entradasMes: number
    transacoesHoje: number
    transacoesMes: number
  }
}

export function ResumoFinanceiro({ resumo, estatisticas }: ResumoFinanceiroProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value)
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Saldo Atual</CardTitle>
          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold font-mono ${resumo.saldo >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(resumo.saldo)}
          </div>
          <p className="text-xs text-muted-foreground">
            {resumo.totalTransacoes} transaç{resumo.totalTransacoes === 1 ? 'ão' : 'ões'}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Entradas</CardTitle>
          <TrendingUp className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600 font-mono">
            {formatCurrency(resumo.entradas)}
          </div>
          <p className="text-xs text-muted-foreground">
            Hoje: <span className="font-mono">{formatCurrency(estatisticas.entradasHoje)}</span>
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Saídas</CardTitle>
          <TrendingDown className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600 font-mono">
            {formatCurrency(resumo.saidas)}
          </div>
          <p className="text-xs text-muted-foreground">
            Este mês: <span className="font-mono">{formatCurrency(estatisticas.entradasMes)}</span>
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Transações</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {resumo.totalTransacoes}
          </div>
          <p className="text-xs text-muted-foreground">
            Hoje: {estatisticas.transacoesHoje}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
