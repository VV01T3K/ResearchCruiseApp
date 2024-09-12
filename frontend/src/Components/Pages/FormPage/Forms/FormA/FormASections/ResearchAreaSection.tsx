import TextArea from "../../../Inputs/TextArea";
import FormSection, {SectionProps} from "../../../Wrappers/FormSection";
import React, {useContext} from "react";
import {
    FormSectionType,
    SectionIdFromTitle
} from "../../../Wrappers/FormASections";
import ResearchAreaSelect from "../../../Inputs/ClickableMap";
import {FormContext} from "../../../Wrappers/FormTemplate";

const researchAreaSectionFieldNames = {
    researchArea:"researchAreaId",
    researchAreaInfo:"researchAreaInfo",
}

const ResearchAreaField = () => {
    const formContext = useContext(FormContext)
    return(
        <ResearchAreaSelect className="two-fields-beside-md"
                            fieldLabel="Obszar prowadzonych badań"
                            fieldName={researchAreaSectionFieldNames.researchArea}
                            initValues={formContext!.initValues?.researchAreas}
        />
    )
}
const ResearchAreaDescriptionField = () => (
    <TextArea className="two-fields-beside-md"
              fieldLabel="Opis"
              fieldName={researchAreaSectionFieldNames.researchAreaInfo}
              required={false}
    />
)


export const ResearchAreaSection = ():FormSectionType => {
    const shortTitle = "Rejon"
    const longTitle = "Rejon prowadzenia badań"
    const id = SectionIdFromTitle(shortTitle)

    const Content = (props:SectionProps) => (
        <FormSection index={props.index} id={id} title={longTitle}>
            <ResearchAreaField/>
            <ResearchAreaDescriptionField/>
        </FormSection>
    )
    return {Content, id, shortTitle, longTitle, sectionFieldNames:researchAreaSectionFieldNames}
}