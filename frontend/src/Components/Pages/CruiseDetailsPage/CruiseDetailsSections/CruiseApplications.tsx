import ApplicationsList from "../../ApplicationsPage/ApplicationsList";
import {Application} from "../../ApplicationsPage/ApplicationsPage";
import {useState} from "react";

type Props = {
    applications: Application[]
}


export default function CruiseApplications(props: Props) {
    const [addingMode, setAddingMode] = useState(false)
    const [applications, setApplications] = useState(props.applications)

    const updateApplications = (applications: Application[]) => {
        setApplications(applications)
        setAddingMode(false)
    }

    return (
        <>
            <ApplicationsList
                boundedValues={applications}
                setBoundedValues={setApplications}
                deletionMode={true}
            />
            <div className="d-flex w-100 justify-content-center">
                <a
                    className={`btn btn-info col-12 my-2 ${addingMode && "d-none"}`}
                    style={{ font: "inherit" }}
                    onClick={() => setAddingMode(true)}
                >
                    Dołącz zgłoszenie
                </a>
            </div>
            {addingMode &&
                <div className="mt-4">
                    <ApplicationsList
                        addingMode={true}
                        boundedValues={applications}
                        setBoundedValues={updateApplications}
                    />
                </div>
            }
        </>
    )
}