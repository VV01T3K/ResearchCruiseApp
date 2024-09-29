import {SectionWrapper} from "../../../FormPage/Wrappers/FormASections";
import React from "react";
import {useLocation} from "react-router-dom";
import CruiseBasicInfo from "../../../CruiseFormPage/CruiseFormSections/CruiseBasicInfo";
import {
    CruiseApplicationCruiseManagerName,
    CruiseApplicationDeputyManagerName
} from "../../../CruiseApplicationDetailsPage/CruiseApplicationInfo";
import {extendedUseLocation} from "../../FormPage";


export const BasicInfo = () => {
    const locationState = extendedUseLocation()
    return(
        <CruiseBasicInfo cruise={locationState.state.cruise} />
    )
}


export const CruiseManagersSection = () => SectionWrapper(
    {
        shortTitle: "Kierownik",
        longTitle: "Kierownik zgłaszanego rejsu",
        children:
            <>
                <CruiseApplicationCruiseManagerName/>
                <CruiseApplicationDeputyManagerName/>
            </>
    }
)
