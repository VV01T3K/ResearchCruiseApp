import {SectionWrapper} from "../../Wrappers/FormASections";
import React from "react";

const researchAreaSectionFieldNames = {
    researchArea:"researchAreaId",
    researchAreaInfo:"researchAreaInfo",
}

export const ResearchAreaSection = () => SectionWrapper(
    {
        shortTitle: "Rejon",
        longTitle: "Rejon prowadzenia badań",
        sectionFieldNames:researchAreaSectionFieldNames,
        children:
            <>

            </>
    }
)