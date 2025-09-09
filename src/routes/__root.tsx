import React from "react";
import { Layout } from "@/components/layout";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { ThemeProvider } from "@/components/theme-provider";

export const RootRoute = createRootRoute({
  component: Root,
});

function Root() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Layout />
    </ThemeProvider>
  );
}
