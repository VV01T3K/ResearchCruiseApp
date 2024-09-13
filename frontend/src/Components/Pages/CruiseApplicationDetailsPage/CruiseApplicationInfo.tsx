import ReadOnlyTextInput from "../../CommonComponents/ReadOnlyTextInput";
import React, {useContext} from "react";
import LinkWithState from "../../CommonComponents/LinkWithState";
import SimpleInfoTile from "../../CommonComponents/SimpleInfoTile";
import {CruiseApplicationContext} from "./CruiseApplicationDetailsPage";
import {Path} from "../../Tools/Path";
import {CruiseApplication} from "../CruiseApplicationsPage/CruiseApplicationsPage";

const SimpleInfoWrapperSingleField = (props:{title:string, selector: keyof CruiseApplication}) => {
    const cruiseApplicationContext = useContext(CruiseApplicationContext)
    return(
        <SimpleInfoTile title={props.title}>
            <ReadOnlyTextInput value={cruiseApplicationContext![props.selector]} />
        </SimpleInfoTile>
    )
}

const SimpleInfoWrapperTwoFields = (props:{
    title:string, firstSelector: keyof CruiseApplication, secondSelector: keyof CruiseApplication }) => {
    const cruiseApplicationContext = useContext(CruiseApplicationContext)
    return(
        <SimpleInfoTile title={props.title}>
            <ReadOnlyTextInput value={cruiseApplicationContext![props.firstSelector]} />
            <ReadOnlyTextInput value={cruiseApplicationContext![props.secondSelector]} className="mt-1"/>
        </SimpleInfoTile>
    )
}


export const CruiseApplicationNumber = () => (
    <SimpleInfoWrapperSingleField title={"Numer zgłoszenia"} selector={"number"}/>
)

export const CruiseApplicationDate = () => (
    <SimpleInfoWrapperSingleField title={"Data"} selector={"date"}/>
)


export const CruiseApplicationYear = () => (
    <SimpleInfoWrapperSingleField title={"Rok rejsu"} selector={"year"}/>
)


export const CruiseApplicationCruiseManagerName = () => (
    <SimpleInfoWrapperTwoFields title={"Kierownik"}
                                firstSelector={"cruiseManagerFirstName"}
                                secondSelector={"cruiseManagerLastName"}/> )

export const CruiseApplicationDeputyManagerName = () => (
    <SimpleInfoWrapperTwoFields title={"Zastępca kierownika"}
                                firstSelector={"deputyManagerFirstName"}
                                secondSelector={"deputyManagerLastName"}/> )

const CruiseApplicationStatus = () => (
    <SimpleInfoWrapperSingleField title={"Status zgłoszenia"} selector={"status"}/>
)

const CruiseApplicationPoints = () => (
    <SimpleInfoWrapperSingleField title={"Punkty"} selector={"points"}/>
)

const isLinkDisabled = (formType:string) => {
    const cruiseApplicationContext = useContext(CruiseApplicationContext)
    switch (formType){
        case "A":
            return !cruiseApplicationContext!.hasFormA
        case "B":
            return !cruiseApplicationContext!.hasFormB
        case "C":
            return !cruiseApplicationContext!.hasFormC
    }
}

const FormLink = (props:{formType:string}) => {
    const cruiseApplicationContext = useContext(CruiseApplicationContext)
    const disabled = isLinkDisabled(props.formType)
    return(
        <LinkWithState to={Path.Form}
                       state={{ formType: props.formType, cruiseApplicationId: cruiseApplicationContext!.id, readOnly: true }}
                       label={"Formularz " + props.formType}
                       disabled={disabled}

        />
    )
}

export const FormALink = () => (<FormLink formType={"A"}/>)

export const FormCLink = () => (<FormLink formType={"B"}/>)

export const FormBLink = () => (<FormLink formType={"C"}/>)


const CruiseApplicationForms = () => (
        <SimpleInfoTile title="Formularze">
            <FormALink/>
            <FormBLink/>
            <FormCLink/>
        </SimpleInfoTile>
    )

function CruiseApplicationInfo() {
    const cruiseApplicationContext = useContext(CruiseApplicationContext)
    return (
        <div className="cruise-application-info">
            <CruiseApplicationNumber/>
            <CruiseApplicationDate/>
            <CruiseApplicationYear/>
            <CruiseApplicationCruiseManagerName/>
            <CruiseApplicationDeputyManagerName/>
            <CruiseApplicationForms/>
            <CruiseApplicationStatus/>
            <CruiseApplicationPoints/>
        </div>
    )
}


export default CruiseApplicationInfo