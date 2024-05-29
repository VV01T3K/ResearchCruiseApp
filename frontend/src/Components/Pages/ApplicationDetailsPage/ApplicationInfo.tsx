import ReadOnlyTextInput from "../../CommonComponents/ReadOnlyTextInput";
import React from "react";
import {Application} from "../ApplicationsPage/ApplicationsPage";
import LinkWithState from "../../CommonComponents/LinkWithState";
import SimpleInfoTile from "../../CommonComponents/SimpleInfoTile";


type Props = {
    application: Application
}


function ApplicationInfo(props: Props) {
    return (
        <div className="d-flex flex-wrap flex-row justify-content-center col-12">
            <SimpleInfoTile title="Numer zgłoszenia" colsXl={4}>
                <ReadOnlyTextInput value={props.application.number} />
            </SimpleInfoTile>

            <SimpleInfoTile title="Data" colsXl={4}>
                <ReadOnlyTextInput value={props.application.date} />
            </SimpleInfoTile>

            <SimpleInfoTile title="Rok rejsu" colsXl={4}>
                <ReadOnlyTextInput value={props.application.year} />
            </SimpleInfoTile>

            <SimpleInfoTile title="Kierownik" colsXl={4}>
                <ReadOnlyTextInput value={props.application.cruiseManagerFirstName} />
                <ReadOnlyTextInput value={props.application.cruiseManagerLastName} className="mt-1"/>
            </SimpleInfoTile>

            <SimpleInfoTile title="Zastępca kierownika" colsXl={4}>
                <ReadOnlyTextInput value={props.application.deputyManagerFirstName} />
                <ReadOnlyTextInput value={props.application.deputyManagerLastName} className="mt-1"/>
            </SimpleInfoTile>

            <SimpleInfoTile title="Formularze" colsXl={4}>
                <LinkWithState
                    to="/Form"
                    state={{
                        formType: "A",
                        formId: props.application.formAId ?? undefined,
                        readonly: true
                    }}
                    label="Formularz A"
                    className={`col-12 d-flex justify-content-center ${!props.application.formAId ? "text-muted text-decoration-none" : ""}`}
                    style={!props.application.formAId ? {cursor: "default"} : undefined}
                />
                <LinkWithState
                    to="/Form"
                    state={{
                        formType: "B",
                        formId: props.application.formBId ?? undefined,
                        readonly: true
                    }}
                    label="Formularz B"
                    className={`col-12 d-flex justify-content-center ${!props.application.formBId ? "text-muted text-decoration-none" : ""}`}
                    style={!props.application.formBId ? {cursor: "default"} : undefined}
                />
                <LinkWithState
                    to="/Form"
                    state={{
                        formType: "C",
                        formId: props.application.formCId ?? undefined,
                        readonly: true
                    }}
                    label="Formularz C"
                    className={`col-12 d-flex justify-content-center ${!props.application.formCId ? "text-muted text-decoration-none" : ""}`}
                    style={!props.application.formCId ? {cursor: "default"} : undefined}
                />
            </SimpleInfoTile>

            <SimpleInfoTile title="Status zgłoszenia" colsXl={4}>
                <ReadOnlyTextInput value={props.application.status} className="align-self-start"/>
            </SimpleInfoTile>

            <SimpleInfoTile title="Punkty" colsXl={4}>
                <ReadOnlyTextInput value={props.application.points} className="align-self-start"/>
            </SimpleInfoTile>
        </div>
    )
}


export default ApplicationInfo