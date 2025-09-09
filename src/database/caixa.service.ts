import { getDatabase, saveDatabase } from './database';
import { RegistroCaixa } from '../types/caixa';

export const caixaService = {
  getCaixaRegistros(): RegistroCaixa[] {
    try {
      const db = getDatabase();
      const stmt = db.prepare('SELECT * FROM caixa_registros ORDER BY data DESC');
      const rows: any[] = [];
      
      while (stmt.step()) {
        rows.push(stmt.getAsObject());
      }
      stmt.free();
      
      console.log('Registros encontrados no banco:', rows.length);

      return rows.map((r) => ({
        id: r.id_caixa,
        tipo: r.tipo_registro,
        categoria: r.categoria,
        servicoId: r.servico_id,
        valor: r.valor,
        descricao: r.descricao,
        data: new Date(r.data),
        formaPagamento: r.formaPagamento,
      }));
    } catch (error) {
      console.error('Erro ao buscar registros:', error);
      return [];
    }
  },

  addCaixaRegistro(
    registro: Omit<RegistroCaixa, 'id' | 'data'>,
  ): RegistroCaixa {
    const data = new Date().toISOString();
    const servicoIdValue = registro.servicoId && registro.servicoId.trim() !== '' 
      ? registro.servicoId 
      : null;

    try {
      const db = getDatabase();
      const stmt = db.prepare(
        'INSERT INTO caixa_registros (tipo_registro, categoria, servico_id, valor, descricao, data, formaPagamento) VALUES (?, ?, ?, ?, ?, ?, ?)'
      );
      
      stmt.run([
        registro.tipo,
        registro.categoria,
        servicoIdValue,
        registro.valor,
        registro.descricao,
        data,
        registro.formaPagamento,
      ]);
      
      const lastInsertRowid = db.exec('SELECT last_insert_rowid()')[0].values[0][0] as number;
      stmt.free();
      
      console.log('Registro inserido com sucesso, ID:', lastInsertRowid);
      
      // Salvar mudanças
      saveDatabase();
      
      return this.getCaixaRegistroById(lastInsertRowid);
    } catch (error) {
      console.error('Erro ao inserir registro:', error);
      throw error;
    }
  },

  updateCaixaRegistro(
    id: number,
    updates: Partial<RegistroCaixa>,
  ): RegistroCaixa {
    const columnMap: Record<string, string> = {
      tipo: 'tipo_registro',
      servicoId: 'servico_id',
    };

    const fields = Object.keys(updates)
      .filter((k) => k !== 'id')
      .map((k) => `${columnMap[k] || k} = ?`)
      .join(', ');
    
    const values = Object.values(updates).filter((v, i) => Object.keys(updates)[i] !== 'id');

    if (fields.length === 0) {
      return this.getCaixaRegistroById(id);
    }

    try {
      const db = getDatabase();
      const stmt = db.prepare(`UPDATE caixa_registros SET ${fields} WHERE id_caixa = ?`);
      stmt.run([...values, id]);
      stmt.free();
      
      // Salvar mudanças
      saveDatabase();
      
      return this.getCaixaRegistroById(id);
    } catch (error) {
      console.error('Erro ao atualizar registro:', error);
      throw error;
    }
  },

  deleteCaixaRegistro(id: number): { id: number } {
    try {
      const db = getDatabase();
      const stmt = db.prepare('DELETE FROM caixa_registros WHERE id_caixa = ?');
      stmt.run([id]);
      stmt.free();
      
      // Salvar mudanças
      saveDatabase();
      
      return { id };
    } catch (error) {
      console.error('Erro ao deletar registro:', error);
      throw error;
    }
  },

  getCaixaRegistroById(id: number): RegistroCaixa {
    try {
      const db = getDatabase();
      const stmt = db.prepare('SELECT * FROM caixa_registros WHERE id_caixa = ?');
      stmt.bind([id]);
      
      if (stmt.step()) {
        const registro = stmt.getAsObject();
        stmt.free();
        
        return {
          id: registro.id_caixa,
          tipo: registro.tipo_registro,
          categoria: registro.categoria,
          servicoId: registro.servico_id,
          valor: registro.valor,
          descricao: registro.descricao,
          data: new Date(registro.data),
          formaPagamento: registro.formaPagamento,
        };
      } else {
        stmt.free();
        throw new Error(`Registro com id ${id} não encontrado.`);
      }
    } catch (error) {
      console.error('Erro ao buscar registro por ID:', error);
      throw error;
    }
  },
};
