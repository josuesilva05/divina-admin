import { useState } from 'react'
import { useServicos } from '@/hooks/useServicos'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog'
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Plus, Edit, Trash2, Loader2, Settings } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'

interface ServicoFormData {
  nome: string
  preco: string
}

interface ServicoEditData {
  id_servico: string
  nome: string
  preco: number
}

export function ServicosDisponiveis() {
  const { servicos, loading, error, criarServico, atualizarServico, excluirServico } = useServicos()
  
  const [dialogAberto, setDialogAberto] = useState(false)
  const [dialogEdicaoAberto, setDialogEdicaoAberto] = useState(false)
  const [servicoEditando, setServicoEditando] = useState<ServicoEditData | null>(null)
  const [enviandoForm, setEnviandoForm] = useState(false)
  
  const [formData, setFormData] = useState<ServicoFormData>({
    nome: '',
    preco: ''
  })

  const resetForm = () => {
    setFormData({ nome: '', preco: '' })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.nome.trim() || !formData.preco.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos",
        variant: "destructive"
      })
      return
    }

    const preco = parseFloat(formData.preco.replace(',', '.'))
    if (isNaN(preco) || preco <= 0) {
      toast({
        title: "Erro",
        description: "Por favor, insira um preço válido",
        variant: "destructive"
      })
      return
    }

    try {
      setEnviandoForm(true)
      await criarServico({
        nome: formData.nome.trim(),
        preco: preco
      })
      
      toast({
        title: "Sucesso",
        description: "Serviço criado com sucesso!"
      })
      
      resetForm()
      setDialogAberto(false)
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao criar serviço",
        variant: "destructive"
      })
    } finally {
      setEnviandoForm(false)
    }
  }

  const handleEditar = (servico: any) => {
    setServicoEditando({
      id_servico: servico.id_servico,
      nome: servico.nome,
      preco: servico.preco
    })
    setDialogEdicaoAberto(true)
  }

  const handleSubmitEdicao = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!servicoEditando) return

    if (!servicoEditando.nome.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, preencha o nome do serviço",
        variant: "destructive"
      })
      return
    }

    if (servicoEditando.preco <= 0) {
      toast({
        title: "Erro",
        description: "Por favor, insira um preço válido",
        variant: "destructive"
      })
      return
    }

    try {
      setEnviandoForm(true)
      await atualizarServico(servicoEditando.id_servico, {
        nome: servicoEditando.nome.trim(),
        preco: servicoEditando.preco
      })
      
      toast({
        title: "Sucesso",
        description: "Serviço atualizado com sucesso!"
      })
      
      setDialogEdicaoAberto(false)
      setServicoEditando(null)
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar serviço",
        variant: "destructive"
      })
    } finally {
      setEnviandoForm(false)
    }
  }

  const handleExcluir = async (id: string, nome: string) => {
    try {
      await excluirServico(id)
      toast({
        title: "Sucesso",
        description: `Serviço "${nome}" excluído com sucesso!`
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao excluir serviço",
        variant: "destructive"
      })
    }
  }

  const formatarPreco = (preco: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(preco)
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Serviços Disponíveis</span>
          </CardTitle>
          <CardDescription>
            Gerencie os serviços disponíveis em seu estabelecimento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Serviços Disponíveis</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-red-500">{error}</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between w-full mt-4 mb-4">
          <div>
            <CardTitle className="flex items-center space-x-2 mb-1">
              <Settings className="h-5 w-5" />
              <span>Serviços Disponíveis</span>
            </CardTitle>
            <CardDescription>
              Gerencie os serviços disponíveis em seu estabelecimento
            </CardDescription>
          </div>
          
          <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Novo Serviço
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Novo Serviço</DialogTitle>
                <DialogDescription>
                  Adicione um novo serviço ao seu catálogo
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="nome">Nome do Serviço</Label>
                    <Input
                      id="nome"
                      value={formData.nome}
                      onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                      placeholder="Ex: Corte Masculino"
                      disabled={enviandoForm}
                    />
                  </div>
                  <div>
                    <Label htmlFor="preco">Preço (R$)</Label>
                    <Input
                      id="preco"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.preco}
                      onChange={(e) => setFormData(prev => ({ ...prev, preco: e.target.value }))}
                      placeholder="0,00"
                      disabled={enviandoForm}
                    />
                  </div>
                </div>
                <DialogFooter className="mt-6">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setDialogAberto(false)}
                    disabled={enviandoForm}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={enviandoForm}>
                    {enviandoForm && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Criar Serviço
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      
      <CardContent>
        {servicos.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Nenhum serviço cadastrado</p>
            <p className="text-sm">Clique em "Novo Serviço" para começar</p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome do Serviço</TableHead>
                  <TableHead className="text-right">Preço</TableHead>
                  <TableHead className="w-[100px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {servicos.map((servico) => (
                  <TableRow key={servico.id_servico}>
                    <TableCell className="font-medium">{servico.nome}</TableCell>
                    <TableCell className="text-right font-mono">
                      {formatarPreco(servico.preco)}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditar(servico)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir o serviço "{servico.nome}"? 
                                Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleExcluir(servico.id_servico, servico.nome)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      {/* Dialog de Edição */}
      <Dialog open={dialogEdicaoAberto} onOpenChange={setDialogEdicaoAberto}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Serviço</DialogTitle>
            <DialogDescription>
              Altere as informações do serviço
            </DialogDescription>
          </DialogHeader>
          {servicoEditando && (
            <form onSubmit={handleSubmitEdicao}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-nome">Nome do Serviço</Label>
                  <Input
                    id="edit-nome"
                    value={servicoEditando.nome}
                    onChange={(e) => setServicoEditando(prev => 
                      prev ? { ...prev, nome: e.target.value } : null
                    )}
                    disabled={enviandoForm}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-preco">Preço (R$)</Label>
                  <Input
                    id="edit-preco"
                    type="number"
                    step="0.01"
                    min="0"
                    value={servicoEditando.preco}
                    onChange={(e) => setServicoEditando(prev => 
                      prev ? { ...prev, preco: parseFloat(e.target.value) || 0 } : null
                    )}
                    disabled={enviandoForm}
                  />
                </div>
              </div>
              <DialogFooter className="mt-6">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setDialogEdicaoAberto(false)
                    setServicoEditando(null)
                  }}
                  disabled={enviandoForm}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={enviandoForm}>
                  {enviandoForm && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Salvar Alterações
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  )
}
