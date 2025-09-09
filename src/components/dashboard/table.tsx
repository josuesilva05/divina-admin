import { Table, TableHeader, TableRow, TableBody, TableCell, TableHead } from "../ui/table";
import { formatCurrency } from "@/lib/utils";

interface ServicosMaisProcuradosTableProps {
  servicosMaisVendidos: Array<{
    servico: string
    quantidade: number
    receita: number
  }>
  isLoading?: boolean
}

export default function ServicosMaisProcuradosTable({ 
  servicosMaisVendidos, 
  isLoading = false 
}: ServicosMaisProcuradosTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex justify-between items-center p-2">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-32"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-8"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
          </div>
        ))}
      </div>
    )
  }

  if (servicosMaisVendidos.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Nenhum serviço encontrado no período.</p>
        <p className="text-sm">Os dados aparecerão após registros de entrada serem criados.</p>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Serviço</TableHead>
          <TableHead className="text-center">Quantidade</TableHead>
          <TableHead className="text-right">Valor Total</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {servicosMaisVendidos.map((servico, index) => (
          <TableRow key={index}>
            <TableCell className="font-medium">{servico.servico}</TableCell>
            <TableCell className="text-center">{servico.quantidade}</TableCell>
            <TableCell className="text-right font-medium">
              {formatCurrency(servico.receita)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
