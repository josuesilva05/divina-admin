import { Servico, RegistroCaixa, DashboardMetrics, ServicoSalao } from '../types/caixa';

// Serviços da Clínica
export const servicosSalao: ServicoSalao[] = [
  // Serviços de Unha
  { id: '1', nome: 'Pé e mão (simples)', preco: 35.00, categoria: 'Unha', ativo: true },
  { id: '2', nome: 'Pé e mão (design)', preco: 50.00, categoria: 'Unha', ativo: true },
  { id: '3', nome: 'Esmaltação em gel', preco: 25.00, categoria: 'Unha', ativo: true },
  { id: '4', nome: 'Unha postiça', preco: 45.00, categoria: 'Unha', ativo: true },
  { id: '5', nome: 'Unha postiça + pé', preco: 60.00, categoria: 'Unha', ativo: true },
  { id: '6', nome: 'Spa dos pés', preco: 40.00, categoria: 'Unha', ativo: true },
  
  // Serviços de Cabelo
  { id: '7', nome: 'Escova', preco: 30.00, categoria: 'Cabelo', ativo: true },
  { id: '8', nome: 'Coloração', preco: 120.00, categoria: 'Cabelo', ativo: true },
  { id: '9', nome: 'Progressiva', preco: 180.00, categoria: 'Cabelo', ativo: true },
  { id: '10', nome: 'Corte', preco: 40.00, categoria: 'Cabelo', ativo: true },
  { id: '11', nome: 'Corte (finalização)', preco: 45.00, categoria: 'Cabelo', ativo: true },
  { id: '12', nome: 'Corte (sem finalização)', preco: 35.00, categoria: 'Cabelo', ativo: true },
  { id: '13', nome: 'Hidratação', preco: 50.00, categoria: 'Cabelo', ativo: true },
  { id: '14', nome: 'Reconstução', preco: 60.00, categoria: 'Cabelo', ativo: true },
  { id: '15', nome: 'Nutrição', preco: 55.00, categoria: 'Cabelo', ativo: true },
  
  // Serviços de Estética
  { id: '16', nome: 'Buço', preco: 15.00, categoria: 'Estética', ativo: true },
  { id: '17', nome: 'Cílios look francês', preco: 80.00, categoria: 'Estética', ativo: true },
];

// Categorias comuns para saídas/despesas
export const categoriasSaida = [
  'Produtos e Materiais',
  'Equipamentos',
  'Manutenção',
  'Aluguel',
  'Energia Elétrica',
  'Água',
  'Internet/Telefone',
  'Marketing',
  'Comissões',
  'Impostos',
  'Outros'
];

// Mock de Registros de Caixa
export const mockRegistrosCaixa: RegistroCaixa[] = [
  {
    id: '1',
    tipo: 'Entrada',
    categoria: 'Pé e mão (design)',
    servicoId: '2',
    valor: 50.00,
    descricao: 'Atendimento cliente Maria Silva',
    data: new Date('2024-08-29T09:00:00'),
    formaPagamento: 'PIX'
  },
  {
    id: '2',
    tipo: 'Entrada',
    categoria: 'Esmaltação em gel',
    servicoId: '3',
    valor: 25.00,
    descricao: 'Atendimento cliente Ana Costa',
    data: new Date('2024-08-29T10:30:00'),
    formaPagamento: 'Dinheiro'
  },
  {
    id: '3',
    tipo: 'Entrada',
    categoria: 'Coloração',
    servicoId: '8',
    valor: 120.00,
    descricao: 'Coloração completa - Carla Santos',
    data: new Date('2024-08-29T14:00:00'),
    formaPagamento: 'Cartão'
  },
  {
    id: '4',
    tipo: 'Entrada',
    categoria: 'Corte (finalização)',
    servicoId: '11',
    valor: 45.00,
    descricao: 'Corte e finalização - Juliana Oliveira',
    data: new Date('2024-08-29T16:00:00'),
    formaPagamento: 'Débito'
  },
  {
    id: '5',
    tipo: 'Saída',
    categoria: 'Produtos e Materiais',
    valor: 80.00,
    descricao: 'Compra de produtos para coloração',
    data: new Date('2024-08-29T11:00:00'),
    formaPagamento: 'Dinheiro'
  },
  {
    id: '6',
    tipo: 'Saída',
    categoria: 'Equipamentos',
    valor: 150.00,
    descricao: 'Secador de cabelo novo',
    data: new Date('2024-08-28T15:00:00'),
    formaPagamento: 'Cartão'
  },
  {
    id: '7',
    tipo: 'Saída',
    categoria: 'Comissões',
    valor: 25.00,
    descricao: 'Comissão Fernanda - Progressiva',
    data: new Date('2024-08-28T18:00:00'),
    formaPagamento: 'Dinheiro'
  },
  {
    id: '8',
    tipo: 'Entrada',
    categoria: 'Cílios look francês',
    servicoId: '17',
    valor: 80.00,
    descricao: 'Extensão de cílios - Cliente VIP',
    data: new Date('2024-08-28T13:00:00'),
    formaPagamento: 'PIX'
  },
  {
    id: '9',
    tipo: 'Entrada',
    categoria: 'Progressiva',
    servicoId: '9',
    valor: 180.00,
    descricao: 'Progressiva completa - Amanda Silva',
    data: new Date('2024-08-28T09:00:00'),
    formaPagamento: 'Cartão'
  },
  {
    id: '10',
    tipo: 'Saída',
    categoria: 'Marketing',
    valor: 50.00,
    descricao: 'Anúncios Facebook/Instagram',
    data: new Date('2024-08-27T16:00:00'),
    formaPagamento: 'PIX'
  },
  {
    id: '11',
    tipo: 'Entrada',
    categoria: 'Spa dos pés',
    servicoId: '6',
    valor: 40.00,
    descricao: 'Spa relaxante - Beatriz Costa',
    data: new Date('2024-08-27T14:30:00'),
    formaPagamento: 'Dinheiro'
  },
  {
    id: '12',
    tipo: 'Entrada',
    categoria: 'Nutrição',
    servicoId: '15',
    valor: 55.00,
    descricao: 'Tratamento nutritivo - Camila Ferreira',
    data: new Date('2024-08-27T11:00:00'),
    formaPagamento: 'Débito'
  },
  {
    id: '13',
    tipo: 'Saída',
    categoria: 'Energia Elétrica',
    valor: 120.00,
    descricao: 'Conta de luz - Agosto/2024',
    data: new Date('2024-08-26T15:00:00'),
    formaPagamento: 'Débito'
  },
  {
    id: '14',
    tipo: 'Entrada',
    categoria: 'Buço',
    servicoId: '16',
    valor: 15.00,
    descricao: 'Depilação de buço - Cliente regular',
    data: new Date('2024-08-26T10:15:00'),
    formaPagamento: 'Dinheiro'
  },
  {
    id: '15',
    tipo: 'Entrada',
    categoria: 'Reconstução',
    servicoId: '14',
    valor: 60.00,
    descricao: 'Reconstração capilar - Diana Alves',
    data: new Date('2024-08-26T08:30:00'),
    formaPagamento: 'PIX'
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
