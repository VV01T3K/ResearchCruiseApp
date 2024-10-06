import {FormSectionType, SectionIdFromTitle} from "../../FormPage/Wrappers/FormASections";
import FormSection, {SectionProps} from "../../FormPage/Wrappers/FormSection";
import EvaluatedPublicationsTable from "../../FormPage/Inputs/PublicationsTable/EvaluatedPublicationsTable";
import {useContext} from "react";
import {FormContext} from "../../FormPage/Wrappers/FormTemplate";


const PublicationsSectionFieldNames = {
    publications:"publicationsEvaluationsEdits",
}

const PublicationsField = () =>
{
    const formContext = useContext(FormContext)
    return(
       <EvaluatedPublicationsTable
           fieldLabel={""}
           className={"single-field"}
           fieldName={PublicationsSectionFieldNames.publications}
           evaluatedPublications={formContext!.initValues?.formAPublications}
       />
    )
}

export const PublicationsSection = (): FormSectionType => {
    const shortTitle = "Publikacje"
    const longTitle = "Publikacje"
    const id = SectionIdFromTitle(shortTitle)

    const Content = (props: SectionProps) => (
        <FormSection index={props.index} id={id} title={longTitle}>
            <PublicationsField/>
        </FormSection>
    )
    return {Content, id, shortTitle, longTitle, sectionFieldNames:PublicationsSectionFieldNames}
}