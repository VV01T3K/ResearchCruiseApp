import { FormSectionType } from "Form/Section/FormSectionType"
import { SectionIdFromTitle } from "@components/Form/Section/helpers/SectionIdFromTitle"
import Section from "../../../../../components/Form/Section/Section"
import { SectionContentProps } from "Form/Section/SectionContentProps"
import { spubTasksSectionFieldNames } from "./SpubTasksSectionFieldNames"
import { SpubTaskField } from "./SpubTaskField"

export const SpubTaskSection = (): FormSectionType => {
  const shortTitle = "SPUB"
  const longTitle =
    "Zadania SPUB, z którymi pokrywają się zadania planowane do realizacji na rejsie"
  const id = SectionIdFromTitle(shortTitle)

  const Content = (props: SectionContentProps) => (
    <Section index={props.index} id={id} title={longTitle}>
      <SpubTaskField />
    </Section>
  )
  return {
    Content,
    id,
    shortTitle,
    longTitle,
    sectionFieldNames: spubTasksSectionFieldNames,
  }
}
