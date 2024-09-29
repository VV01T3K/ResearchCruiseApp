import CruiseApplicationsList from "../../CruiseApplicationsPage/CruiseApplicationsList";
import {CruiseApplication} from "../../CruiseApplicationsPage/CruiseApplicationsPage";
import {Dispatch, SetStateAction, useContext} from "react";
import {FormContext} from "../../FormPage/Wrappers/FormTemplate";

type Props = {
    cruiseApplications: CruiseApplication[],
    setCruiseApplications: (applications: CruiseApplication[]) => void,
    addingMode: boolean,
}


export default function CruiseApplications(props: Props) {
    const formContext = useContext(FormContext)
    // const updateApplications = (applications: CruiseApplication[], disableAddingMode?: boolean = true) => {
    //     props.setCruiseApplications(applications)
    //     formContext!.setValue(
    //         "cruiseApplicationsIds",
    //         applications.map(app => app.id)
    //     )
    //
    //     if (props.addingMode && disableAddingMode)
    //         props.setAddingMode(false)
    // }

    return (
        <div className="p-2 w-100">

        </div>
    )
}