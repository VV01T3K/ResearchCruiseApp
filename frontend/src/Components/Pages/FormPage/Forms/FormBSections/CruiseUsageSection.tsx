import {FormSectionType, SectionWrapper} from "../../Wrappers/FormASections";
import React from "react";
import {DifferentShipUsageField, ShipUsageField} from "../FormA/FormASections/TimeSectionFields";
import {timeSectionFieldNames} from "../FormA/FormASections/TimeSection";

export const cruiseUsageFieldNames = {
    shipUsage:"shipUsage",
    differentUsage:"differentUsage"
}


export const CruiseUsageSection = ()=> SectionWrapper(
    {
        shortTitle: "Wykorzystanie statku",
        longTitle: "Sposób wykorzystania statku",
        sectionFieldNames:cruiseUsageFieldNames,
        children:
            <>
                <ShipUsageField/>
                <DifferentShipUsageField/>
            </>
    }
)