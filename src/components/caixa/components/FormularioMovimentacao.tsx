import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  DollarSign 
} from "lucide-react"
import { categoriasSaida } from "@/data/mockData"
import React, { useState, useEffect } from "react"

interface NovoRegistroData {
  tipo: 'Entrada' | 'Saída' | ''
  categoria: string
  servicoId: string
  valor: string
  descricao: string
  formaPagamento: 'Dinheiro' | 'Cartão' | 'PIX' | 'Débito' | 'Crédito' | ''
}

interface FormularioMovimentacaoProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  novoRegistro: NovoRegistroData
  onRegistroChange: (registro: NovoRegistroData) => void
  onSubmit: () => void
  tipoMovimentacao?: 'Entrada' | 'Saída'
  children?: React.ReactNode
}

export function FormularioMovimentacao({ 
  open, 
  onOpenChange, 
  novoRegistro, 
  onRegistroChange, 
  onSubmit,
  tipoMovimentacao,
  children
}: FormularioMovimentacaoProps) {
  const [servicos, setServicos] = useState<{
    id_servico: string
    nome: string
    preco: number
  }[]>([])
  const [isLoadingServicos, setIsLoadingServicos] = useState(false)

  // Carregar serviços do banco de dados
  useEffect(() => {
    async function carregarServicos() {
      try {
        setIsLoadingServicos(true)
        const servicosData = await window.db.servicos.getServicos()
        setServicos(servicosData)
      } catch (error) {
        console.error('Erro ao carregar serviços:', error)
        setServicos([])
      } finally {
        setIsLoadingServicos(false)
      }
    }
    
    if (open) {
      carregarServicos()
    }
  }, [open])
  
  // Garantir que o tipo seja definido quando tipoMovimentacao for fornecido
  React.useEffect(() => {
    if (tipoMovimentacao && open && !novoRegistro.tipo) {
      onRegistroChange({...novoRegistro, tipo: tipoMovimentacao})
    }
  }, [tipoMovimentacao, open, novoRegistro.tipo])
  
  // Opções de categoria baseadas no tipo selecionado
  const getCategoriaOptions = () => {
    const tipoAtual = tipoMovimentacao || novoRegistro.tipo
    if (tipoAtual === 'Entrada') {
      return servicos.map(s => ({ 
        value: s.nome, 
        label: s.nome, 
        preco: s.preco,
        id: s.id_servico 
      }))
    } else {
      return categoriasSaida.map(cat => ({ 
        value: cat, 
        label: cat,
        preco: undefined
      }))
    }
  }

  const handleCategoriaChange = (categoria: string) => {
    const servico = servicos.find(s => s.nome === categoria)
    onRegistroChange({
      ...novoRegistro, 
      categoria,
      servicoId: servico?.id_servico || '',
      // Preenche o valor automaticamente, mas permite edição
      valor: servico?.preco.toString() || ''
    })
  }

  const isFormValid = () => {
    const tipoAtual = tipoMovimentacao || novoRegistro.tipo
    const temTipo = !!tipoAtual
    const temCategoria = !!novoRegistro.categoria
    const temValor = !!novoRegistro.valor
    const temDescricao = !!novoRegistro.descricao
    
    // Para entradas, forma de pagamento é obrigatória
    if (tipoAtual === 'Entrada') {
      return temTipo && temCategoria && temValor && temDescricao && !!novoRegistro.formaPagamento
    }
    
    // Para saídas, forma de pagamento não é necessária
    return temTipo && temCategoria && temValor && temDescricao
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {tipoMovimentacao ? `Nova ${tipoMovimentacao}` : 'Nova Movimentação'}
          </DialogTitle>
          <DialogDescription>
            {tipoMovimentacao 
              ? `Registre uma nova ${tipoMovimentacao.toLowerCase()} no caixa`
              : 'Registre uma nova entrada ou saída no caixa'
            }
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo *</Label>
              <Select 
                value={tipoMovimentacao || novoRegistro.tipo} 
                onValueChange={(value: 'Entrada' | 'Saída') => onRegistroChange({...novoRegistro, tipo: value})}
                disabled={!!tipoMovimentacao}
              >
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Entrada">
                    <div className="flex items-center">
                      <TrendingUp className="mr-2 h-4 w-4 text-green-700" />
                      Entrada
                    </div>
                  </SelectItem>
                  <SelectItem value="Saída">
                    <div className="flex items-center">
                      <TrendingDown className="mr-2 h-4 w-4 text-red-500" />
                      Saída
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* Só mostra forma de pagamento para Entradas */}
            {(tipoMovimentacao === 'Entrada' || novoRegistro.tipo === 'Entrada') && (
              <div className="space-y-2">
                <Label htmlFor="formaPagamento">Forma de Pagamento *</Label>
                <Select value={novoRegistro.formaPagamento} onValueChange={(value: any) => onRegistroChange({...novoRegistro, formaPagamento: value})}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Dinheiro">💵 Dinheiro</SelectItem>
                    <SelectItem value="Cartão">💳 Cartão</SelectItem>
                    <SelectItem value="PIX">📱 PIX</SelectItem>
                    <SelectItem value="Débito">💳 Débito</SelectItem>
                    <SelectItem value="Crédito">💳 Crédito</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="categoria">
              {(tipoMovimentacao === 'Entrada' || novoRegistro.tipo === 'Entrada') ? 'Serviço *' : 'Categoria *'}
            </Label>
            {/* Para Entradas: Select com serviços */}
            {(tipoMovimentacao === 'Entrada' || novoRegistro.tipo === 'Entrada') && (
              <>
                <Select 
                  value={novoRegistro.categoria} 
                  onValueChange={handleCategoriaChange}
                  disabled={!novoRegistro.tipo && !tipoMovimentacao}
                >
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder={
                      isLoadingServicos 
                        ? "Carregando serviços..." 
                        : "Selecione o serviço"
                    } />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {isLoadingServicos ? (
                      <div className="p-2 text-center text-sm text-muted-foreground">
                        Carregando serviços...
                      </div>
                    ) : getCategoriaOptions().length === 0 ? (
                      <div className="p-2 text-center text-sm text-muted-foreground">
                        Nenhum serviço encontrado
                      </div>
                    ) : (
                      getCategoriaOptions().map((opcao: {
                        value: string
                        label: string
                        preco?: number
                        id?: string
                      }) => (
                        <SelectItem key={opcao.value} value={opcao.value}>
                          <div className="flex items-center justify-between w-full">
                            <span>{opcao.label}</span>
                            {opcao.preco && (
                              <span className="text-sm text-muted-foreground ml-2">
                                R$ {opcao.preco.toFixed(2)}
                              </span>
                            )}
                          </div>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  O valor será sugerido automaticamente baseado no serviço, mas pode ser editado
                </p>
              </>
            )}
            {/* Para Saídas: Input de texto livre */}
            {(tipoMovimentacao === 'Saída' || novoRegistro.tipo === 'Saída') && (
              <>
                <Input
                  id="categoria"
                  placeholder="Digite a categoria da saída..."
                  className="h-10"
                  value={novoRegistro.categoria}
                  onChange={(e) => onRegistroChange({...novoRegistro, categoria: e.target.value})}
                />
                <p className="text-xs text-muted-foreground">
                  Ex: Aluguel, Material, Salário, etc.
                </p>
              </>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="valor">Valor *</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="valor"
                type="number"
                step="0.01"
                placeholder="0,00"
                className="pl-10 h-10"
                value={novoRegistro.valor}
                onChange={(e) => onRegistroChange({...novoRegistro, valor: e.target.value})}
              />
            </div>
            {(tipoMovimentacao === 'Entrada' || novoRegistro.tipo === 'Entrada') && novoRegistro.categoria && (
              <p className="text-xs text-muted-foreground">
                Valor sugerido baseado no serviço selecionado, mas pode ser alterado
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição *</Label>
            <Textarea
              id="descricao"
              placeholder="Descreva a movimentação..."
              className="resize-none"
              rows={3}
              value={novoRegistro.descricao}
              onChange={(e) => onRegistroChange({...novoRegistro, descricao: e.target.value})}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button 
            type="submit" 
            onClick={onSubmit}
            disabled={!isFormValid()}
          >
            Registrar Movimentação
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
