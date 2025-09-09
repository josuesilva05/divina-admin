import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts"
import {
  DollarSign,
  Users,
  Calendar,
  TrendingUp,
  Clock,
  Award,
  CircleDollarSign,
  UserPlus,
  ArrowUpRight,
  TrendingDown,
  RefreshCw
} from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import StatisticCard7, { CardType } from "../ui/reui/statistic-card-7"
import ReceitaChart from "../ui/reui/receita-chart"
import ServicosMaisProcuradosTable from "./table"
import { useDashboardMetrics } from "@/hooks/useDashboardMetrics"
import { Button } from "@/components/ui/button"

export function Dashboard() {
  const { metrics, isLoading, error, refreshMetrics } = useDashboardMetrics()

  // Calculate percentage changes
  const calculatePercentageChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0
    return ((current - previous) / previous) * 100
  }

  // For demonstration, we'll use simplified comparison logic
  // In a real app, you'd compare with previous day/month data
  const receitaDiariaAnterior = metrics.receitaDiaria * 0.95 // Simulated previous day
  const receitaMensalAnterior = metrics.receitaMensal * 0.97 // Simulated previous month
  const clientesAnterior = metrics.clientesAtendidos + 1 // Simulated previous

  const percentualReceita = calculatePercentageChange(metrics.receitaDiaria, receitaDiariaAnterior)
  const percentualMensal = calculatePercentageChange(metrics.receitaMensal, receitaMensalAnterior)
  const percentualClientes = calculatePercentageChange(metrics.clientesAtendidos, clientesAnterior)

  const cards: CardType[] = [
    {
      title: 'Receita diária',
      subtitle: 'Hoje',
      value: isLoading ? '...' : formatCurrency(metrics.receitaDiaria),
      valueColor: 'text-green-600',
      badge: {
        color: percentualReceita >= 0 
          ? 'bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400'
          : 'bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400',
        icon: percentualReceita >= 0 ? ArrowUpRight : TrendingDown,
        iconColor: percentualReceita >= 0 ? 'text-green-500' : 'text-red-500',
        text: `${percentualReceita >= 0 ? '+' : ''}${percentualReceita.toFixed(1)}%`,
      },
    },
    {
      title: 'Receita Mensal',
      subtitle: 'Este mês',
      value: isLoading ? '...' : formatCurrency(metrics.receitaMensal),
      valueColor: 'text-blue-600',
      badge: {
        color: percentualMensal >= 0
          ? 'bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400'
          : 'bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400',
        icon: percentualMensal >= 0 ? UserPlus : TrendingDown,
        iconColor: percentualMensal >= 0 ? 'text-blue-500' : 'text-red-500',
        text: `${percentualMensal >= 0 ? '+' : ''}${percentualMensal.toFixed(1)}%`,
      },
    },
    {
      title: 'Clientes',
      subtitle: 'Atendimentos hoje',
      value: isLoading ? '...' : metrics.clientesAtendidos.toString(),
      valueColor: percentualClientes >= 0 ? 'text-green-500' : 'text-red-500',
      badge: {
        color: percentualClientes >= 0
          ? 'bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400'
          : 'bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400',
        icon: percentualClientes >= 0 ? ArrowUpRight : TrendingDown,
        iconColor: percentualClientes >= 0 ? 'text-green-500' : 'text-red-500',
        text: `${percentualClientes >= 0 ? '+' : ''}${percentualClientes.toFixed(1)}%`,
      },
    },
  ];

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-red-500">Erro ao carregar dados: {error}</p>
          </div>
          <Button onClick={refreshMetrics} disabled={isLoading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Tentar Novamente
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Visão geral do seu negócio
          </p>
        </div>
        <Button 
          onClick={refreshMetrics} 
          disabled={isLoading}
          variant="outline"
          size="sm"
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
      </div>

      {/* Cards de Estatísticas */}
      <div className="w-full">
        <StatisticCard7 cards={cards} />
      </div>

      {/* Gráficos e Tabelas */}
      <div className="flex space-x-6">
        {/* Gráfico de Receita Semanal */}
        <ReceitaChart data={metrics.receitaSemanal} isLoading={isLoading} />

        {/* Serviços Mais Procurados */}
        <div className="gap-4 md:grid-cols-2 w-full">
          <Card className="">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Award className="mr-2 h-4 w-4" />
                  Serviços mais procurados
                </div>
                {isLoading && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <RefreshCw className="mr-1 h-3 w-3 animate-spin" />
                    Carregando...
                  </div>
                )}
              </CardTitle>
              <CardDescription>
                Ranking dos serviços mais vendidos este mês
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ServicosMaisProcuradosTable 
                servicosMaisVendidos={metrics.servicosMaisVendidos}
                isLoading={isLoading}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
