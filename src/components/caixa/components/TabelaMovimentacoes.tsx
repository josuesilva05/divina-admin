import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { 
  TrendingUp, 
  TrendingDown, 
  Search,
  Eye,
  Edit,
  Trash2,
} from "lucide-react"
import { RegistroCaixa } from "@/types/caixa"

interface TabelaMovimentacoesProps {
  registros: RegistroCaixa[]
  onLimparFiltros: () => void
  itensPorPagina: number
  onEditarRegistro?: (registro: RegistroCaixa) => void
  onExcluirRegistro?: (id: number) => void
}

export function TabelaMovimentacoes({ 
  registros, 
  onLimparFiltros, 
  itensPorPagina,
  onEditarRegistro,
  onExcluirRegistro 
}: TabelaMovimentacoesProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value)
  }

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  return (
    <div className="rounded-md border">
  <div className="h-[440px] flex flex-col">
        {/* Cabeçalho da tabela fixo */}
        <div className="border-b bg-muted/50">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[140px]">Data/Hora</TableHead>
                <TableHead className="w-[100px]">Tipo</TableHead>
                <TableHead className="w-[180px]">Categoria</TableHead>
                <TableHead className="w-[250px]">Descrição</TableHead>
                <TableHead className="w-[120px]">Pagamento</TableHead>
                <TableHead className="w-[140px] text-right">Valor</TableHead>
                <TableHead className="w-[100px] text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
          </Table>
        </div>
        
        {/* Corpo da tabela com scroll */}
        <div className="flex-1 overflow-auto">
          <Table>
            <TableBody>
              {registros.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-12 h-[460px]">
                    <div className="flex flex-col items-center justify-center h-full gap-2">
                      <Search className="h-8 w-8 text-muted-foreground/50" />
                      <span>Nenhuma movimentação encontrada</span>
                      <Button variant="link" onClick={onLimparFiltros} className="text-sm">
                        Limpar filtros para ver todos os registros
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                <>
                  {registros.map((registro) => (
                      <TableRow key={registro.id} className="hover:bg-muted/50 h-10">
                        <TableCell className="font-mono text-sm w-[140px] py-1">
                        <div className="space-y-1">
                          <div className="font-medium">
                            {formatDate(registro.data).split(', ')[0]}
                          </div>
                        </div>
                      </TableCell>
                        <TableCell className="w-[100px] py-1">
                        <Badge 
                          variant={registro.tipo === 'Entrada' ? 'success' : 'destructive'}
                          className="font-medium"
                        >
                          {registro.tipo === 'Entrada' ? (
                            <TrendingUp className="mr-1 h-3 w-3" />
                          ) : (
                            <TrendingDown className="mr-1 h-3 w-3" />
                          )}
                          {registro.tipo}
                        </Badge>
                      </TableCell>
                        <TableCell className="w-[180px] py-1">
                        <Badge 
                          variant="outline" 
                          className={`font-normal ${
                            registro.tipo === 'Entrada' 
                              ? 'border-green-200 bg-green-50 text-green-700 dark:border-green-700 dark:bg-green-950 dark:text-green-300' 
                              : 'border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-700 dark:bg-orange-950 dark:text-orange-300'
                          }`}
                        >
                          <div className="truncate max-w-[140px]" title={registro.categoria}>
                            {registro.categoria}
                          </div>
                        </Badge>
                      </TableCell>
                        <TableCell className="w-[250px] py-1">
                        <div className="truncate max-w-[230px]" title={registro.descricao}>
                          {registro.descricao}
                        </div>
                      </TableCell>
                        <TableCell className="w-[120px] py-1">
                        <Badge 
                          variant="secondary"
                          className={`
                            ${registro.formaPagamento === 'PIX' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : ''}
                            ${registro.formaPagamento === 'Dinheiro' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : ''}
                            ${registro.formaPagamento === 'Cartão' || registro.formaPagamento === 'Crédito' || registro.formaPagamento === 'Débito' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' : ''}
                          `}
                        >
                          {registro.formaPagamento}
                        </Badge>
                      </TableCell>
                        <TableCell className="text-right w-[140px] py-1">
                        <div className={`font-mono font-semibold ${
                          registro.tipo === 'Entrada' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                        }`}>
                          <div className="text-base">
                            {registro.tipo === 'Entrada' ? '+' : '-'} {formatCurrency(registro.valor)}
                          </div>
                        </div>
                      </TableCell>
                        <TableCell className="text-right w-[100px] py-1">
                        <div className="flex items-center justify-end gap-1">
                          {/* <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Eye className="h-4 w-4" />
                          </Button> */}
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0"
                            onClick={() => onEditarRegistro?.(registro)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                            onClick={() => onExcluirRegistro?.(registro.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
