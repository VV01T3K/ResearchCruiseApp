import React, { useContext } from "react"
import { IsSectionActiveContext } from "@contexts/IsSectionActiveContext"

export const SectionContent = (props: { children: React.ReactNode }) => {
  const [isActive] = useContext(IsSectionActiveContext)!
  return <div className={isActive ? "form-section-children" : "d-none"}>{props.children}</div>
}
