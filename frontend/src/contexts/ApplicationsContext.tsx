import { createContext } from "react"

import { CruiseApplication } from "CruiseApplication"

export const ApplicationsContext = createContext<CruiseApplication[] | undefined>(undefined)
