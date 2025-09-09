import { useState, useMemo } from "react"
import { RegistroCaixa } from "@/types/caixa"

interface FiltrosTabela {
  tipo: 'Todos' | 'Entrada' | 'Saída'
  data: Date | undefined
  busca: string
}

export function useFiltrosTabela(registros: RegistroCaixa[]) {
  const [filtros, setFiltros] = useState<FiltrosTabela>({
    tipo: 'Todos',
    data: undefined,
    busca: ''
  })

  const formatDateShort = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date)
  }

  const registrosFiltrados = useMemo(() => {
    return registros.filter(registro => {
      const matchTipo = filtros.tipo === 'Todos' || registro.tipo === filtros.tipo
      const matchTexto = filtros.busca === '' || 
        registro.descricao.toLowerCase().includes(filtros.busca.toLowerCase()) ||
        registro.categoria.toLowerCase().includes(filtros.busca.toLowerCase())
      const matchData = !filtros.data || formatDateShort(registro.data) === formatDateShort(filtros.data)
      
      return matchTipo && matchTexto && matchData
    })
  }, [registros, filtros])

  const limparFiltros = () => {
    setFiltros({
      tipo: 'Todos',
      data: undefined,
      busca: ''
    })
  }

  return {
    filtros,
    setFiltros,
    registrosFiltrados,
    limparFiltros
  }
}
