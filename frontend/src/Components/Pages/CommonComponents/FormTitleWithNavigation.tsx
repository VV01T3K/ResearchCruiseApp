import React, {useContext} from "react";
import {FormSectionType} from "../FormPage/Wrappers/FormASections";
import {FormContext} from "../FormPage/Wrappers/FormTemplate";
import {useLocation} from "react-router-dom";

export const formType = {
    A: "A",
    B: "B",
    C: "C",
    ApplicationDetails: "0",
    CruiseDetails: "1"
}

export type FormTypeKeys = keyof typeof formType;
export type FormTypeValues = (typeof formType)[FormTypeKeys];

function FormTitleWithNavigation(){
    const formContext = useContext(FormContext)


    function scrollSmoothTo(elementId: string){
        var element = document.getElementById(elementId);
        element?.scrollIntoView({block: 'start', behavior: 'smooth'});
    }

    const FormTitle = () => {
        const locationState = useLocation().state
        return(
            <div className={"form-page-title"}>
                {[formType.A, formType.B,formType.C].includes(formContext!.type) && `Formularz ${formContext!.type}` }
                {formContext!.type == formType.ApplicationDetails && `Szczegóły zgłoszenia` }
                {formContext!.type == formType.CruiseDetails && (locationState.cruise ? "Szczegóły rejsu" : "Nowy rejs")}
            </div>
        )
    }

    const showRequiredSections = !formContext?.readOnly

    const isSectionInvalid = (section:FormSectionType) => section.sectionFieldNames ? Object.values(section.sectionFieldNames)
        .some((fieldName)=>formContext?.formState.errors[fieldName]):false

    const SectionLink = (props:{section:FormSectionType, index:number} ) => (
        <div className={"form-page-navigation-button"} onClick={() => scrollSmoothTo(props.section.id)}>
            {props.index + 1 + ". "}{props.section.shortTitle}{showRequiredSections && (isSectionInvalid(props.section) ? "*" : "")}
        </div>
    )

    const SectionLinks = () => (
        <div className={"form-page-navigation"}>
            {formContext!.sections.map((section, index) =>
                <SectionLink key={index} section={section} index={index} /> )}
        </div>
    )

    return (
        <div className={"form-title-with-navigation"}>
            <SectionLinks/>
            <FormTitle/>
        </div>
    )
}


export default FormTitleWithNavigation