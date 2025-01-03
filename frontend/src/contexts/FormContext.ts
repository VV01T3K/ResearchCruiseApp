import { createContext } from "react"

import { FormContextFields } from "@app/pages/FormPage/Wrappers/FormTemplate"

export const FormContext = createContext<FormContextFields | null>(null)
