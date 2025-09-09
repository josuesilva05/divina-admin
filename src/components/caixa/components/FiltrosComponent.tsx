import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, Filter } from "lucide-react"
import { DatePicker } from "./DatePicker"

interface FiltrosTabela {
  tipo: 'Todos' | 'Entrada' | 'Saída'
  data: Date | undefined
  busca: string
}

interface FiltrosComponentProps {
  filtros: FiltrosTabela
  onFiltroChange: (filtros: FiltrosTabela) => void
  onLimparFiltros: () => void
}

export function FiltrosComponent({ filtros, onFiltroChange, onLimparFiltros }: FiltrosComponentProps) {
  const handleTipoChange = (tipo: 'Todos' | 'Entrada' | 'Saída') => {
    onFiltroChange({ ...filtros, tipo })
  }

  const handleDataChange = (data: Date | undefined) => {
    onFiltroChange({ ...filtros, data })
  }

  const handleBuscaChange = (busca: string) => {
    onFiltroChange({ ...filtros, busca })
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Campo de Busca */}
      <div className="space-y-2 sm:col-span-2 lg:col-span-1">
        <Label htmlFor="busca" className="text-sm font-medium">Buscar</Label>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="busca"
            placeholder="Descrição ou categoria..."
            className="pl-10 h-10"
            value={filtros.busca}
            onChange={(e) => handleBuscaChange(e.target.value)}
          />
        </div>
      </div>
      
      {/* Filtro por Tipo */}
      <div className="space-y-2">
        <Label htmlFor="filtro-tipo" className="text-sm font-medium">Tipo</Label>
        <Select value={filtros.tipo} onValueChange={handleTipoChange}>
          <SelectTrigger className="h-10">
            <SelectValue placeholder="Selecione o tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Todos">Todos</SelectItem>
            <SelectItem value="Entrada">Entradas</SelectItem>
            <SelectItem value="Saída">Saídas</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Filtro por Data */}
      <div className="space-y-2">
        <DatePicker
          date={filtros.data}
          onDateChange={handleDataChange}
          placeholder="Selecionar data"
          label="Data"
          id="filtro-data"
        />
      </div>
      
      {/* Botão Limpar Filtros */}
      <div className="space-y-2">
        <Label className="text-sm font-medium opacity-0 hidden lg:block">Ações</Label>
        <Button variant="outline" onClick={onLimparFiltros} className="w-full h-10">
          <Filter className="mr-2 h-4 w-4" />
          Limpar Filtros
        </Button>
      </div>
    </div>
  )
}
