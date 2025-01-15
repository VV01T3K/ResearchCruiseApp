import { createContext } from "react"
import { CruiseApplication } from "CruiseApplication"

export const CruiseApplicationContext = createContext<CruiseApplication | null>(null)
