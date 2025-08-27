import { Cliente, Servico, Profissional, Agendamento, RegistroCaixa, DashboardMetrics } from '../types';

// Mock de Clientes
export const mockClientes: Cliente[] = [
  {
    id: '1',
    nome: 'Maria Silva',
    telefone: '(11) 99999-1111',
    email: 'maria@email.com',
    ultimaVisita: new Date('2024-08-25'),
    totalGasto: 450.00
  },
  {
    id: '2',
    nome: 'Ana Costa',
    telefone: '(11) 99999-2222',
    email: 'ana@email.com',
    ultimaVisita: new Date('2024-08-26'),
    totalGasto: 320.00
  },
  {
    id: '3',
    nome: 'Carla Santos',
    telefone: '(11) 99999-3333',
    ultimaVisita: new Date('2024-08-27'),
    totalGasto: 180.00
  }
];

// Mock de Serviços
export const mockServicos: Servico[] = [
  { id: '1', nome: 'Corte Feminino', preco: 50.00, duracao: 60, categoria: 'Cabelo' },
  { id: '2', nome: 'Escova', preco: 30.00, duracao: 45, categoria: 'Cabelo' },
  { id: '3', nome: 'Coloração', preco: 120.00, duracao: 120, categoria: 'Cabelo' },
  { id: '4', nome: 'Manicure', preco: 25.00, duracao: 45, categoria: 'Unha' },
  { id: '5', nome: 'Pedicure', preco: 35.00, duracao: 60, categoria: 'Unha' },
  { id: '6', nome: 'Limpeza de Pele', preco: 80.00, duracao: 90, categoria: 'Estética' },
  { id: '7', nome: 'Sobrancelha', preco: 20.00, duracao: 30, categoria: 'Estética' },
  { id: '8', nome: 'Depilação Perna', preco: 40.00, duracao: 60, categoria: 'Depilação' }
];

// Mock de Profissionais
export const mockProfissionais: Profissional[] = [
  {
    id: '1',
    nome: 'Juliana Oliveira',
    especialidades: ['Cabelo', 'Coloração'],
    comissao: 50
  },
  {
    id: '2',
    nome: 'Patricia Lima',
    especialidades: ['Unha', 'Estética'],
    comissao: 45
  },
  {
    id: '3',
    nome: 'Fernanda Costa',
    especialidades: ['Depilação', 'Estética'],
    comissao: 40
  }
];

// Mock de Registros de Caixa
export const mockRegistrosCaixa: RegistroCaixa[] = [
  {
    id: '1',
    tipo: 'Entrada',
    categoria: 'Serviço',
    valor: 50.00,
    descricao: 'Corte Feminino - Maria Silva',
    data: new Date('2024-08-27T09:00:00'),
    formaPagamento: 'PIX'
  },
  {
    id: '2',
    tipo: 'Entrada',
    categoria: 'Serviço',
    valor: 25.00,
    descricao: 'Manicure - Ana Costa',
    data: new Date('2024-08-27T10:30:00'),
    formaPagamento: 'Dinheiro'
  },
  {
    id: '3',
    tipo: 'Entrada',
    categoria: 'Serviço',
    valor: 120.00,
    descricao: 'Coloração - Carla Santos',
    data: new Date('2024-08-27T14:00:00'),
    formaPagamento: 'Cartão'
  },
  {
    id: '4',
    tipo: 'Saída',
    categoria: 'Despesa',
    valor: 80.00,
    descricao: 'Produtos para Coloração',
    data: new Date('2024-08-27T16:00:00'),
    formaPagamento: 'Dinheiro'
  },
  {
    id: '5',
    tipo: 'Saída',
    categoria: 'Comissão',
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
    { servico: 'Corte Feminino', quantidade: 12, receita: 600.00 },
    { servico: 'Manicure', quantidade: 18, receita: 450.00 },
    { servico: 'Coloração', quantidade: 8, receita: 960.00 },
    { servico: 'Escova', quantidade: 15, receita: 450.00 }
  ],
  profissionaisMaisAtivos: [
    { profissional: 'Juliana Oliveira', atendimentos: 25, receita: 1250.00 },
    { profissional: 'Patricia Lima', atendimentos: 22, receita: 980.00 },
    { profissional: 'Fernanda Costa', atendimentos: 18, receita: 720.00 }
  ]
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

// Dados para gráfico de serviços por categoria
export const mockServicosPorCategoria = [
  { categoria: 'Cabelo', total: 2010, cor: '#8884d8' },
  { categoria: 'Unha', total: 900, cor: '#82ca9d' },
  { categoria: 'Estética', total: 800, cor: '#ffc658' },
  { categoria: 'Depilação', total: 480, cor: '#ff7300' }
];
