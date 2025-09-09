export interface Servico {
  id: string;
  nome: string;
  preco: number;
  categoria: 'Cabelo' | 'Unha' | 'Estética' | 'Depilação' | 'Outros';
}

export interface RegistroCaixa {
  id: number;
  tipo: 'Entrada' | 'Saída';
  categoria: string; // Flexível para permitir diferentes tipos de entradas e saídas
  servicoId?: string; // Para entradas de serviços específicos
  valor: number;
  descricao: string;
  data: Date;
  agendamentoId?: string;
  formaPagamento: 'Dinheiro' | 'Cartão' | 'PIX' | 'Débito' | 'Crédito';
}

export interface ServicoSalao {
  id: string;
  nome: string;
  preco: number;
  categoria: 'Unha' | 'Cabelo' | 'Estética';
  ativo: boolean;
}

export interface DashboardMetrics {
  receitaDiaria: number;
  receitaMensal: number;
  clientesAtendidos: number;
  servicosMaisVendidos: Array<{
    servico: string;
    quantidade: number;
    receita: number;
  }>;
}
