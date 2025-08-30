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
  TrendingDown
} from "lucide-react"
import { mockDashboardMetrics, mockReceitaSemanal } from "@/data/mockData"
import StatisticCard7 from "./ui/reui/statistic-card-7"
import LineChart2 from "./ui/reui/line-chart-2"
import ServicosMaisProcuradosTable from "./table"

export function Dashboard() {
  const metrics = mockDashboardMetrics

  const cards = [
    {
      title: 'Receita diária',
      subtitle: 'Hoje',
      value: 'R$ 956,00',
      valueColor: 'text-green-600',
      badge: {
        color: 'bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400',
        icon: ArrowUpRight,
        iconColor: 'text-green-500',
        text: '+5.4%',
      },
    },
    {
      title: 'Receita Mensal',
      subtitle: 'Este mês',
      value: 'R$ 5.840,00',
      valueColor: 'text-blue-600',
      badge: {
        color: 'bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400',
        icon: UserPlus,
        iconColor: 'text-blue-500',
        text: '+3.2%',
      },
    },
    {
      title: 'Clientes',
      subtitle: 'Atendimentos hoje',
      value: '10',
      valueColor: 'text-red-500',
      badge: {
        color: 'bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400',
        icon: TrendingDown,
        iconColor: 'text-red-500',
        text: '-1.1%',
      },
    },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  return (
    <div className="space-y-6">
      <div className="w-full">
        <StatisticCard7 cards={cards} />
      </div>
      <div className="flex space-x-6">
        <LineChart2 />

        {/* Rankings */}
        <div className="gap-4 md:grid-cols-2 w-full">
          <Card className="">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="mr-2 h-4 w-4" />
                Serviços mais procurados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ServicosMaisProcuradosTable />
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  )
}
