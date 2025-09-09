import { useState, useEffect } from 'react'
import { RegistroCaixa } from '@/types/caixa'

interface DashboardMetrics {
  receitaDiaria: number
  receitaMensal: number
  clientesAtendidos: number
  servicosMaisVendidos: Array<{
    servico: string
    quantidade: number
    receita: number
  }>
  receitaSemanal: Array<{
    dia: string
    receita: number
  }>
}

export function useDashboardMetrics() {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    receitaDiaria: 0,
    receitaMensal: 0,
    clientesAtendidos: 0,
    servicosMaisVendidos: [],
    receitaSemanal: [],
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const calculateMetrics = (registros: RegistroCaixa[]): DashboardMetrics => {
    const hoje = new Date()
    const inicioDoMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1)
    const inicioDaSemana = new Date(hoje)
    inicioDaSemana.setDate(hoje.getDate() - hoje.getDay())

    // Filtrar apenas entradas de serviços
    const entradas = registros.filter(r => r.tipo === 'Entrada')

    // Receita diária
    const receitaDiaria = entradas
      .filter(r => {
        const dataRegistro = new Date(r.data)
        return dataRegistro.toDateString() === hoje.toDateString()
      })
      .reduce((total, r) => total + r.valor, 0)

    // Receita mensal
    const receitaMensal = entradas
      .filter(r => {
        const dataRegistro = new Date(r.data)
        return dataRegistro >= inicioDoMes
      })
      .reduce((total, r) => total + r.valor, 0)

    // Clientes atendidos hoje
    const clientesAtendidos = entradas
      .filter(r => {
        const dataRegistro = new Date(r.data)
        return dataRegistro.toDateString() === hoje.toDateString()
      }).length

    // Serviços mais vendidos (do mês atual)
    const servicosDoMes = entradas.filter(r => {
      const dataRegistro = new Date(r.data)
      return dataRegistro >= inicioDoMes && r.servicoId
    })

    const servicosAgrupados = servicosDoMes.reduce((acc, registro) => {
      const servico = registro.categoria || 'Serviço não identificado'
      if (!acc[servico]) {
        acc[servico] = { quantidade: 0, receita: 0 }
      }
      acc[servico].quantidade += 1
      acc[servico].receita += registro.valor
      return acc
    }, {} as Record<string, { quantidade: number; receita: number }>)

    const servicosMaisVendidos = Object.entries(servicosAgrupados)
      .map(([servico, dados]) => ({
        servico,
        quantidade: dados.quantidade,
        receita: dados.receita,
      }))
      .sort((a, b) => b.receita - a.receita)
      .slice(0, 5)

    // Receita semanal (últimos 7 dias)
    const diasDaSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
    const receitaSemanal = Array.from({ length: 7 }, (_, i) => {
      const data = new Date(inicioDaSemana)
      data.setDate(inicioDaSemana.getDate() + i)
      
      const receitaDoDia = entradas
        .filter(r => {
          const dataRegistro = new Date(r.data)
          return dataRegistro.toDateString() === data.toDateString()
        })
        .reduce((total, r) => total + r.valor, 0)

      return {
        dia: diasDaSemana[data.getDay()],
        receita: receitaDoDia,
      }
    })

    return {
      receitaDiaria,
      receitaMensal,
      clientesAtendidos,
      servicosMaisVendidos,
      receitaSemanal,
    }
  }

  const loadMetrics = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Buscar dados do banco de dados
      const registros = await window.db.caixa.getRegistros()
      
      // Calcular métricas
      const calculatedMetrics = calculateMetrics(registros)
      setMetrics(calculatedMetrics)
    } catch (err) {
      console.error('Erro ao carregar métricas do dashboard:', err)
      setError('Erro ao carregar dados do dashboard')
      
      // Fallback para dados vazios em caso de erro
      setMetrics({
        receitaDiaria: 0,
        receitaMensal: 0,
        clientesAtendidos: 0,
        servicosMaisVendidos: [],
        receitaSemanal: [],
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadMetrics()
  }, [])

  return {
    metrics,
    isLoading,
    error,
    refreshMetrics: loadMetrics,
  }
}
