import { useMemo } from "react"
import { RegistroCaixa } from "@/types/caixa"

export function useCaixaCalculos(registros: RegistroCaixa[], registrosFiltrados: RegistroCaixa[]) {
  const formatDateShort = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date)
  }

  const calcularResumo = useMemo(() => {
    const entradas = registrosFiltrados
      .filter(r => r.tipo === 'Entrada')
      .reduce((acc, r) => acc + r.valor, 0)
    
    const saidas = registrosFiltrados
      .filter(r => r.tipo === 'Saída')
      .reduce((acc, r) => acc + r.valor, 0)
    
    return {
      entradas,
      saidas,
      saldo: entradas - saidas,
      totalTransacoes: registrosFiltrados.length
    }
  }, [registrosFiltrados])

  const calcularEstatisticas = useMemo(() => {
    const hoje = new Date()
    const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1)
    
    const registrosHoje = registros.filter(r => 
      formatDateShort(r.data) === formatDateShort(hoje)
    )
    
    const registrosMes = registros.filter(r => 
      r.data >= inicioMes
    )

    const entradasHoje = registrosHoje
      .filter(r => r.tipo === 'Entrada')
      .reduce((acc, r) => acc + r.valor, 0)
    
    const entradasMes = registrosMes
      .filter(r => r.tipo === 'Entrada')
      .reduce((acc, r) => acc + r.valor, 0)

    return {
      entradasHoje,
      entradasMes,
      transacoesHoje: registrosHoje.length,
      transacoesMes: registrosMes.length
    }
  }, [registros])

  return {
    resumo: calcularResumo,
    estatisticas: calcularEstatisticas
  }
}
