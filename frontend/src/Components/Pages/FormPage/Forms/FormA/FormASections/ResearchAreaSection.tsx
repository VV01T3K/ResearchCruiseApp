import React from "react";
import {SectionWrapper} from "../../../Wrappers/FormASections";
import {ResearchAreaDescriptionField, ResearchAreaField} from "./ResearchAreaSectionFields";

export const researchAreaSectionFieldNames = {
    researchArea:"researchAreaId",
    researchAreaInfo:"researchAreaInfo",
}
export const ResearchAreaSection = () => SectionWrapper(
    {
        shortTitle: "Rejon",
        longTitle: "Rejon prowadzenia badań",
        sectionFieldNames: researchAreaSectionFieldNames,
        children:
            <>
                <ResearchAreaField/>
                <ResearchAreaDescriptionField/>
            </>
    }
)