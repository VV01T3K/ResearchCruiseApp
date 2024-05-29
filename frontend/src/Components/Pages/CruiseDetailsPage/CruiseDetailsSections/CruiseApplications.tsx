import ApplicationsList from "../../ApplicationsPage/ApplicationsList";
import {Application} from "../../ApplicationsPage/ApplicationsPage";

type Props = {
    applications: Application[]
}


export default function CruiseApplications(props: Props) {
    return (
        <ApplicationsList boundedValues={props.applications} />
    )
}