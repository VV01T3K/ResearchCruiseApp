import {FormSectionType, SectionIdFromTitle, SectionWrapper} from "../../../FormPage/Wrappers/FormASections";
import FormSection, {SectionProps} from "../../../FormPage/Wrappers/FormSection";
import React from "react";
import {useLocation} from "react-router-dom";
import CruiseBasicInfo from "../../../CruiseFormPage/CruiseFormSections/CruiseBasicInfo";
import {timeSectionFieldNames} from "./CruiseDetailsSection";


export const BasicInfo = () => {
    const locationState = useLocation()
    return(
        <CruiseBasicInfo cruise={locationState.state.cruise} />
    )
}



export const CruiseInfoSection = () => SectionWrapper(
    {
        shortTitle: "Rejs",
        longTitle: "Numer ewidencyjny rejsu",
        children: <BasicInfo/>
    }
)