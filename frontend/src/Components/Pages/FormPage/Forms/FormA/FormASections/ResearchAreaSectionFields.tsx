import React, {useContext} from "react";
import {FormContext} from "../../../Wrappers/FormTemplate";
import ResearchAreaSelect from "../../../Inputs/ClickableMap";
import TextArea from "../../../Inputs/TextArea";
import {researchAreaSectionFieldNames} from "./ResearchAreaSection";

export const ResearchAreaField = () => {
    const formContext = useContext(FormContext)
    return(
        <ResearchAreaSelect className="two-fields-beside-md"
                            fieldLabel="Obszar prowadzonych badań"
                            fieldName={researchAreaSectionFieldNames.researchArea}
                            initValues={formContext!.initValues?.researchAreas}
        />
    )
}
export const ResearchAreaDescriptionField = () => (
    <TextArea className="two-fields-beside-md"
              fieldLabel="Opis"
              placeholder={"Wpisz opis"}
              fieldName={researchAreaSectionFieldNames.researchAreaInfo}
              required={false}
    />
)
