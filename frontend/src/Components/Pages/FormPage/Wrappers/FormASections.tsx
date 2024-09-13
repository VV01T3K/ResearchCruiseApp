import React from "react";
import {SectionProps} from "./FormSection";

export type FormSectionType = {
    Content:(props: SectionProps) => React.JSX.Element, id:string, shortTitle:string, longTitle:string, sectionFieldNames:{[key:string]:string}}
export function SectionIdFromTitle(title:String){
    return "section_" + title.replace(/[^A-Za-z]/g, '');
}


