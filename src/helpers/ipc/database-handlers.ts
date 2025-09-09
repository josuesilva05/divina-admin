import { ipcMain } from 'electron';
import { caixaService } from '../../database/caixa.service';
import { servicosService } from '../../database/servicos.service';
import { relatoriosService } from '../../database/relatorios.service';

export function registerDatabaseHandlers() {
  console.log('Registrando handlers do banco de dados...');
  
  console.log('Serviços disponíveis:', {
    caixaService: !!caixaService,
    servicosService: !!servicosService,
    relatoriosService: !!relatoriosService
  });
  
  // Handlers do Caixa
  ipcMain.handle('db:caixa:get', () => {
    console.log('Buscando registros do caixa...');
    const result = caixaService.getCaixaRegistros();
    console.log('Registros retornados:', result.length);
    return result;
  });

  ipcMain.handle('db:caixa:add', (_, registro) => {
    console.log('Adicionando novo registro:', registro);
    try {
      const result = caixaService.addCaixaRegistro(registro);
      console.log('Registro adicionado com sucesso:', result);
      return result;
    } catch (error) {
      console.error('Erro ao adicionar registro:', error);
      throw error;
    }
  });

  ipcMain.handle('db:caixa:update', (_, id, updates) => {
    console.log('Atualizando registro:', id, updates);
    return caixaService.updateCaixaRegistro(id, updates);
  });

  ipcMain.handle('db:caixa:delete', (_, id) => {
    console.log('Deletando registro:', id);
    return caixaService.deleteCaixaRegistro(id);
  });

  // Handlers dos Serviços
  ipcMain.handle('db:servicos:get', () => {
    console.log('Buscando serviços...');
    const result = servicosService.getServicos();
    console.log('Serviços retornados:', result.length);
    return result;
  });

  ipcMain.handle('db:servicos:getById', (_, id) => {
    console.log('Buscando serviço por ID:', id);
    return servicosService.getServicoById(id);
  });

  ipcMain.handle('db:servicos:criar', (_, novoServico) => {
    console.log('Criando novo serviço:', novoServico);
    try {
      const result = servicosService.criarServico(novoServico);
      console.log('Serviço criado com sucesso:', result);
      return result;
    } catch (error) {
      console.error('Erro ao criar serviço:', error);
      throw error;
    }
  });

  ipcMain.handle('db:servicos:atualizar', (_, id, atualizacoes) => {
    console.log('Atualizando serviço:', id, atualizacoes);
    try {
      const result = servicosService.atualizarServico(id, atualizacoes);
      console.log('Serviço atualizado com sucesso:', result);
      return result;
    } catch (error) {
      console.error('Erro ao atualizar serviço:', error);
      throw error;
    }
  });

  ipcMain.handle('db:servicos:excluir', (_, id) => {
    console.log('Excluindo serviço:', id);
    try {
      const result = servicosService.excluirServico(id);
      console.log('Serviço excluído:', result);
      return result;
    } catch (error) {
      console.error('Erro ao excluir serviço:', error);
      throw error;
    }
  });

  // Handlers dos Relatórios
  console.log('Registrando handlers dos relatórios...');
  
  ipcMain.handle('db:relatorios:getCompleto', (_, dataInicio, dataFim) => {
    console.log('Handler db:relatorios:getCompleto chamado com:', { dataInicio, dataFim });
    try {
      const result = relatoriosService.getRelatorioCompleto(dataInicio, dataFim);
      console.log('Dados do relatório retornados:', result.length);
      return result;
    } catch (error) {
      console.error('Erro no handler db:relatorios:getCompleto:', error);
      throw error;
    }
  });

  ipcMain.handle('db:relatorios:getResumo', (_, dataInicio, dataFim) => {
    console.log('Handler db:relatorios:getResumo chamado com:', { dataInicio, dataFim });
    try {
      const result = relatoriosService.getRelatorioResumo(dataInicio, dataFim);
      console.log('Resumo do relatório retornado');
      return result;
    } catch (error) {
      console.error('Erro no handler db:relatorios:getResumo:', error);
      throw error;
    }
  });
  
  console.log('Handlers dos relatórios registrados com sucesso!');
}
