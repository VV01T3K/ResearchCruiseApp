import Api from "./Api";
import {Application, ApplicationShortInfo} from "../Pages/ApplicationsPage/ApplicationsPage";
import {Dispatch} from "react";

export async function fetchApplications(
    applicationsShortInfo: ApplicationShortInfo[],
    setApplicationsDispatch: Dispatch<any>
) {
    const applicationsResponses = await Promise.all(
        applicationsShortInfo.map(applicationShortInfo =>
            Api
                .get(`/api/Applications/${applicationShortInfo.id}`)
                .catch(error =>
                    console.log(error.message)
                )
        )
    )
    const applicationsResponsesData: Application[] = applicationsResponses
        .map(response => response?.data)
    setApplicationsDispatch(applicationsResponsesData)
}