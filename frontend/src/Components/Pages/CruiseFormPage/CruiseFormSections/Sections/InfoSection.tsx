import {SectionWrapper} from "../../../FormPage/Wrappers/FormASections";
import CruiseBasicInfo from "../CruiseBasicInfo";
import React from "react";
import {useLocation} from "react-router-dom";


export const BasicInfo = () => {
    const locationState = useLocation()
    return(
        <CruiseBasicInfo cruise={locationState.state.cruise} />
    )
}

export const DateSection = () => SectionWrapper(
    {
        shortTitle: "Podstawowe",
        longTitle: "Podstawowe informacje o rejsie",
        children: <BasicInfo/>
    }
)