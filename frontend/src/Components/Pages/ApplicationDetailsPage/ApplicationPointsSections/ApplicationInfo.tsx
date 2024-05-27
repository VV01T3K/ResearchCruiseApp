import ReadOnlyTextInput from "../../../CommonComponents/ReadOnlyTextInput";
import React from "react";
import {Application} from "../../ApplicationsPage/ApplicationsPage";
import LinkWithState from "../../../CommonComponents/LinkWithState";
import ApplicationInfoSection from "./Wrappers/ApplicationInfoSection";


type Props = {
    application: Application
}


function ApplicationInfo(props: Props) {
    return (
        <div className="d-flex flex-wrap flex-row justify-content-center">
            <ApplicationInfoSection title="Numer zgłoszenia">
                <ReadOnlyTextInput value={props.application.number} />
            </ApplicationInfoSection>

            <ApplicationInfoSection title="Data">
                <ReadOnlyTextInput value={props.application.date} />
            </ApplicationInfoSection>

            <ApplicationInfoSection title="Rok rejsu">
                <ReadOnlyTextInput value={props.application.year} />
            </ApplicationInfoSection>

            <ApplicationInfoSection title="Kierownik">
                <ReadOnlyTextInput value={props.application.cruiseManagerFirstName} />
                <ReadOnlyTextInput value={props.application.cruiseManagerLastName} className="mt-1"/>
            </ApplicationInfoSection>

            <ApplicationInfoSection title="Zastępca kierownika">
                <ReadOnlyTextInput value={props.application.deputyManagerFirstName} />
                <ReadOnlyTextInput value={props.application.deputyManagerLastName} className="mt-1"/>
            </ApplicationInfoSection>

            <ApplicationInfoSection title="Formularze">
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
            </ApplicationInfoSection>

            <ApplicationInfoSection title="Status zgłoszenia">
                <ReadOnlyTextInput value={props.application.status} className="align-self-start"/>
            </ApplicationInfoSection>

            <ApplicationInfoSection title="Punkty">
                <ReadOnlyTextInput value={props.application.points} className="align-self-start"/>
            </ApplicationInfoSection>
        </div>
    )
}


export default ApplicationInfo