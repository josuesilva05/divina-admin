import { ipcRenderer } from 'electron'
import { RegistroCaixa } from '../../../types/caixa'

export const caixaApi = {
  getRegistros: (): Promise<RegistroCaixa[]> =>
    ipcRenderer.invoke('db:caixa:get'),
  addRegistro: (
    registro: Omit<RegistroCaixa, 'id' | 'data'>,
  ): Promise<RegistroCaixa> => ipcRenderer.invoke('db:caixa:add', registro),
  updateRegistro: (
    id: number,
    updates: Partial<RegistroCaixa>,
  ): Promise<RegistroCaixa> =>
    ipcRenderer.invoke('db:caixa:update', id, updates),
  deleteRegistro: (id: number): Promise<{ id: number }> =>
    ipcRenderer.invoke('db:caixa:delete', id),
}
