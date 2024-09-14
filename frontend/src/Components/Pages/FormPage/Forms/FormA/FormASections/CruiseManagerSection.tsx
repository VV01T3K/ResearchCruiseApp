import React from "react";
import {SectionWrapper} from "../../../Wrappers/FormASections";
import {CruiseAndDeputyManager} from "./CruiseManagerSectionFields";

export const cruiseManagerSectionFieldNames = {
    cruiseManagerId:"cruiseManagerId",
    deputyManagerId:"deputyManagerId",
    year:"year"
}

export const CruiseManagerSection = () => SectionWrapper(
    {
        shortTitle: "Kierownik",
        longTitle: "Kierownik zgłaszanego rejsu",
        sectionFieldNames: cruiseManagerSectionFieldNames,
        children: <CruiseAndDeputyManager/>
    }
)