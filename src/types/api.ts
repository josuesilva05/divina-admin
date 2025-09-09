import { RegistroCaixa } from './caixa'
import type { RelatorioData, RelatorioResumo } from '../database/relatorios.service'

export interface ICaixaAPI {
  getRegistros: () => Promise<RegistroCaixa[]>
  addRegistro: (
    registro: Omit<RegistroCaixa, 'id' | 'data'>,
  ) => Promise<RegistroCaixa>
  updateRegistro: (
    id: string,
    updates: Partial<RegistroCaixa>,
  ) => Promise<RegistroCaixa>
  deleteRegistro: (id: string) => Promise<{ id: string }>
}

export interface IRelatoriosAPI {
  getRelatorioCompleto: (dataInicio?: string, dataFim?: string) => Promise<RelatorioData[]>
  getRelatorioResumo: (dataInicio?: string, dataFim?: string) => Promise<RelatorioResumo>
}
