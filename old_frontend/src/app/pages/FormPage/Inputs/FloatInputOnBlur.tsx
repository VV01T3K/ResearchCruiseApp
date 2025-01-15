import { CellFormTools } from "@app/pages/FormPage/Inputs/TableParts"
import React from "react"
import { ParseFloatInput } from "@app/pages/FormPage/Inputs/Misc"

export const FloatInputOnBlur = () => {
  const { setCellValue, field } = CellFormTools()

  return (e: React.ChangeEvent<HTMLInputElement>) => {
    setCellValue(String(ParseFloatInput(e.target.value)))
    field!.onBlur(field!.value)
  }
}
