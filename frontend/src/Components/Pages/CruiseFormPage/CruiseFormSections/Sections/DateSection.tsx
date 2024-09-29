import {SectionWrapper} from "../../../FormPage/Wrappers/FormASections";
import React, {useContext} from "react";
import {EndDate, StartDate} from "../../../CruisesPage/CruiseListFields";
import {StartDateField, EndDateField} from "../../../FormPage/Inputs/DateField";
import {CruiseApplicationsContext} from "../../CruiseFormPage";
import {CruiseApplicationContext} from "../../../CruiseApplicationDetailsPage/CruiseApplicationDetailsPage";

export const dateSectionFieldNames = {
    startDate:"startDate",
    endDate:"endDate",
}

const CruiseStartDateField = () => {
    return(
        <>
            <StartDateField
                className={"two-fields-beside-md"}
                fieldName={dateSectionFieldNames.startDate}
                fieldLabel={"Początek"}
                EndDateFieldName={dateSectionFieldNames.endDate}/>
            <EndDateField
                className={"two-fields-beside-md"}
                fieldName={dateSectionFieldNames.endDate}
                fieldLabel={"Koniec"}
                StartDateFieldName={dateSectionFieldNames.startDate}/>
        </>

    )
}

export const InfoSection = () => SectionWrapper(
    {
        shortTitle: "Termin",
        longTitle: "Termin rejsu",
        children:
            <>
                <CruiseStartDateField/>
            </>
    }
)