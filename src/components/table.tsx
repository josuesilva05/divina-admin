import { Table, TableHeader, TableRow, TableBody, TableCell, TableHead } from "./ui/table";
import { mockDashboardMetrics } from "@/data/mockData";
import { formatCurrency } from "@/lib/utils";

export default function ServicosMaisProcuradosTable() {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Serviço</TableHead>
                    <TableHead>Quantidade</TableHead>
                    <TableHead>Valor</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {mockDashboardMetrics.servicosMaisVendidos.map((servico, index) => (
                    <TableRow key={index}>
                        <TableCell>{servico.servico}</TableCell>
                        <TableCell>{servico.quantidade}</TableCell>
                        <TableCell>{formatCurrency(servico.receita)}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
