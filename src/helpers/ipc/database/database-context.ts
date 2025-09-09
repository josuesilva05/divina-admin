import { contextBridge } from 'electron'
import { caixaApi } from './caixa-context'
import { servicosApi } from './servicos-context'
import { relatoriosApi } from './relatorios-context'

export function exposeDatabaseContext() {
  console.log('Expondo contexto do banco de dados...')
  
  contextBridge.exposeInMainWorld('db', {
    caixa: caixaApi,
    servicos: servicosApi,
    relatorios: relatoriosApi,
  })
  
  console.log('Contexto do banco de dados exposto com sucesso!')
  console.log('APIs disponíveis:', {
    caixa: !!caixaApi,
    servicos: !!servicosApi,
    relatorios: !!relatoriosApi
  })
}
