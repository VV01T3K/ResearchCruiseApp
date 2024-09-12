import {FormSectionType, SectionIdFromTitle} from "../../../FormPage/Wrappers/FormASections";
import FormSection, {SectionProps} from "../../../FormPage/Wrappers/FormSection";

export const CruiseManagersSection = ():FormSectionType => {
    const shortTitle = "Kierownicy"
    const longTitle = "Kierownik główny i zastępca kierownika głównego"
    const id = SectionIdFromTitle(shortTitle)

    const Content = (props:SectionProps) => (
        <FormSection index={props.index} id={id} title={longTitle}>
        </FormSection>
    )
    return {Content, id, shortTitle, longTitle, sectionFieldNames:{}}
}