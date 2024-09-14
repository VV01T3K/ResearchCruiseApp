import {SectionWrapper} from "../../Wrappers/FormASections";
import React from "react";

export const technicalElementsSectionFieldNames = {

}

//  TODO: Change
//                     <TechnicalElementsUsedInput className={"col-12"} name={"technical"}/>

export const TechnicalElementsSection = () => SectionWrapper(
    {
        shortTitle: "E. techniczne",
        longTitle: "Elementy techniczne statku wykorzystywane podczas rejsu",
        sectionFieldNames:technicalElementsSectionFieldNames,
        children: <> </>
    }
)