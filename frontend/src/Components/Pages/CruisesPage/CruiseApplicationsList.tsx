import {Application, ApplicationShortInfo} from "../ApplicationsPage/ApplicationsPage";
import LinkWithState from "../../CommonComponents/LinkWithState";
import ReadOnlyTextInput from "../../CommonComponents/ReadOnlyTextInput";
import React, {useEffect, useState} from "react";
import Api from "../../Tools/Api";


type Props = {
    applicationsShortInfo: ApplicationShortInfo[]
}


export default function CruiseApplicationsList(props: Props) {
    const [applications, setApplications] =
        useState<Application[]>([])
    useEffect(() => {
        props.applicationsShortInfo.forEach(applicationShortInfo => {
            Api
                .get(`/api/Applications/${applicationShortInfo.id}`)
                .then(response =>
                    setApplications([...applications, response.data])
                )
                .catch(error =>
                    console.log(error.message)
                )
        })
    }, []);

    return (
        <>
            {applications.map((application: Application, index: number) => (
                    <div
                        key={index}
                        className={`d-flex col-12 ${(index < props.applicationsShortInfo.length - 1) && "mb-2"}`}
                    >
                        <div className="d-flex flex-wrap align-content-center col-6">
                            <div className="d-flex justify-content-center w-100">Numer:</div>
                            <LinkWithState
                                className="text-center w-100"
                                to="/ApplicationDetails"
                                label={application.number}
                                state={{application: application}}
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