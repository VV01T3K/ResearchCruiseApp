import Api from "./Api";
import {CruiseApplication, CruiseApplicationShortInfo} from "../Pages/CruiseApplicationsPage/CruiseApplicationsPage";
import {Dispatch} from "react";

export async function fetchCruiseApplications(
    cruiseApplicationsShortInfo: CruiseApplicationShortInfo[],
    setCruiseApplicationsDispatch: Dispatch<any>
) {
    const cruiseApplicationsResponses = await Promise.all(
        cruiseApplicationsShortInfo.map(cruiseApplicationShortInfo =>
            Api
                .get(`/api/CruiseApplications/${cruiseApplicationShortInfo.id}`)
                .catch(error => {}
                )
        )
    )
    const cruiseApplicationsResponsesData: CruiseApplication[] = cruiseApplicationsResponses
        .map(response => response?.data)
    setCruiseApplicationsDispatch(cruiseApplicationsResponsesData)
}