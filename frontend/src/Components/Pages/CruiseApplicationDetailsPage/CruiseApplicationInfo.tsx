import ReadOnlyTextInput from "../../CommonComponents/ReadOnlyTextInput";
import React from "react";
import {CruiseApplication} from "../ApplicationsPage/CruiseApplicationsPage";
import LinkWithState from "../../CommonComponents/LinkWithState";
import SimpleInfoTile from "../../CommonComponents/SimpleInfoTile";


type Props = {
    cruiseApplication: CruiseApplication
}


function CruiseApplicationInfo(props: Props) {
    return (
        <div className="d-flex flex-wrap flex-row justify-content-center col-12">
            <SimpleInfoTile title="Numer zgłoszenia" colsXl={4}>
                <ReadOnlyTextInput value={props.cruiseApplication.number} />
            </SimpleInfoTile>

            <SimpleInfoTile title="Data" colsXl={4}>
                <ReadOnlyTextInput value={props.cruiseApplication.date} />
            </SimpleInfoTile>

            <SimpleInfoTile title="Rok rejsu" colsXl={4}>
                <ReadOnlyTextInput value={props.cruiseApplication.year} />
            </SimpleInfoTile>

            <SimpleInfoTile title="Kierownik" colsXl={4}>
                <ReadOnlyTextInput value={props.cruiseApplication.cruiseManagerFirstName} />
                <ReadOnlyTextInput value={props.cruiseApplication.cruiseManagerLastName} className="mt-1"/>
            </SimpleInfoTile>

            <SimpleInfoTile title="Zastępca kierownika" colsXl={4}>
                <ReadOnlyTextInput value={props.cruiseApplication.deputyManagerFirstName} />
                <ReadOnlyTextInput value={props.cruiseApplication.deputyManagerLastName} className="mt-1"/>
            </SimpleInfoTile>

            <SimpleInfoTile title="Formularze" colsXl={4}>
                <LinkWithState
                    to="/Form"
                    state={{
                        formType: "A",
                        formId: props.cruiseApplication.formAId ?? undefined,
                        readonly: true
                    }}
                    label="Formularz A"
                    className={`col-12 d-flex justify-content-center ${!props.cruiseApplication.formAId ? "text-muted text-decoration-none" : ""}`}
                    style={!props.cruiseApplication.formAId ? {cursor: "default"} : undefined}
                />
                <LinkWithState
                    to="/Form"
                    state={{
                        formType: "B",
                        formId: props.cruiseApplication.formBId ?? undefined,
                        readonly: true
                    }}
                    label="Formularz B"
                    className={`col-12 d-flex justify-content-center ${!props.cruiseApplication.formBId ? "text-muted text-decoration-none" : ""}`}
                    style={!props.cruiseApplication.formBId ? {cursor: "default"} : undefined}
                />
                <LinkWithState
                    to="/Form"
                    state={{
                        formType: "C",
                        formId: props.cruiseApplication.formCId ?? undefined,
                        readonly: true
                    }}
                    label="Formularz C"
                    className={`col-12 d-flex justify-content-center ${!props.cruiseApplication.formCId ? "text-muted text-decoration-none" : ""}`}
                    style={!props.cruiseApplication.formCId ? {cursor: "default"} : undefined}
                />
            </SimpleInfoTile>

            <SimpleInfoTile title="Status zgłoszenia" colsXl={4}>
                <ReadOnlyTextInput value={props.cruiseApplication.status} className="align-self-start"/>
            </SimpleInfoTile>

            <SimpleInfoTile title="Punkty" colsXl={4}>
                <ReadOnlyTextInput value={props.cruiseApplication.points} className="align-self-start"/>
            </SimpleInfoTile>
        </div>
    )
}


export default CruiseApplicationInfo