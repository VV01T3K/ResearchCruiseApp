import { ContextUseStateType } from "ContextUseStateType"
import { createContext } from "react"

export const UseStateContext = <T>() => createContext<ContextUseStateType<T> | null>(null)
