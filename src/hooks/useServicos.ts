import { useState, useEffect, useCallback } from 'react'

interface Servico {
  id_servico: string
  nome: string
  preco: number
}

interface NovoServico {
  nome: string
  preco: number
}

interface AtualizarServico {
  nome?: string
  preco?: number
}

export function useServicos() {
  const [servicos, setServicos] = useState<Servico[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const carregarServicos = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const dados = await window.db.servicos.getServicos()
      setServicos(dados)
    } catch (err) {
      console.error('Erro ao carregar serviços:', err)
      setError('Erro ao carregar serviços')
    } finally {
      setLoading(false)
    }
  }, [])

  const criarServico = useCallback(async (novoServico: NovoServico) => {
    try {
      setError(null)
      const servicoCriado = await window.db.servicos.criarServico(novoServico)
      setServicos(prev => [...prev, servicoCriado])
      return servicoCriado
    } catch (err) {
      console.error('Erro ao criar serviço:', err)
      setError('Erro ao criar serviço')
      throw err
    }
  }, [])

  const atualizarServico = useCallback(async (id: string, atualizacoes: AtualizarServico) => {
    try {
      setError(null)
      const servicoAtualizado = await window.db.servicos.atualizarServico(id, atualizacoes)
      if (servicoAtualizado) {
        setServicos(prev => 
          prev.map(servico => 
            servico.id_servico === id ? servicoAtualizado : servico
          )
        )
        return servicoAtualizado
      }
    } catch (err) {
      console.error('Erro ao atualizar serviço:', err)
      setError('Erro ao atualizar serviço')
      throw err
    }
  }, [])

  const excluirServico = useCallback(async (id: string) => {
    try {
      setError(null)
      const sucesso = await window.db.servicos.excluirServico(id)
      if (sucesso) {
        setServicos(prev => prev.filter(servico => servico.id_servico !== id))
      }
      return sucesso
    } catch (err) {
      console.error('Erro ao excluir serviço:', err)
      setError('Erro ao excluir serviço')
      throw err
    }
  }, [])

  useEffect(() => {
    carregarServicos()
  }, [carregarServicos])

  return {
    servicos,
    loading,
    error,
    carregarServicos,
    criarServico,
    atualizarServico,
    excluirServico,
  }
}
