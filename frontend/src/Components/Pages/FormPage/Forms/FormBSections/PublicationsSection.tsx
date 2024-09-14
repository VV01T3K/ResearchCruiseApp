import {FormSectionType, SectionIdFromTitle} from "../../Wrappers/FormASections";
import FormSection, {SectionProps} from "../../Wrappers/FormSection";
export const PublicationsSectionFieldNames = {
    theses:"theses",
    publications:"publications",

}

export const PublicationAndThesesSection = (): FormSectionType => {
    const shortTitle = "Publikacje"
    const longTitle = "Publikacje"
    const id = SectionIdFromTitle(shortTitle)

    const Content = (props: SectionProps) => (
        <FormSection index={props.index} id={id} title={longTitle}>

        </FormSection>
    )
    return {Content, id, shortTitle, longTitle, sectionFieldNames:PublicationsSectionFieldNames}
}