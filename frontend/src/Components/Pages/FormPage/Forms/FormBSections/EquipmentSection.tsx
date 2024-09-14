import {SectionWrapper} from "../../Wrappers/FormASections";
import React from "react";

export const equipementSectionFieldNames = {

}

//TODO change
//                     <EquipmentInput className={"col-12"} name={"equipment2"}/>

export const EquipementSection = () => SectionWrapper(
    {
        shortTitle: "Sprzęt",
        longTitle: "Lista sprzętu i aparatury badawczej planowanej do użycia podczas rejsu",
        sectionFieldNames:equipementSectionFieldNames,
        children: <> </>
    }
)