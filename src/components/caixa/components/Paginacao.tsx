import { Button } from "@/components/ui/button"
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"

interface PaginacaoProps {
  paginaAtual: number
  totalPaginas: number
  onMudarPagina: (pagina: number) => void
  totalRegistros: number
  registrosPagina: number
}

export function Paginacao({ 
  paginaAtual, 
  totalPaginas, 
  onMudarPagina, 
  totalRegistros, 
  registrosPagina 
}: PaginacaoProps) {
  
  const irParaPagina = (pagina: number) => {
    onMudarPagina(Math.max(1, Math.min(pagina, totalPaginas)))
  }

  const proximaPagina = () => {
    if (paginaAtual < totalPaginas) {
      onMudarPagina(paginaAtual + 1)
    }
  }

  const paginaAnterior = () => {
    if (paginaAtual > 1) {
      onMudarPagina(paginaAtual - 1)
    }
  }

  if (totalPaginas <= 1) {
    return (
      <div className="text-sm text-muted-foreground">
        {totalRegistros} registros
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-muted-foreground">
        Página {paginaAtual} de {totalPaginas} • {totalRegistros} registros
      </div>
      
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => irParaPagina(1)}
          disabled={paginaAtual === 1}
          className="h-8 w-8 p-0"
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={paginaAnterior}
          disabled={paginaAtual === 1}
          className="h-8 w-8 p-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div className="flex items-center space-x-1">
          {Array.from({ length: Math.min(5, totalPaginas) }, (_, i) => {
            let pageNumber
            if (totalPaginas <= 5) {
              pageNumber = i + 1
            } else if (paginaAtual <= 3) {
              pageNumber = i + 1
            } else if (paginaAtual >= totalPaginas - 2) {
              pageNumber = totalPaginas - 4 + i
            } else {
              pageNumber = paginaAtual - 2 + i
            }
            
            return (
              <Button
                key={pageNumber}
                variant={paginaAtual === pageNumber ? "default" : "outline"}
                size="sm"
                onClick={() => irParaPagina(pageNumber)}
                className="h-8 w-8 p-0"
              >
                {pageNumber}
              </Button>
            )
          })}
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={proximaPagina}
          disabled={paginaAtual === totalPaginas}
          className="h-8 w-8 p-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => irParaPagina(totalPaginas)}
          disabled={paginaAtual === totalPaginas}
          className="h-8 w-8 p-0"
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
