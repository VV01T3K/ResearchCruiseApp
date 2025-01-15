import { createContext } from "react"
import { FieldValues } from "react-hook-form"

export const FieldContext = createContext<null | FieldValues>(null)
