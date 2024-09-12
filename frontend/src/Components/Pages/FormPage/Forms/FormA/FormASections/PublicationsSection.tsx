import FormSection, {SectionProps} from "../../../Wrappers/FormSection";
import React from "react";
import {
    FormSectionType,
    SectionIdFromTitle
} from "../../../Wrappers/FormASections";
import {PublicationsDescription, PublicationsField} from "./PublicationsSectionFields";

export const PublicationsSectionFieldNames = {
    theses:"theses",
    publications:"publications",

}

export const PublicationAndThesesSection = (): FormSectionType => {
    const shortTitle = "Publikacje/prace"
    const longTitle = "Publikacje i prace"
    const id = SectionIdFromTitle(shortTitle)

    const Content = (props: SectionProps) => (
        <FormSection index={props.index} id={id} title={longTitle}>
            <PublicationsDescription/>
            <PublicationsField/>
            {/* Not required */}
            {/*<ThesesDesription/>*/}
            {/*<ThesesField/>*/}
        </FormSection>
    )
    return {Content, id, shortTitle, longTitle, sectionFieldNames:PublicationsSectionFieldNames}
}