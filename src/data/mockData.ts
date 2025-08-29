import { Servico, RegistroCaixa, DashboardMetrics } from '../types';


// Mock de Registros de Caixa
export const mockRegistrosCaixa: RegistroCaixa[] = [
  {
    id: '1',
    tipo: 'Entrada',
    categoria: 'Pé e mão (simples)',
    valor: 50.00,
    descricao: 'Esmaltação em gel',
    data: new Date('2024-08-27T09:00:00'),
    formaPagamento: 'PIX'
  },
  {
    id: '2',
    tipo: 'Entrada',
    categoria: 'Escova',
    valor: 25.00,
    descricao: 'Manicure - Ana Costa',
    data: new Date('2024-08-27T10:30:00'),
    formaPagamento: 'Dinheiro'
  },
  {
    id: '3',
    tipo: 'Entrada',
    categoria: 'Hidratação',
    valor: 120.00,
    descricao: 'Coloração - Carla Santos',
    data: new Date('2024-08-27T14:00:00'),
    formaPagamento: 'Cartão'
  },
  {
    id: '4',
    tipo: 'Saída',
    categoria: 'Corte (sem finalização)',
    valor: 80.00,
    descricao: 'Produtos para Coloração',
    data: new Date('2024-08-27T16:00:00'),
    formaPagamento: 'Dinheiro'
  },
  {
    id: '5',
    tipo: 'Saída',
    categoria: 'Buço',
    valor: 25.00,
    descricao: 'Comissão Juliana - Corte',
    data: new Date('2024-08-27T18:00:00'),
    formaPagamento: 'Dinheiro'
  }
];

// Mock de Métricas do Dashboard
export const mockDashboardMetrics: DashboardMetrics = {
  receitaDiaria: 195.00,
  receitaMensal: 5840.00,
  clientesAtendidos: 3,
  servicosMaisVendidos: [
    { servico: 'Esmaltação em gel', quantidade: 12, receita: 600.00 },
    { servico: 'Manicure', quantidade: 18, receita: 450.00 },
    { servico: 'Coloração', quantidade: 8, receita: 960.00 },
    { servico: 'Coloração', quantidade: 8, receita: 960.00 },
    { servico: 'Coloração', quantidade: 8, receita: 960.00 },
    { servico: 'Coloração', quantidade: 8, receita: 960.00 },
    { servico: 'Escova', quantidade: 15, receita: 450.00 }
  ],
};

// Dados para gráficos de receita semanal
export const mockReceitaSemanal = [
  { dia: 'Seg', receita: 320 },
  { dia: 'Ter', receita: 450 },
  { dia: 'Qua', receita: 280 },
  { dia: 'Qui', receita: 520 },
  { dia: 'Sex', receita: 680 },
  { dia: 'Sáb', receita: 920 },
  { dia: 'Dom', receita: 0 }
];

// export const mockServicosDisponiveis: 