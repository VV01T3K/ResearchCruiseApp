import { SectionWrapperProps } from "Form/Section/SectionWrapperProps"
import { FormSectionType } from "Form/Section/FormSectionType"
import { SectionIdFromTitle } from "./helpers/SectionIdFromTitle"
import Section from "./Section"
import { SectionContentProps } from "Form/Section/SectionContentProps"

export const SectionWrapper = (props: SectionWrapperProps): FormSectionType => {
  const id = SectionIdFromTitle(props.shortTitle)
  const longTitle = props.longTitle
  const children = props.children
  const Content = (props: SectionContentProps) => (
    <Section index={props.index} id={id} title={longTitle}>
      {children}
    </Section>
  )
  return {
    Content,
    id,
    shortTitle: props.shortTitle,
    longTitle: longTitle,
    sectionFieldNames: props.sectionFieldNames,
  }
}
