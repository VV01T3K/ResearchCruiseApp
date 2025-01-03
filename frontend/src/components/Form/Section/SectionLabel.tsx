import { useContext } from "react"
import { SectionTitle } from "./SectionTitle"
import { ExpansionMark } from "./SectionExpansionMark"
import { IsSectionActiveContext } from "@contexts/IsSectionActiveContext"
import { IsSectionCompletedContext } from "@contexts/IsSectionCompletedContext"

export const SectionLabel = () => {
  const [isActive, setIsActive] = useContext(IsSectionActiveContext)!
  const [isCompleted] = useContext(IsSectionCompletedContext)!
  return (
    <div onClick={() => setIsActive(!isActive)} className={"form-section-label"}>
      <SectionTitle />
      <ExpansionMark isSectionActive={isActive} isSectionCompleted={isCompleted} />
    </div>
  )
}
