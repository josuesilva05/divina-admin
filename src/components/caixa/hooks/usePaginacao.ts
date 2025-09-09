import { useState, useMemo } from "react"

export function usePaginacao(totalItens: number, itensPorPaginaInicial: number = 10) {
  const [paginaAtual, setPaginaAtual] = useState(1)
  const [itensPorPagina, setItensPorPagina] = useState(itensPorPaginaInicial)

  const totalPaginas = Math.ceil(totalItens / itensPorPagina)

  const irParaPagina = (pagina: number) => {
    setPaginaAtual(Math.max(1, Math.min(pagina, totalPaginas)))
  }

  const resetarPagina = () => {
    setPaginaAtual(1)
  }

  const indiceInicio = (paginaAtual - 1) * itensPorPagina
  const indiceFim = indiceInicio + itensPorPagina

  return {
    paginaAtual,
    setPaginaAtual,
    itensPorPagina,
    setItensPorPagina,
    totalPaginas,
    irParaPagina,
    resetarPagina,
    indiceInicio,
    indiceFim
  }
}
