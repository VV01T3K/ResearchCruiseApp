import { SectionWrapper } from "@components/Form/Section/SectionWrapper"
import ReadonlyOverrideWrapper from "@components/Form/ReadonlyOverrideWrapper"
import {
  ResearchAreaDescriptionField,
  ResearchAreaField,
} from "@app/pages/FormPage/Forms/FormA/FormASections/ResearchAreaSectionFields"

export const researchAreaSectionFieldNames = {
  researchArea: "researchAreaId",
  researchAreaInfo: "researchAreaInfo",
}
export const ResearchAreaSection = () =>
  SectionWrapper({
    shortTitle: "Rejon",
    longTitle: "Rejon przeprowadzonych badań",
    sectionFieldNames: researchAreaSectionFieldNames,
    children: (
      <ReadonlyOverrideWrapper>
        <ResearchAreaField />
        <ResearchAreaDescriptionField />
      </ReadonlyOverrideWrapper>
    ),
  })
