import ReadOnlyTextInput from "../../CommonComponents/ReadOnlyTextInput";
import {CruiseApplicationContext} from "../CruiseApplicationDetailsPage/CruiseApplicationDetailsPage";
import {FormALink, FormBLink, FormCLink} from "../CruiseApplicationDetailsPage/CruiseApplicationInfo";
import React, {useContext} from "react";
import {CellContext} from "../FormPage/Wrappers/FieldTableWrapper";
import {CruiseApplication} from "./CruiseApplicationsPage";
import {ApplicationsContext} from "./CruiseApplicationsList";
import LinkWithState from "../../CommonComponents/LinkWithState";

export const ApplicationTools = () => {
    const cellContext = useContext(CellContext)
    const applicationContext = useContext(ApplicationsContext)

    const application:CruiseApplication = applicationContext![cellContext?.rowIndex!]
    return {application}
}

export const NumberAndDate = () => {
    const {application} = ApplicationTools()
    return (
        <div className={"task-field-input"}>
            <label className={"table-field-input-label"}>
                Numer i data:
            </label>
            <ReadOnlyTextInput value={application.number}/>
            <ReadOnlyTextInput value={application.date}/>
        </div>
    )

}

export const Year = () => {
    const {application} = ApplicationTools()
    return (
        <div className={"task-field-input"}>
            <label className={"table-field-input-label"}>
                Rok rejsu:
            </label>
            <ReadOnlyTextInput value={application.year.toString()}
            />
        </div>
    )
}

export const CruiseManager = () => {
    const {application} = ApplicationTools()
    return (
        <div className={"task-field-input"}>
            <label className={"table-field-input-label"}>
                Kierownik:
            </label>
            <ReadOnlyTextInput value={application.cruiseManagerFirstName}/>
            <ReadOnlyTextInput value={application.cruiseManagerLastName}/>
        </div>
    )
}

export const FormLinks = () => {
    const {application} = ApplicationTools()
    return (
        <CruiseApplicationContext.Provider value={application}>
            <div className={"task-field-input"}>
                <FormALink/>
                <FormBLink/>
                <FormCLink/>
            </div>
        </CruiseApplicationContext.Provider>
    )
}

export const Points = () => {
    const {application} = ApplicationTools()
    return(
        <div className={"task-field-input"}>
            <label className={"table-field-input-label"}>
                Punkty:
            </label>
            <ReadOnlyTextInput value={application!.points}/>
        </div>
    )
}

export const Status = () => {
    const {application} = ApplicationTools()
    return (
        <div className={"task-field-input"}>
            <label className={"table-field-input-label"}>
                Status:
            </label>
            <i>{application!.status}</i>
        </div>
    )
}

export const Actions = () => {
    const {application} = ApplicationTools()
    return (
        <div className="task-field-input">
            <LinkWithState
                className="btn btn-info"
                to="/CruiseApplicationDetails"
                label="Szczegóły"
                state={{cruiseApplication: application, readOnly:true}}
            />

            {/*{props.deletionMode &&*/}
            {/*    // Show only if the component represents a cruise's applications*/}
            {/*    <a*/}
            {/*        className="btn btn-outline-danger"*/}
            {/*        style={{fontSize: "inherit"}}*/}
            {/*        onClick={() => {*/}
            {/*            // Remove the application from the list*/}
            {/*            const updatedApplications = props.boundCruiseApplications!.filter((_, i) => i != index)*/}
            {/*            props.setBoundCruiseApplications!(updatedApplications)*/}
            {/*        }}*/}
            {/*    >*/}
            {/*        Usuń*/}
            {/*    </a>*/}
            {/*}*/}
            {/*{props.addingMode &&*/}
            {/*    // Show only if the component enables adding applications to a cruise*/}
            {/*    <a*/}
            {/*        className="btn btn-outline-success"*/}
            {/*        style={{fontSize: "inherit"}}*/}
            {/*        onClick={() => {*/}
            {/*            // Add the application to the list*/}
            {/*            const updatedApplications = [...props.boundCruiseApplications!, row]*/}
            {/*            props.setBoundCruiseApplications!(updatedApplications)*/}
            {/*        }}*/}
            {/*    >*/}
            {/*        Dołącz*/}
            {/*    </a>*/}
            {/*}*/}
        </div>
    )
}


export const CruiseApplicationsTableContent = () => [
    NumberAndDate,
    Year,
    CruiseManager,
    FormLinks,
    Points,
    Status,
    Actions
]