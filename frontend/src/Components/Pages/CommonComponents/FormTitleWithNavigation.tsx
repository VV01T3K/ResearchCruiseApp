import React, {useContext} from "react";
import {FormSectionType} from "../FormPage/Wrappers/FormASections";
import {FormContext} from "../FormPage/Wrappers/FormTemplate";

function FormTitleWithNavigation(){
    const formContext = useContext(FormContext)


    function scrollSmoothTo(elementId: string){
        var element = document.getElementById(elementId);
        element?.scrollIntoView({block: 'start', behavior: 'smooth'});
    }

    const FormTitle = () => ( <div className={"form-page-title"}>Formularz {formContext?.type}</div> )

    const showRequiredSections = !formContext?.readOnly
    const SectionLink = (props:{section:FormSectionType, index:number} ) => (
        <div className={"form-page-navigation-button"} onClick={() => scrollSmoothTo(props.section.id)}>
            {props.index + 1 + ". "}{props.section.shortTitle}{showRequiredSections && (props.section ? "" : "*")}
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