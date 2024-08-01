import {CruiseApplication, CruiseApplicationShortInfo} from "../CruiseApplicationsPage/CruiseApplicationsPage";
import LinkWithState from "../../CommonComponents/LinkWithState";
import ReadOnlyTextInput from "../../CommonComponents/ReadOnlyTextInput";
import React, {useEffect, useState} from "react";
import Api from "../../Tools/Api";
import {fetchCruiseApplications} from "../../Tools/Fetchers";


type Props = {
    cruiseApplicationsShortInfo: CruiseApplicationShortInfo[]
}


export default function CruiseApplicationsList(props: Props) {
    const [applications, setApplications] =
        useState<CruiseApplication[]>([])
    useEffect(() => {
        fetchCruiseApplications(props.cruiseApplicationsShortInfo, setApplications)
    }, [props.cruiseApplicationsShortInfo]);

    return (
        <>
            {applications.length == 0 &&
                <div>Brak zgłoszeń</div>
            }
            {applications.map((application: CruiseApplication, index: number) => (
                    <div
                        key={index}
                        className={`d-flex col-12 ${(index < props.cruiseApplicationsShortInfo.length - 1) && "mb-2"}`}
                    >
                        <div className="d-flex flex-wrap align-content-center col-6">
                            <div className="d-flex justify-content-center w-100">Numer:</div>
                            <LinkWithState
                                className="text-center w-100"
                                to="/ApplicationDetails"
                                label={application.number}
                                state={{cruiseApplication: application}}
                            />
                        </div>
                        <div className="d-flex flex-wrap align-content-center col-6 mb-2">
                            <div className="d-flex justify-content-center w-100">Punkty:</div>
                            <ReadOnlyTextInput value={application.points.toString()} className="d-flex w-100" />
                        </div>
                    </div>
                ))}
        </>
    )
}