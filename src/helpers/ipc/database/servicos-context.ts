import { ipcRenderer } from 'electron'

export interface Servico {
  id_servico: string
  nome: string
  preco: number
}

export interface NovoServico {
  nome: string
  preco: number
}

export interface AtualizarServico {
  nome?: string
  preco?: number
}

export const servicosApi = {
  getServicos: (): Promise<Servico[]> =>
    ipcRenderer.invoke('db:servicos:get'),
  getServicoById: (id: string): Promise<Servico | null> =>
    ipcRenderer.invoke('db:servicos:getById', id),
  criarServico: (novoServico: NovoServico): Promise<Servico> =>
    ipcRenderer.invoke('db:servicos:criar', novoServico),
  atualizarServico: (id: string, atualizacoes: AtualizarServico): Promise<Servico | null> =>
    ipcRenderer.invoke('db:servicos:atualizar', id, atualizacoes),
  excluirServico: (id: string): Promise<boolean> =>
    ipcRenderer.invoke('db:servicos:excluir', id),
}
