import ReadOnlyTextInput from "../../CommonComponents/ReadOnlyTextInput";
import React, {useContext} from "react";
import LinkWithState from "../../CommonComponents/LinkWithState";
import SimpleInfoTile from "../../CommonComponents/SimpleInfoTile";
import {CruiseApplicationContext} from "./CruiseApplicationDetailsPage";


const CruiseApplicationNumber = () => {
    const cruiseApplicationContext = useContext(CruiseApplicationContext)
    return(
        <SimpleInfoTile title="Numer zgłoszenia">
            <ReadOnlyTextInput value={cruiseApplicationContext!.number} />
        </SimpleInfoTile>
    )
}

const CruiseApplicationDate = () => {
    const cruiseApplicationContext = useContext(CruiseApplicationContext)
    return(
        <SimpleInfoTile title="Data">
            <ReadOnlyTextInput value={cruiseApplicationContext!.date} />
        </SimpleInfoTile>
    )
}

const CruiseApplicationYear = () => {
    const cruiseApplicationContext = useContext(CruiseApplicationContext)
    return(
        <SimpleInfoTile title="Rok rejsu">
            <ReadOnlyTextInput value={cruiseApplicationContext!.year} />
        </SimpleInfoTile>
    )
}

const CruiseApplicationCruiseManagerName = () => {
    const cruiseApplicationContext = useContext(CruiseApplicationContext)
    return(
        <SimpleInfoTile title="Kierownik">
            <ReadOnlyTextInput value={cruiseApplicationContext!.cruiseManagerFirstName} />
            <ReadOnlyTextInput value={cruiseApplicationContext!.cruiseManagerLastName} className="mt-1"/>
        </SimpleInfoTile>
    )
}

const CruiseApplicationDeputyManagerName = () => {
    const cruiseApplicationContext = useContext(CruiseApplicationContext)
    return(
        <SimpleInfoTile title="Zastępca kierownika">
            <ReadOnlyTextInput value={cruiseApplicationContext!.deputyManagerFirstName} />
            <ReadOnlyTextInput value={cruiseApplicationContext!.deputyManagerLastName} className="mt-1"/>
        </SimpleInfoTile>
    )
}
const CruiseApplicationStatus = () => {
    const cruiseApplicationContext = useContext(CruiseApplicationContext)
    return(
        <SimpleInfoTile title="Status zgłoszenia" >
            <ReadOnlyTextInput value={cruiseApplicationContext!.status} className="align-self-start"/>
        </SimpleInfoTile>
    )
}
const CruiseApplicationPoints = () => {
    const cruiseApplicationContext = useContext(CruiseApplicationContext)
    return(
        <SimpleInfoTile title="Punkty">
            <ReadOnlyTextInput value={cruiseApplicationContext!.points} className="align-self-start"/>
        </SimpleInfoTile>
    )
}

export const FormALink = () => {
    const cruiseApplicationContext = useContext(CruiseApplicationContext)
    return(
        <LinkWithState to="/Form"
                       state={{ formType: "A", cruiseApplicationId: cruiseApplicationContext!.id, readOnly: true }}
                       label="Formularz A"
                       disabled={!cruiseApplicationContext!.hasFormA}

        />
    )
}
export const FormCLink = () => {
    const cruiseApplicationContext = useContext(CruiseApplicationContext)
    return(
        <LinkWithState
            to="/Form"
            state={{
                formType: "C",
                cruiseApplicationId: cruiseApplicationContext!.id,
                readOnly: true
            }}
            label="Formularz C"
            disabled={!cruiseApplicationContext!.hasFormC}

        />
    )
}
export const FormBLink = () => {
    const cruiseApplicationContext = useContext(CruiseApplicationContext)
    return(
        <LinkWithState
            to="/Form"
            state={{
                formType: "B",
                cruiseApplicationId: cruiseApplicationContext!.id,
                readOnly: true
            }}
            label="Formularz B"
            disabled={!cruiseApplicationContext!.hasFormB}

        />
    )
}

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