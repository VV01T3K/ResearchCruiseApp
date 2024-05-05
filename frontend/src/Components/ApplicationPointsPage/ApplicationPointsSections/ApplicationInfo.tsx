import ReadOnlyTextInput from "../../CommonComponents/ReadOnlyTextInput";
import React from "react";

type Props = {
    id: string,
    date: string,
    number: string,
    year: string,
    cruiseManagerFirstName: string,
    cruiseManagerLastName: string,
    status: string,
}


function ApplicationInfo(props: Props) {
    return (
        <div className="d-flex flex-wrap flex-row justify-content-center">
            <div className="d-flex col-12 col-xl-4 flex-wrap justify-content-center align-items-center p-2">
                <div className="d-flex col-12 justify-content-center mb-1">Numer zgłoszenia:</div>
                <ReadOnlyTextInput value={props.number} />
            </div>
            <div className="d-flex col-12 col-xl-4 flex-wrap justify-content-center align-items-center p-2">
                <div className="d-flex col-12 justify-content-center mb-1">Data:</div>
                <ReadOnlyTextInput value={props.date} />
            </div>
            <div className="d-flex col-12 col-xl-4 flex-wrap justify-content-center align-items-center p-2">
                <div className="d-flex col-12 justify-content-center mb-1">Rok rejsu:</div>
                <ReadOnlyTextInput value={props.year} />
            </div>
            <div className="d-flex col-12 col-xl-4 flex-wrap justify-content-center align-items-center p-2">
                <div className="d-flex col-12 justify-content-center mb-1">Kierownik:</div>
                <ReadOnlyTextInput value={props.cruiseManagerFirstName} />
                <ReadOnlyTextInput value={props.cruiseManagerLastName} className="mt-1"/>
            </div>
            <div className="d-flex col-12 col-xl-4 flex-wrap justify-content-center align-items-center p-2">
                <div className="d-flex col-12 justify-content-center mb-1">Status zgłoszenia:</div>
                <ReadOnlyTextInput value={props.status} className="align-self-start"/>
            </div>
        </div>
    )
}


export default ApplicationInfo