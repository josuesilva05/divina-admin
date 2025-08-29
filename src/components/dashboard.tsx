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
  UserPlus
} from "lucide-react"
import { mockDashboardMetrics, mockReceitaSemanal } from "@/data/mockData"
import StatisticCard7 from "./ui/reui/statistic-card-7"
import LineChart2 from "./ui/reui/line-chart-2"

export function Dashboard() {
  const metrics = mockDashboardMetrics

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  return (
    <div className="h-screen overflow-y-auto space-y-6 p-7">
      <div className="w-full">
        <StatisticCard7 />
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
              <div className="space-y-4">
                {metrics.servicosMaisVendidos.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">{index + 1}º</Badge>
                      <span className="font-medium">{item.servico}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{formatCurrency(item.receita)}</div>
                      <div className="text-xs text-muted-foreground">
                        {item.quantidade} vendas
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  )
}
