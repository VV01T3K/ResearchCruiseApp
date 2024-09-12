import {FormSectionType, SectionIdFromTitle} from "../../../FormPage/Wrappers/FormASections";
import FormSection, {SectionProps} from "../../../FormPage/Wrappers/FormSection";

export const ApplicationsSection = ():FormSectionType => {
    const shortTitle = "Zgłoszenia"
    const longTitle = "Zgłoszenia przypisane do rejsu"
    const id = SectionIdFromTitle(shortTitle)

    const Content = (props:SectionProps) => (
        <FormSection index={props.index} id={id} title={longTitle}>
        </FormSection>
    )
    return {Content, id, shortTitle, longTitle, sectionFieldNames:{}}
}