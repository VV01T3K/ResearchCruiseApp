import React from "react"
import { SectionFieldNames } from "./SectionFieldNames"

export type SectionWrapperProps = {
  shortTitle: string
  longTitle: string
  children: React.ReactNode
  sectionFieldNames?: SectionFieldNames
}
