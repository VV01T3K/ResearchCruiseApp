import { useContext, useEffect, useRef } from "react"
import { FormContext } from "@contexts/FormContext"

// TODO Right handling focus in form
export const GetFocusRef = <T extends HTMLSelectElement | HTMLDivElement>(fieldName: string) => {
  const formContext = useContext(FormContext)
  const inputRef = useRef<T>(null)
  useEffect(() => {
    if (
      formContext?.formState.errors[fieldName] == formContext?.formState.errors[0] &&
      inputRef.current
    ) {
      inputRef.current.focus()
    }
  }, [formContext?.formState.errors, fieldName])
  return inputRef
}
