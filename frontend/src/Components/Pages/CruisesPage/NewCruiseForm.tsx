import {useForm} from "react-hook-form";
import {Cruise} from "./CruisesPage";
import ReadOnlyTextInput from "../../CommonComponents/ReadOnlyTextInput";
import {ApplicationShortInfo} from "../ApplicationsPage/ApplicationsPage";
import LinkWithState from "../../CommonComponents/LinkWithState";
import React, {useEffect, useState} from "react";

type Props = {

}


export default function NewCruiseForm(props: Props) {
    const form = useForm()

    const [windowWidth, setWindowWidth] = useState(window.innerWidth)
    useEffect(
        () => {
            const handleResize = () => {
                setWindowWidth(window.innerWidth);
            };
            window.addEventListener('resize', handleResize);
            return () => {
                window.removeEventListener('resize', handleResize);
            };
        },
        []
    );

    return (
        <div className="table-striped w-100">
            <div className="text-white text-center bg-primary">
                <div className="d-flex flex-row center">
                    <div className="d-none d-xl-flex justify-content-center align-items-center p-2" style={{width: "15%", cursor: "pointer"}}
                         onClick={() => {}}
                    >
                        <b>Czas rozpoczęcia</b>
                        {/*<div className="btn btn-sm btn-dark px-1 py-0 ms-2">*/}
                        {/*    <FontAwesomeIcon icon={faArrowDown} />*/}
                        {/*</div>*/}
                    </div>
                    <div className="d-none d-xl-flex justify-content-center align-items-center p-2" style={{width: "15%", cursor: "pointer"}}
                         onClick={() => {}}
                    >
                        <b>Czas zakończenia</b>
                        {/*<div className="btn btn-sm btn-dark px-1 py-0 ms-2">*/}
                        {/*    <FontAwesomeIcon icon={faArrowDown} />*/}
                        {/*</div>*/}
                    </div>
                    <div className="d-none d-xl-flex justify-content-center align-items-center p-2" style={{width: "44%"}}>
                        <b>Zgłoszenia</b>
                    </div>
                    <div className="d-none d-xl-flex justify-content-center align-items-center p-2 border-end" style={{width: "16%"}}>
                        <b>Akcje</b>
                    </div>

                    <div className="d-flex d-xl-none justify-content-center p-2 col-12">
                        <b>Rejsy</b>
                    </div>
                </div>
            </div>
            <div className="w-100 bg-light">
                {[1].map((row: number, index: number) => (
                    <div key={index}
                         className={`d-flex flex-wrap flex-row justify-content-center border-bottom ${index % 2 == 0 ? "bg-light" : "bg-white"}`}
                    >
                        <div className="d-flex flex-wrap justify-content-center align-items-center p-2"
                             style={{width: windowWidth >= 1200 ? "15%" : "100%"}}
                        >
                            <div className="col-12 d-flex d-xl-none justify-content-center">Czas rozpoczęcia:</div>
                            <ReadOnlyTextInput value={row.toString()} />
                        </div>
                        <div className="d-flex flex-wrap justify-content-center align-items-center p-2"
                             style={{width: windowWidth >= 1200 ? "15%" : "100%"}}
                        >
                            <div className="col-12 d-flex d-xl-none justify-content-center">Czas zakończenia:</div>
                            <ReadOnlyTextInput value={row.toString()} className="mb-1"/>
                        </div>
                        <div className="d-flex flex-wrap justify-content-center align-items-center p-2"
                             style={{width: windowWidth >= 1200 ? "44%" : "100%"}}
                        >
                            <div className="col-12 d-flex d-xl-none justify-content-center">Zgłoszenia:</div>
                            {[1].map((application: number) => (
                                <div className="d-flex col-12">
                                    <div className="d-flex flex-wrap align-content-center col-3 mt-2">
                                        <div className="d-flex justify-content-center w-100">Numer:</div>
                                        <LinkWithState
                                            className="text-center w-100"
                                            to="/ApplicationDetails"
                                            label={application.toString()}
                                            state={{ applicationId: application }}
                                        />
                                    </div>
                                    <div className="d-flex flex-wrap align-content-center col-9 mb-2">
                                        <div className="d-flex justify-content-center w-100">Kierownik:</div>
                                        <ReadOnlyTextInput value={application.toString()} className="d-flex w-100 mb-1" />
                                        <ReadOnlyTextInput value={application.toString()} className="d-flex w-100" />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="d-flex flex-wrap justify-content-center align-items-center p-2 text-center"
                             style={{width: windowWidth >= 1200 ? "16%" : "100%"}}
                        >
                            <div className="btn-group-vertical">
                                <LinkWithState
                                    className="btn btn-info"
                                    to="/"
                                    label="Akcja"
                                    state={{}}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}