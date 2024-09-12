import FormSection, {SectionProps} from "../../../Wrappers/FormSection";
import React, {useContext, useEffect, useState} from "react";
import {FormSectionType, SectionIdFromTitle} from "../../../Wrappers/FormASections";
import {CruiseManagerField, DeputyManagerField, YearField} from "./CruiseManagerSectionFields";

export const cruiseManagerSectionFieldNames = {
    cruiseManagerId:"cruiseManagerId",
    deputyManagerId:"deputyManagerId",
    year:"year"
}

export const CruiseManagerSection = ():FormSectionType => {
    const shortTitle = "Kierownik"
    const longTitle = "Kierownik zgłaszanego rejsu"
    const id = SectionIdFromTitle(shortTitle)

    const Content = (props:SectionProps) => (
        <FormSection index={props.index} id={id} title={longTitle}>
            <CruiseManagerField/>
            <DeputyManagerField/>
            <YearField/>
        </FormSection>
    )
    return {Content, id, shortTitle, longTitle, sectionFieldNames:cruiseManagerSectionFieldNames}
}