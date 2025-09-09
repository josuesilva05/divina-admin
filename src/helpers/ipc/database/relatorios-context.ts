import { ipcRenderer } from 'electron'
import type { RelatorioData, RelatorioResumo } from '../../../database/relatorios.service'

console.log('Carregando API de relatórios...')

export const relatoriosApi = {
  getRelatorioCompleto: (dataInicio?: string, dataFim?: string): Promise<RelatorioData[]> => {
    console.log('Chamando db:relatorios:getCompleto via IPC...')
    return ipcRenderer.invoke('db:relatorios:getCompleto', dataInicio, dataFim)
  },
  
  getRelatorioResumo: (dataInicio?: string, dataFim?: string): Promise<RelatorioResumo> => {
    console.log('Chamando db:relatorios:getResumo via IPC...')
    return ipcRenderer.invoke('db:relatorios:getResumo', dataInicio, dataFim)
  },
}

console.log('API de relatórios carregada!')
