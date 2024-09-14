import {SectionWrapper} from "../../Wrappers/FormASections";
import React from "react";

export const cruisePlanSectionFieldNames = {

}


// TODO: CHANGE

//                     <DetailedPlanInput className={"col-12"} name={"plan"}/>


export const CruisePlanSection = () => SectionWrapper(
    {
        shortTitle: "Plan",
        longTitle: "Szczegółowy plan zadań do realizacji podczas rejsu",
        sectionFieldNames:cruisePlanSectionFieldNames,
        children: <> </>
    }
)