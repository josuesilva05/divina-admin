export interface Servico {
  id: string;
  nome: string;
  preco: number;
  categoria: 'Cabelo' | 'Unha' | 'Estética' | 'Depilação' | 'Outros';
}

export interface RegistroCaixa {
  id: string;
  tipo: 'Entrada' | 'Saída';
  categoria: 'Pé e mão (simples)' | 'Pé e mão (design)' | 'Esmaltação em gel' | 'Unha postiça' | 'Unha postiça + pé' | 'Spa dos pés' | 'Escova' | 'Coloração' | 'Progressiva' | 'Corte' | 'Corte (finalização)' | 'Corte (sem finalização)' | 'Hidratação' | 'Reconstução' | 'Nutrição' | 'Buço' | 'Cílios look francês';
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
}
