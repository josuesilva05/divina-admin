export interface Cliente {
  id: string;
  nome: string;
  telefone: string;
  email?: string;
  ultimaVisita?: Date;
  totalGasto: number;
}

export interface Servico {
  id: string;
  nome: string;
  preco: number;
  duracao: number; // em minutos
  categoria: 'Cabelo' | 'Unha' | 'Estética' | 'Depilação' | 'Outros';
}

export interface Profissional {
  id: string;
  nome: string;
  especialidades: string[];
  comissao: number; // porcentagem
}

export interface Agendamento {
  id: string;
  clienteId: string;
  profissionalId: string;
  servicoId: string;
  dataHora: Date;
  status: 'Agendado' | 'Em Andamento' | 'Concluído' | 'Cancelado';
  observacoes?: string;
}

export interface RegistroCaixa {
  id: string;
  tipo: 'Entrada' | 'Saída';
  categoria: 'Serviço' | 'Produto' | 'Despesa' | 'Comissão';
  valor: number;
  descricao: string;
  data: Date;
  agendamentoId?: string;
  formaPagamento: 'Dinheiro' | 'Cartão' | 'PIX' | 'Débito' | 'Crédito';
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
  profissionaisMaisAtivos: Array<{
    profissional: string;
    atendimentos: number;
    receita: number;
  }>;
}
