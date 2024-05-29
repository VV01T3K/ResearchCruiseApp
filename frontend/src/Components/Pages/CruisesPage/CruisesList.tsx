import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowDown} from "@fortawesome/free-solid-svg-icons";
import ReadOnlyTextInput from "../../CommonComponents/ReadOnlyTextInput";
import LinkWithState from "../../CommonComponents/LinkWithState";
import React, {useEffect, useState} from "react";
import {Cruise} from "./CruisesPage";
import {ApplicationShortInfo} from "../ApplicationsPage/ApplicationsPage";
import CruiseApplicationsList from "./CruiseApplicationsList";


type Props = {
    cruises: Cruise[]
}


export default function CruisesList(props: Props) {
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
                    <div className="d-none d-xl-flex justify-content-center align-items-center p-2" style={{width: "10%", cursor: "pointer"}}
                         onClick={() => {}}
                    >
                        <b>Numer</b>
                        {/*<div className="btn btn-sm btn-dark px-1 py-0 ms-2">*/}
                        {/*    <FontAwesomeIcon icon={faArrowDown} />*/}
                        {/*</div>*/}
                    </div>
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
                {!props.cruises.length &&
                    <div className="d-flex flex-row bg-light p-2 justify-content-center border">
                        <div className={"text-center"}>Brak rejsów</div>
                    </div>
                }
                {props.cruises.map((row: Cruise, index: number) => (
                    <div key={index}
                         className={`d-flex flex-wrap flex-row justify-content-center border-bottom ${index % 2 == 0 ? "bg-light" : "bg-white"}`}
                    >
                        <div className="d-flex flex-wrap justify-content-center align-items-center p-2"
                             style={{width: windowWidth >= 1200 ? "10%" : "100%"}}
                        >
                            <div className="col-12 d-flex d-xl-none justify-content-center">Numer</div>
                            <ReadOnlyTextInput value={row.number} />
                        </div>
                        <div className="d-flex flex-wrap justify-content-center align-items-center p-2"
                             style={{width: windowWidth >= 1200 ? "15%" : "100%"}}
                        >
                            <div className="col-12 d-flex d-xl-none justify-content-center">Czas rozpoczęcia:</div>
                            <ReadOnlyTextInput value={row.startDate} />
                        </div>
                        <div className="d-flex flex-wrap justify-content-center align-items-center p-2"
                             style={{width: windowWidth >= 1200 ? "15%" : "100%"}}
                        >
                            <div className="col-12 d-flex d-xl-none justify-content-center">Czas zakończenia:</div>
                            <ReadOnlyTextInput value={row.endDate} className="mb-1"/>
                        </div>
                        <div className="d-flex flex-wrap justify-content-center align-items-center p-2"
                             style={{width: windowWidth >= 1200 ? "44%" : "100%"}}
                        >
                            <div className="col-12 d-flex d-xl-none justify-content-center">Zgłoszenia:</div>
                            <CruiseApplicationsList applicationsShortInfo={row.applicationsShortInfo} />
                        </div>
                        <div className="d-flex flex-wrap justify-content-center align-items-center p-2 text-center"
                             style={{width: windowWidth >= 1200 ? "16%" : "100%"}}
                        >
                            <div className="btn-group-vertical">
                                <LinkWithState
                                    className="btn btn-info"
                                    to="/CruiseDetails"
                                    label="Szczegóły"
                                    state={{ cruise: row }}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}