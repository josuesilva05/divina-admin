import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Plus, TrendingUp, TrendingDown, DollarSign } from "lucide-react"
import { mockRegistrosCaixa } from "@/data/mockData"
import { RegistroCaixa } from "@/types"

export function CaixaModule() {
  const [registros, setRegistros] = useState<RegistroCaixa[]>(mockRegistrosCaixa)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [novoRegistro, setNovoRegistro] = useState({
    tipo: '' as 'Entrada' | 'Saída',
    categoria: '' as 'Serviço' | 'Produto' | 'Despesa' | 'Comissão',
    valor: '',
    descricao: '',
    formaPagamento: '' as 'Dinheiro' | 'Cartão' | 'PIX' | 'Débito' | 'Crédito'
  })

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
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

  const calcularResumo = () => {
    const entradas = registros
      .filter(r => r.tipo === 'Entrada')
      .reduce((acc, r) => acc + r.valor, 0)
    
    const saidas = registros
      .filter(r => r.tipo === 'Saída')
      .reduce((acc, r) => acc + r.valor, 0)
    
    return {
      entradas,
      saidas,
      saldo: entradas - saidas
    }
  }

  const handleSubmitRegistro = () => {
    if (!novoRegistro.tipo || !novoRegistro.categoria || !novoRegistro.valor || !novoRegistro.descricao || !novoRegistro.formaPagamento) {
      return
    }

    const registro: RegistroCaixa = {
      id: Date.now().toString(),
      tipo: novoRegistro.tipo,
      categoria: novoRegistro.categoria,
      valor: parseFloat(novoRegistro.valor),
      descricao: novoRegistro.descricao,
      data: new Date(),
      formaPagamento: novoRegistro.formaPagamento
    }

    setRegistros([registro, ...registros])
    setNovoRegistro({
      tipo: '' as any,
      categoria: '' as any,
      valor: '',
      descricao: '',
      formaPagamento: '' as any
    })
    setDialogOpen(false)
  }

  const resumo = calcularResumo()

  return (
    <div className="space-y-6">
      {/* Cards de Resumo */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Entradas
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(resumo.entradas)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Saídas
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(resumo.saidas)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Registro de Movimentações */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Movimentações do Caixa</CardTitle>
              <CardDescription>
                Registre entradas e saídas do caixa
              </CardDescription>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Nova Movimentação
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Nova Movimentação</DialogTitle>
                  <DialogDescription>
                    Registre uma nova entrada ou saída no caixa
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="tipo">Tipo</Label>
                      <Select value={novoRegistro.tipo} onValueChange={(value: 'Entrada' | 'Saída') => setNovoRegistro({...novoRegistro, tipo: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Entrada">Entrada</SelectItem>
                          <SelectItem value="Saída">Saída</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="categoria">Categoria</Label>
                      <Select value={novoRegistro.categoria} onValueChange={(value: any) => setNovoRegistro({...novoRegistro, categoria: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Serviço">Serviço</SelectItem>
                          <SelectItem value="Produto">Produto</SelectItem>
                          <SelectItem value="Despesa">Despesa</SelectItem>
                          <SelectItem value="Comissão">Comissão</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="valor">Valor</Label>
                    <Input
                      id="valor"
                      type="number"
                      step="0.01"
                      placeholder="0,00"
                      value={novoRegistro.valor}
                      onChange={(e) => setNovoRegistro({...novoRegistro, valor: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="formaPagamento">Forma de Pagamento</Label>
                    <Select value={novoRegistro.formaPagamento} onValueChange={(value: any) => setNovoRegistro({...novoRegistro, formaPagamento: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Dinheiro">Dinheiro</SelectItem>
                        <SelectItem value="Cartão">Cartão</SelectItem>
                        <SelectItem value="PIX">PIX</SelectItem>
                        <SelectItem value="Débito">Débito</SelectItem>
                        <SelectItem value="Crédito">Crédito</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="descricao">Descrição</Label>
                    <Textarea
                      id="descricao"
                      placeholder="Descreva a movimentação..."
                      value={novoRegistro.descricao}
                      onChange={(e) => setNovoRegistro({...novoRegistro, descricao: e.target.value})}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" onClick={handleSubmitRegistro}>
                    Registrar
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data/Hora</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Pagamento</TableHead>
                <TableHead className="text-right">Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {registros.map((registro) => (
                <TableRow key={registro.id}>
                  <TableCell className="text-sm">
                    {formatDate(registro.data)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={registro.tipo === 'Entrada' ? 'primary' : 'destructive'}>
                      {registro.tipo === 'Entrada' ? (
                        <TrendingUp className="mr-1 h-3 w-3" />
                      ) : (
                        <TrendingDown className="mr-1 h-3 w-3" />
                      )}
                      {registro.tipo}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {registro.categoria}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {registro.formaPagamento}
                    </Badge>
                  </TableCell>
                  <TableCell className={`text-right font-medium ${
                    registro.tipo === 'Entrada' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {registro.tipo === 'Entrada' ? '+' : '-'}{formatCurrency(registro.valor)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
