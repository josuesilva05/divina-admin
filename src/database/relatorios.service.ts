import { getDatabase } from './database';

export interface RelatorioData {
  id: number;
  data: string;
  tipo: 'Entrada' | 'Saída';
  categoria: string;
  servico_nome?: string;
  valor: number;
  descricao: string;
  formaPagamento: string;
}

export interface RelatorioResumo {
  totalEntradas: number;
  totalSaidas: number;
  saldoTotal: number;
  totalTransacoes: number;
  servicosMaisVendidos: Array<{
    servico: string;
    quantidade: number;
    receita: number;
  }>;
  receitaPorFormaPagamento: Array<{
    forma: string;
    valor: number;
  }>;
  movimentacaoDiaria: Array<{
    data: string;
    entradas: number;
    saidas: number;
    saldo: number;
  }>;
}

export const relatoriosService = {
  getRelatorioCompleto(dataInicio?: string, dataFim?: string): RelatorioData[] {
    try {
      let query = `
        SELECT 
          cr.id_caixa as id,
          cr.data,
          cr.tipo_registro as tipo,
          cr.categoria,
          s.nome as servico_nome,
          cr.valor,
          cr.descricao,
          cr.formaPagamento
        FROM caixa_registros cr
        LEFT JOIN servicos s ON cr.servico_id = s.id_servico
      `;
      
      const params: any[] = [];
      
      console.log('Filtros recebidos:', { dataInicio, dataFim });
      
      if (dataInicio && dataFim) {
        query += ' WHERE date(cr.data) BETWEEN date(?) AND date(?)';
        params.push(dataInicio, dataFim);
      } else if (dataInicio) {
        query += ' WHERE date(cr.data) >= date(?)';
        params.push(dataInicio);
      } else if (dataFim) {
        query += ' WHERE date(cr.data) <= date(?)';
        params.push(dataFim);
      }
      
      query += ' ORDER BY cr.data DESC';
      
      const db = getDatabase();
      const stmt = db.prepare(query);
      if (params.length > 0) {
        stmt.bind(params);
      }
      
      const rows: RelatorioData[] = [];
      while (stmt.step()) {
        rows.push(stmt.getAsObject() as RelatorioData);
      }
      stmt.free();
      
      console.log(`Query executada: ${query}`);
      console.log(`Parâmetros: ${JSON.stringify(params)}`);
      console.log(`Registros encontrados: ${rows.length}`);
      
      if (rows.length === 0) {
        const debugStmt = db.prepare('SELECT data, date(data) as data_formatada FROM caixa_registros LIMIT 5');
        const debugRows: any[] = [];
        while (debugStmt.step()) {
          debugRows.push(debugStmt.getAsObject());
        }
        debugStmt.free();
        console.log('Datas existentes no banco (debug):', debugRows);
        
        const countStmt = db.prepare('SELECT COUNT(*) as total FROM caixa_registros');
        countStmt.step();
        const countRow = countStmt.getAsObject();
        countStmt.free();
        console.log('Total de registros no banco:', countRow.total);
      }
      
      return rows;
    } catch (error) {
      console.error('Erro ao buscar relatório completo:', error);
      return [];
    }
  },

  getRelatorioResumo(dataInicio?: string, dataFim?: string): RelatorioResumo {
    try {
      const dados = this.getRelatorioCompleto(dataInicio, dataFim);
      
      const totalEntradas = dados
        .filter(d => d.tipo === 'Entrada')
        .reduce((sum, d) => sum + d.valor, 0);
      
      const totalSaidas = dados
        .filter(d => d.tipo === 'Saída')
        .reduce((sum, d) => sum + d.valor, 0);
      
      const saldoTotal = totalEntradas - totalSaidas;
      
      const servicosMap = new Map<string, { quantidade: number; receita: number }>();
      dados
        .filter(d => d.tipo === 'Entrada' && d.servico_nome)
        .forEach(d => {
          const nome = d.servico_nome!;
          const current = servicosMap.get(nome) || { quantidade: 0, receita: 0 };
          servicosMap.set(nome, {
            quantidade: current.quantidade + 1,
            receita: current.receita + d.valor
          });
        });
      
      const servicosMaisVendidos = Array.from(servicosMap.entries())
        .map(([servico, data]) => ({ servico, ...data }))
        .sort((a, b) => b.receita - a.receita)
        .slice(0, 10);
      
      const pagamentoMap = new Map<string, number>();
      dados
        .filter(d => d.tipo === 'Entrada')
        .forEach(d => {
          const forma = d.formaPagamento;
          pagamentoMap.set(forma, (pagamentoMap.get(forma) || 0) + d.valor);
        });
      
      const receitaPorFormaPagamento = Array.from(pagamentoMap.entries())
        .map(([forma, valor]) => ({ forma, valor }))
        .sort((a, b) => b.valor - a.valor);
      
      const diasMap = new Map<string, { entradas: number; saidas: number }>();
      dados.forEach(d => {
        const data = d.data.split('T')[0];
        const current = diasMap.get(data) || { entradas: 0, saidas: 0 };
        
        if (d.tipo === 'Entrada') {
          current.entradas += d.valor;
        } else {
          current.saidas += d.valor;
        }
        
        diasMap.set(data, current);
      });
      
      const movimentacaoDiaria = Array.from(diasMap.entries())
        .map(([data, valores]) => ({
          data,
          entradas: valores.entradas,
          saidas: valores.saidas,
          saldo: valores.entradas - valores.saidas
        }))
        .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
        .slice(0, 30);
      
      return {
        totalEntradas,
        totalSaidas,
        saldoTotal,
        totalTransacoes: dados.length,
        servicosMaisVendidos,
        receitaPorFormaPagamento,
        movimentacaoDiaria
      };
    } catch (error) {
      console.error('Erro ao gerar resumo do relatório:', error);
      return {
        totalEntradas: 0,
        totalSaidas: 0,
        saldoTotal: 0,
        totalTransacoes: 0,
        servicosMaisVendidos: [],
        receitaPorFormaPagamento: [],
        movimentacaoDiaria: []
      };
    }
  }
};
