import React from "react";
import {CruiseManagerSection} from "../Forms/FormASections/CruiseManagerSection";
import {TimeSection} from "../Forms/FormASections/TimeSection";
import {SectionProps} from "./FormSection";

export type FormSectionType = {
    Content:(props: SectionProps) => React.JSX.Element, id:string, shortTitle:string, longTitle:string}
export function SectionIdFromTitle(title:String){
    return "section_" + title.replace(/[^A-Za-z]/g, '');
}


export default function FormASections(){

    const cruiseManagerSection = CruiseManagerSection()
    const timeSection = TimeSection()

    return [cruiseManagerSection, timeSection]
}