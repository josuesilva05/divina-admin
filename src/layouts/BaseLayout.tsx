import React from "react";
import DragWindowRegion from "@/components/DragWindowRegion";

export default function BaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <DragWindowRegion title="Cantinho das Unhas" />
      <main className="h-screen p-2 pb-20">{children}</main>
    </>
  );
}
