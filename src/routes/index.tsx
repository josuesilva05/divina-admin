import { createBrowserRouter } from "react-router-dom"
import { Dashboard } from "../components/dashboard"
import { CaixaModule } from "../components/caixa"
import { Configuracoes } from "../components/configuracoes"
import { Layout } from "@/components/layout"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "caixa",
        element: <CaixaModule />,
      },
      {
        path: "relatorios",
        element: (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Módulo de Relatórios em desenvolvimento...</p>
          </div>
        ),
      },
      {
        path: "configuracoes",
        element: <Configuracoes />,
      },
    //   {
    //     path: "agenda",
    //     element: (
    //       <div className="flex items-center justify-center h-64">
    //         <p className="text-muted-foreground">Módulo de Agenda em desenvolvimento...</p>
    //       </div>
    //     ),
    //   },
    //   {
    //     path: "clientes",
    //     element: (
    //       <div className="flex items-center justify-center h-64">
    //         <p className="text-muted-foreground">Módulo de Clientes em desenvolvimento...</p>
    //       </div>
    //     ),
    //   },
    //   {
    //     path: "servicos",
    //     element: (
    //       <div className="flex items-center justify-center h-64">
    //         <p className="text-muted-foreground">Módulo de Serviços em desenvolvimento...</p>
    //       </div>
    //     ),
    //   },
    //   {
    //     path: "produtos",
    //     element: (
    //       <div className="flex items-center justify-center h-64">
    //         <p className="text-muted-foreground">Módulo de Produtos em desenvolvimento...</p>
    //       </div>
    //     ),
    //   },
    //   {
    //     path: "financeiro",
    //     element: (
    //       <div className="flex items-center justify-center h-64">
    //         <p className="text-muted-foreground">Módulo Financeiro em desenvolvimento...</p>
    //       </div>
    //     ),
    //   },
    ],
  },
])
