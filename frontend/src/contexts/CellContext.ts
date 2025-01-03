import { createContext } from "react"

export const CellContext = createContext<null | {
  rowIndex: number
  colIndex: number
}>(null)
