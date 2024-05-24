import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowDown} from "@fortawesome/free-solid-svg-icons";
import ReadOnlyTextInput from "../../CommonComponents/ReadOnlyTextInput";
import LinkWithState from "../../CommonComponents/LinkWithState";
import React from "react";

export default function CruisesList() {
    return (
        <div className="table-striped w-100 overflow-y-scroll">
            <div className="text-white text-center bg-primary">
                <div className="d-flex flex-row center">
                    <div className="d-none d-xl-flex justify-content-center align-items-center p-2" style={{width: "14%", cursor: "pointer"}}
                         onClick={() => {}}
                    >
                        <b>Numer<br/>data</b>
                        <div className="btn btn-sm btn-dark px-1 py-0 ms-2">
                            <FontAwesomeIcon icon={faArrowDown} />
                        </div>
                    </div>
                    <div className="d-none d-xl-flex justify-content-center align-items-center p-2" style={{width: "9%", cursor: "pointer"}}
                         onClick={() => {}}
                    >
                        <b>Rok rejsu</b>
                        <div className="btn btn-sm btn-dark px-1 py-0 ms-2">
                            <FontAwesomeIcon icon={faArrowDown} />
                        </div>
                    </div>
                    <div className="d-none d-xl-flex justify-content-center align-items-center p-2" style={{width: "32%"}}>
                        <b>Kierownik</b>
                    </div>
                    <div className="d-none d-xl-flex justify-content-center align-items-center p-2" style={{width: "18%"}}>
                        <b>Formularze</b>
                    </div>
                    <div className="d-none d-xl-flex justify-content-center align-items-center p-2" style={{width: "12%", cursor: "pointer"}}
                         onClick={() => {}}
                    >
                        <b>Punkty</b>
                        <div className="btn btn-sm btn-dark px-1 py-0 ms-2">
                            <FontAwesomeIcon icon={faArrowDown} />
                        </div>
                    </div>
                    <div className="d-none d-xl-flex justify-content-center align-items-center p-2 border-end" style={{width: "15%"}}>
                        <b>Status</b>
                    </div>
                    <div className="d-flex d-xl-none justify-content-center p-2 col-12">
                        <b>Zgłoszenia</b>
                    </div>
                </div>
            </div>
            <div className="w-100 bg-light">
                {!applications.length &&
                    <div className="d-flex flex-row bg-light p-2 justify-content-center border">
                        <div className={"text-center"}>Brak rejsów</div>
                    </div>
                }
                {applications.map((row: ApplicationOverview, index: number) => (
                    <div key={index}
                         className={`d-flex flex-wrap flex-row justify-content-center border-bottom ${index % 2 == 0 ? "bg-light" : "bg-white"}`}
                    >
                        <div className="d-flex flex-wrap justify-content-center align-items-center p-2"
                             style={{width: windowWidth >= 1200 ? "14%" : "100%"}}
                        >
                            <div className="col-12 d-flex d-xl-none justify-content-center">Numer i data:</div>
                            <ReadOnlyTextInput value={row.number} className="mb-1" />
                            <ReadOnlyTextInput value={row.date} />
                        </div>
                        <div className="d-flex flex-wrap justify-content-center align-items-center p-2"
                             style={{width: windowWidth >= 1200 ? "9%" : "100%"}}
                        >
                            <div className="col-12 d-flex d-xl-none justify-content-center">Rok rejsu:</div>
                            <ReadOnlyTextInput value={row.year} />
                        </div>
                        <div className="d-flex flex-wrap justify-content-center align-items-center p-2"
                             style={{width: windowWidth >= 1200 ? "32%" : "100%"}}
                        >
                            <div className="col-12 d-flex d-xl-none justify-content-center">Kierownik:</div>
                            <ReadOnlyTextInput value={row.cruiseManagerFirstName} className="mb-1"/>
                            <ReadOnlyTextInput value={row.cruiseManagerLastName} />
                        </div>
                        <div className="d-flex flex-wrap justify-content-center align-items-center p-2 text-center"
                             style={{width: windowWidth >= 1200 ? "18%" : "100%"}}
                        >
                            <LinkWithState
                                to="/Form"
                                state={{
                                    formType: "A",
                                    formId: row.formAId ?? undefined,
                                    readonly: true
                                }}
                                label="Formularz A"
                                className={`col-12 d-flex justify-content-center ${!row.formAId ? "text-muted text-decoration-none" : ""}`}
                                style={!row.formAId ? {cursor: "default"} : undefined}
                            />
                            <LinkWithState
                                to="/Form"
                                state={{
                                    formType: "B",
                                    formId: row.formBId ?? undefined,
                                    readonly: true
                                }}
                                label="Formularz B"
                                className={`col-12 d-flex justify-content-center ${!row.formBId ? "text-muted text-decoration-none" : ""}`}
                                style={!row.formBId ? {cursor: "default"} : undefined}
                            />
                            <LinkWithState
                                to="/Form"
                                state={{
                                    formType: "C",
                                    formId: row.formCId ?? undefined,
                                    readonly: true
                                }}
                                label="Formularz C"
                                className={`col-12 d-flex justify-content-center ${!row.formCId ? "text-muted text-decoration-none" : ""}`}
                                style={!row.formCId ? {cursor: "default"} : undefined}
                            />
                        </div>
                        <div className="d-flex flex-wrap justify-content-center align-items-center p-2 text-center"
                             style={{width: windowWidth >= 1200 ? "12%" : "100%"}}
                        >
                            <div className="col-12 d-flex d-xl-none justify-content-center">Punkty:</div>
                            <LinkWithState
                                to="/ApplicationPoints"
                                state={{ applicationId: row.id }}
                                label={row!.points}
                                className="col-12 d-flex justify-content-center"
                            />
                        </div>
                        <div className="d-flex flex-wrap justify-content-center align-items-center p-2 text-center"
                             style={{width: windowWidth >= 1200 ? "15%" : "100%"}}
                        >
                            <div className="col-12 d-flex d-xl-none justify-content-center">Status:</div>
                            <div className="col-4 d-flex justify-content-center">
                                <i>{row!.status}</i>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}