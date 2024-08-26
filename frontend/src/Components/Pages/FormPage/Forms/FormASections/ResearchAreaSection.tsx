import TextArea from "../../Inputs/TextArea";
import FormSection, {SectionProps} from "../../Wrappers/FormSection";
import React from "react";
import {
    FormSectionType,
    SectionIdFromTitle
} from "../../Wrappers/FormASections";
import ResearchAreaSelect from "../../Inputs/ClickableMap";

const researchAreaSectionFieldNames = {
    researchArea:"researchArea",
    researchAreaInfo:"researchAreaInfo",
}

const ResearchAreaField = () => {
    return(
        <ResearchAreaSelect className="two-fields-beside-md"
                            fieldLabel="Obszar prowadzonych badań"
                            fieldName={researchAreaSectionFieldNames.researchArea}
                            initValues={[{name:"Gdańsk", id:"asdada"}, {name:"Warszawa", id:"asssdada"}]}
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
    const shortTitle = "Z. badawcze"
    const longTitle = "Zespoły badawcze, jakie miałyby uczestniczyć w rejsie"
    const id = SectionIdFromTitle(shortTitle)

    const Content = (props:SectionProps) => (
        <FormSection index={props.index} id={id} title={longTitle}>
            <ResearchAreaField/>
            <ResearchAreaDescriptionField/>
        </FormSection>
    )
    return {Content, id, shortTitle, longTitle, sectionFieldNames:researchAreaSectionFieldNames}
}