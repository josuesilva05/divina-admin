import { getDatabase, saveDatabase } from './database';

export interface Servico {
  id_servico: string;
  nome: string;
  preco: number;
}

export interface NovoServico {
  nome: string;
  preco: number;
}

export interface AtualizarServico {
  nome?: string;
  preco?: number;
}

export const servicosService = {
  getServicos(): Servico[] {
    try {
      const db = getDatabase();
      const stmt = db.prepare('SELECT * FROM servicos ORDER BY nome ASC');
      const rows: any[] = [];
      
      while (stmt.step()) {
        rows.push(stmt.getAsObject());
      }
      stmt.free();
      
      console.log('Serviços encontrados no banco:', rows.length);
      return rows as Servico[];
    } catch (error) {
      console.error('Erro ao buscar serviços:', error);
      return [];
    }
  },

  getServicoById(id: string): Servico | null {
    try {
      const db = getDatabase();
      const stmt = db.prepare('SELECT * FROM servicos WHERE id_servico = ?');
      stmt.bind([id]);
      
      if (stmt.step()) {
        const servico = stmt.getAsObject();
        stmt.free();
        return servico as Servico;
      } else {
        stmt.free();
        return null;
      }
    } catch (error) {
      console.error('Erro ao buscar serviço por ID:', error);
      return null;
    }
  },

  criarServico(novoServico: NovoServico): Servico {
    try {
      const id = `srv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const db = getDatabase();
      const stmt = db.prepare('INSERT INTO servicos (id_servico, nome, preco) VALUES (?, ?, ?)');
      stmt.run([id, novoServico.nome, novoServico.preco]);
      stmt.free();
      
      console.log('Serviço criado com sucesso:', id);
      
      // Salvar mudanças
      saveDatabase();
      
      return { id_servico: id, ...novoServico };
    } catch (error) {
      console.error('Erro ao criar serviço:', error);
      throw new Error('Erro ao criar serviço no banco de dados');
    }
  },

  atualizarServico(id: string, atualizacoes: AtualizarServico): Servico | null {
    try {
      const servicoAtual = this.getServicoById(id);
      if (!servicoAtual) {
        throw new Error('Serviço não encontrado');
      }

      const campos: string[] = [];
      const valores: any[] = [];
      
      if (atualizacoes.nome !== undefined) {
        campos.push('nome = ?');
        valores.push(atualizacoes.nome);
      }
      
      if (atualizacoes.preco !== undefined) {
        campos.push('preco = ?');
        valores.push(atualizacoes.preco);
      }

      if (campos.length === 0) {
        return servicoAtual;
      }

      valores.push(id);
      const db = getDatabase();
      const stmt = db.prepare(`UPDATE servicos SET ${campos.join(', ')} WHERE id_servico = ?`);
      stmt.run(valores);
      stmt.free();
      
      console.log('Serviço atualizado com sucesso:', id);
      
      // Salvar mudanças
      saveDatabase();
      
      return this.getServicoById(id);
    } catch (error) {
      console.error('Erro ao atualizar serviço:', error);
      throw new Error('Erro ao atualizar serviço no banco de dados');
    }
  },

  excluirServico(id: string): boolean {
    try {
      const db = getDatabase();
      const stmt = db.prepare('DELETE FROM servicos WHERE id_servico = ?');
      stmt.run([id]);
      const changes = db.getRowsModified();
      stmt.free();
      
      console.log('Serviço excluído:', id, 'Linhas afetadas:', changes);
      
      // Salvar mudanças
      saveDatabase();
      
      return changes > 0;
    } catch (error) {
      console.error('Erro ao excluir serviço:', error);
      throw new Error('Erro ao excluir serviço do banco de dados');
    }
  },
};
