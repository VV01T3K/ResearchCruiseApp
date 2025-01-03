import { ResearchAreaDescriptionField, ResearchAreaField } from "./ResearchAreaSectionFields"
import { SectionWrapper } from "@components/Form/Section/SectionWrapper"

export const researchAreaSectionFieldNames = {
  researchArea: "researchAreaId",
  researchAreaInfo: "researchAreaInfo",
}
export const ResearchAreaSection = () =>
  SectionWrapper({
    shortTitle: "Rejon",
    longTitle: "Rejon prowadzenia badań",
    sectionFieldNames: researchAreaSectionFieldNames,
    children: (
      <>
        <ResearchAreaField />
        <ResearchAreaDescriptionField />
      </>
    ),
  })
