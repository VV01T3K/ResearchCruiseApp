import {SectionWrapper} from "../../../FormPage/Wrappers/FormASections";
import React from "react";
import {StartDate} from "../../../CruisesPage/CruiseListFields";

const CruiseStartDateField = () => {
    return(
        <StartDate/>
    )
}

export const InfoSection = () => SectionWrapper(
    {
        shortTitle: "Termin",
        longTitle: "Termin rejsu",
        children:
            <>
                {/*<CruiseStartDateField/>*/}
            </>
    }
)