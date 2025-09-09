'use client';

import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardToolbar } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Area, CartesianGrid, ComposedChart, Line, XAxis, YAxis } from 'recharts';

interface ReceitaChartProps {
  data: Array<{
    dia: string
    receita: number
  }>
  isLoading?: boolean
}

// Use custom or Tailwind standard colors
const chartConfig = {
  receita: {
    label: 'Receita',
    color: '#8b5cf6', // Tailwind violet-500
  },
} satisfies ChartConfig;

// Custom Tooltip
interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    dataKey: string;
    value: number;
    color: string;
  }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg bg-zinc-900 text-white p-3 shadow-lg">
        <div className="text-xs font-medium mb-1">{label}:</div>
        <div className="text-sm font-semibold">
          R$ {payload[0].value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </div>
      </div>
    );
  }
  return null;
};

export default function ReceitaChart({ data, isLoading = false }: ReceitaChartProps) {
  // Calculate metrics
  const totalReceita = data.reduce((sum, item) => sum + item.receita, 0);
  const lastValue = data[data.length - 1]?.receita || 0;
  const previousValue = data[data.length - 2]?.receita || 0;
  const percentageChange = previousValue > 0 ? ((lastValue - previousValue) / previousValue) * 100 : 0;
  const isPositive = percentageChange >= 0;

  if (isLoading) {
    return (
      <Card className="w-full lg:max-w-4xl">
        <CardHeader className="border-0 min-h-auto pt-6 pb-4">
          <CardTitle className="text-lg font-semibold">Receita Semanal</CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <div className="px-5 mb-8">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-32 mb-2"></div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-8 bg-gray-200 rounded animate-pulse w-40"></div>
              <div className="h-6 bg-gray-200 rounded animate-pulse w-16"></div>
            </div>
          </div>
          <div className="h-[300px] bg-gray-100 animate-pulse rounded-lg mx-5"></div>
        </CardContent>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card className="w-full lg:max-w-4xl">
        <CardHeader className="border-0 min-h-auto pt-6 pb-4">
          <CardTitle className="text-lg font-semibold">Receita Semanal</CardTitle>
        </CardHeader>
        <CardContent className="px-5">
          <div className="text-center py-12 text-gray-500">
            <p>Nenhum dado de receita disponível.</p>
            <p className="text-sm">Os dados aparecerão após registros serem criados.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full lg:max-w-4xl">
      <CardHeader className="border-0 min-h-auto pt-6 pb-4">
        <CardTitle className="text-lg font-semibold">Receita Semanal</CardTitle>
      </CardHeader>

      <CardContent className="px-0">
        {/* Stats Section */}
        <div className="px-5 mb-8">
          <div className="text-xs font-medium text-muted-foreground tracking-wide mb-2">
            Últimos 7 dias
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="text-3xl font-bold">
              R$ {totalReceita.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            {Math.abs(percentageChange) > 0 && (
              <Badge variant={isPositive ? "success" : "destructive"} appearance="light">
                {isPositive ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
                {Math.abs(percentageChange).toFixed(1)}%
              </Badge>
            )}
          </div>
        </div>

        {/* Chart */}
        <div className="relative">
          <ChartContainer
            config={chartConfig}
            className="h-[300px] w-full ps-1.5 pe-2.5 overflow-visible [&_.recharts-curve.recharts-tooltip-cursor]:stroke-initial"
          >
            <ComposedChart
              data={data}
              margin={{
                top: 25,
                right: 25,
                left: 0,
                bottom: 25,
              }}
              style={{ overflow: 'visible' }}
            >
              {/* Gradient */}
              <defs>
                <linearGradient id="receitaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={chartConfig.receita.color} stopOpacity={0.15} />
                  <stop offset="100%" stopColor={chartConfig.receita.color} stopOpacity={0} />
                </linearGradient>
                <filter id="dotShadow" x="-50%" y="-50%" width="200%" height="200%">
                  <feDropShadow dx="2" dy="2" stdDeviation="3" floodColor="rgba(0,0,0,0.5)" />
                </filter>
              </defs>

              <CartesianGrid
                strokeDasharray="4 12"
                stroke="var(--input)"
                strokeOpacity={1}
                horizontal={true}
                vertical={false}
              />

              <XAxis
                dataKey="dia"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
                tickMargin={12}
                dy={10}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `R$ ${value}`}
                domain={[0, 'dataMax + 50']}
                tickCount={6}
                tickMargin={12}
              />

              <ChartTooltip
                content={<CustomTooltip />}
                cursor={{
                  stroke: chartConfig.receita.color,
                  strokeWidth: 1,
                  strokeDasharray: 'none',
                }}
              />

              {/* Gradient area */}
              <Area
                type="linear"
                dataKey="receita"
                stroke="transparent"
                fill="url(#receitaGradient)"
                strokeWidth={0}
                dot={false}
              />

              {/* Main receita line */}
              <Line
                type="linear"
                dataKey="receita"
                stroke={chartConfig.receita.color}
                strokeWidth={3}
                dot={(props) => {
                  const { cx, cy, payload } = props;
                  // Highlight dots for weekend (Sáb, Dom) or days with high revenue
                  if (payload.dia === 'Sáb' || payload.receita > totalReceita / data.length) {
                    return (
                      <circle
                        key={`dot-${cx}-${cy}`}
                        cx={cx}
                        cy={cy}
                        r={6}
                        fill={chartConfig.receita.color}
                        stroke="white"
                        strokeWidth={2}
                        filter="url(#dotShadow)"
                      />
                    );
                  }
                  return <g key={`dot-${cx}-${cy}`} />; // Return empty group for other points
                }}
                activeDot={{
                  r: 6,
                  fill: chartConfig.receita.color,
                  stroke: 'white',
                  strokeWidth: 2,
                  filter: 'url(#dotShadow)',
                }}
              />
            </ComposedChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
