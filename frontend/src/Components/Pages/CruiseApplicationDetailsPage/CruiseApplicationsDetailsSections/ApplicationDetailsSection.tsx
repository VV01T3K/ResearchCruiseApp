import React from "react";
import CruiseApplicationInfo from "../CruiseApplicationInfo";
import {SectionWrapper} from "../../FormPage/Wrappers/FormASections";

export const ApplicationDetailsSection = () => SectionWrapper(
    {
        shortTitle: "Informacje",
        longTitle: "Informacje o zgłoszeniu",
        children:  <CruiseApplicationInfo/>
    }
)