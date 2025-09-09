import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Badge } from '../ui/badge'
import { Separator } from '../ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Download, FileSpreadsheet, TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react'
import * as XLSX from 'xlsx'
import { relatoriosService, type RelatorioData, type RelatorioResumo } from '../../database/relatorios.service'

export function Relatorios() {
  const [dados, setDados] = useState<RelatorioData[]>([])
  const [resumo, setResumo] = useState<RelatorioResumo | null>(null)
  const [dataInicio, setDataInicio] = useState('')
  const [dataFim, setDataFim] = useState('')
  const [loading, setLoading] = useState(false)

  const carregarDados = async () => {
    setLoading(true)
    try {
      console.log('Carregando dados com filtros:', { dataInicio, dataFim })
      
      // Se não há filtros, primeiro vamos ver se há dados no banco
      if (!dataInicio && !dataFim) {
        console.log('Carregando todos os dados...')
      }
      
      // Verificar se a API de relatórios está disponível
      if (window.db?.relatorios?.getRelatorioCompleto) {
        console.log('Usando API de relatórios...')
        const dadosRelatorio = await window.db.relatorios.getRelatorioCompleto(
          dataInicio || undefined,
          dataFim || undefined
        )
        const resumoRelatorio = await window.db.relatorios.getRelatorioResumo(
          dataInicio || undefined,
          dataFim || undefined
        )
        
        console.log('Dados carregados:', dadosRelatorio.length, 'registros')
        if (dadosRelatorio.length > 0) {
          console.log('Primeiro registro:', dadosRelatorio[0])
          console.log('Data do primeiro registro:', dadosRelatorio[0].data)
        }
        
        setDados(dadosRelatorio)
        setResumo(resumoRelatorio)
      } else {
        console.log('API de relatórios não disponível. Usando fallback...')
        // Fallback: usar os dados do caixa diretamente
        const registrosCaixa = await window.db.caixa.getRegistros()
        
        // Filtrar por data se necessário
        let dadosFiltrados = registrosCaixa
        if (dataInicio || dataFim) {
          dadosFiltrados = registrosCaixa.filter(registro => {
            const dataRegistro = new Date(registro.data).toISOString().split('T')[0]
            if (dataInicio && dataFim) {
              return dataRegistro >= dataInicio && dataRegistro <= dataFim
            } else if (dataInicio) {
              return dataRegistro >= dataInicio
            } else if (dataFim) {
              return dataRegistro <= dataFim
            }
            return true
          })
        }
        
        // Converter para formato de relatório
        const dadosRelatorio = dadosFiltrados.map(registro => ({
          id: registro.id,
          data: registro.data.toISOString(),
          tipo: registro.tipo,
          categoria: registro.categoria,
          servico_nome: undefined,
          valor: registro.valor,
          descricao: registro.descricao,
          formaPagamento: registro.formaPagamento
        }))
        
        // Calcular resumo básico
        const totalEntradas = dadosRelatorio.filter(d => d.tipo === 'Entrada').reduce((sum, d) => sum + d.valor, 0)
        const totalSaidas = dadosRelatorio.filter(d => d.tipo === 'Saída').reduce((sum, d) => sum + d.valor, 0)
        
        const resumoBasico = {
          totalEntradas,
          totalSaidas,
          saldoTotal: totalEntradas - totalSaidas,
          totalTransacoes: dadosRelatorio.length,
          servicosMaisVendidos: [],
          receitaPorFormaPagamento: [],
          movimentacaoDiaria: []
        }
        
        setDados(dadosRelatorio)
        setResumo(resumoBasico)
        
        console.log('Dados carregados via fallback:', dadosRelatorio.length, 'registros')
      }
    } catch (error) {
      console.error('Erro ao carregar dados do relatório:', error)
      alert('Erro ao carregar dados. Tente reiniciar o aplicativo.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Verificar se a API está disponível
    console.log('Verificando API disponível:', {
      windowDb: !!window.db,
      relatorios: !!window.db?.relatorios,
      getRelatorioCompleto: !!window.db?.relatorios?.getRelatorioCompleto,
      getRelatorioResumo: !!window.db?.relatorios?.getRelatorioResumo
    })
    
    carregarDados()
  }, [])

  const aplicarFiltros = () => {
    carregarDados()
  }

  const limparFiltros = () => {
    setDataInicio('')
    setDataFim('')
    setTimeout(() => carregarDados(), 100)
  }

  const exportarParaExcel = () => {
    try {
      // Criar uma nova planilha
      const wb = XLSX.utils.book_new()
      
      // Dados detalhados - apenas os dados brutos da consulta com formatação mínima
      const dadosFormatados = dados.map(item => {
        const dataCompleta = new Date(item.data)
        return {
          'Tipo': item.tipo,
          'Categoria': item.categoria,
          'Valor': item.valor, // Manter como número para formatação monetária
          'Descrição': item.descricao,
          'Data': dataCompleta.toLocaleDateString('pt-BR'), // Formato dd/mm/aaaa
          'Horário': dataCompleta.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) // Formato HH:mm
        }
      })
      
      const wsDados = XLSX.utils.json_to_sheet(dadosFormatados)
      
      // Formatação da coluna de valor como moeda brasileira
      const range = XLSX.utils.decode_range(wsDados['!ref'] || 'A1')
      for (let R = range.s.r + 1; R <= range.e.r; ++R) {
        const cellAddress = XLSX.utils.encode_cell({ r: R, c: 2 }) // Coluna C (Valor)
        if (wsDados[cellAddress]) {
          wsDados[cellAddress].z = '"R$" #,##0.00' // Formato de moeda brasileira
        }
      }
      
      XLSX.utils.book_append_sheet(wb, wsDados, 'Dados')
      
      // Gerar nome do arquivo com data atual
      const agora = new Date()
      const nomeArquivo = `relatorio_${agora.getFullYear()}-${(agora.getMonth() + 1).toString().padStart(2, '0')}-${agora.getDate().toString().padStart(2, '0')}.xlsx`
      
      // Salvar arquivo
      XLSX.writeFile(wb, nomeArquivo)
    } catch (error) {
      console.error('Erro ao exportar para Excel:', error)
      alert('Erro ao exportar dados para Excel. Tente novamente.')
    }
  }

  const formatarMoeda = (valor: number) => {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR')
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Relatórios</h1>
          <p className="text-muted-foreground">
            Visualize e analise os dados financeiros do seu negócio
          </p>
        </div>
        <Button onClick={exportarParaExcel} className="gap-2">
          <FileSpreadsheet className="w-4 h-4" />
          Exportar para Excel
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros de Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-end">
            <div className="space-y-2">
              <Label htmlFor="dataInicio">Data Início</Label>
              <Input
                id="dataInicio"
                type="date"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
                className="w-40"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dataFim">Data Fim</Label>
              <Input
                id="dataFim"
                type="date"
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
                className="w-40"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={aplicarFiltros} disabled={loading}>
                {loading ? 'Carregando...' : 'Aplicar Filtros'}
              </Button>
              <Button variant="outline" onClick={limparFiltros}>
                Limpar Filtros
              </Button>
              <Button variant="secondary" onClick={() => {
                console.log('Testando carregamento sem filtros...')
                setDataInicio('')
                setDataFim('')
                setTimeout(carregarDados, 100)
              }}>
                Mostrar Todos
              </Button>
            </div>
          </div>
          {(dataInicio || dataFim) && (
            <div className="mt-4 p-3 bg-muted rounded-md">
              <p className="text-sm text-muted-foreground">
                Filtros ativos: 
                {dataInicio && ` A partir de ${new Date(dataInicio).toLocaleDateString('pt-BR')}`}
                {dataInicio && dataFim && ' até '}
                {dataFim && ` ${new Date(dataFim).toLocaleDateString('pt-BR')}`}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cards de Resumo */}
      {resumo && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <p className="text-sm font-medium text-muted-foreground">Total Entradas</p>
              </div>
              <p className="text-2xl font-bold text-green-600">
                {formatarMoeda(resumo.totalEntradas)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <TrendingDown className="w-4 h-4 text-red-600" />
                <p className="text-sm font-medium text-muted-foreground">Total Saídas</p>
              </div>
              <p className="text-2xl font-bold text-red-600">
                {formatarMoeda(resumo.totalSaidas)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <DollarSign className="w-4 h-4 text-blue-600" />
                <p className="text-sm font-medium text-muted-foreground">Saldo Total</p>
              </div>
              <p className={`text-2xl font-bold ${resumo.saldoTotal >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatarMoeda(resumo.saldoTotal)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-purple-600" />
                <p className="text-sm font-medium text-muted-foreground">Total Transações</p>
              </div>
              <p className="text-2xl font-bold text-purple-600">
                {resumo.totalTransacoes}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Serviços Mais Vendidos */}
        {resumo?.servicosMaisVendidos && resumo.servicosMaisVendidos.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Serviços Mais Vendidos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {resumo.servicosMaisVendidos.slice(0, 5).map((servico, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{servico.servico}</p>
                      <p className="text-sm text-muted-foreground">
                        {servico.quantidade} vendas
                      </p>
                    </div>
                    <Badge variant="secondary">
                      {formatarMoeda(servico.receita)}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Receita por Forma de Pagamento */}
        {resumo?.receitaPorFormaPagamento && resumo.receitaPorFormaPagamento.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Receita por Forma de Pagamento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {resumo.receitaPorFormaPagamento.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <p className="font-medium">{item.forma}</p>
                    <Badge variant="outline">
                      {formatarMoeda(item.valor)}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Tabela de Dados Detalhados */}
      <Card>
        <CardHeader>
          <CardTitle>
            Transações Detalhadas 
            {loading ? (
              <span className="text-sm font-normal text-muted-foreground ml-2">(Carregando...)</span>
            ) : (
              <span className="text-sm font-normal text-muted-foreground ml-2">
                ({dados.length} {dados.length === 1 ? 'registro' : 'registros'}
                {(dataInicio || dataFim) && ' filtrados'})
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Serviço</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead>Forma Pagamento</TableHead>
                  <TableHead>Descrição</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dados.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                      {loading ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full"></div>
                          Carregando dados...
                        </div>
                      ) : (dataInicio || dataFim) ? (
                        <div>
                          <p>Nenhum dado encontrado para o período selecionado</p>
                          <p className="text-xs mt-1">
                            Período: {dataInicio && new Date(dataInicio).toLocaleDateString('pt-BR')}
                            {dataInicio && dataFim && ' a '}
                            {dataFim && new Date(dataFim).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      ) : (
                        'Nenhum dado encontrado no banco de dados'
                      )}
                    </TableCell>
                  </TableRow>
                ) : (
                  dados.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{formatarData(item.data)}</TableCell>
                      <TableCell>
                        <Badge variant={item.tipo === 'Entrada' ? 'secondary' : 'destructive'}>
                          {item.tipo}
                        </Badge>
                      </TableCell>
                      <TableCell>{item.categoria}</TableCell>
                      <TableCell>{item.servico_nome || '-'}</TableCell>
                      <TableCell className={`text-right font-medium ${item.tipo === 'Entrada' ? 'text-green-600' : 'text-red-600'}`}>
                        {formatarMoeda(item.valor)}
                      </TableCell>
                      <TableCell>{item.formaPagamento}</TableCell>
                      <TableCell className="max-w-xs truncate">{item.descricao}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
