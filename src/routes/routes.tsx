import { createRoute } from "@tanstack/react-router";
import { RootRoute } from "./__root";
import { Dashboard } from "../components/dashboard/dashboard";
import { CaixaModule } from "../components/caixa/caixa";
import { Configuracoes } from "../components/configuracoes";
import { Relatorios } from "../components/relatorios";

// TODO: Steps to add a new route:
// 1. Create a new page component in the '../components/' directory (e.g., NewPage.tsx)
// 2. Import the new page component at the top of this file
// 3. Define a new route for the page using createRoute()
// 4. Add the new route to the routeTree in RootRoute.addChildren([...])
// 5. Add a new Link in the navigation section of RootRoute if needed

export const DashboardRoute = createRoute({
  getParentRoute: () => RootRoute,
  path: "/",
  component: Dashboard,
});

export const DashboardPageRoute = createRoute({
  getParentRoute: () => RootRoute,
  path: "/dashboard",
  component: Dashboard,
});

export const CaixaRoute = createRoute({
  getParentRoute: () => RootRoute,
  path: "/caixa",
  component: CaixaModule,
});

export const RelatoriosRoute = createRoute({
  getParentRoute: () => RootRoute,
  path: "/relatorios",
  component: Relatorios,
});

export const ConfiguracoesRoute = createRoute({
  getParentRoute: () => RootRoute,
  path: "/configuracoes",
  component: Configuracoes,
});

export const rootTree = RootRoute.addChildren([
  DashboardRoute,
  DashboardPageRoute,
  CaixaRoute,
  RelatoriosRoute,
  ConfiguracoesRoute,
]);
