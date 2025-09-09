import { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  ArrowUpDown,
  Download,
  Plus,
  TrendingUp,
  TrendingDown,
} from 'lucide-react'
import { RegistroCaixa } from '@/types/caixa'

// Importar componentes modularizados
import { ResumoFinanceiro } from './components/ResumoFinanceiro'
import { FormularioMovimentacao } from './components/FormularioMovimentacao'
import { FiltrosComponent } from './components/FiltrosComponent'
import { TabelaMovimentacoes } from './components/TabelaMovimentacoes'
import { Paginacao } from './components/Paginacao'

// Importar hooks
import { useCaixaCalculos } from './hooks/useCaixaCalculos'
import { useFiltrosTabela } from './hooks/useFiltrosTabela'
import { usePaginacao } from './hooks/usePaginacao'

export function CaixaModule() {
  const [registros, setRegistros] = useState<RegistroCaixa[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [dialogEntradaOpen, setDialogEntradaOpen] = useState(false)
  const [dialogSaidaOpen, setDialogSaidaOpen] = useState(false)
  const [dialogEditarOpen, setDialogEditarOpen] = useState(false)
  const [registroEditando, setRegistroEditando] = useState<RegistroCaixa | null>(null)
  const [novoRegistro, setNovoRegistro] = useState({
    tipo: '' as 'Entrada' | 'Saída' | '',
    categoria: '',
    servicoId: '',
    valor: '',
    descricao: '',
    formaPagamento: '' as
      | 'Dinheiro'
      | 'Cartão'
      | 'PIX'
      | 'Débito'
      | 'Crédito'
      | '',
  })

  // Função para carregar dados do banco
  const carregarRegistros = async () => {
    try {
      setIsLoading(true)
      const data = await window.db.caixa.getRegistros()
      setRegistros(data)
    } catch (error) {
      console.error('Erro ao carregar registros:', error)
      setRegistros([])
    } finally {
      setIsLoading(false)
    }
  }

  // Carregar dados na inicialização
  useEffect(() => {
    carregarRegistros()
  }, [])

  // Usar hooks customizados
  const { filtros, setFiltros, registrosFiltrados, limparFiltros } =
    useFiltrosTabela(registros)
  const {
    paginaAtual,
    itensPorPagina,
    setItensPorPagina,
    totalPaginas,
    irParaPagina,
    resetarPagina,
    indiceInicio,
    indiceFim,
  } = usePaginacao(registrosFiltrados.length)

  const { resumo, estatisticas } = useCaixaCalculos(
    registros,
    registrosFiltrados,
  )

  // Registros paginados
  const registrosPaginados = registrosFiltrados.slice(indiceInicio, indiceFim)

  // Reset página quando filtros mudam
  useEffect(() => {
    resetarPagina()
  }, [filtros, resetarPagina])

  const handleSubmitRegistro = async (tipo: 'Entrada' | 'Saída') => {
    // Validação básica
    if (
      !novoRegistro.categoria ||
      !novoRegistro.valor ||
      !novoRegistro.descricao
    ) {
      return
    }

    // Para entradas, forma de pagamento é obrigatória
    if (tipo === 'Entrada' && !novoRegistro.formaPagamento) {
      return
    }

    try {
      setIsLoading(true)
      
      const registroParaSalvar = {
        tipo: tipo,
        categoria: novoRegistro.categoria,
        servicoId: novoRegistro.servicoId || undefined,
        valor: parseFloat(novoRegistro.valor),
        descricao: novoRegistro.descricao,
        formaPagamento: (
          tipo === 'Entrada'
            ? novoRegistro.formaPagamento
            : novoRegistro.formaPagamento || 'Dinheiro'
        ) as 'Dinheiro' | 'Cartão' | 'PIX' | 'Débito' | 'Crédito',
      }

      await window.db.caixa.addRegistro(registroParaSalvar)
      
      // Recarregar dados do banco após inserção
      await carregarRegistros()

      setNovoRegistro({
        tipo: '',
        categoria: '',
        servicoId: '',
        valor: '',
        descricao: '',
        formaPagamento: '',
      })
      setDialogEntradaOpen(false)
      setDialogSaidaOpen(false)
    } catch (error) {
      console.error('Erro ao salvar registro:', error)
    }
  }

  const handleOpenEntrada = () => {
    setNovoRegistro({
      tipo: 'Entrada',
      categoria: '',
      servicoId: '',
      valor: '',
      descricao: '',
      formaPagamento: '',
    })
    setDialogEntradaOpen(true)
  }

  const handleOpenSaida = () => {
    setNovoRegistro({
      tipo: 'Saída',
      categoria: '',
      servicoId: '',
      valor: '',
      descricao: '',
      formaPagamento: '',
    })
    setDialogSaidaOpen(true)
  }

  const handleEditarRegistro = (registro: RegistroCaixa) => {
    setRegistroEditando(registro)
    setNovoRegistro({
      tipo: registro.tipo,
      categoria: registro.categoria,
      servicoId: registro.servicoId?.toString() || '',
      valor: registro.valor.toString(),
      descricao: registro.descricao,
      formaPagamento: registro.formaPagamento,
    })
    setDialogEditarOpen(true)
  }

  const handleSubmitEdicao = async () => {
    if (!registroEditando) return

    try {
      setIsLoading(true)
      
      const updates = {
        tipo: novoRegistro.tipo as 'Entrada' | 'Saída',
        categoria: novoRegistro.categoria,
        servicoId: novoRegistro.servicoId || undefined,
        valor: parseFloat(novoRegistro.valor),
        descricao: novoRegistro.descricao,
        formaPagamento: novoRegistro.formaPagamento as 'Dinheiro' | 'Cartão' | 'PIX' | 'Débito' | 'Crédito',
      }

      await window.db.caixa.updateRegistro(registroEditando.id, updates)
      await carregarRegistros()

      setDialogEditarOpen(false)
      setRegistroEditando(null)
      setNovoRegistro({
        tipo: '',
        categoria: '',
        servicoId: '',
        valor: '',
        descricao: '',
        formaPagamento: '',
      })
    } catch (error) {
      console.error('Erro ao atualizar registro:', error)
    }
  }

  const handleExcluirRegistro = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este registro?')) return

    try {
      setIsLoading(true)
      await window.db.caixa.deleteRegistro(id)
      await carregarRegistros()
    } catch (error) {
      console.error('Erro ao excluir registro:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestão de Caixa</h1>
          <p className="text-muted-foreground">
            Controle suas movimentações financeiras
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Botão Nova Entrada */}
          <FormularioMovimentacao
            open={dialogEntradaOpen}
            onOpenChange={setDialogEntradaOpen}
            novoRegistro={novoRegistro}
            onRegistroChange={setNovoRegistro}
            onSubmit={() => handleSubmitRegistro('Entrada')}
            tipoMovimentacao="Entrada"
          >
            <Button
              onClick={handleOpenEntrada}
              className="bg-green-600 hover:bg-green-700"
              disabled={isLoading}
            >
              <TrendingUp className="mr-2 h-4 w-4" />
              Nova Entrada
            </Button>
          </FormularioMovimentacao>

          {/* Botão Nova Saída */}
          <FormularioMovimentacao
            open={dialogSaidaOpen}
            onOpenChange={setDialogSaidaOpen}
            novoRegistro={novoRegistro}
            onRegistroChange={setNovoRegistro}
            onSubmit={() => handleSubmitRegistro('Saída')}
            tipoMovimentacao="Saída"
          >
            <Button onClick={handleOpenSaida} variant="destructive" disabled={isLoading}>
              <TrendingDown className="mr-2 h-4 w-4" />
              Nova Saída
            </Button>
          </FormularioMovimentacao>
        </div>
      </div>

      {/* Cards de Resumo */}
      {/* <ResumoFinanceiro resumo={resumo} estatisticas={estatisticas} /> */}

      {/* Tabela de Movimentações */}
      <Card>
        <CardHeader className="pb-4 pt-4">
          <div className="flex flex-col gap-4 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-1">
                <CardTitle className="text-xl font-semibold">
                  Movimentações do Caixa
                </CardTitle>
                <CardDescription className="text-sm">
                  {isLoading ? (
                    'Carregando dados...'
                  ) : (
                    <>
                      Mostrando {registrosPaginados.length} de{' '}
                      {registrosFiltrados.length} movimentações
                      {registrosFiltrados.length !== registros.length &&
                        ` (${registros.length} total)`}
                    </>
                  )}
                </CardDescription>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <div className="flex items-center space-x-2">
                  <Label
                    htmlFor="items-per-page"
                    className="text-sm font-medium whitespace-nowrap"
                  >
                    Mostrar:
                  </Label>
                  <Select
                    value={itensPorPagina.toString()}
                    onValueChange={(value) => {
                      setItensPorPagina(Number(value))
                      resetarPagina()
                    }}
                  >
                    <SelectTrigger className="w-20 h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button variant="outline" className="h-10">
                  <ArrowUpDown className="mr-2 h-4 w-4" />
                  Ordenar
                </Button>
              </div>
            </div>

            {/* Filtros Integrados */}
            <div className="flex flex-col gap-4 pt-3 border-t border-border">
              <FiltrosComponent
                filtros={filtros}
                onFiltroChange={setFiltros}
                onLimparFiltros={limparFiltros}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <TabelaMovimentacoes
            registros={registrosPaginados}
            onLimparFiltros={limparFiltros}
            itensPorPagina={itensPorPagina}
            onEditarRegistro={handleEditarRegistro}
            onExcluirRegistro={handleExcluirRegistro}
          />

          {/* Rodapé da tabela com paginação */}
          <div className="border-t bg-muted/50 p-4">
            <Paginacao
              paginaAtual={paginaAtual}
              totalPaginas={totalPaginas}
              onMudarPagina={irParaPagina}
              totalRegistros={registrosFiltrados.length}
              registrosPagina={registrosPaginados.length}
            />
          </div>
        </CardContent>
      </Card>

      {/* Dialog de Edição */}
      <FormularioMovimentacao
        open={dialogEditarOpen}
        onOpenChange={setDialogEditarOpen}
        novoRegistro={novoRegistro}
        onRegistroChange={setNovoRegistro}
        onSubmit={handleSubmitEdicao}
        tipoMovimentacao={registroEditando?.tipo || 'Entrada'}
      />
    </div>
  )
}
