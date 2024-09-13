import FormSection, {SectionProps} from "../../../Wrappers/FormSection";
import React from "react";
import {
    FormSectionType,
    SectionIdFromTitle
} from "../../../Wrappers/FormASections";
import {
    AcceptablePeriodField,
    CruiseDaysField,
    CruiseHoursField, DifferentShipUsageField,
    OptimalPeriodField,
    PeriodNotesField, ShipUsageField
} from "./TimeSectionFields";

export const timeSectionFieldNames = {
    acceptablePeriod:"acceptablePeriod",
    optimalPeriod:"optimalPeriod",
    cruiseHours:"cruiseHours",
    periodNotes:"periodNotes",
    shipUsage:"shipUsage",
    differentUsage:"differentUsage"

}

export const TimeSection = ():FormSectionType => {
    const shortTitle = "Czas"
    const longTitle = "Czas trwania zgłaszanego rejsu"
    const id = SectionIdFromTitle(shortTitle)
    const Content = (props:SectionProps) => (
        <FormSection index={props.index} id={id} title={longTitle}>
            <AcceptablePeriodField/>
            <OptimalPeriodField/>
            <CruiseDaysField/>
            <CruiseHoursField/>
            <PeriodNotesField/>
            <ShipUsageField/>
            <DifferentShipUsageField/>
        </FormSection>
    )
    return {Content, id, shortTitle, longTitle, sectionFieldNames:timeSectionFieldNames}
}